import React, { useState, useEffect, useRef } from 'react';
import { PageProps } from '../types';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded-md text-sm my-4 overflow-x-auto">
        <code className="font-mono">{children}</code>
    </pre>
);

const DocSection: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => (
    <section id={id} className="mb-12 scroll-mt-20">
        <h2 className="text-3xl font-bold border-b border-inherit pb-3 mb-6">{title}</h2>
        <div className="prose dark:prose-invert max-w-none text-base leading-relaxed">
            {children}
        </div>
    </section>
);

const Documentation: React.FC<PageProps> = () => {
    const sections = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'getting-started', label: 'Getting Started' },
        { id: 'how-to-merge', label: 'How to Merge' },
        { id: 'placeholders', label: 'Using Placeholders' },
        { id: 'image-merging', label: 'Image Merging' },
        { id: 'troubleshooting', label: 'Troubleshooting' },
    ];

    const [activeSection, setActiveSection] = useState(sections[0].id);
    const mainContentRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // The main scrollable container is the <main> element in App.tsx
        const scrollContainer = document.querySelector('main');
        mainContentRef.current = scrollContainer;

        const handleScroll = () => {
            if (!scrollContainer) return;
            
            let currentSectionId = activeSection;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if the top of the section is within the top portion of the viewport
                    if (rect.top >= 0 && rect.top <= 150) {
                        currentSectionId = section.id;
                        break;
                    }
                }
            }
            setActiveSection(currentSectionId);
        };
        
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => {
            scrollContainer?.removeEventListener('scroll', handleScroll);
        };
    }, [sections]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500 text-4xl">menu_book</span>
                    Documentation
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Your comprehensive guide to using MargeitPro.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 lg:sticky top-8 self-start">
                    <div className="card p-4">
                        <h3 className="text-lg font-semibold mb-3">Contents</h3>
                        <div className="flex flex-col space-y-1">
                            {sections.map(section => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-white font-semibold'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {section.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <DocSection title="Introduction" id="introduction">
                        <p>Welcome to MargeitPro! This tool is designed to simplify and automate the process of creating documents (Google Docs) and presentations (Google Slides) from data in a Google Sheet. By using templates with special placeholders, you can generate personalized files for each row of your data, saving you hours of manual work.</p>
                    </DocSection>

                    <DocSection title="Getting Started: Finding Your IDs" id="getting-started">
                        <p>To use Marge It, you need three key pieces of information: the <strong>Spreadsheet ID</strong>, the <strong>Sheet Name</strong>, and the <strong>Template ID</strong>.</p>
                        <h4 className="font-bold mt-4">Spreadsheet ID</h4>
                        <p>This is the ID of the Google Sheet containing your data. You can find it in the URL.</p>
                        <p><code>https://docs.google.com/spreadsheets/d/</code><strong className="text-red-500">1aBCdeFgHiJkLmNoPqRsTuVwXyZ_12345AbcdeF</strong><code>/edit#gid=0</code></p>
                        <CodeBlock>1aBCdeFgHiJkLmNoPqRsTuVwXyZ_12345AbcdeF</CodeBlock>

                        <h4 className="font-bold mt-4">Sheet Name</h4>
                        <p>This is the name of the specific sheet (tab) within your Google Spreadsheet that holds the data. You can find it at the bottom of the page.</p>
                        <img src="https://i.imgur.com/2A2nN8h.png" alt="Google Sheet Name Example" className="my-4 border border-inherit rounded-md" />

                        <h4 className="font-bold mt-4">Template ID (Google Slides or Docs)</h4>
                        <p>Similar to the Spreadsheet ID, the Template ID is found in the URL of your Google Slides or Google Docs template file.</p>
                        <p><code>https://docs.google.com/presentation/d/</code><strong className="text-red-500">1aBCdeFgHiJkLmNoPqRsTuVwXyZ_12345AbcdeF</strong><code>/edit</code></p>
                        <p>You can also find pre-made templates and their IDs on the "Templates" page.</p>
                    </DocSection>

                    <DocSection title="How to Perform a Merge" id="how-to-merge">
                        <p>1. Navigate to the <strong>Marge It</strong> page.</p>
                        <p>2. Select whether you want to merge into <strong>Slides</strong> or <strong>Docs</strong>.</p>
                        <p>3. Fill in the required fields: Spreadsheet ID, Sheet Name, and Template ID.</p>
                        <p>4. Optionally, specify a Start Row and End Row if you only want to merge a subset of your data. If End Row is blank, it will process all rows from the Start Row.</p>
                        <p>5. Choose your merge type:</p>
                        <ul>
                            <li><strong>Custom (One file per row):</strong> This creates a separate, individual file for each row of data you merge. Ideal for personalized letters, certificates, or reports.</li>
                            <li><strong>All In One (One file for all):</strong> This combines all rows into a single output file. For Slides, it creates one new slide per row. For Docs, it appends the content for each row into one document. Ideal for directories or summary reports.</li>
                        </ul>
                        <p>6. Click one of the merge buttons. Your generated files will appear in the "Merge Results" table.</p>
                    </DocSection>
                    
                    <DocSection title="Using Placeholders (Merge Fields)" id="placeholders">
                        <p>The core of the merge process is using placeholders in your template. A placeholder is a piece of text that MargeitPro replaces with data from your Google Sheet.</p>
                        <p>Placeholders must follow this format: <code>{`{{Column_Name}}`}</code></p>
                        <p><strong>Important Rules:</strong></p>
                        <ul>
                            <li>The text inside the double curly braces <strong>must exactly match</strong> the column header in your Google Sheet.</li>
                            <li>Matching is <strong>case-sensitive</strong>. <code>{`{{FirstName}}`}</code> is different from <code>{`{{firstname}}`}</code>.</li>
                            <li>Matching is <strong>space-sensitive</strong>. <code>{`{{First Name}}`}</code> is different from <code>{`{{First_Name}}`}</code>.</li>
                        </ul>
                        <h4 className="font-bold mt-4">Example:</h4>
                        <p>If your Google Sheet has a column named "Client Name", your placeholder in the Google Doc or Slide template should be exactly <code>{`{{Client Name}}`}</code>.</p>
                    </DocSection>

                    <DocSection title="Advanced: Image Merging" id="image-merging">
                        <p>You can also merge images dynamically.</p>
                        <p>1. In your Google Sheet, place the public URL of an image into a cell. The URL must be accessible to anyone with the link.</p>
                        <p>2. In your Google Slides or Docs template, create a placeholder for the image, just like a text placeholder (e.g., <code>{`{{Profile Picture}}`}</code>).</p>
                        <p>The merge process will automatically detect the URL, fetch the image, and insert it into your template, resizing it to fit the original placeholder's container (like a shape in Slides).</p>
                    </DocSection>

                    <DocSection title="Troubleshooting" id="troubleshooting">
                        <h4 className="font-bold">My merge failed.</h4>
                        <p>Check the most common causes:</p>
                        <ul>
                            <li><strong>Incorrect ID:</strong> Double-check that your Spreadsheet and Template IDs are correct and that you have permission to view them.</li>
                            <li><strong>Incorrect Sheet Name:</strong> Make sure the sheet name is spelled correctly and matches exactly.</li>
                            <li><strong>Invalid Range:</strong> Ensure your Start Row (and End Row, if used) are valid numbers and point to rows with data.</li>
                        </ul>
                        <h4 className="font-bold mt-4">My placeholders aren't being replaced.</h4>
                        <p>This is almost always due to a mismatch between the column header in your Sheet and the placeholder text in your template. Check for:</p>
                        <ul>
                            <li>Case sensitivity (<code>Name</code> vs <code>name</code>).</li>
                            <li>Extra spaces before or after the column header or placeholder text.</li>
                            <li>Typos.</li>
                        </ul>
                    </DocSection>
                </main>
            </div>
        </div>
    );
};

export default Documentation;