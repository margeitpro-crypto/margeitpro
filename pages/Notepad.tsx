import React, { useState, useEffect, useRef } from 'react';
import { Note, PageProps } from '../types';

const NotepadPage: React.FC<PageProps> = () => {
    const [notes, setNotes] = useState<Note[]>(() => {
        const savedNotes = localStorage.getItem('notes');
        if (!savedNotes) return [];
        return JSON.parse(savedNotes);
    });
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const createNewNote = () => {
        const newNote: Note = {
            id: Date.now(),
            title: `Note ${notes.length + 1}`,
            content: '',
            fontSize: 16,
            fontFamily: 'Arial',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        setCurrentNote(newNote);
        setFontSize(newNote.fontSize);
        setFontFamily(newNote.fontFamily);
        setWordCount(0);
        setCharCount(0);
        setHistory([newNote.content]);
        setHistoryIndex(0);
    };

    const selectNote = (note: Note) => {
        setCurrentNote(note);
        setFontSize(note.fontSize);
        setFontFamily(note.fontFamily);
        updateCounts(note.content);
        setHistory([note.content]);
        setHistoryIndex(0);
    };

    const updateCounts = (content: string) => {
        const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
        const chars = content.length;
        setWordCount(words);
        setCharCount(chars);
    };

    const handleContentChange = (content: string) => {
        if (!currentNote) return;
        const updatedNote = { ...currentNote, content, updatedAt: new Date().toISOString() };
        setNotes(notes.map(note => note.id === currentNote.id ? updatedNote : note));
        setCurrentNote(updatedNote);
        updateCounts(content);

        // Add to history for undo/redo
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleFontSizeChange = (size: number) => {
        setFontSize(size);
        if (currentNote) {
            const updatedNote = { ...currentNote, fontSize: size, updatedAt: new Date().toISOString() };
            setNotes(notes.map(note => note.id === currentNote.id ? updatedNote : note));
            setCurrentNote(updatedNote);
        }
    };

    const handleFontFamilyChange = (family: string) => {
        setFontFamily(family);
        if (currentNote) {
            const updatedNote = { ...currentNote, fontFamily: family, updatedAt: new Date().toISOString() };
            setNotes(notes.map(note => note.id === currentNote.id ? updatedNote : note));
            setCurrentNote(updatedNote);
        }
    };

    const deleteNote = (id: number) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        if (currentNote?.id === id) {
            setCurrentNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            handleContentChange(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            handleContentChange(history[newIndex]);
        }
    };

    const applyFormatting = (command: string) => {
        document.execCommand(command, false);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <button onClick={createNewNote} className="w-full btn btn-primary">
                            <span className="material-icons-outlined mr-2">add</span>
                            New Note
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => selectNote(note)}
                                className={`p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    currentNote?.id === note.id ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' : ''
                                }`}
                            >
                                <h3 className="font-medium text-sm truncate">{note.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{note.content.slice(0, 50)}...</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <span className="material-icons-outlined">{sidebarOpen ? 'chevron_left' : 'chevron_right'}</span>
                        </button>
                        <h1 className="text-xl font-bold">{currentNote?.title || 'Notepad'}</h1>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => applyFormatting('bold')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <span className="material-icons-outlined">format_bold</span>
                        </button>
                        <button onClick={() => applyFormatting('italic')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <span className="material-icons-outlined">format_italic</span>
                        </button>
                        <button onClick={() => applyFormatting('underline')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <span className="material-icons-outlined">format_underlined</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                        <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50">
                            <span className="material-icons-outlined">undo</span>
                        </button>
                        <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50">
                            <span className="material-icons-outlined">redo</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                        <select value={fontFamily} onChange={(e) => handleFontFamilyChange(e.target.value)} className="p-1 border rounded">
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                        <select value={fontSize} onChange={(e) => handleFontSizeChange(Number(e.target.value))} className="p-1 border rounded w-16">
                            {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                                <option key={size} value={size}>{size}px</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 p-4">
                    {currentNote ? (
                        <textarea
                            ref={textareaRef}
                            value={currentNote.content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Start writing your note..."
                            className="w-full h-full resize-none border-none outline-none bg-transparent"
                            style={{ fontSize: `${fontSize}px`, fontFamily }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                                <span className="material-icons-outlined text-6xl mb-4">note_alt</span>
                                <p className="text-lg">Select a note or create a new one to start writing</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Words: {wordCount}</span>
                        <span>Characters: {charCount}</span>
                    </div>
                    {currentNote && (
                        <button onClick={() => deleteNote(currentNote.id)} className="text-red-500 hover:text-red-700">
                            <span className="material-icons-outlined">delete</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotepadPage;
