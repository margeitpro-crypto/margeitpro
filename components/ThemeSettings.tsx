import React from 'react';
import { useTheme, ThemeConfig } from '../hooks/useTheme';
import ThemePreview from './ThemePreview';

const ThemeSettings: React.FC = () => {
    const { theme, updateTheme, toggleMode, resetTheme } = useTheme();

    const colorOptions = [
        { value: 'facebook', label: 'Facebook', color: '#1877F2' },
        { value: 'blue', label: 'Blue', color: '#3b82f6' },
        { value: 'green', label: 'Green', color: '#22c55e' },
        { value: 'red', label: 'Red', color: '#ef4444' }
    ];

    const fontSizeOptions = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
    ];

    const borderRadiusOptions = [
        { value: 'none', label: 'None' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Dark Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={theme.mode === 'dark'}
                            onChange={toggleMode}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Primary Color */}
                <div className="mb-4">
                    <label className="block font-medium mb-2">Primary Color</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {colorOptions.map(color => (
                            <button
                                key={color.value}
                                onClick={() => updateTheme({ primaryColor: color.value })}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    theme.primaryColor === color.value
                                        ? 'border-gray-400 ring-2 ring-blue-500'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div
                                    className="w-6 h-6 rounded-full mx-auto mb-1"
                                    style={{ backgroundColor: color.color }}
                                ></div>
                                <span className="text-xs">{color.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font Size */}
                <div className="mb-4">
                    <label className="block font-medium mb-2">Font Size</label>
                    <select
                        value={theme.fontSize}
                        onChange={(e) => updateTheme({ fontSize: e.target.value as ThemeConfig['fontSize'] })}
                        className="w-full p-2"
                    >
                        {fontSizeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Border Radius */}
                <div className="mb-4">
                    <label className="block font-medium mb-2">Border Radius</label>
                    <select
                        value={theme.borderRadius}
                        onChange={(e) => updateTheme({ borderRadius: e.target.value as ThemeConfig['borderRadius'] })}
                        className="w-full p-2"
                    >
                        {borderRadiusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Animations</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={theme.animations}
                            onChange={(e) => updateTheme({ animations: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Reset Button */}
                <button
                    onClick={resetTheme}
                    className="btn btn-secondary w-full"
                >
                    Reset to Default
                </button>
            </div>
            
            {/* Theme Preview */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <ThemePreview />
            </div>
        </div>
    );
};

export default ThemeSettings;