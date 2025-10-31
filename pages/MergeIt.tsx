
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PageProps, MergeLog } from '../types';
import { runSlidesMerge, runDocsMerge, runSlidesPreview, runDocsPreview, addMergeLog } from '../services/gasClient';

type MergeMode = 'slides' | 'docs';

interface FormData {
  spreadsheetId: string;
  sheetName: string;
  startRow: string;
  endRow: string;
  templateId: string;
  outputFileName: string;
}

const defaultFormState: FormData = {
    spreadsheetId: '',
    sheetName: 'Sheet1',
    startRow: '2',
    endRow: '',
    templateId: '',
    outputFileName: '',
};

const downloadFormats = {
    slides: [ { format: 'pptx', label: 'PowerPoint (.pptx)' }, { format: 'pdf', label: 'PDF (.pdf)' }, { format: 'txt', label: 'Text (.txt)' } ],
    docs: [ { format: 'docx', label: 'Word (.docx)' }, { format: 'pdf', label: 'PDF (.pdf)' }, { format: 'rtf', label: 'RTF (.rtf)' }, { format: 'txt', label: 'Text (.txt)' } ]
};

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`w-full p-2 ${props.className || ''}`} />
);

export default function MargeItPage({ setModal, user }: PageProps) {
  const [mode, setMode] = useState<MergeMode>('slides');
  const [slidesForm, setSlidesForm] = useState<FormData>(defaultFormState);
  const [docsForm, setDocsForm] = useState<FormData>(defaultFormState);
  const [results, setResults] = useState<MergeLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sort, setSort] = useState<{ column: keyof MergeLog; direction: 'asc' | 'desc' }>({ column: 'timestamp', direction: 'desc' });
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpenDropdown(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSlidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSlidesForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocsForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReset = (formType: 'slides' | 'docs') => {
    if (formType === 'slides') {
      setSlidesForm(defaultFormState);
    } else {
      setDocsForm(defaultFormState);
    }
    setResults([]);
  };

  const handleRunMerge = async (runType: string, currentMode: 'slides' | 'docs') => {
    const formData = currentMode === 'slides' ? slidesForm : docsForm;

    if (!formData.spreadsheetId || !formData.sheetName || !formData.templateId) {
        setModal({ type: 'confirmation', props: { title: 'Validation Error', message: 'Please fill in all required fields: Spreadsheet ID, Sheet Name, and Template ID.', confirmText: "Okay", confirmColor: 'btn-primary', onConfirm: () => setModal({ type: null, props: {} }) }});
        return;
    }

    setIsProcessing(true);
    setModal({ type: 'progress', props: { title: 'Processing Merge...', message: 'Please wait, this may take a few moments.' } });

    try {
      const mergeFunction = currentMode === 'slides' ? runSlidesMerge : runDocsMerge;
      const response: any = await mergeFunction({ ...formData, runtype: runType });

      if (response.error) throw new Error(response.error);

      const newResults: MergeLog[] = response.data.urls.map((url: string, i: number) => ({
          sn: Date.now() + i,
          fileName: formData.outputFileName ? `${formData.outputFileName} (${i + 1})` : `Generated File ${i + 1}`,
          fileUrl: url,
          type: currentMode === 'slides' ? 'Sheet to Slides' : 'Sheet to Docs',
          status: 'Success',
          sheet: formData.sheetName,
          timestamp: new Date().toLocaleString(),
          date: new Date().toISOString().split('T')[0],
          user: user?.email,
          operation: runType === 'custom' ? 'Custom' : 'All In One',
          templateId: formData.templateId,
      }));

      // Save to Firebase
      for (const result of newResults) {
          await addMergeLog(result);
      }

      setResults(prev => [...newResults, ...prev]);

    } catch (error: any) {
      console.error("Merge failed", error);
      const errorMessage = error.message || "An unknown error occurred during the merge process.";
      setModal({ type: 'confirmation', props: { title: 'Merge Failed', message: errorMessage, confirmText: "Close", confirmColor: 'btn-danger', onConfirm: () => setModal({ type: null, props: {} }) }});
      const failedResult: MergeLog = {
          sn: Date.now(),
          fileName: formData.outputFileName || 'Untitled Merge',
          fileUrl: '',
          status: 'Failed',
          type: currentMode === 'slides' ? 'Sheet to Slides' : 'Sheet to Docs',
          sheet: formData.sheetName,
          timestamp: new Date().toLocaleString(),
          date: new Date().toISOString().split('T')[0],
          user: user?.email,
          operation: runType === 'custom' ? 'Custom' : 'All In One',
          templateId: formData.templateId,
      };

      // Save failed result to Firebase
      await addMergeLog(failedResult);

      setResults(prev => [failedResult, ...prev]);
    } finally {
      setIsProcessing(false);
      setModal({ type: null, props: {} });
    }
  };

  const handlePreview = async (currentMode: 'slides' | 'docs') => {
    const formData = currentMode === 'slides' ? slidesForm : docsForm;

    if (!formData.spreadsheetId || !formData.sheetName || !formData.templateId) {
        setModal({ type: 'confirmation', props: { title: 'Validation Error', message: 'Please fill in all required fields: Spreadsheet ID, Sheet Name, and Template ID.', confirmText: "Okay", confirmColor: 'btn-primary', onConfirm: () => setModal({ type: null, props: {} }) }});
        return;
    }

    setIsProcessing(true);
    setModal({ type: 'progress', props: { title: 'Generating Preview...', message: 'Please wait, this may take a few moments.' } });

    try {
      const previewFunction = currentMode === 'slides' ? runSlidesPreview : runDocsPreview;
      const response: any = await previewFunction(formData);

      if (response.error) throw new Error(response.error);

      // Show preview in modal
      setModal({
        type: 'preview',
        props: {
          title: `${currentMode === 'slides' ? 'Slides' : 'Docs'} Preview`,
          previewUrl: response.previewUrl,
          mode: currentMode,
          formData,
          onClose: () => setModal({ type: null, props: {} })
        }
      });

    } catch (error: any) {
      console.error("Preview failed", error);
      const errorMessage = error.message || "An unknown error occurred during the preview process.";
      setModal({ type: 'confirmation', props: { title: 'Preview Failed', message: errorMessage, confirmText: "Close", confirmColor: 'btn-danger', onConfirm: () => setModal({ type: null, props: {} }) }});
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>, sn: number) => {
    if (openDropdown === sn) {
        setOpenDropdown(null);
        setDropdownPosition(null);
    } else {
        const log = results.find(l => l.sn === sn);
        if (!log) return;

        const isSlides = log.type === 'Sheet to Slides';
        
        const DROPDOWN_WIDTH = 224; // w-56 in tailwind
        const DROPDOWN_HEIGHT_SLIDES = 275;
        const DROPDOWN_HEIGHT_DOCS = 305;
        const DROPDOWN_HEIGHT = isSlides ? DROPDOWN_HEIGHT_SLIDES : DROPDOWN_HEIGHT_DOCS;
        const VERTICAL_OFFSET = 5; 

        const rect = event.currentTarget.getBoundingClientRect();
        
        let leftPosition = rect.left;
        if (rect.left + DROPDOWN_WIDTH > window.innerWidth) {
            leftPosition = rect.right - DROPDOWN_WIDTH;
        }

        let topPosition;
        if (rect.bottom + DROPDOWN_HEIGHT + VERTICAL_OFFSET > window.innerHeight) {
            topPosition = rect.top + window.scrollY - DROPDOWN_HEIGHT - VERTICAL_OFFSET;
        } else {
            topPosition = rect.bottom + window.scrollY + VERTICAL_OFFSET;
        }

        setDropdownPosition({ top: topPosition, left: leftPosition });
        setOpenDropdown(sn);
    }
  };

  const closeDropdown = () => {
      setOpenDropdown(null);
      setDropdownPosition(null);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link to clipboard.');
    });
    closeDropdown();
  };

  const handleDownload = (baseUrl: string, format: string) => {
      // Extract file ID from Google Docs/Slides URL
      const fileIdMatch = baseUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!fileIdMatch) {
          alert('Invalid file URL format.');
          closeDropdown();
          return;
      }
      const fileId = fileIdMatch[1];
      // Determine if it's docs or slides based on the URL
      const isSlides = baseUrl.includes('presentation') || baseUrl.includes('slides');
      const downloadUrl = isSlides
          ? `https://docs.google.com/presentation/d/${fileId}/export?format=${format}`
          : `https://docs.google.com/document/d/${fileId}/export?format=${format}`;
      window.open(downloadUrl, '_blank');
      closeDropdown();
  };

  const handleRemoveResult = (sn: number) => {
      setResults(prevResults => prevResults.filter(r => r.sn !== sn));
      closeDropdown();
  };
  
  const handleSort = (column: keyof MergeLog) => {
    setSort(prevSort => ({
        column,
        direction: prevSort.column === column && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
            const col = sort.column;
            const dir = sort.direction === 'asc' ? 1 : -1;

            let valA = a[col];
            let valB = b[col];
            
            if (col === 'timestamp' && typeof valA === 'string' && typeof valB === 'string') {
                const timeA = new Date(valA).getTime();
                const timeB = new Date(valB).getTime();
                if (!isNaN(timeA) && !isNaN(timeB)) {
                      return (timeA - timeB) * dir;
                }
            }

            valA = valA ?? '';
            valB = valB ?? '';

            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
        });
  }, [results, sort]);

  const renderInput = ( iconName: string, iconColor: string, id: string, name: keyof FormData, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type: string = 'text', required: boolean = false ) => (
    <div className="relative">
        <span className={`material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${iconColor}`}>{iconName}</span>
        <Input id={id} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className="pl-10" disabled={isProcessing} required={required} />
    </div>
  );

  const renderForm = (currentMode: 'slides' | 'docs') => {
    const formData = currentMode === 'slides' ? slidesForm : docsForm;
    const handleChange = currentMode === 'slides' ? handleSlidesChange : handleDocsChange;
    const templateIcon = currentMode === 'slides' ? 'slideshow' : 'article';
    const templateIconColor = currentMode === 'slides' ? 'text-yellow-500' : 'text-blue-500';
    const templatePlaceholder = `Google ${currentMode === 'slides' ? 'Slides' : 'Docs'} Template ID`;

    return (
      <div className="pt-6">
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            <div><Label htmlFor={`${currentMode}-spreadsheetId`}>Data Spreadsheet ID <span className="text-red-500">*</span></Label>{renderInput('grid_on', 'text-green-500', `${currentMode}-spreadsheetId`, "spreadsheetId", "Spreadsheet ID", formData.spreadsheetId, handleChange, 'text', true)}</div>
            <div><Label htmlFor={`${currentMode}-sheetName`}>Data Sheet Name <span className="text-red-500">*</span></Label>{renderInput('view_list', 'text-green-500', `${currentMode}-sheetName`, "sheetName", "e.g., Sheet1", formData.sheetName, handleChange, 'text', true)}</div>
            <div><Label htmlFor={`${currentMode}-startRow`}>Start Row</Label>{renderInput('format_list_numbered', 'text-gray-400', `${currentMode}-startRow`, "startRow", "e.g., 2", formData.startRow, handleChange, "number")}</div>
            <div><Label htmlFor={`${currentMode}-endRow`}>End Row (optional)</Label>{renderInput('last_page', 'text-gray-400', `${currentMode}-endRow`, "endRow", "e.g., 50", formData.endRow, handleChange, "number")}</div>
            <div><Label htmlFor={`${currentMode}-templateId`}>Template ID <span className="text-red-500">*</span></Label>{renderInput(templateIcon, templateIconColor, `${currentMode}-templateId`, "templateId", templatePlaceholder, formData.templateId, handleChange, 'text', true)}</div>
            <div><Label htmlFor={`${currentMode}-outputFileName`}>Output File Name (Optional)</Label>{renderInput('drive_file_rename_outline', 'text-gray-400', `${currentMode}-outputFileName`, "outputFileName", "e.g., Monthly_Report", formData.outputFileName, handleChange)}</div>
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <button onClick={() => handlePreview(currentMode)} disabled={isProcessing} className="btn btn-info bg-blue-500 hover:bg-blue-600 text-white"><span className="material-icons-outlined text-lg">visibility</span>Preview</button>
          <button onClick={() => handleRunMerge('custom', currentMode)} disabled={isProcessing} className="btn btn-warning bg-yellow-500 hover:bg-yellow-600 text-white">Custom (One file per row)</button>
          <button onClick={() => handleRunMerge('allinone', currentMode)} disabled={isProcessing} className="btn btn-primary"><span className="material-icons-outlined text-lg text-yellow-300">auto_awesome</span>All In One (One file for all)</button>
          <button onClick={() => handleReset(currentMode)} className="btn btn-danger" disabled={isProcessing}>Clear</button>
        </div>
      </div>
    );
  };
  
  const SortableHeader: React.FC<{ column: keyof MergeLog; label: string }> = ({ column, label }) => (
    <th className="py-3 px-4 font-semibold cursor-pointer" onClick={() => handleSort(column)}>
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
    <div className="w-full space-y-6">
      <div className="card">
        <div className="p-6">
            <div className="flex items-center gap-3">
                <span className="material-icons-outlined text-3xl text-blue-600 dark:text-blue-500">link</span>
                <div><h1 className="text-2xl font-bold">Marge It</h1><p className="text-gray-500 dark:text-gray-400 text-base">Merge data from Google Sheets into Docs & Slides effortlessly.</p></div>
            </div>
        </div>
        <div className="p-6 pt-0">
            <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-lg flex">
                <button onClick={() => setMode('slides')} className={`flex-1 px-4 py-2 font-semibold text-sm rounded-md focus:outline-none transition-colors ${mode === 'slides' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Sheet to Slides</button>
                <button onClick={() => setMode('docs')} className={`flex-1 px-4 py-2 font-semibold text-sm rounded-md focus:outline-none transition-colors ${mode === 'docs' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Sheet to Docs</button>
            </div>
            
            {mode === 'slides' ? renderForm('slides') : renderForm('docs')}

            {(isProcessing || results.length > 0) && (
                <div className="mt-6 pt-6 border-t border-inherit w-full">
                    <h2 className="text-xl font-bold mb-4">Merge Results</h2>
                    {isProcessing && results.length === 0 && <div className="min-h-[6rem] flex items-center justify-center"><div className="spinner"></div></div>}
                    {results.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                                    <tr>
                                        <SortableHeader column="sn" label="SN" />
                                        <SortableHeader column="fileName" label="File Name" />
                                        <SortableHeader column="type" label="Type" />
                                        <SortableHeader column="status" label="Status" />
                                        <SortableHeader column="timestamp" label="Timestamp" />
                                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {sortedResults.map(log => (
                                        <tr key={log.sn} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.sn}</td>
                                            <td className="py-4 px-4 font-medium">{log.fileName}</td>
                                            <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.type}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${log.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{log.status}</span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{log.timestamp}</td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="inline-block text-left">
                                                    {log.status === 'Success' ? (
                                                        <button onClick={(e) => handleDropdownToggle(e, log.sn)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full p-1">more_vert</button>
                                                    ) : (
                                                        <button onClick={() => handleRemoveResult(log.sn)} className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:text-red-500 p-1">delete</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      {openDropdown && dropdownPosition && (() => {
          const log = results.find(l => l.sn === openDropdown);
          if (!log || !log.fileUrl) return null;
          return (
              <div 
                  ref={dropdownRef}
                  className="card fixed w-56 z-50 p-2"
                  style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
              >
                  <ul>
                      <li><a href={log.fileUrl} target="_blank" rel="noopener noreferrer" onClick={closeDropdown} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"><span className="material-icons-outlined text-base text-blue-500">open_in_new</span>Open</a></li>
                      <li><button onClick={() => handleCopyLink(log.fileUrl!)} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"><span className="material-icons-outlined text-base text-green-500">content_copy</span>Copy Link</button></li>
                      <li className="my-1 border-t border-inherit"></li>
                      <li className="px-3 pt-2 pb-1 text-xs text-gray-400">Download As</li>
                      {(log.type === 'Sheet to Slides' ? downloadFormats.slides : downloadFormats.docs).map(df => (
                          <li key={df.format}><button onClick={() => handleDownload(log.fileUrl!, df.format)} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"><span className="material-icons-outlined text-base text-gray-500">download</span>{df.label}</button></li>
                      ))}
                      <li className="my-1 border-t border-inherit"></li>
                      <li><button onClick={() => handleRemoveResult(log.sn)} className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><span className="material-icons-outlined text-base">delete</span>Remove from list</button></li>
                  </ul>
              </div>
          );
      })()}
    </div>
  );
}