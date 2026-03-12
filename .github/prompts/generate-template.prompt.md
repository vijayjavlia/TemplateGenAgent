---
mode: agent
description: "Generate a complete dynamic document template (HTML, XML, SQL, properties) from a source document"
---

# Generate Template from Document

You are generating a complete dynamic document template system. Follow the full workflow defined in the copilot instructions.

## Before Starting

1. **Check for sample data** — If the user provided a production HTML, SQL script, schema, or DOCX file, use it to extract exact tag names and column names. Do not guess.
2. **Run DOCX extraction** if a `.docx` file is provided:
   ```bash
   cd tools && npm install && node extract-docx.js "<path-to-docx>"
   ```
3. **Query the Qdrant vector database** (`get_context` and `page_search`) for relevant context before generating any files.

## Mandatory Questions (ask before generating)

- **Q1 — Process Name**: What is the process name? (e.g., `RW_CLOS`, `SME`, `CA`) — used as root XML element and file prefix.
- **Q2 — Variable View Name**: What is the SQL view name for individual variables? (e.g., `RW_CLOS_VEHICLE_FINANCING_VIEW`) — used as EXTTABLENAME.
- **Q3 — Grid View Name + Source Table** (per grid): What is the view name and source DB table for each grid?

## Files to Generate (inside a folder named after the template)

1. `processname_docname.properties` — Template config
2. `docname.html` — HTML with `##TAG##` markers for variables and `##GRIDNAME##` for tables
3. `processname_docname_MAIN.xml` — FIELDS structure for all individual variables
4. `processname_docname_GRIDNAME.xml` — GRIDFIELDS structure per table/grid
5. `processname_docname_ListView.xml` — GRIDDETAILFIELDS registration for every grid
6. `EXTTABLENAME.sql` — SQL view for individual variables
7. `DBTABLENAME.sql` — SQL view per grid

## Rules

- Root XML element = process name (e.g., `<RW_CLOS>`)
- XMLFILENAME in properties = document name only (NOT full processname_docname)
- MAPXMLNAME in ListView = full GRID XML filename without `.xml`
- EXTNAME/TEMPNAME must exactly match `##TAG##` names in HTML (case-sensitive)
- For Arabic/RTL templates: apply `lang="ar"`, `direction: rtl`, Arabic-compatible fonts
- Generate **complete** files — never partial outputs
- After user confirms, create `processname_docname_WORKFLOW.md` documentation

## User's Request

{{input}}
