import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageProps, User, MergeLog } from '../types';
import { getAdminDashboardData, getUsersData, addUser, updateUserByAdmin, deleteUser, uploadFile } from '../services/gasClient';
import { adminMenu, generalMenu } from '../components/Layout';
import Chart from '../components/Chart';
import { ChartConfiguration } from 'chart.js';
import { TableSkeleton, CardSkeleton } from '../components/SkeletonLoader';
import SearchFilter from '../components/SearchFilter';
import BulkActions from '../components/BulkActions';

const allPages = [...adminMenu.items, ...generalMenu.items];

interface DashboardData {
    totalUsers: number;
    totalMerges: number;
    activeSubscriptions: number;
    recentMerges: MergeLog[];
    totalRevenue?: number;
    apiCallsLast30Days?: number[];
}

// Stat Card Component
const StatCard: React.FC<{ title: string; value: string; change: string; icon: string; iconColor: string; }> = ({ title, value, change, icon, iconColor }) => (
    <div className="card p-5">
        <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <span className={`material-icons-outlined ${iconColor}`}>{icon}</span>
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-xs text-green-500 font-medium mt-1">{change}</p>
    </div>
);

// User Table Component
const UserTable: React.FC<{
    users: User[];
    loading: boolean;
    error: string | null;
    sort: { column: keyof User; direction: 'asc' | 'desc' };
    handleSort: (column: keyof User) => void;
    handleEditUser: (user: User) => void;
    handleDeleteUser: (user: User) => void;
    planDetails: { [key in User['plan']]: { price: string; color: string } };
    selectedUsers: Set<string>;
    onUserSelect: (userId: string, selected: boolean) => void;
}> = ({ users, loading, error, sort, handleSort, handleEditUser, handleDeleteUser, planDetails, selectedUsers, onUserSelect }) => {
    const SortableHeader: React.FC<{ column: keyof User; label: string }> = ({ column, label }) => (
        <th className="py-3 px-4 font-semibold sortable-header cursor-pointer" onClick={() => handleSort(column)}>
            {label}
            {sort.column === column && (
                <span className="sort-indicator ml-1">
                    <span className="material-icons-outlined text-sm align-middle">
                        {sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                </span>
            )}
        </th>
    );

    const getUserAvatar = (user: User) => {
        if (user.profilePictureUrl) {
            return user.profilePictureUrl;
        }
        if (user.profilePictureId) {
            return `https://lh3.googleusercontent.com/d/${user.profilePictureId}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                    <tr>
                        <th className="py-3 px-4 w-12 font-semibold">
                            <input 
                                type="checkbox" 
                                checked={users.length > 0 && users.every(u => selectedUsers.has(u.id!))}
                                onChange={(e) => {
                                    users.forEach(u => onUserSelect(u.id!, e.target.checked));
                                }}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" 
                            />
                        </th>
                        <SortableHeader column="name" label="User" />
                        <SortableHeader column="accessPage" label="Access Page" />
                        <SortableHeader column="plan" label="Plan" />
                        <SortableHeader column="role" label="Role" />
                        <SortableHeader column="status" label="Status" />
                        <SortableHeader column="joinDate" label="Join Date" />
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {loading ? (
                        <tr><td colSpan={8} className="text-center py-8"><div className="spinner mx-auto"></div></td></tr>
                    ) : error ? (
                        <tr><td colSpan={8} className="text-center py-8 text-red-500">{error}</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-8 text-gray-500">No users found.</td></tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800">
                                <td className="px-4 py-3">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.has(user.id!)}
                                        onChange={(e) => onUserSelect(user.id!, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" 
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={getUserAvatar(user)} className="w-8 h-8 rounded-full object-cover" alt={user.name}/>
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs" title={Array.isArray(user.accessPage) ? user.accessPage.join(', ') : user.accessPage as string}>{Array.isArray(user.accessPage) ? user.accessPage.join(', ') : user.accessPage}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${planDetails[user.plan].color}`}>{user.plan}</span>
                                </td>
                                <td className="px-4 py-3"><span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{user.role}</span></td>
                                <td className="px-4 py-3">
                                    <div>
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{user.status}</span>
                                        {user.status === 'Inactive' && user.inactiveDate && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.inactiveDate}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">{user.joinDate}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => handleEditUser(user)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1">edit</button>
                                    <button onClick={() => handleDeleteUser(user)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 p-1">delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// User Filters Component
const UserFilters: React.FC<{
    filters: { search: string; role: string; status: string };
    setFilters: React.Dispatch<React.SetStateAction<{ search: string; role: string; status: string }>>;
}> = ({ filters, setFilters }) => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Search by name or email..." className="flex-grow p-2" onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <select className="p-2" onChange={e => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option><option>Admin</option><option>User</option>
        </select>
        <select className="p-2" onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Statuses</option><option>Active</option><option>Inactive</option>
        </select>
    </div>
);

// User Pagination Component
const UserPagination: React.FC<{
    pagination: { currentPage: number; rowsPerPage: number };
    setPagination: React.Dispatch<React.SetStateAction<{ currentPage: number; rowsPerPage: number }>>;
    totalUsers: number;
    totalPages: number;
}> = ({ pagination, setPagination, totalUsers, totalPages }) => (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400 gap-4">
        <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select value={pagination.rowsPerPage} onChange={e => setPagination({ ...pagination, rowsPerPage: Number(e.target.value), currentPage: 1 })} className="p-1 text-sm rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500">
                <option>10</option><option>25</option><option>50</option>
            </select>
        </div>
        <div>Showing {totalUsers > 0 ? (pagination.currentPage - 1) * pagination.rowsPerPage + 1 : 0} to {Math.min(pagination.currentPage * pagination.rowsPerPage, totalUsers)} of {totalUsers} users.</div>
        <div className="flex items-center gap-2">
            <button onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))} disabled={pagination.currentPage === 1} className="px-3 py-1 rounded-md font-semibold border border-inherit hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))} disabled={pagination.currentPage === totalPages} className="px-3 py-1 rounded-md font-semibold border border-inherit hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
    </div>
);

// User Form Component
const UserForm: React.FC<{
    user: User | null;
    onSave: (user: Partial<User>, newProfilePicture: File | null) => void;
    onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: '', email: '', role: 'User', status: 'Active', accessPage: [], plan: 'Free', inactiveDate: '', profilePictureId: undefined, ...user,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const initialData = { name: '', email: '', role: 'User', status: 'Active', accessPage: [], plan: 'Free', inactiveDate: '', profilePictureId: undefined, profilePictureUrl: undefined, ...user };
        setFormData(initialData);

        if (initialData.profilePictureUrl) {
            setImagePreview(initialData.profilePictureUrl);
        } else if (initialData.profilePictureId) {
            setImagePreview(`https://lh3.googleusercontent.com/d/${initialData.profilePictureId}`);
        } else {
            setImagePreview(null);
        }
    }, [user]);



    const handleAccessPageChange = (pageId: string, checked: boolean) => {
        const currentPages = Array.isArray(formData.accessPage) ? formData.accessPage : (formData.accessPage || '').split(',').map(p => p.trim()).filter(Boolean);
        const newPages = checked ? [...currentPages, pageId] : currentPages.filter(p => p !== pageId);
        setFormData(prev => ({ ...prev, accessPage: newPages }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as User['status'];
        const newInactiveDate = (newStatus === 'Inactive' && !formData.inactiveDate)
            ? new Date().toISOString().split('T')[0]
            : newStatus === 'Active' ? undefined : formData.inactiveDate;

        setFormData(p => ({ ...p, status: newStatus, inactiveDate: newInactiveDate }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, null);
    };

    return (
        <div className="card w-full max-w-3xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add New User'}</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full p-2" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full p-2" required disabled={!!user} /></div>
                                <div><label className="block text-sm font-medium mb-1">Role</label><select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value as User['role'] }))} className="w-full p-2"><option>User</option><option>Admin</option></select></div>
                                <div><label className="block text-sm font-medium mb-1">Plan</label>
                                    <select value={formData.plan} onChange={e => setFormData(p => ({ ...p, plan: e.target.value as User['plan'] }))} className="w-full p-2">
                                        <option>Free</option>
                                        <option>Pro</option>
                                        <option>Enterprise</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium mb-1">Status</label>
                                    <select value={formData.status} onChange={handleStatusChange} className="w-full p-2">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                {formData.status === 'Inactive' && (
                                    <div><label className="block text-sm font-medium mb-1">Inactive Since</label>
                                        <input type="date" value={formData.inactiveDate || ''} onChange={e => setFormData(p => ({...p, inactiveDate: e.target.value}))} className="w-full p-2" required />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-40 text-center">
                            <label className="block text-sm font-medium mb-2">Profile Picture</label>
                            <img
                                src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'New User')}&background=random`}
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
                                alt="Profile"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">Gmail Profile Only</p>
                        </div>
                    </div>
                    <div className="mt-4"><h3 className="text-sm font-medium mb-2">Access Pages</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-inherit rounded-md">
                            {allPages.map(page => (
                                <label key={page.id} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={(Array.isArray(formData.accessPage) ? formData.accessPage : (formData.accessPage || '').split(',')).includes(page.id)} onChange={e => handleAccessPageChange(page.id, e.target.checked)} className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"/>
                                    {page.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-end gap-3 rounded-b-xl">
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save User</button>
                </div>
            </form>
        </div>
    );
};

// Main Component
const AdminControlCenter: React.FC<PageProps> = ({ theme, setModal, user }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalUsers: 0,
        totalMerges: 0,
        activeSubscriptions: 0,
        recentMerges: [],
    });
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
    const [filters, setFilters] = useState({ search: '', role: '', status: '', plan: '' });
    const [sort, setSort] = useState<{ column: keyof User, direction: 'asc' | 'desc' }>({ column: 'joinDate', direction: 'desc' });
    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    const planDetails: { [key in User['plan']]: { price: string; color: string } } = {
        Free: { price: 'Free', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
        Pro: { price: '$10/mo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        Enterprise: { price: 'Custom', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
    };

    const userStats = useMemo(() => {
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'Active').length;
        const inactiveUsers = users.filter(u => u.status === 'Inactive').length;
        const adminUsers = users.filter(u => u.role === 'Admin').length;
        const freePlanUsers = users.filter(u => u.plan === 'Free').length;
        const proPlanUsers = users.filter(u => u.plan === 'Pro').length;
        const enterprisePlanUsers = users.filter(u => u.plan === 'Enterprise').length;

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            adminUsers,
            freePlanUsers,
            proPlanUsers,
            enterprisePlanUsers
        };
    }, [users]);

    const fetchDashboardData = async () => {
        try {
            const data = await getAdminDashboardData() as DashboardData;
            setDashboardData(data);
        } catch (err) {
            setError('Failed to load dashboard data.');
            console.error(err);
        }
    };

    const fetchUsersData = async () => {
        try {
            console.log('Fetching users data...');
            const data = await getUsersData();
            console.log('Users data fetched:', data);
            console.log('Number of users:', data.length);
            setUsers(data as User[]);
        } catch (err) {
            setError('Failed to load user data.');
            console.error('Error fetching users data:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchDashboardData(), fetchUsersData()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSort = (column: keyof User) => {
        setSort(prevSort => ({
            column,
            direction: prevSort.column === column && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAddUser = () => { setEditingUser(null); setIsModalOpen(true); };
    const handleEditUser = (user: User) => { setEditingUser(user); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingUser(null); };

    const handleSaveUser = async (formData: Partial<User>, newProfilePicture: File | null) => {
        setModal({ type: 'progress', props: { title: 'Saving User...', message: 'Please wait while we process your request.' } });
        try {
            let finalUserData = { ...formData };
            if (newProfilePicture) {
                const uploadResult = await uploadFile(newProfilePicture);
                finalUserData.profilePictureUrl = uploadResult.url;
            }

            const userDataToSave = { ...finalUserData, accessPage: Array.isArray(finalUserData.accessPage) ? finalUserData.accessPage.join(',') : finalUserData.accessPage };

            if (editingUser && editingUser.id) { // Update
                await updateUserByAdmin(user, editingUser.id, userDataToSave);
            } else { // Add
                await addUser(userDataToSave);
            }
            await fetchUsersData(); // Refresh data
        } catch(e) {
             alert(`Error saving user: ${(e as Error).message}`);
        }
        setModal({ type: null, props: {} });
        handleCloseModal();
    };

    const exportUsers = (userIds: string[]) => {
        const usersToExport = users.filter(u => userIds.includes(u.id!));
        const csvContent = [
            ['Name', 'Email', 'Role', 'Status', 'Plan', 'Join Date'].join(','),
            ...usersToExport.map(u => [
                u.name, u.email, u.role, u.status, u.plan, u.joinDate
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleBulkDelete = () => {
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Multiple Users',
                message: `Are you sure you want to delete ${selectedUsers.size} selected users? This action cannot be undone.`,
                onConfirm: async () => {
                    try {
                        await Promise.all(Array.from(selectedUsers).map(userId => deleteUser(userId as string)));
                        await fetchUsersData();
                        setSelectedUsers(new Set());
                    } catch (e) {
                        alert(`Error deleting users: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };

    const handleDeleteUser = (user: User) => {
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete User',
                message: `Are you sure you want to delete user <strong>${user.name}</strong>? This action cannot be undone.`,
                onConfirm: async () => {
                    try {
                        if (user.id) {
                            await deleteUser(user.id);
                            await fetchUsersData();
                        }
                    } catch (e) {
                         alert(`Error deleting user: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };

    const filteredAndSortedUsers = useMemo(() => {
        return users
            .filter(user => {
                const matchesSearch = searchQuery === '' || 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    user.email.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesRole = filters.role === '' || user.role === filters.role;
                const matchesStatus = filters.status === '' || user.status === filters.status;
                const matchesPlan = !filters.plan || user.plan === filters.plan;
                return matchesSearch && matchesRole && matchesStatus && matchesPlan;
            })
            .sort((a, b) => {
                const valA = a[sort.column];
                const valB = b[sort.column];
                if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [users, searchQuery, filters, sort]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.rowsPerPage;
        return filteredAndSortedUsers.slice(startIndex, startIndex + pagination.rowsPerPage);
    }, [filteredAndSortedUsers, pagination]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / pagination.rowsPerPage);

    const { mergeActivityChartConfig, userGrowthChartConfig } = useMemo(() => {
        const isDarkMode = theme === 'dark';
        const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
        const tickColor = isDarkMode ? '#94a3b8' : '#64748B';

        // Calculate last 7 days' merge counts
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(now.getDate() - (6 - i));
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        });
        const mergeCounts = last7Days.map(day => {
            return dashboardData.recentMerges.filter(merge => {
                const mergeDate = merge.timestamp ? new Date(merge.timestamp).toISOString().split('T')[0] : merge.date;
                return mergeDate === day;
            }).length;
        });
        const labels = last7Days.map(day => {
            const d = new Date(day);
            return d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
        });

        const mergeActivityChartConfig: ChartConfiguration = {
            type: 'bar',
            data: {
                labels,
                datasets: [{ label: 'Merges', data: mergeCounts, backgroundColor: '#4F46E5', borderColor: '#4F46E5', borderWidth: 1, borderRadius: 4, barPercentage: 0.5 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { display: false } }, x: { grid: { display: false }, ticks: { color: tickColor } } } }
        };

        const userGrowthChartConfig: ChartConfiguration = {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ label: 'New Users', data: [65, 159, 280, 381, 456, 550], fill: true, backgroundColor: 'rgba(79, 70, 229, 0.1)', borderColor: '#4F46E5', pointBackgroundColor: '#4F46E5', tension: 0.3 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor } }, x: { grid: { display: false }, ticks: { color: tickColor } } } }
        };

        return { mergeActivityChartConfig, userGrowthChartConfig };
    }, [theme]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">admin_panel_settings</span>
                    Admin Control
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Comprehensive admin dashboard and user management in one place.</p>
            </div>

            {/* Combined Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
                ) : (
                    <>
                <StatCard title="Total Users" value={userStats.totalUsers.toString()} change={`${userStats.activeUsers} active`} icon="group" iconColor="text-blue-500 dark:text-blue-400" />
                <StatCard title="Active Users" value={userStats.activeUsers.toString()} change={`${Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}% active`} icon="person_check" iconColor="text-green-500 dark:text-green-400" />
                <StatCard title="Inactive Users" value={userStats.inactiveUsers.toString()} change={`${Math.round((userStats.inactiveUsers / userStats.totalUsers) * 100)}% inactive`} icon="person_off" iconColor="text-yellow-500 dark:text-yellow-400" />
                <StatCard title="Admin Users" value={userStats.adminUsers.toString()} change={`${Math.round((userStats.adminUsers / userStats.totalUsers) * 100)}% admins`} icon="admin_panel_settings" iconColor="text-purple-500 dark:text-purple-400" />
                <StatCard title="Active Subscriptions" value={dashboardData.activeSubscriptions.toLocaleString()} change={`${Math.round((dashboardData.activeSubscriptions / userStats.totalUsers) * 100)}% paid users`} icon="subscriptions" iconColor="text-yellow-500 dark:text-yellow-400" />
                <StatCard title="Total Merges" value={dashboardData.totalMerges.toLocaleString()} change="All time" icon="merge_type" iconColor="text-indigo-500 dark:text-indigo-400" />
                <StatCard title="System Health" value="99.9%" change="All systems operational" icon="shield" iconColor="text-purple-500 dark:text-purple-400" />
                <StatCard title="API Calls (24h)" value={(dashboardData.apiCallsLast30Days?.slice(-1)[0] || 0).toLocaleString()} change="Last 24 hours" icon="api" iconColor="text-teal-500 dark:text-teal-400" />
                    </>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <span className="material-icons-outlined text-base">dashboard</span>
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            data-tab="users"
                        >
                            <span className="material-icons-outlined text-base">group</span>
                            User Management
                        </button>
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'overview' && (
                        <>
                            <div className="card p-6 mb-8">
                                <h2 className="text-xl font-bold">Recent System Merges</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">A log of the most recent merge operations across the system.</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase border-b border-inherit">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 font-semibold">SN</th>
                                                <th scope="col" className="px-4 py-3 font-semibold">File Name</th>
                                                <th scope="col" className="px-4 py-3 font-semibold">User</th>
                                                <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                                                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                                                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan={6} className="text-center py-8"><div className="spinner mx-auto"></div></td></tr>
                                            ) : error ? (
                                                <tr><td colSpan={6} className="text-center py-8 text-red-500">{error}</td></tr>
                                            ) : dashboardData.recentMerges.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No recent merges found.</td></tr>
                                            ) : (
                                                dashboardData.recentMerges.map((item, index) => (
                                                    <tr key={index} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800">
                                                        <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.sn}</td>
                                                        <td className="px-4 py-4 font-medium">{item.fileName}</td>
                                                        <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.user}</td>
                                                        <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                                                        <td className="px-4 py-4"><span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{item.status}</span></td>
                                                        <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="card p-6">
                                    <h2 className="text-xl font-bold">System Merge Activity</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Merge operations in the last 7 days.</p>
                                    <div><Chart config={mergeActivityChartConfig} className="h-48" /></div>
                                </div>
                                <div className="card p-6">
                                    <h2 className="text-xl font-bold">User Growth</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">New users in the last 6 months.</p>
                                    <div><Chart config={userGrowthChartConfig} className="h-48" /></div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'users' && (
                        <div className="card p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">All Users</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage user accounts, roles, and access permissions.</p>
                                </div>
                                <div className="flex items-center gap-2 mt-4 md:mt-0">
                                    <button className="btn btn-secondary">
                                        <span className="material-icons-outlined text-base">download</span> Export CSV
                                    </button>
                                    <button onClick={handleAddUser} className="btn btn-primary">
                                        <span className="material-icons-outlined">add</span> Add User
                                    </button>
                                </div>
                            </div>
                            <SearchFilter
                                onSearch={setSearchQuery}
                                onFilter={(newFilters) => setFilters({ ...filters, ...newFilters })}
                                filters={[
                                    { key: 'role', label: 'Role', options: ['Admin', 'User'] },
                                    { key: 'status', label: 'Status', options: ['Active', 'Inactive'] },
                                    { key: 'plan', label: 'Plan', options: ['Free', 'Pro', 'Enterprise'] }
                                ]}
                                placeholder="Search users by name or email..."
                            />
                            <BulkActions
                                selectedCount={selectedUsers.size}
                                totalCount={filteredAndSortedUsers.length}
                                onSelectAll={() => setSelectedUsers(new Set(filteredAndSortedUsers.map(u => u.id!)))}
                                onDeselectAll={() => setSelectedUsers(new Set())}
                                actions={[
                                    {
                                        label: 'Export Selected',
                                        icon: 'download',
                                        onClick: () => exportUsers(Array.from(selectedUsers)),
                                        color: 'secondary'
                                    },
                                    {
                                        label: 'Delete Selected',
                                        icon: 'delete',
                                        onClick: () => handleBulkDelete(),
                                        color: 'danger'
                                    }
                                ]}
                            />
                            {loading ? (
                                <TableSkeleton rows={pagination.rowsPerPage} cols={8} />
                            ) : (
                                <UserTable 
                                    users={paginatedUsers} 
                                    loading={loading} 
                                    error={error} 
                                    sort={sort} 
                                    handleSort={handleSort} 
                                    handleEditUser={handleEditUser} 
                                    handleDeleteUser={handleDeleteUser} 
                                    planDetails={planDetails}
                                    selectedUsers={selectedUsers}
                                    onUserSelect={(userId, selected) => {
                                        const newSelected = new Set(selectedUsers);
                                        if (selected) newSelected.add(userId);
                                        else newSelected.delete(userId);
                                        setSelectedUsers(newSelected);
                                    }}
                                />
                            )}
                            <UserPagination pagination={pagination} setPagination={setPagination} totalUsers={filteredAndSortedUsers.length} totalPages={totalPages} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="card p-6">
                        <h2 className="text-xl font-bold">Quick Actions</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Perform common administrative tasks.</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleAddUser} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                <span className="material-icons-outlined text-xl">person_add</span> Add New User
                            </button>

                            <button onClick={() => window.location.hash = 'system-analytics'} className="w-full bg-gray-100 dark:bg-slate-700 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                <span className="material-icons-outlined text-xl">analytics</span> System Analytics
                            </button>
                        </div>
                    </div>
                    <div className="card p-6">
                        <h2 className="text-xl font-bold">User Statistics</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Current user distribution overview.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Active Users</span>
                                <span className="font-semibold">{userStats.activeUsers}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(userStats.activeUsers / userStats.totalUsers) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Inactive Users</span>
                                <span className="font-semibold">{userStats.inactiveUsers}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(userStats.inactiveUsers / userStats.totalUsers) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Admin Users</span>
                                <span className="font-semibold">{userStats.adminUsers}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(userStats.adminUsers / userStats.totalUsers) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6">
                        <h2 className="text-xl font-bold">Plan Statistics</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">User distribution by plan.</p>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b border-inherit">
                                    <td className="py-2 px-2 font-medium">Free Plan Users</td>
                                    <td className="py-2 px-2 text-right font-semibold">{userStats.freePlanUsers}</td>
                                </tr>
                                <tr className="border-b border-inherit">
                                    <td className="py-2 px-2 font-medium">Pro Plan Users</td>
                                    <td className="py-2 px-2 text-right font-semibold">{userStats.proPlanUsers}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-2 font-medium">Enterprise Plan Users</td>
                                    <td className="py-2 px-2 text-right font-semibold">{userStats.enterprisePlanUsers}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0" onClick={handleCloseModal}></div>
                    <div className="relative z-10">
                        <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminControlCenter;
