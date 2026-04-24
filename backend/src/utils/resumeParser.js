const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

function normalizeText(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function createClientError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

async function extractResumeText(file) {
  if (!file || !file.buffer) {
    throw createClientError("Resume file is missing");
  }

  const mimeType = file.mimetype || "";
  const fileName = (file.originalname || "").toLowerCase();
  const isPdf = mimeType.includes("pdf") || fileName.endsWith(".pdf");
  const isDocx =
    mimeType.includes("word") ||
    mimeType.includes("officedocument") ||
    fileName.endsWith(".docx");
  const isTxt = mimeType.includes("text") || fileName.endsWith(".txt");

  if (isPdf) {
    try {
      const parser = new PDFParse({ data: file.buffer });
      const parsed = await parser.getText();
      await parser.destroy();

      const text =
        typeof parsed === "string"
          ? parsed
          : parsed?.text || parsed?.content || "";

      return normalizeText(text);
    } catch {
      throw createClientError("Unable to parse this PDF file. Please upload a valid PDF or DOCX resume.");
    }
  }

  if (isDocx) {
    try {
      const parsed = await mammoth.extractRawText({ buffer: file.buffer });
      return normalizeText(parsed.value);
    } catch {
      throw createClientError("Unable to parse this DOCX file. Please upload a valid DOCX or PDF resume.");
    }
  }

  if (isTxt) {
    return normalizeText(file.buffer.toString("utf-8"));
  }

  throw createClientError("Unsupported file format. Use PDF, DOCX, or TXT");
}

module.exports = {
  extractResumeText
};
