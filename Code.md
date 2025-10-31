# Google Apps Script Code for Merge Functionality

Copy the following code into your Google Apps Script editor:

```javascript
function doPost(e) {
  try {
    // Handle CORS preflight request
    if (e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify({}))
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }

    const data = JSON.parse(e.postData.contents);
    const { mode, action, spreadsheetId, sheetName, startRow, endRow, templateId, outputFileName, runtype } = data;

    let result;

    if (action === 'preview') {
      if (mode === 'slides') {
        result = generateSlidesPreview(spreadsheetId, sheetName, startRow, endRow, templateId);
      } else if (mode === 'docs') {
        result = generateDocsPreview(spreadsheetId, sheetName, startRow, endRow, templateId);
      }
    } else {
      if (mode === 'slides') {
        result = mergeSlides(spreadsheetId, sheetName, startRow, endRow, templateId, outputFileName, runtype);
      } else if (mode === 'docs') {
        result = mergeDocs(spreadsheetId, sheetName, startRow, endRow, templateId, outputFileName, runtype);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      });

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      });
  }
}

function generateSlidesPreview(spreadsheetId, sheetName, startRow, endRow, templateId) {
  // Implement preview logic for slides
  // This should generate a preview URL or data
  // For now, return a placeholder
  return { previewUrl: 'https://docs.google.com/presentation/d/' + templateId + '/preview' };
}

function generateDocsPreview(spreadsheetId, sheetName, startRow, endRow, templateId) {
  // Implement preview logic for docs
  // This should generate a preview URL or data
  // For now, return a placeholder
  return { previewUrl: 'https://docs.google.com/document/d/' + templateId + '/preview' };
}

function mergeSlides(spreadsheetId, sheetName, startRow, endRow, templateId, outputFileName, runtype) {
  // Implement slides merge logic
  // This should perform the actual merge and return URLs
  // For now, return placeholder URLs
  const urls = ['https://docs.google.com/presentation/d/PLACEHOLDER1/edit', 'https://docs.google.com/presentation/d/PLACEHOLDER2/edit'];
  return { urls };
}

function mergeDocs(spreadsheetId, sheetName, startRow, endRow, templateId, outputFileName, runtype) {
  // Implement docs merge logic
  // This should perform the actual merge and return URLs
  // For now, return placeholder URLs
  const urls = ['https://docs.google.com/document/d/PLACEHOLDER1/edit', 'https://docs.google.com/document/d/PLACEHOLDER2/edit'];
  return { urls };
}
```

## Instructions

1. Copy the code between the ```javascript and ``` markers into your Google Apps Script editor (not the markdown formatting).
2. Replace the placeholder functions (`generateSlidesPreview`, `generateDocsPreview`, `mergeSlides`, `mergeDocs`) with your actual implementation logic for merging data from Google Sheets into Slides/Docs.
3. Deploy the script as a web app with the following settings:
   - Execute the app as: Me
   - Who has access to the app: Anyone
4. Use the new deployment URL in your `gasClient.ts` file.

This code includes CORS headers to allow cross-origin requests from your React app.
