
import React, { useMemo, useState, useEffect } from 'react';
import { PageProps, AuditLog } from '../types';
import Chart from '../components/Chart';
import { ChartConfiguration } from 'chart.js';
import { getAuditLogsData } from '../services/gasClient';

// Stat Card Component (reusable within this page)
const StatCard: React.FC<{ title: string; value: string; icon: string; iconColor: string; }> = ({ title, value, icon, iconColor }) => (
    <div className="card p-5">
        <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <span className={`material-icons-outlined ${iconColor}`}>{icon}</span>
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

// Main Component
const SystemAnalytics: React.FC<PageProps> = ({ theme }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activityFilter, setActivityFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Mock data for the charts
    const mockAnalyticsData = {
        apiCallsLast30Days: Array.from({ length: 30 }, () => Math.floor(Math.random() * (5000 - 1000 + 1) + 1000)),
        mergeStatus: { success: 1254, failed: 89 },
        userActivity: { admins: 450, users: 804 },
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getAuditLogsData({});
                setLogs(data as AuditLog[]);
            } catch (err) {
                setError('Failed to load audit logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Chart configurations
    const { apiUsageChartConfig, mergeStatusChartConfig, userActivityChartConfig } = useMemo(() => {
        const isDarkMode = theme === 'dark';
        const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
        const tickColor = isDarkMode ? '#94a3b8' : '#64748B';
        const labelColor = isDarkMode ? '#f1f5f9' : '#0f172a';

        // FIX: Specify chart type in ChartConfiguration to resolve type errors with chart-specific options like 'cutout'.
        const apiUsageChartConfig: ChartConfiguration<'line'> = {
            type: 'line',
            data: {
                labels: Array.from({ length: 30 }, (_, i) => new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'API Calls',
                    data: mockAnalyticsData.apiCallsLast30Days,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    pointBackgroundColor: '#3b82f6',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'API Calls (Last 30 Days)', color: labelColor, font: { size: 16 } }
                },
                scales: {
                    y: { grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor } },
                    x: { grid: { display: false }, ticks: { color: tickColor, maxRotation: 45, minRotation: 45 } }
                }
            }
        };

        const mergeStatusChartConfig: ChartConfiguration<'doughnut'> = {
            type: 'doughnut',
            data: {
                labels: ['Successful', 'Failed'],
                datasets: [{
                    data: [mockAnalyticsData.mergeStatus.success, mockAnalyticsData.mergeStatus.failed],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderColor: [isDarkMode ? '#0f172a' : '#ffffff'],
                    borderWidth: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: labelColor } },
                    title: { display: true, text: 'Merge Success vs. Failure', color: labelColor, font: { size: 16 } }
                },
                cutout: '70%'
            }
        };
        
        const userActivityChartConfig: ChartConfiguration<'bar'> = {
            type: 'bar',
            data: {
                labels: ['Admins', 'Users'],
                datasets: [{
                    label: 'Merges Performed',
                    data: [mockAnalyticsData.userActivity.admins, mockAnalyticsData.userActivity.users],
                    backgroundColor: ['#8b5cf6', '#3b82f6'],
                    borderRadius: 4,
                    barPercentage: 0.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'User Activity by Role', color: labelColor, font: { size: 16 } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor } },
                    x: { grid: { display: false }, ticks: { color: tickColor } }
                }
            }
        };

        return { apiUsageChartConfig, mergeStatusChartConfig, userActivityChartConfig };
    }, [theme, mockAnalyticsData]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">desktop_windows</span>
                    System Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">An in-depth look at system usage, performance, and user activity.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total API Calls (24h)" value="15,482" icon="api" iconColor="text-blue-500" />
                <StatCard title="Average Merge Time" value="12.5s" icon="timer" iconColor="text-green-500" />
                <StatCard title="Error Rate (24h)" value="1.2%" icon="error_outline" iconColor="text-red-500" />
                <StatCard title="Active Users Today" value="2,134" icon="groups" iconColor="text-purple-500" />
            </div>

            <div className="card p-6">
                <Chart config={apiUsageChartConfig} className="h-96" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="card p-6 lg:col-span-1">
                    <Chart config={mergeStatusChartConfig} className="h-80" />
                </div>
                 <div className="card p-6 lg:col-span-2">
                    <Chart config={userActivityChartConfig} className="h-80" />
                </div>
            </div>

            {/* Key Activities Section */}
            <div className="card p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <span className="material-icons-outlined text-blue-600 dark:text-blue-500">history</span>
                        Key Activities
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Recent system activities including user actions, logins, merges, and more.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <select
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded"
                    >
                        <option value="">All Actions</option>
                        <option value="LOGIN_SUCCESS">Login Success</option>
                        <option value="LOGIN_FAILURE">Login Failure</option>
                        <option value="UPDATE_USER">Update User</option>
                        <option value="DELETE_USER">Delete User</option>
                        <option value="ADD_USER">Add User</option>
                        <option value="UPDATE_ROLE">Update Role</option>
                        <option value="UPDATE_STATUS">Update Status</option>
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded"
                        title="Start Date"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded"
                        title="End Date"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Action</th>
                                <th className="py-3 px-4 font-semibold">User</th>
                                <th className="py-3 px-4 font-semibold">Details</th>
                                <th className="py-3 px-4 font-semibold">Timestamp</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8"><div className="spinner mx-auto"></div></td></tr>
                            ) : error ? (
                                <tr><td colSpan={5} className="text-center py-8 text-red-500">{error}</td></tr>
                            ) : (() => {
                                const filteredLogs = logs
                                    .filter(log => !activityFilter || log.action === activityFilter)
                                    .filter(log => !startDate || new Date(log.timestamp) >= new Date(startDate))
                                    .filter(log => !endDate || new Date(log.timestamp) <= new Date(endDate + 'T23:59:59'))
                                    .slice(0, 20); // Limit to last 20 for summary
                                return filteredLogs.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No activities found.</td></tr>
                                ) : (
                                    filteredLogs.map((log, index) => (
                                        <tr key={index} className="border-b border-inherit last:border-b-0">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <span className="material-icons-outlined text-base text-gray-500">
                                                        {log.action === 'LOGIN_SUCCESS' ? 'login' :
                                                         log.action === 'LOGIN_FAILURE' ? 'no_accounts' :
                                                         log.action === 'UPDATE_USER' ? 'manage_accounts' :
                                                         log.action === 'DELETE_USER' ? 'person_remove' :
                                                         log.action === 'ADD_USER' ? 'person_add' :
                                                         log.action === 'UPDATE_ROLE' ? 'admin_panel_settings' :
                                                         log.action === 'UPDATE_STATUS' ? 'toggle_on' : 'info'}
                                                    </span>
                                                    {log.action.replace(/_/g, ' ')}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.userEmail}</td>
                                            <td className="py-4 px-4">{log.details}</td>
                                            <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{log.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemAnalytics;
