import React, { useState, useEffect, useMemo, useRef } from 'react';
// FIX: Import MergeLog from central types file to include the 'id' property.
import { PageProps, MergeLog } from '../types';
import { getMergeLogsData, deleteMergeLog } from '../services/gasClient';
import { useFloating, FloatingPortal, flip, shift, offset } from '@floating-ui/react';
import { getFileInfo, getDownloadUrl } from '../services/googleFileUtils';

const downloadFormats = {
    slides: [ { format: 'pptx', label: 'PowerPoint (.pptx)' }, { format: 'pdf', label: 'PDF (.pdf)' },{ format: 'txt', label: 'Text (.txt)' },{ format: 'jpeg', label: 'JPEG image (.jpeg)' },{ format: 'png', label: 'PNG image (.png)' }, { format: 'svg', label: 'SVG (.svg)' } ],
    docs: [{ format: 'docx', label: 'Word (.docx)' },{ format: 'pdf', label: 'PDF (.pdf)' },{ format: 'txt', label: 'Text (.txt)' },{ format: 'html', label: 'Web page (.html, zipped)' },{ format: 'epub', label: 'EPUB (.epub)' }]
};

const MergeLogs: React.FC<PageProps> = ({ setModal, user }) => {
    const [logs, setLogs] = useState<MergeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', type: 'all', status: 'all' });
    const [sort, setSort] = useState<{ column: keyof MergeLog, direction: 'asc' | 'desc' }>({ column: 'sn', direction: 'desc' });
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { refs, floatingStyles } = useFloating({
        open: openDropdown !== null,
        onOpenChange: (open) => {
            if (!open) {
                setOpenDropdown(null);
            }
        },
        placement: 'bottom-end',
        middleware: [offset(5), flip(), shift()],
    });

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

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(processedLogs.map(log => log.id).filter(id => id));
            setSelectedLogs(allIds);
        } else {
            setSelectedLogs(new Set());
        }
    };

    const handleSelectLog = (logId: string, checked: boolean) => {
        const newSelected = new Set(selectedLogs);
        if (checked) {
            newSelected.add(logId);
        } else {
            newSelected.delete(logId);
        }
        setSelectedLogs(newSelected);
    };

    const isAllSelected = processedLogs.length > 0 && processedLogs.every(log => log.id && selectedLogs.has(log.id));
    const isIndeterminate = selectedLogs.size > 0 && !isAllSelected;

    const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>, sn: number) => {
        if (openDropdown === sn) {
            setOpenDropdown(null);
        } else {
            refs.setReference(event.currentTarget);
            setOpenDropdown(sn);
        }
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
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
        // Use the getFileInfo helper to extract file information
        const fileInfo = getFileInfo(baseUrl);
        if (!fileInfo) {
            console.warn('Invalid file URL format. Could not extract file information from:', baseUrl);
            alert('Invalid file URL format. Please check the URL and try again.');
            closeDropdown();
            return;
        }

        // Generate the download URL using the helper
        const downloadUrl = getDownloadUrl(fileInfo, format);
        if (!downloadUrl) {
            console.warn('Failed to generate download URL for file:', fileInfo.fileId, 'format:', format);
            alert('Failed to generate download URL. Please try again.');
            closeDropdown();
            return;
        }

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
                        // Remove from selection if it was selected
                        setSelectedLogs(prev => {
                            const newSelected = new Set(prev);
                            newSelected.delete(log.id);
                            return newSelected;
                        });
                    } catch (e) {
                        alert(`Error deleting log: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };

    const handleDeleteSelected = () => {
        const selectedCount = selectedLogs.size;
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Selected Logs',
                message: `Are you sure you want to delete <strong>${selectedCount}</strong> selected log${selectedCount > 1 ? 's' : ''}?`,
                onConfirm: async () => {
                    try {
                        // Delete all selected logs
                        const deletePromises = Array.from(selectedLogs).map(id => deleteMergeLog(id));
                        await Promise.all(deletePromises);

                        // Update local state - remove deleted logs
                        setLogs(prevLogs => prevLogs.filter(log => !log.id || !selectedLogs.has(log.id)));

                        // Clear selection
                        setSelectedLogs(new Set());

                        // Show success message
                        alert(`Successfully deleted ${selectedCount} log${selectedCount > 1 ? 's' : ''}.`);
                    } catch (e) {
                        alert(`Error deleting logs: ${(e as Error).message}`);
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
        <div ref={cardRef} className="card p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-3xl text-blue-600 dark:text-blue-500">history_toggle_off</span>
                    <div>
                        <h1 className="text-2xl font-bold">Merge Logs</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">View, search, and manage the history of all merge operations.</p>
                    </div>
                </div>
                {/* Delete Selected Button */}
                {selectedLogs.size > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        className="btn bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedLogs.size === 0}
                    >
                        <span className="material-icons-outlined text-base mr-2">delete</span>
                        Delete Selected ({selectedLogs.size})
                    </button>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="input-with-icon flex-grow">
                    <span className="material-icons-outlined input-icon text-gray-400 dark:text-gray-500">search</span>
                    <input type="text" placeholder="Search by file, sheet, or user..." onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
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
                            {/* Select All Checkbox */}
                            <th className="py-3 px-4 font-semibold">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = isIndeterminate;
                                    }}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
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
                             <tr><td colSpan={9} className="text-center py-8"><div className="spinner mx-auto"></div></td></tr>
                        ) : processedLogs.length === 0 ? (
                            <tr><td colSpan={9} className="text-center py-8 text-gray-500">No merge logs found.</td></tr>
                        ) : (
                            processedLogs.map(log => (
                                <tr key={log.sn} className="border-b last:border-b-0 transition-colors duration-200" style={{ borderColor: 'var(--fb-border)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--fb-border)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    {/* Individual Checkbox */}
                                    <td className="py-4 px-4">
                                        <input
                                            type="checkbox"
                                            checked={log.id ? selectedLogs.has(log.id) : false}
                                            onChange={(e) => log.id && handleSelectLog(log.id, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-4 px-4" style={{ color: 'var(--fb-text-secondary)' }}>{log.sn}</td>
                                    <td className="py-4 px-4 font-medium" style={{ color: 'var(--fb-text-primary)' }}>{log.fileName}</td>
                                    <td className="py-4 px-4" style={{ color: 'var(--fb-text-secondary)' }}>{log.user || '-'}</td>
                                    <td className="py-4 px-4" style={{ color: 'var(--fb-text-secondary)' }}>{log.type}</td>
                                    <td className="py-4 px-4" style={{ color: 'var(--fb-text-secondary)' }}>{log.operation || '-'}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${log.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 success-animation' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 error-shake'}`}>{log.status}</span>
                                    </td>
                                    <td className="py-4 px-4" style={{ color: 'var(--fb-text-secondary)' }}>{log.timestamp}</td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="inline-block text-left">
                                            {log.status === 'Success' ? (
                                                <button 
                                                    onClick={(e) => handleDropdownToggle(e, log.sn)} 
                                                    className="
                                                        relative group
                                                        material-icons-outlined rounded-full p-2 
                                                        transition-all duration-200 ease-out
                                                        hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50
                                                        dark:hover:bg-gradient-to-r dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20
                                                        hover:shadow-md hover:scale-105
                                                        active:scale-95
                                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                                    " 
                                                    style={{ color: 'var(--fb-text-secondary)' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.color = 'var(--fb-primary)';
                                                        e.currentTarget.style.transform = 'rotate(90deg)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.color = 'var(--fb-text-secondary)';
                                                        e.currentTarget.style.transform = 'rotate(0deg)';
                                                    }}
                                                >
                                                    more_vert
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                                </button>
                                            ) : (
                                                <button onClick={() => handleDelete(log)} className="material-icons-outlined p-1 transition-colors" style={{ color: 'var(--fb-text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fb-error)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--fb-text-secondary)'}>delete</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {openDropdown && (() => {
                const log = logs.find(l => l.sn === openDropdown);
                if (!log || !log.fileUrl) return null;
                return (
                    <FloatingPortal>
                        <div
                            ref={refs.setFloating}
                            className="
                                card w-80 z-50 p-3
                                shadow-2xl ring-1 ring-black/10 dark:ring-white/10
                                rounded-2xl overflow-hidden
                                backdrop-blur-sm
                                transition-all duration-200 ease-out
                                transform scale-100
                            "
                            style={{
                                ...floatingStyles,
                                animation: 'fadeInScale 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <a href={log.fileUrl} target="_blank" rel="noopener noreferrer" onClick={closeDropdown} className="
                                        flex items-center gap-2 w-full px-3 py-2 text-left text-xs rounded-lg 
                                        transition-all duration-200 ease-out group
                                        hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white
                                        hover:shadow-sm
                                    " style={{ color: 'var(--fb-text-primary)' }}>
                                        <span className="material-icons-outlined text-sm text-blue-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">open_in_new</span>Open
                                    </a>
                                    <button onClick={() => handleCopyLink(log.fileUrl!)} className="
                                        flex items-center gap-2 w-full px-3 py-2 text-left text-xs rounded-lg 
                                        transition-all duration-200 ease-out group
                                        hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white
                                        hover:shadow-sm
                                    " style={{ color: 'var(--fb-text-primary)' }}>
                                        <span className="material-icons-outlined text-sm text-green-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">content_copy</span>Copy Link
                                    </button>
                                    <button onClick={() => handleDelete(log)} className="
                                        flex items-center gap-2 w-full px-3 py-2 text-left text-xs rounded-lg 
                                        transition-all duration-200 ease-out group
                                        hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white
                                        hover:shadow-sm
                                    " style={{ color: 'var(--fb-error)' }}>
                                        <span className="material-icons-outlined text-sm group-hover:text-white transition-all duration-200 group-hover:scale-110">delete</span>Delete
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <div className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-1">Download As</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {(log.type === 'Sheet to Slides' ? downloadFormats.slides : downloadFormats.docs).map(df => (
                                            <button key={df.format} onClick={() => handleDownload(log.fileUrl!, df.format)} className="
                                                flex items-center gap-2 w-full px-3 py-2 text-left text-xs rounded-lg 
                                                transition-all duration-200 ease-out group
                                                hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white
                                                hover:shadow-sm
                                            " style={{ color: 'var(--fb-text-primary)' }}>
                                                <span className="material-icons-outlined text-sm text-gray-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">download</span>{df.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FloatingPortal>
                );
            })()}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {processedLogs.length} of {logs.length} merge logs. {selectedLogs.size > 0 && `(${selectedLogs.size} selected)`}
            </div>
        </div>
    );
};

export default MergeLogs;
