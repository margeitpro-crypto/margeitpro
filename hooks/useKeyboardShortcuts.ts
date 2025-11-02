import { useEffect } from 'react';

interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    action: () => void;
    description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const shortcut = shortcuts.find(s => 
                s && s.key && event.key && s.key.toLowerCase() === event.key.toLowerCase() &&
                !!s.ctrlKey === event.ctrlKey &&
                !!s.altKey === event.altKey &&
                !!s.shiftKey === event.shiftKey
            );

            if (shortcut) {
                event.preventDefault();
                shortcut.action();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

export const globalShortcuts = (navigateTo: (page: string) => void, toggleTheme: () => void) => [
    { key: 'd', ctrlKey: true, action: () => navigateTo('user-dashboard'), description: 'Go to Dashboard' },
    { key: 'm', ctrlKey: true, action: () => navigateTo('marge-it'), description: 'Go to Merge It' },
    { key: 'l', ctrlKey: true, action: () => navigateTo('merge-logs'), description: 'Go to Merge Logs' },
    { key: 't', ctrlKey: true, action: () => navigateTo('templates'), description: 'Go to Templates' },
    { key: 'n', ctrlKey: true, action: () => navigateTo('notifications'), description: 'Go to Notifications' },
    { key: 's', ctrlKey: true, action: () => navigateTo('settings'), description: 'Go to Settings' },
    { key: 'h', ctrlKey: true, action: () => navigateTo('help'), description: 'Go to Help' },
    { key: '/', ctrlKey: true, action: toggleTheme, description: 'Toggle Theme' },
];