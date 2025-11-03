import React, { useState, useEffect } from 'react';
import { ToastNotification } from '../types';

interface ToastProps {
    toast: ToastNotification;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setIsVisible(true);

        // Auto-close after duration
        const duration = toast.duration || 5000;
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(toast.id);
        }, 300); // Match animation duration
    };

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ease-in-out transform";

        if (isExiting) {
            return `${baseStyles} translate-x-full opacity-0`;
        }

        if (isVisible) {
            return `${baseStyles} translate-x-0 opacity-100`;
        }

        return `${baseStyles} translate-x-full opacity-0`;
    };

    const getTypeStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300';
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'info';
        }
    };

    return (
        <div className={`${getToastStyles()} border rounded-lg shadow-lg`}>
            <div className={`p-4 ${getTypeStyles()}`}>
                <div className="flex items-start gap-3">
                    <span className="material-icons-outlined text-xl mt-0.5 flex-shrink-0">
                        {getIcon()}
                    </span>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{toast.title}</h4>
                        <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                        {toast.action && (
                            <button
                                onClick={() => {
                                    toast.action?.onClick();
                                    handleClose();
                                }}
                                className="mt-2 text-xs font-medium underline hover:no-underline"
                            >
                                {toast.action.text}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors"
                    >
                        <span className="material-icons-outlined text-lg">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
