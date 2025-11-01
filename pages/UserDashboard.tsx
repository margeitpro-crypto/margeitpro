
import React, { useEffect, useState, useMemo } from 'react';
import { PageProps, MergeLog, User } from '../types';
import { getUserDashboardData } from '../services/gasClient';
import Chart from '../components/Chart';
import { ChartConfiguration } from 'chart.js';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';

interface DashboardData {
    totalUserMerges: number;
    docsGenerated: number;
    slidesGenerated: number;
    recentUserMerges: MergeLog[];
    mergeActivityLast7Days?: number[];
    successRate?: number;
    templatesUsed?: number;
}

const StatCard: React.FC<{ title: string; value: string; change: string; icon: string; iconColor: string; }> = ({ title, value, change, icon, iconColor }) => (
    <div className="card p-5">
        <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <span className={`material-icons-outlined ${iconColor}`}>{icon}</span>
        </div>
        <p className={`${title === 'Templates & Success' ? 'text-2xl' : 'text-3xl'} font-bold mt-2`}>{value}</p>
        <p className="text-xs text-green-500 font-medium mt-1">{change}</p>
    </div>
);

const UserDashboard: React.FC<PageProps> = ({ theme, user }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.email) return;
            console.log('UserDashboard: Fetching data for user:', user.email);
            setLoading(true);
            try {
                const data = await getUserDashboardData(user.email) as DashboardData;
                console.log('UserDashboard: Received data:', data);
                setDashboardData(data);
            } catch (err) {
                console.error('UserDashboard: Error fetching data:', err);
                // Set fallback data for new users or when there are permission issues
                setDashboardData({
                    totalUserMerges: 0,
                    docsGenerated: 0,
                    slidesGenerated: 0,
                    recentUserMerges: [],
                    mergeActivityLast7Days: [0, 0, 0, 0, 0, 0, 0],
                    successRate: 0,
                    templatesUsed: 0
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    
    const userMergeActivityChartConfig = useMemo((): ChartConfiguration => {
        const isDarkMode = theme === 'dark';
        const tickColor = isDarkMode ? '#94a3b8' : '#64748B';

        return {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ label: 'Merges', data: dashboardData?.mergeActivityLast7Days || [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#4F46E5', borderWidth: 0, borderRadius: 4, barPercentage: 0.6 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: tickColor } } } }
        };
    }, [theme, dashboardData]);
    
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">bar_chart</span>
                    User Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Welcome back! Here's a quick overview of your activity.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard title="Your Total Merges" value={dashboardData?.totalUserMerges.toLocaleString() ?? '...'} change="+120 this week" icon="analytics" iconColor="text-blue-500" />
                        <StatCard title="Docs Generated" value={dashboardData?.docsGenerated.toLocaleString() ?? '...'} change="+15.2% from last week" icon="article" iconColor="text-green-500" />
                        <StatCard title="Slides Generated" value={dashboardData?.slidesGenerated.toLocaleString() ?? '...'} change="+12.1% from last week" icon="slideshow" iconColor="text-yellow-500" />
                        <StatCard title="Templates & Success" value={`${dashboardData?.templatesUsed ?? '...'} Used / ${dashboardData?.successRate ?? '...'}%`} change="+5 new, +1.2% up" icon="category" iconColor="text-purple-500" />
                    </>
                )}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-6">
                    <h2 className="text-xl font-bold">Your Recent Merges</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">A log of your most recent merge operations.</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase border-b border-inherit">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-semibold">SN</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">File Name</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <TableSkeleton rows={5} cols={5} />
                                ) : !dashboardData || dashboardData.recentUserMerges.length === 0 ? (
                                     <tr><td colSpan={5} className="text-center py-8 text-gray-500">No recent merges found.</td></tr>
                                ) : (
                                    dashboardData.recentUserMerges.map(item => (
                                        <tr key={item.sn} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.sn}</td>
                                            <td className="px-4 py-4 font-medium">{item.fileName}</td>
                                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                                            <td className="px-4 py-4"><span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 success-animation' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{item.status}</span></td>
                                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="space-y-8">
                    <div className="card p-6">
                        <h2 className="text-xl font-bold">Your Merge Activity</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Merge operations in the last 7 days.</p>
                        <div><Chart config={userMergeActivityChartConfig} className="h-48" /></div>
                    </div>
                    <div className="card p-6">
                        <h2 className="text-xl font-bold">Quick Actions</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get started with a new task.</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => window.location.hash = 'marge-it'} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                <span className="material-icons-outlined text-xl">rocket_launch</span> Start a New Merge
                            </button>
                            <button onClick={() => window.location.hash = 'merge-logs'} className="w-full bg-gray-100 dark:bg-slate-700 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                <span className="material-icons-outlined text-xl">visibility</span> View Your Merge Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
