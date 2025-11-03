import React, { useState, useEffect } from 'react';

// --- Confirmation Modal ---
interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    confirmColor?: 'btn-primary' | 'btn-danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel, confirmText = "Confirm", confirmColor = "btn-danger" }) => (
    <div className="card w-full max-w-md">
        <div className="p-6 lg:p-8">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <span className="material-icons-outlined text-red-600 dark:text-red-400 text-3xl">warning</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="mt-2 text-gray-600 dark:text-gray-400 max-h-60 overflow-y-auto" dangerouslySetInnerHTML={{ __html: message }} />
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
                <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
                <button onClick={onConfirm} className={`btn ${confirmColor}`}>{confirmText}</button>
            </div>
        </div>
    </div>
);

// --- Progress Modal ---
interface ProgressModalProps {
    title: string;
    message: string;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ title, message }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card w-full max-w-md">
            <div className="p-6 lg:p-8 text-center">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
                <div className="text-lg font-mono text-gray-800 dark:text-gray-200 mb-6">
                    {formatTime(elapsedTime)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%', animation: 'progress-bar-stripes 1s linear infinite', backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
                </div>
            </div>
        </div>
    );
};

// --- Preview Modal ---
interface PreviewModalProps {
    title: string;
    previewUrl: string;
    mode: 'slides' | 'docs';
    formData: any;
    onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ title, previewUrl, mode, formData, onClose }) => {
    const [activeTab, setActiveTab] = React.useState<'spreadsheet' | 'template'>('spreadsheet');

    return (
    <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden landscape:max-w-5xl landscape:max-h-[80vh]">
        <div className="p-6 border-b border-inherit">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{title}</h2>
                <button onClick={onClose} className="material-icons-outlined text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">close</button>
            </div>
            <div className="mt-2">
                <div className="flex items-center gap-2 mb-4">
                    <strong className="text-sm text-gray-600 dark:text-gray-400">Mode:</strong>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                        {mode === 'slides' ? 'Sheet to Slides' : 'Sheet to Docs'}
                    </span>
                
                    <a
                        href={`https://docs.google.com/spreadsheets/d/${formData.spreadsheetId}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                        <span className="material-icons-outlined text-sm">grid_on</span>
                        Spreadsheet
                    </a>
                    <a
                        href={mode === 'slides'
                            ? `https://docs.google.com/presentation/d/${formData.templateId}/edit`
                            : `https://docs.google.com/document/d/${formData.templateId}/edit`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                        <span className="material-icons-outlined text-sm">{mode === 'slides' ? 'slideshow' : 'article'}</span>
                        {mode === 'slides' ? 'Slides' : 'Docs'}
                    </a>
                </div>
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('spreadsheet')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'spreadsheet'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <span className="material-icons-outlined text-sm mr-1">grid_on</span>
                        Spreadsheet
                    </button>
                    <button
                        onClick={() => setActiveTab('template')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'template'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <span className="material-icons-outlined text-sm mr-1">{mode === 'slides' ? 'slideshow' : 'article'}</span>
                        {mode === 'slides' ? 'Slides' : 'Docs'}
                    </button>
                </div>
                <div className="mt-4">
                    {activeTab === 'spreadsheet' && (
                        <iframe
                            src={`https://docs.google.com/spreadsheets/d/${formData.spreadsheetId}/edit?embedded=true&widget=true&headers=false&range=A1:Z15&rm=minimal`}
                            className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded"
                            title="Spreadsheet Preview"
                        />
                    )}
                    {activeTab === 'template' && (
                        <iframe
                            src={mode === 'slides'
                                ? `https://docs.google.com/presentation/d/${formData.templateId}/edit?embedded=true&rm=minimal`
                                : `https://docs.google.com/document/d/${formData.templateId}/edit?embedded=true&rm=minimal&zoom=50`
                            }
                            className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded"
                            title={`${mode === 'slides' ? 'Slides' : 'Docs'} Template Preview`}
                        />
                    )}
                </div>
            </div>
        </div>
        <div className="p-0">
            <iframe
                src={previewUrl}
                className="w-full h-[50vh] landscape:h-[60vh] border-0"
                title={`${mode} Preview`}
                allow="fullscreen"
            />
        </div>
        <div className="p-4 border-t border-inherit bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Output File Name:</strong> {formData.outputFileName || 'Preview'}
            </div>
            <div className="flex gap-3">
                <a 
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"  /* <- उही styling प्रयोग गर्नुहोस् */
                >
                    <span className="material-icons-outlined text-sm mr-1">open_in_new</span>
                    Open in New Tab
                </a>
                <button onClick={onClose} className="btn btn-secondary">Close</button>
            </div>
        </div>
    </div>
    );
};
