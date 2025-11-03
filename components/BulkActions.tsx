import React from 'react';

interface BulkActionsProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    actions: Array<{
        label: string;
        icon: string;
        onClick: () => void;
        color?: 'primary' | 'secondary' | 'danger';
        disabled?: boolean;
    }>;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
    selectedCount, 
    totalCount, 
    onSelectAll, 
    onDeselectAll, 
    actions 
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                        {selectedCount} of {totalCount} selected
                    </span>
                    <div className="flex gap-2">
                        {selectedCount < totalCount && (
                            <button
                                onClick={onSelectAll}
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                                Select all {totalCount}
                            </button>
                        )}
                        <button
                            onClick={onDeselectAll}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                            Deselect all
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={`btn ${
                                action.color === 'danger' ? 'btn-danger' : 
                                action.color === 'primary' ? 'btn-primary' : 'btn-secondary'
                            } flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span className="material-icons-outlined text-sm">{action.icon}</span>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BulkActions;