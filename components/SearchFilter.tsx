import React, { useState } from 'react';

interface SearchFilterProps {
    onSearch: (query: string) => void;
    onFilter: (filters: Record<string, string>) => void;
    filters: Array<{ key: string; label: string; options: string[] }>;
    placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter, filters, placeholder = "Search..." }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch(query);
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...activeFilters, [key]: value };
        if (!value) delete newFilters[key];
        setActiveFilters(newFilters);
        onFilter(newFilters);
    };

    const clearAllFilters = () => {
        setActiveFilters({});
        setSearchQuery('');
        onSearch('');
        onFilter({});
    };

    const activeFilterCount = Object.keys(activeFilters).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <span className="material-icons-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => handleSearch('')}
                            className="material-icons-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            close
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} relative`}
                    >
                        <span className="material-icons-outlined">filter_list</span>
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button onClick={clearAllFilters} className="btn btn-secondary">
                            <span className="material-icons-outlined">clear</span>
                            Clear
                        </button>
                    )}
                </div>
            </div>
            
            {showFilters && (
                <div className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filters.map(filter => (
                        <div key={filter.key}>
                            <label className="block text-sm font-medium mb-1">{filter.label}</label>
                            <select
                                value={activeFilters[filter.key] || ''}
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                className="w-full"
                            >
                                <option value="">All {filter.label}</option>
                                {filter.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchFilter;