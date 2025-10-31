
import React, { useState, useEffect, useMemo } from 'react';
import { PageProps, Template, User } from '../types';
import { getTemplatesData, deleteTemplate } from '../services/gasClient';

const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return '';
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
    if (match) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
};

const Templates: React.FC<PageProps> = ({ setModal, user }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState<{ src: string; src2?: string; template: Template; currentIndex: number } | null>(null);
    const currentUser = user;

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getTemplatesData();
            setTemplates(data as Template[]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const refreshTemplates = () => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filters = ['All', 'Slides', 'Docs', 'Free', 'Pro'];

    const filteredTemplates = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return templates
            .filter(template => {
                if (activeFilter === 'All') return true;
                if (['Slides', 'Docs'].includes(activeFilter)) return template.type === activeFilter;
                if (['Free', 'Pro'].includes(activeFilter)) return template.plan === activeFilter;
                return true;
            })
            .filter(template => {
                return (
                    template.name.toLowerCase().includes(lowerCaseSearch) ||
                    template.description.toLowerCase().includes(lowerCaseSearch)
                );
            });
    }, [templates, searchTerm, activeFilter]);

    const copyToClipboard = (text: string, element: HTMLButtonElement) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = element.innerHTML;
            element.disabled = true;
            element.innerHTML = `<span class="material-icons-outlined text-xl">check</span> Copied!`;
            setTimeout(() => {
                element.innerHTML = originalHTML;
                element.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy ID.');
        });
    };

    const handleDelete = (template: Template) => {
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Template',
                message: `Are you sure you want to delete the template <strong>${template.name}</strong>? This action cannot be undone.`,
                onConfirm: async () => {
                    try {
                        await deleteTemplate(template.id);
                        refreshTemplates();
                    } catch (e) {
                        alert(`Error: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };

    const typeIcons: { [key: string]: string } = {
        Sheet: 'grid_on',
        Slides: 'slideshow',
        Docs: 'article'
    };
    const typeIconColors: { [key: string]: string } = {
        Sheet: 'text-green-500',
        Slides: 'text-yellow-500',
        Docs: 'text-blue-500'
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">description</span>
                    Templates
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Click a template to preview and copy its ID for use in the "Marge It" page.</p>
            </div>

            <div className="card p-4 mb-8 sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10"
                            aria-label="Search templates"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2" role="tablist" aria-label="Template Filters">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                                    activeFilter === filter
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                }`}
                                role="tab"
                                aria-selected={activeFilter === filter}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <p className="text-2xl font-bold">No templates found.</p>
                        <p className="mt-2">Try adjusting your search or filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map(template => {
                            const isAdmin = currentUser?.role === 'Admin';
                            const imageSrc = convertGoogleDriveUrl(template.imageUrl || '') || 'https://via.placeholder.com/400x225.png/F1F5F9/94A3B8?text=No+Preview';

                            return (
                                <div key={template.id} className="group relative card flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" title={template.name}>

                                    {isAdmin && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(template); }}
                                            className="absolute top-2 right-2 z-20 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            title="Delete Template"
                                            aria-label={`Delete ${template.name}`}
                                        >
                                            <span className="material-icons-outlined text-base">delete</span>
                                        </button>
                                    )}

                                    <div className="relative aspect-video bg-gray-100 dark:bg-slate-800 overflow-hidden" onClick={() => setSelectedImage({ src: imageSrc, src2: convertGoogleDriveUrl(template.imageUrl2 || ''), template, currentIndex: 0 })}>
                                        <img
                                            src={imageSrc}
                                            alt={template.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                            <span className="material-icons-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">zoom_in</span>
                                        </div>

                                        <div className="absolute top-2 left-2 z-10">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md ${template.plan === 'Pro' ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-500 text-white'}`}>
                                                {template.plan === 'Pro' && <span className="material-icons-outlined text-sm">workspace_premium</span>}
                                                {template.plan}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-grow flex flex-col">
                                        <h3 className="font-bold truncate text-base">{template.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex-grow">{template.description.substring(0, 70) || "No description available."}...</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                </>
            )}

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)} role="dialog" aria-modal="true" aria-labelledby="template-modal-title">
                    <div
                        className="card w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 z-10 p-1.5 bg-gray-100/50 hover:bg-gray-200/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/80 rounded-full cursor-pointer transition-colors"
                            onClick={() => setSelectedImage(null)}
                            title="Close"
                            aria-label="Close modal"
                        ><span className="material-icons-outlined">close</span></button>

                        <div className="md:w-3/5 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-slate-900/50 p-4 relative">
                            {(selectedImage.src2 && selectedImage.src2 !== '') && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(prev => prev ? { ...prev, currentIndex: (prev.currentIndex - 1 + 2) % 2 } : null);
                                        }}
                                        title="Previous Image"
                                        aria-label="Previous Image"
                                    >
                                        <span className="material-icons-outlined">chevron_left</span>
                                    </button>
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(prev => prev ? { ...prev, currentIndex: (prev.currentIndex + 1) % 2 } : null);
                                        }}
                                        title="Next Image"
                                        aria-label="Next Image"
                                    >
                                        <span className="material-icons-outlined">chevron_right</span>
                                    </button>
                                </>
                            )}
                            <img
                                src={selectedImage.currentIndex === 0 ? selectedImage.src : (selectedImage.src2 || selectedImage.src)}
                                alt={selectedImage.template.name}
                                className="max-w-full max-h-[50vh] md:max-h-[85vh] object-contain rounded-lg"
                            />
                        </div>
                        <div className="md:w-2/5 p-8 flex flex-col">
                            <div>
                                <h3 id="template-modal-title" className="text-2xl font-bold mb-3">{selectedImage.template.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">{selectedImage.template.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1"><span className={`material-icons-outlined ${typeIconColors[selectedImage.template.type]}`}>{typeIcons[selectedImage.template.type]}</span> {selectedImage.template.type}</span>
                                    <span className="flex items-center gap-1"><span className={`material-icons-outlined ${selectedImage.template.plan === 'Pro' ? 'text-yellow-500' : 'text-blue-500'}`}>{selectedImage.template.plan === 'Pro' ? 'workspace_premium' : 'check_circle'}</span> {selectedImage.template.plan}</span>
                                </div>

                                {selectedImage.template.plan === 'Pro' && !currentUser?.hasProAccess && (
                                    <div className="mt-6 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-semibold flex items-center gap-2">
                                        <span className="material-icons-outlined">lock</span>
                                        Pro Access Required to use this template.
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 mt-auto pt-6">
                                <button
                                    className="btn btn-primary w-full"
                                    onClick={(e) => copyToClipboard(selectedImage.template.id, e.currentTarget as HTMLButtonElement)}
                                    disabled={selectedImage.template.plan === 'Pro' && !currentUser?.hasProAccess}
                                >
                                    <span className="material-icons-outlined">content_copy</span>
                                    Copy Template ID
                                </button>
                                <a
                                    href={`https://docs.google.com/presentation/d/${selectedImage.template.id}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary w-full"
                                >
                                    <span className="material-icons-outlined">open_in_new</span>
                                    View Template
                                </a>
                                {selectedImage.template.sheetUrl && (
                                    <a
                                        href={selectedImage.template.sheetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline w-full"
                                    >
                                        <span className="material-icons-outlined">table_chart</span>
                                        View Sheet
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Templates;
