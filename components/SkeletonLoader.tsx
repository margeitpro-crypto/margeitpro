import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 6 }) => (
    <>
        {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse border-b border-gray-200 dark:border-gray-700">
                {Array.from({ length: cols }).map((_, j) => (
                    <td key={j} className="py-4 px-4">
                        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${j === 0 ? 'w-8' : j === 1 ? 'w-full' : 'w-20'}`}></div>
                    </td>
                ))}
            </tr>
        ))}
    </>
);

export const CardSkeleton: React.FC = () => (
    <div className="card p-5 animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
);

export const ChartSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
);