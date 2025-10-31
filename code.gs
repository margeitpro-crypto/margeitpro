/**
 * ✅ MargeIt Backend - Production Ready
 * Supports Slides + Docs merge (preview / custom / all-in-one)
 * Handles CORS + errors + placeholder escaping
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

  const previewUrl =
    mode === "slides"
      ? createSlidesCopy(templateId, data, `Preview - Slides`)
      : createDocsCopy(templateId, data, `Preview - Docs`);

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

  const urls = [];

  if (runtype === "custom") {
    for (let r = start; r <= end; r++) {
      const row = sheet.getRange(r, 1, 1, headers.length).getValues()[0];
      const data = mapHeadersToData(headers, row);
      const url =
        mode === "slides"
          ? createSlidesCopy(templateId, data, outputName || `Slides Merge ${r}`)
          : createDocsCopy(templateId, data, outputName || `Docs Merge ${r}`);
      urls.push(url);
    }
  } else if (runtype === "allinone") {
    const rows = sheet.getRange(start, 1, end - start + 1, headers.length).getValues();
    const url =
      mode === "slides"
        ? mergeAllInOneSlides(templateId, headers, rows, outputName || "All-in-One Slides")
        : mergeAllInOneDocs(templateId, headers, rows, outputName || "All-in-One Docs");
    urls.push(url);
  } else {
    throw new Error("Invalid runtype. Must be 'custom' or 'allinone'.");
  }

  return { urls, total: urls.length };
}

/////////////////////////////
// 🔹 UTILITIES //
/////////////////////////////

function mapHeadersToData(headers, row) {
  const data = {};
  headers.forEach((h, i) => (data[h] = row[i]));
  return data;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/////////////////////////////
// 🔹 DOCS GENERATION //
/////////////////////////////

function createDocsCopy(templateId, data, name) {
  const file = DriveApp.getFileById(templateId).makeCopy(name);
  const doc = DocumentApp.openById(file.getId());
  replacePlaceholders(doc.getBody(), data);
  doc.saveAndClose();
  return doc.getUrl();
}

function mergeAllInOneDocs(templateId, headers, rows, name) {
  const file = DriveApp.getFileById(templateId).makeCopy(name);
  const doc = DocumentApp.openById(file.getId());
  const body = doc.getBody();

  rows.forEach((row, i) => {
    const data = mapHeadersToData(headers, row);
    body.appendParagraph(`--- Record ${i + 1} ---`);
    replacePlaceholders(body, data);
    body.appendPageBreak();
  });

  doc.saveAndClose();
  return doc.getUrl();
}

function replacePlaceholders(body, data) {
  for (const key in data) {
    const value = data[key] ?? "";
    body.replaceText(new RegExp(`{{${escapeRegExp(key)}}}`, "g"), value);
  }
}

/////////////////////////////
// 🔹 SLIDES GENERATION //
/////////////////////////////

function createSlidesCopy(templateId, data, name) {
  const file = DriveApp.getFileById(templateId).makeCopy(name);
  const pres = SlidesApp.openById(file.getId());
  replaceSlidesPlaceholders(pres, data);
  pres.saveAndClose();
  return pres.getUrl();
}

function mergeAllInOneSlides(templateId, headers, rows, name) {
  const file = DriveApp.getFileById(templateId).makeCopy(name);
  const pres = SlidesApp.openById(file.getId());
  const templateSlide = pres.getSlides()[0];

  rows.forEach((row, i) => {
    const data = mapHeadersToData(headers, row);
    const newSlide = templateSlide.duplicate();
    replaceSlidesPlaceholders(pres, data, newSlide);
  });

  templateSlide.remove();
  pres.saveAndClose();
  return pres.getUrl();
}

function replaceSlidesPlaceholders(pres, data, slide) {
  const slides = slide ? [slide] : pres.getSlides();
  slides.forEach((s) => {
    for (const key in data) {
      const value = data[key] ?? "";
      s.replaceAllText(`{{${key}}}`, value);
    }
  });
}
