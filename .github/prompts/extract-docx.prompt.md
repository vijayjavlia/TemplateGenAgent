---
mode: agent
description: "Extract content from a Word (.docx) file — comments, tables, and dynamic fields"
---

# Extract Data from Word Document

Extract structured data from a `.docx` file using the Node.js extraction tool.

## Steps

1. **Verify Node.js is installed:**
   ```bash
   node --version
   ```
   If not installed, offer to install via `winget install OpenJS.NodeJS.LTS`.

2. **Install dependencies (first time only):**
   ```bash
   cd tools
   npm install
   ```

3. **Run the extractor:**
   ```bash
   node tools/extract-docx.js "<path-to-docx>"
   ```
   This auto-creates a folder named after the document containing:
   - `*_extracted.json` — Structured JSON (comments, tables, dot-dot fields, metadata)
   - `*_extracted.html` — HTML conversion
   - `*_extracted.txt` — Plain text extraction

4. **Analyze the extracted JSON:**
   - **Comments** → dynamic variable fields (with `annotatedText` showing attached text)
   - **Tables** → grid/table structures (headers + data rows)
   - **Dot-dot fields** → placeholder fields marked with `……` patterns

5. **If extraction is incomplete** (missing colors, backgrounds, merged cells, formatting):
   - Ask the user for a screenshot of the Word document
   - Use the screenshot to create a pixel-accurate HTML replica
   - Get user confirmation before proceeding

## User's Request

{{input}}
