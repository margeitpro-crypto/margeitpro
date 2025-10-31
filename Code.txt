/**
 * ✅ Hybrid MargeIt Backend - Production Ready (Final Version)
 *
 * Combines the best of both worlds:
 * 1. API Structure (doPost, CORS, JSON) from Code 1
 * 2. {{HeaderName}} placeholders from Code 1
 * 3. Robust formatting-preserving merge for Docs (appendPreserveFormatting_) from Code 2
 * 4. Organized folder structure (getTargetFolder_) from Code 2
 * 5. ⭐ Robust Docs Placeholder Replacement (Handles split/styled placeholders) ⭐
 * 6. 🔄 Slides Code is restored to Original (as requested)
 */

//////////////////////
// 🔹 CORS HANDLER //
//////////////////////
function setCorsHeaders(output) {
  return output.setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return setCorsHeaders(ContentService.createTextOutput(""));
}

//////////////////////
// 🔹 MAIN ENTRY //
//////////////////////

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const { spreadsheetId, sheetName, startRow, endRow, templateId, outputFileName, runtype, mode, action } = data;

    if (!spreadsheetId || !sheetName || !templateId) {
      throw new Error("Missing required fields: spreadsheetId, sheetName, templateId.");
    }

    let result;
    if (action === "preview") {
      result = handlePreview(mode, spreadsheetId, sheetName, templateId, startRow);
    } else if (action === "merge") {
      result = handleMerge(mode, spreadsheetId, sheetName, templateId, startRow, endRow, outputFileName, runtype);
    } else {
      throw new Error("Invalid action. Must be 'preview' or 'merge'.");
    }

    return setCorsHeaders(
      ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
    );

  } catch (err) {
    Logger.log("Error in doPost: " + err.stack);
    return setCorsHeaders(
      ContentService.createTextOutput(JSON.stringify({ error: err.message }))
        .setMimeType(ContentService.MimeType.JSON)
    );
  }
}

/////////////////////////////
// 🔹 PREVIEW HANDLER //
/////////////////////////////

function handlePreview(mode, spreadsheetId, sheetName, templateId, startRow) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet '${sheetName}' not found.`);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowNum = Number(startRow) || 2;

  if (rowNum > sheet.getLastRow()) throw new Error("startRow exceeds sheet rows.");

  const dataRow = sheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
  const data = mapHeadersToData(headers, dataRow);
  
  // Use a temporary folder for previews
  const parentFolder = getOrCreateFolder_("Marge It Previews", DriveApp);
  const tz = Session.getScriptTimeZone() || "Asia/Kathmandu";
  const dateStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
  const tempFolder = getOrCreateFolder_(dateStr, parentFolder);


  const fileId =
    mode === "slides"
      ? createSlidesCopy(templateId, data, `Preview - Slides`, tempFolder)
      : createDocsCopy(templateId, data, `Preview - Docs`, tempFolder); // Docs function updated

  // Generate preview URL
  const previewUrl = mode === "slides"
    ? `https://docs.google.com/presentation/d/${fileId}/preview`
    : `https://docs.google.com/document/d/${fileId}/preview`;
  
  // Clean up temporary preview file after 5 minutes (Original logic retained)
  // ScriptApp.newTrigger("deleteFileById_")
  //  .timeBased()
  //  .after(5 * 60 * 1000) 
  //  .create()
  //  .getUniqueId(); 

  Logger.log('Generated previewUrl: ' + previewUrl);
  return { previewUrl };
}

/////////////////////////////
// 🔹 MERGE HANDLER //
/////////////////////////////

function handleMerge(mode, spreadsheetId, sheetName, templateId, startRow, endRow, outputName, runtype) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet '${sheetName}' not found.`);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const start = Number(startRow) || 2;
  const end = Number(endRow) || sheet.getLastRow();

  if (start > end) throw new Error("startRow cannot be greater than endRow.");
  if (end > sheet.getLastRow()) throw new Error("endRow exceeds sheet rows.");
  
  const tz = Session.getScriptTimeZone() || "Asia/Kathmandu";
  const dateStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  // Get the proper organized folder from Code 2's logic
  const targetFolder = getTargetFolder_(runtype, mode);
  const urls = [];

  if (runtype === "custom") {
    for (let r = start; r <= end; r++) {
      const row = sheet.getRange(r, 1, 1, headers.length).getValues()[0];
      const data = mapHeadersToData(headers, row);
      
      // Generate a dynamic name based on column A (from Code 2's logic)
      const aVal = row[0] ? String(row[0]) : String(r);
      const safeName = sanitizeFilename_(aVal);
      const fileName = outputName 
        ? `${outputName} - ${safeName}` 
        : `Merged_${mode}_${safeName}_${dateStr}`;
        
      const fileId =
        mode === "slides"
          ? createSlidesCopy(templateId, data, fileName, targetFolder) // Original Slides
          : createDocsCopy(templateId, data, fileName, targetFolder); // Updated Docs
          
      // Return edit URL for merge
      const url = mode === "slides"
        ? `https://docs.google.com/presentation/d/${fileId}/edit`
        : `https://docs.google.com/document/d/${fileId}/edit`;
      urls.push(url);
    }
  } else if (runtype === "allinone") {
    const rows = sheet.getRange(start, 1, end - start + 1, headers.length).getValues();
    const finalName = outputName || `Merged_All_${mode}_${dateStr}`;
    
    const url =
      mode === "slides"
        ? mergeAllInOneSlides(templateId, headers, rows, finalName, targetFolder) // Original Slides
        : mergeAllInOneDocs(templateId, headers, rows, finalName, targetFolder); // Updated Docs
    urls.push(url);
  } else {
    throw new Error("Invalid runtype. Must be 'custom' or 'allinone'.");
  }

  return { urls, total: urls.length };
}

/////////////////////////////
// 🔹 UTILITIES (From Code 1 & 2) //
/////////////////////////////

function mapHeadersToData(headers, row) {
  const data = {};
  headers.forEach((h, i) => {
    const key = `{{${h}}}`;
    data[key] = row[i] ?? "";
  });
  return data;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- From Code 2 (Folder Logic) ---
function getTargetFolder_(runType, mode) {
  const root = DriveApp;
  const main = getOrCreateFolder_("Marge It", root);
  const parentName = (runType === "allinone") ? "All-in-One" : "Custom";
  const parent = getOrCreateFolder_(parentName, main);
  const subName = (mode === "slides") ? "Slides" : "Docs";
  const sub = getOrCreateFolder_(subName, parent);

  const tz = Session.getScriptTimeZone() || "Asia/Kathmandu";
  const dateStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
  return getOrCreateFolder_(dateStr, sub);
}

function getOrCreateFolder_(name, parent) {
  if (!parent) parent = DriveApp;
  const iter = parent.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : parent.createFolder(name);
}

function sanitizeFilename_(s) {
  if (!s) return '';
  const cleaned = s.toString().replace(/[/\\?%*:|"<>]/g, '-').replace(/\r?\n|\r/g, ' ').trim();
  return cleaned.length > 120 ? cleaned.slice(0,120) : cleaned;
}

// --- From Code 2: The most important helper for Docs ---
function appendPreserveFormatting_(body, child) {
  const type = child.getType();
  switch (type) {
    case DocumentApp.ElementType.PARAGRAPH:
      body.appendParagraph(child.copy().asParagraph());
      break;
    case DocumentApp.ElementType.TABLE:
      body.appendTable(child.copy().asTable());
      break;
    case DocumentApp.ElementType.LIST_ITEM:
      body.appendListItem(child.copy().asListItem());
      break;
    case DocumentApp.ElementType.INLINE_IMAGE:
      try {
        const imgBlob = child.copy().asInlineImage().getBlob();
        body.appendImage(imgBlob);
      } catch (e) {
        try { body.appendParagraph(child.getText ? child.getText() : ''); } catch (_) {}
      }
      break;
    case DocumentApp.ElementType.HORIZONTAL_RULE:
      body.appendHorizontalRule();
      break;
    default:
      try {
        const txt = (child.getText && child.getText()) ? child.getText() : '';
        body.appendParagraph(txt);
      } catch (_) {}
      break;
  }
}

/////////////////////////////
// 🔹 DOCS GENERATION (Robust) //
/////////////////////////////

function createDocsCopy(templateId, data, name, folder) {
  const file = DriveApp.getFileById(templateId).makeCopy(name, folder);
  const doc = DocumentApp.openById(file.getId());
  // ⭐ Updated: Pass the full Document object for robust replacement
  replacePlaceholders(doc, data); 
  doc.saveAndClose();
  return file.getId();
}

/**
 * HYBRID All-in-One Docs Merge.
 * Uses Code 1's {{header}} placeholders.
 * Uses Code 2's robust appendPreserveFormatting_ logic.
 */
function mergeAllInOneDocs(templateId, headers, rows, name, folder) {
  const tmplFile = DriveApp.getFileById(templateId);
  const resultCopy = tmplFile.makeCopy(name, folder);
  const resultId = resultCopy.getId();
  const resultDoc = DocumentApp.openById(resultId);
  const resultBody = resultDoc.getBody();
  resultBody.clear(); // Start with a blank doc

  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    if (row.every(v => v === '' || v === null)) continue;
    
    // Use Code 1's mapHeadersToData to get {{header}} data
    const data = mapHeadersToData(headers, row);

    // Make a temporary copy of the template
    const tmpCopy = tmplFile.makeCopy(`__tmp_merge_${Date.now()}_${ri}`);
    const tmpId = tmpCopy.getId();
    
    try {
      const tmpDoc = DocumentApp.openById(tmpId);
      // ⭐ Updated: Pass the full Document object for robust replacement
      replacePlaceholders(tmpDoc, data); 
      
      tmpDoc.saveAndClose();

      // Open the *saved* temp doc to get all content
      const tmpDoc2 = DocumentApp.openById(tmpId);
      const tmpBody2 = tmpDoc2.getBody();
      const childCount = tmpBody2.getNumChildren();

      // Add a page break if it's not the first record
      if (resultBody.getNumChildren() > 1 || (resultBody.getNumChildren() === 1 && resultBody.getChild(0).getText() !== "")) {
        try { resultBody.appendPageBreak(); } catch(e) {}
      }

      // Append all content (with formatting) from temp doc to final doc
      for (let ci = 0; ci < childCount; ci++) {
        const child = tmpBody2.getChild(ci);
        try {
          // Use Code 2's helper function
          appendPreserveFormatting_(resultBody, child);
        } catch (e) {
          try { const txt = child.getText ? child.getText() : ""; resultBody.appendParagraph(txt); } catch (_) {}
        }
      }
    } finally {
      // Delete the temporary file
      try { DriveApp.getFileById(tmpId).setTrashed(true); } catch (_) {}
    }
  }

  // Clean up the first empty paragraph if it exists
  try {
    if (resultBody.getNumChildren() > 1) {
      const first = resultBody.getChild(0);
      if (first.getType() === DocumentApp.ElementType.PARAGRAPH && first.getText() === "") {
        resultBody.removeChild(first);
      }
    }
  } catch (_) {}

  resultDoc.saveAndClose();
  return resultDoc.getUrl(); // Return the URL of the final file
}

/**
 * Helper function to find and replace text within an element (Paragraph or ListItem).
 * It handles placeholders that are split by formatting and preserves style.
 */
function replaceTextInElement(element, data) {
    const text = element.asText();
    
    for (const key in data) { // key is "{{A}}", value is "S1001"
        const value = String(data[key] ?? "");
        const keyText = key;
        
        let index = text.findText(escapeRegExp(keyText));
        
        while (index) {
            const start = index.getStartOffset();
            const end = index.getEndOffsetInclusive();
            
            // 1. Capture the styling of the first character of the placeholder
            const firstCharStyle = {
                isBold: text.isBold(start),
                isItalic: text.isItalic(start),
                isUnderline: text.isUnderline(start),
                fontFamily: text.getFontFamily(start),
                fontSize: text.getFontSize(start),
                foregroundColor: text.getForegroundColor(start)
            };
            
            // 2. Delete the old placeholder (which might be styled differently across characters)
            text.deleteText(start, end);
            
            // 3. Insert the new text (value) at the start position
            text.insertText(start, value);
            
            // 4. Apply the captured style to the newly inserted text
            const newEnd = start + value.length - 1;
            
            if (value.length > 0) { // Apply style only if new text is inserted
                text.setBold(start, newEnd, firstCharStyle.isBold);
                text.setItalic(start, newEnd, firstCharStyle.isItalic);
                text.setUnderline(start, newEnd, firstCharStyle.isUnderline);
                if (firstCharStyle.fontFamily) text.setFontFamily(start, newEnd, firstCharStyle.fontFamily);
                if (firstCharStyle.fontSize) text.setFontSize(start, newEnd, firstCharStyle.fontSize);
                if (firstCharStyle.foregroundColor) text.setForegroundColor(start, newEnd, firstCharStyle.foregroundColor);
            }
            
            // Search for the next occurrence of the placeholder after the insertion
            index = text.findText(escapeRegExp(keyText));
        }
    }
}

/**
 * ⭐ NEW ROBUST REPLACE PLACEHOLDERS FUNCTION FOR DOCS ⭐
 * Searches Body, Headers, Footers, and Tables, handling split formatting.
 */
function replacePlaceholders(doc, data) {
    const body = doc.getBody();
    
    // Array of containers to search
    const containers = [body];
    
    // Add Headers and Footers
    const header = doc.getHeader();
    if (header) containers.push(header);
    const footer = doc.getFooter();
    if (footer) containers.push(footer);

    for (const container of containers) {
        // Iterate through all child elements of the container (Paragraphs, Tables, Lists)
        for (let i = 0; i < container.getNumChildren(); i++) {
            const child = container.getChild(i);
            
            // Check for Paragraphs and List Items
            if (child.getType() === DocumentApp.ElementType.PARAGRAPH ||
                child.getType() === DocumentApp.ElementType.LIST_ITEM) {
                
                replaceTextInElement(child, data);
                
            } else if (child.getType() === DocumentApp.ElementType.TABLE) {
                
                // If it's a Table, iterate through all cells and their children
                const table = child.asTable();
                for (let r = 0; r < table.getNumRows(); r++) {
                    for (let c = 0; c < table.getNumCells(); c++) {
                        const cell = table.getCell(r, c);
                        // Iterate through all children inside the cell
                        for (let p = 0; p < cell.getNumChildren(); p++) {
                            const childElement = cell.getChild(p);
                            if (childElement.getType() === DocumentApp.ElementType.PARAGRAPH ||
                                childElement.getType() === DocumentApp.ElementType.LIST_ITEM) {
                                replaceTextInElement(childElement, data);
                            }
                        }
                    }
                }
            }
        }
    }
}

/////////////////////////////
// 🔹 SLIDES GENERATION (Original) //
/////////////////////////////

function createSlidesCopy(templateId, data, name, folder) {
  const file = DriveApp.getFileById(templateId).makeCopy(name, folder);
  const pres = SlidesApp.openById(file.getId());
  replaceSlidesPlaceholders(pres, data);
  pres.saveAndClose();
  return file.getId();
}

function mergeAllInOneSlides(templateId, headers, rows, name, folder) {
  const file = DriveApp.getFileById(templateId).makeCopy(name, folder);
  const pres = SlidesApp.openById(file.getId());
  const templateSlide = pres.getSlides()[0];

  rows.forEach((row, i) => {
    const data = mapHeadersToData(headers, row); // From Code 1
    const newSlide = templateSlide.duplicate();
    replaceSlidesPlaceholders(pres, data, newSlide);
  });

  templateSlide.remove();
  pres.saveAndClose();
  return pres.getUrl();
}

function replaceSlidesPlaceholders(pres, data, slide) {
  // Original Code 1 (Slides placeholder replacement)
  const slides = slide ? [slide] : pres.getSlides();
  slides.forEach((s) => {
    for (const key in data) {
      const value = data[key] ?? "";
      // Slides is simpler, no RegExp needed
      s.replaceAllText(key, value); 
    }
  });
}