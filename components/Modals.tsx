import React from 'react';

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

export const ProgressModal: React.FC<ProgressModalProps> = ({ title, message }) => (
     <div className="card w-full max-w-md">
        <div className="p-6 lg:p-8 text-center">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%', animation: 'progress-bar-stripes 1s linear infinite', backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
            </div>
        </div>
    </div>
);

// --- Preview Modal ---
interface PreviewModalProps {
    title: string;
    previewUrl: string;
    mode: 'slides' | 'docs';
    formData: any;
    onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ title, previewUrl, mode, formData, onClose }) => (
    <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-inherit">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{title}</h2>
                <button onClick={onClose} className="material-icons-outlined text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">close</button>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Mode:</strong> {mode === 'slides' ? 'Sheet to Slides' : 'Sheet to Docs'} |
                <strong> Spreadsheet ID:</strong> {formData.spreadsheetId} |
                <strong> Sheet Name:</strong> {formData.sheetName} |
                <strong> Template ID:</strong> {formData.templateId}
                {formData.outputFileName && <span> | <strong>Output File Name:</strong> {formData.outputFileName}</span>}
            </div>
        </div>
        <div className="p-0">
            <iframe
                src={previewUrl}
                className="w-full h-[70vh] border-0"
                title={`${mode} Preview`}
                allow="fullscreen"
            />
        </div>
        <div className="p-4 border-t border-inherit bg-gray-50 dark:bg-slate-800 flex justify-end gap-3">
            <button onClick={() => window.open(previewUrl, '_blank')} className="btn btn-primary">
                <span className="material-icons-outlined text-sm mr-1">open_in_new</span>
                Open in New Tab
            </button>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
    </div>
);
