

import React, { useState, useEffect, useMemo, useRef } from 'react';
// FIX: Import MergeLog from central types file to include the 'id' property.
import { PageProps, MergeLog } from '../types';
import { getMergeLogsData, deleteMergeLog } from '../services/gasClient';

const downloadFormats = {
    slides: [ { format: 'pptx', label: 'PowerPoint (.pptx)' }, { format: 'pdf', label: 'PDF (.pdf)' }, { format: 'txt', label: 'Text (.txt)' } ],
    docs: [ { format: 'docx', label: 'Word (.docx)' }, { format: 'pdf', label: 'PDF (.pdf)' }, { format: 'rtf', label: 'RTF (.rtf)' }, { format: 'txt', label: 'Text (.txt)' } ]
};

const MergeLogs: React.FC<PageProps> = ({ setModal, user }) => {
    const [logs, setLogs] = useState<MergeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', type: 'all', status: 'all' });
    const [sort, setSort] = useState<{ column: keyof MergeLog, direction: 'asc' | 'desc' }>({ column: 'sn', direction: 'desc' });
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Pass user email to filter logs, or undefined for admin to see all
            const userEmail = user?.role === 'Admin' ? undefined : user?.email;
            const data = await getMergeLogsData(userEmail) as MergeLog[];
            setLogs(data);
        } catch (err) {
            console.error('Error fetching merge logs:', err);
            // Set empty array on error
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
                setDropdownPosition(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSort = (column: keyof MergeLog) => {
        setSort(prevSort => ({
            column,
            direction: prevSort.column === column && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    
    const processedLogs = useMemo(() => {
        return logs
            .filter(log => {
                const lowerSearch = filters.search.toLowerCase();
                const matchesSearch = log.fileName.toLowerCase().includes(lowerSearch) || 
                                      (log.sheet && log.sheet.toLowerCase().includes(lowerSearch)) ||
                                      (log.user && log.user.toLowerCase().includes(lowerSearch));
                const matchesType = filters.type === 'all' || (filters.type === 'slides' && log.type === 'Sheet to Slides') || (filters.type === 'docs' && log.type === 'Sheet to Docs');
                const matchesStatus = filters.status === 'all' || log.status.toLowerCase() === filters.status;
                return matchesSearch && matchesType && matchesStatus;
            })
            .sort((a, b) => {
                const col = sort.column;
                const dir = sort.direction === 'asc' ? 1 : -1;

                let valA = a[col];
                let valB = b[col];
                
                if (col === 'timestamp' && typeof valA === 'string' && typeof valB === 'string') {
                    const timeA = new Date(valA).getTime();
                    const timeB = new Date(valB).getTime();
                    if (!isNaN(timeA) && !isNaN(timeB)) {
                         return (timeA - timeB) * dir;
                    }
                }

                valA = valA ?? '';
                valB = valB ?? '';

                if (valA < valB) return -1 * dir;
                if (valA > valB) return 1 * dir;
                return 0;
            });
    }, [logs, filters, sort]);

    const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>, sn: number) => {
        if (openDropdown === sn) {
            setOpenDropdown(null);
            setDropdownPosition(null);
        } else {
            const log = logs.find(l => l.sn === sn);
            if (!log) return;

            const isSlides = log.type === 'Sheet to Slides';
            
            const DROPDOWN_WIDTH = 224; // w-56 in tailwind
            const DROPDOWN_HEIGHT_SLIDES = 275;
            const DROPDOWN_HEIGHT_DOCS = 305;
            const DROPDOWN_HEIGHT = isSlides ? DROPDOWN_HEIGHT_SLIDES : DROPDOWN_HEIGHT_DOCS;
            const VERTICAL_OFFSET = 5; 

            const rect = event.currentTarget.getBoundingClientRect();
            
            let leftPosition = rect.left;
            if (rect.left + DROPDOWN_WIDTH > window.innerWidth) {
                leftPosition = rect.right - DROPDOWN_WIDTH;
            }

            let topPosition;
            if (rect.bottom + DROPDOWN_HEIGHT + VERTICAL_OFFSET > window.innerHeight) {
                topPosition = rect.top + window.scrollY - DROPDOWN_HEIGHT - VERTICAL_OFFSET;
            } else {
                topPosition = rect.bottom + window.scrollY + VERTICAL_OFFSET;
            }

            setDropdownPosition({ top: topPosition, left: leftPosition });
            setOpenDropdown(sn);
        }
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
        setDropdownPosition(null);
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link to clipboard.');
        });
        closeDropdown();
    };

    const handleDownload = (baseUrl: string, format: string) => {
        // Extract file ID from Google Docs/Slides URL
        const fileIdMatch = baseUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!fileIdMatch) {
            alert('Invalid file URL format.');
            closeDropdown();
            return;
        }
        const fileId = fileIdMatch[1];
        // Determine if it's docs or slides based on the URL
        const isSlides = baseUrl.includes('presentation') || baseUrl.includes('slides');
        const downloadUrl = isSlides
            ? `https://docs.google.com/presentation/d/${fileId}/export?format=${format}`
            : `https://docs.google.com/document/d/${fileId}/export?format=${format}`;
        window.open(downloadUrl, '_blank');
        closeDropdown();
    };

    const handleDelete = (log: MergeLog) => {
        closeDropdown();
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Log',
                message: `Are you sure you want to delete the log for <strong>${log.fileName}</strong>?`,
                onConfirm: async () => {
                    try {
                        // FIX: Pass the string document 'id' to the delete function, not the numeric 'sn'.
                        // Also, add a guard to ensure the id exists.
                        if (!log.id) {
                            alert('Error: This log cannot be deleted as it has no ID.');
                            setModal({ type: null, props: {} });
                            return;
                        }
                        await deleteMergeLog(log.id);
                        setLogs(prevLogs => prevLogs.filter(l => l.sn !== log.sn));
                    } catch (e) {
                        alert(`Error deleting log: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };
    
    const SortableHeader: React.FC<{ column: keyof MergeLog; label: string, className?: string }> = ({ column, label, className = '' }) => (
        <th className={`py-3 px-4 font-semibold cursor-pointer ${className}`} onClick={() => handleSort(column)}>
            <div className="flex items-center gap-1">
                {label}
                {sort.column === column && (
                    <span className="material-icons-outlined text-sm">
                        {sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                )}
            </div>
        </th>
    );

    return (
        <div className="card p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-3xl text-blue-600 dark:text-blue-500">history_toggle_off</span>
                    <div>
                        <h1 className="text-2xl font-bold">Merge Logs</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">View, search, and manage the history of all merge operations.</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
                    <input type="text" placeholder="Search by file, sheet, or user..." className="w-full p-2 pl-10" onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select className="p-2 w-full" onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                        <option value="all">All Types</option><option value="slides">Sheet to Slides</option><option value="docs">Sheet to Docs</option>
                    </select>
                    <select className="p-2 w-full" onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                        <option value="all">All Statuses</option><option value="success">Success</option><option value="failed">Failed</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <SortableHeader column="sn" label="SN" />
                            <SortableHeader column="fileName" label="File Name" />
                            <SortableHeader column="user" label="User" />
                            <SortableHeader column="type" label="Type" />
                            <SortableHeader column="operation" label="Operation" />
                            <SortableHeader column="status" label="Status" />
                            <SortableHeader column="timestamp" label="Timestamp" />
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                         {loading ? (
                             <tr><td colSpan={8} className="text-center py-8"><div className="spinner mx-auto"></div></td></tr>
                        ) : processedLogs.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-8 text-gray-500">No merge logs found.</td></tr>
                        ) : (
                            processedLogs.map(log => (
                                <tr key={log.sn} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.sn}</td>
                                    <td className="py-4 px-4 font-medium">{log.fileName}</td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.user || '-'}</td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.type}</td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.operation || '-'}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${log.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{log.status}</span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.timestamp}</td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="inline-block text-left">
                                            {log.status === 'Success' ? (
                                                <button onClick={(e) => handleDropdownToggle(e, log.sn)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full p-1">more_vert</button>
                                            ) : (
                                                <button onClick={() => handleDelete(log)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:text-red-500 p-1">delete</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {openDropdown && dropdownPosition && (() => {
                const log = logs.find(l => l.sn === openDropdown);
                if (!log || !log.fileUrl) return null;
                return (
                    <div 
                        ref={dropdownRef}
                        className="card fixed w-56 z-50 p-2"
                        style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                    >
                        <ul>
                            <li><a href={log.fileUrl} target="_blank" rel="noopener noreferrer" onClick={closeDropdown} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"><span className="material-icons-outlined text-base text-blue-500">open_in_new</span>Open</a></li>
                            <li><button onClick={() => handleCopyLink(log.fileUrl!)} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"><span className="material-icons-outlined text-base text-green-500">content_copy</span>Copy Link</button></li>
                            <li className="my-1 border-t border-inherit"></li>
                            <li className="px-3 pt-2 pb-1 text-xs text-gray-400">Download As</li>
                            {(log.type === 'Sheet to Slides' ? downloadFormats.slides : downloadFormats.docs).map(df => (
                                <li key={df.format}><button onClick={() => handleDownload(log.fileUrl!, df.format)} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"><span className="material-icons-outlined text-base text-gray-500">download</span>{df.label}</button></li>
                            ))}
                            <li className="my-1 border-t border-inherit"></li>
                            <li><button onClick={() => handleDelete(log)} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><span className="material-icons-outlined text-base">delete</span>Delete</button></li>
                        </ul>
                    </div>
                );
            })()}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {processedLogs.length} of {logs.length} merge logs.
            </div>
        </div>
    );
};

export default MergeLogs;