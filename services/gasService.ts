// DEPRECATED: All type definitions have been consolidated into `types.ts`.
// This file is kept to avoid breaking older import paths but should not be used for new development.
// Please update your imports to point to `../types`.

// GAS Service functions for handling merge operations
export interface GasRequestParams {
  mode: 'slides' | 'docs';
  action?: 'preview' | 'merge';
  spreadsheetId: string;
  sheetName: string;
  startRow: string;
  endRow: string;
  templateId: string;
  outputFileName: string;
  runtype?: 'custom' | 'allinone';
}

export interface GasResponse {
  success: boolean;
  data?: any;
  error?: string;
  urls?: string[];
  previewUrl?: string;
}

// Helper function to validate request parameters
export const validateGasParams = (params: GasRequestParams): { isValid: boolean; error?: string } => {
  if (!params.spreadsheetId) return { isValid: false, error: 'Spreadsheet ID is required' };
  if (!params.sheetName) return { isValid: false, error: 'Sheet name is required' };
  if (!params.templateId) return { isValid: false, error: 'Template ID is required' };
  if (!params.startRow) return { isValid: false, error: 'Start row is required' };

  // Validate IDs are in correct format
  const spreadsheetRegex = /^[a-zA-Z0-9-_]+$/;
  if (!spreadsheetRegex.test(params.spreadsheetId)) {
    return { isValid: false, error: 'Invalid spreadsheet ID format' };
  }
  if (!spreadsheetRegex.test(params.templateId)) {
    return { isValid: false, error: 'Invalid template ID format' };
  }

  return { isValid: true };
};

// Helper function to format error responses
export const formatGasError = (error: any): GasResponse => {
  return {
    success: false,
    error: typeof error === 'string' ? error : error.message || 'Unknown error occurred'
  };
};

// Helper function to format success responses
export const formatGasSuccess = (data: any): GasResponse => {
  return {
    success: true,
    data
  };
};
