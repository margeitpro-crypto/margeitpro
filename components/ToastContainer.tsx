import React, { useState, useCallback } from 'react';
import Toast from './Toast';
import { ToastNotification } from '../types';

const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastNotification[]>([]);

    const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
        const id = Date.now().toString();
        const newToast: ToastNotification = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Expose addToast globally for easy access
    React.useEffect(() => {
        (window as any).showToast = addToast;
    }, [addToast]);

    return (
        <div className="fixed top-0 right-0 z-50 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto mb-4">
                    <Toast toast={toast} onClose={removeToast} />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
