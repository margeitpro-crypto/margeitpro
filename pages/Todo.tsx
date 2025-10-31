
import React, { useState, useEffect, useMemo } from 'react';
import { Todo, PageProps } from '../types';

const TodoPage: React.FC<PageProps> = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        if (!savedTodos) return [];
        const parsedTodos = JSON.parse(savedTodos);
        // Ensure all todos from localStorage have a priority for backward compatibility
        return parsedTodos.map((todo: any) => ({
            ...todo,
            priority: todo.priority || 'Low'
        }));
    });
    const [newTodo, setNewTodo] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState<'High' | 'Medium' | 'Low'>('Low');
    const [filter, setFilter] = useState({ status: 'all', search: '' });
    const [sort, setSort] = useState<{ column: keyof Todo | 'text', direction: 'asc' | 'desc' }>({ column: 'id', direction: 'desc' });


    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;
        setTodos([{ id: Date.now(), text: newTodo, completed: false, priority: newTodoPriority }, ...todos]);
        setNewTodo('');
        setNewTodoPriority('Low');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleSort = (column: keyof Todo | 'text') => {
        setSort(prevSort => ({
            column,
            direction: prevSort.column === column && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedTodos = useMemo(() => {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        
        return todos.filter(todo => {
            const matchesStatus = filter.status === 'all' || (filter.status === 'completed' && todo.completed) || (filter.status === 'active' && !todo.completed);
            const matchesSearch = todo.text.toLowerCase().includes(filter.search.toLowerCase());
            return matchesStatus && matchesSearch;
        }).sort((a, b) => {
            const dir = sort.direction === 'asc' ? 1 : -1;
            if (sort.column === 'priority') {
                return (priorityOrder[a.priority] - priorityOrder[b.priority]) * dir;
            }
            if (sort.column === 'id' && typeof a.id === 'number' && typeof b.id === 'number') {
                 return (b.id - a.id); // Always sort by newest first for ID
            }
            const valA = a[sort.column as keyof Todo];
            const valB = b[sort.column as keyof Todo];
            
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
        });
    }, [todos, filter, sort]);
    
    const activeTasks = todos.filter(t => !t.completed).length;

    const priorityColors: { [key in Todo['priority']]: string } = {
        High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };
    
    const SortableHeader: React.FC<{ column: keyof Todo | 'text'; label: string, className?: string }> = ({ column, label, className }) => (
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
                    <span className="material-icons-outlined text-3xl text-blue-600 dark:text-blue-500">checklist</span>
                    <div>
                        <h1 className="text-2xl font-bold">To-Do List</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Manage your tasks and stay organized.</p>
                    </div>
                </div>
                 <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
                    <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." className="p-2 w-full md:w-auto flex-grow" required />
                    <select value={newTodoPriority} onChange={(e) => setNewTodoPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="p-2 w-full sm:w-auto">
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>
                    <button type="submit" className="btn btn-primary">
                        <span className="material-icons-outlined">add</span>
                    </button>
                </form>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative flex-grow w-full md:w-auto">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
                    <input 
                        type="text" 
                        placeholder="Search by task name..." 
                        className="w-full p-2 pl-10" 
                        onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        className="p-2 w-full"
                        onChange={(e) => setFilter(prev => ({...prev, status: e.target.value}))}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="py-3 px-4 w-12"></th>
                            <SortableHeader column="text" label="Task Information" />
                            <SortableHeader column="priority" label="Priority" />
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                         {filteredAndSortedTodos.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No tasks found.</td></tr>
                        ) : (
                            filteredAndSortedTodos.map(todo => (
                                <tr key={todo.id} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <td className="py-4 px-4">
                                        <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-slate-500' : ''}`}>{todo.text}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${priorityColors[todo.priority]}`}>
                                            {todo.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button onClick={() => deleteTodo(todo.id)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 p-1">delete_outline</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredAndSortedTodos.length} of {todos.length} tasks. ({activeTasks} remaining)
            </div>
        </div>
    );
};

export default TodoPage;