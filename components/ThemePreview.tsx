import React from 'react';

const ThemePreview: React.FC = () => {
    return (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-theme-lg bg-gray-50 dark:bg-slate-800">
            <h4 className="font-semibold">Theme Preview</h4>
            
            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
                <button className="btn btn-primary btn-sm">Primary</button>
                <button className="btn btn-secondary btn-sm">Secondary</button>
                <button className="btn btn-danger btn-sm">Danger</button>
            </div>
            
            {/* Card */}
            <div className="card p-4">
                <h5 className="font-semibold text-primary mb-2">Sample Card</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">This is how cards will look with your theme settings.</p>
            </div>
            
            {/* Form Elements */}
            <div className="space-y-2">
                <input type="text" placeholder="Sample input" className="w-full" />
                <select className="w-full">
                    <option>Sample select</option>
                </select>
            </div>
            
            {/* Typography */}
            <div className="space-y-1">
                <h1 className="font-bold">Heading 1</h1>
                <h2 className="font-bold">Heading 2</h2>
                <h3 className="font-bold">Heading 3</h3>
                <p className="text-base">Regular paragraph text</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Small text</p>
            </div>
        </div>
    );
};

export default ThemePreview;