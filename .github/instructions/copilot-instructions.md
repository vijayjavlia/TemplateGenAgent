# Purpose
Create all files needed for a dynamic document template system, enabling the mapping of data between front-end templates and back-end data sources using HTML, XML, SQL, and supporting code.and the main thing is if any new requirement come from user then we will update this instruction file with new requirement after confirmation from user and if user rejected then we will ask for correct requirement and update instruction file with correct requirement for future use.

The system mapping flow is:
HTML → XML Mapping → SQL View → Database Table

 

# General Guidelines
- Respond to requests by generating the sequence of files and mapping steps required to assemble a dynamic document template system.
- Ask for missing inputs, such as table/column names or process/template details, when needed.
- Use clear, descriptive file names based on provided properties or process names.
- Ensure that all data mapping between layers (HTML ↔ XML ↔ SQL) is clearly defined and tracked.
- Always generate well-formed markup, XML, and SQL code snippets.
- Keep tone precise, technical, and supportive.

# Skills
- Generate properties/config files for template and process metadata.
- Produce HTML page structures with variable and table mappings.
- Create XML mapping files for each variable/table, reflecting database schema and required fields.
- Generate a master XML table-list file to maintain all data mappings.
- Draft SQL views matching XML schema, with proper field selection and aliasing.
- Suggest or generate template functions/procedures where back-end logic is needed.
- Assemble final dynamic HTML using all defined mappings.
- Extract text accurately from images when needed.
- Detect table structures in images and generate corresponding HTML/XML/SQL.
- Validate column mappings and flag any inconsistencies or missing information.
- Propose sensible defaults when information is missing, but always confirm with the user.
- Ensure that all generated files are complete and functional, avoiding partial outputs.
- Provide clear error messages and guidance when issues arise.
- Support iterative refinement based on user feedback.
- Maintain a clear mapping between all layers (HTML, XML, SQL) for traceability and debugging.
- Ensure that all generated code adheres to best practices for readability and maintainability.
- Always confirm with the user before making assumptions about missing information or defaults.
- If user requests new requiement and you geneated correct , confirm from user to use in future if user approved then update instruction file with new requirement and if user rejected then ask for correct requirement and update instruction file with correct requirement for future use.

# Step 0 — Sample Data Collection (Highest Priority)
**Before asking ANY questions or generating ANY files**, check if the user has provided sample data. Sample data gives 100% accurate tag names, column names, and structure — eliminating all guesswork.

## Accepted Sample Data Formats (ask user to provide one or more):
| Format | What it gives |
|---|---|
| **Production HTML file** (like `CA_Main.html`) | Exact `##TAG##` variable names + grid/table names already in use |
| **SQL CREATE TABLE / CREATE VIEW** | Exact column names → XML EXTNAME + SQL view aliases |
| **Sample rows (CSV / JSON / Excel)** | Column names, data types, sample values |
| **Existing SQL SELECT query** | Ready-made FROM/JOIN clause for the view |
| **Database schema export** | Full table structure for complete mapping |

## How to use a Production HTML sample file:
1. **Scan all `##TAG##` patterns** in the HTML
2. **Classify each tag:**
   - Tags ending in `_GRID` or `_GRIDS` or containing `GRID` → **Grid/Table** mapping (separate XML + separate SQL view + TableListView.xml entry)
   - All other tags → **Single Variable** mapping (_MAIN.xml + variable SQL view)
3. **Ignore commented-out tags** (`<!-- ##TAG## -->`) — do not generate mappings for them
4. **Use exact tag names** (case-sensitive) as EXTNAME/TEMPNAME in XML and as column aliases in SQL views
5. **Save extracted tags** as a reference file in `.github/SampleData/[templatename]_tags.txt` for traceability

## Reference Sample Data on file:
- `.github/SampleData/CA_Main.html` — Production HTML with 63 single variables + 24 grids
- `.github/SampleData/CA_Main_tags.txt` — Extracted tag reference list from CA_Main.html
- `.github/SampleData/RW_CLOS_CA_Main.xml` — Production MAIN XML (FIELDS structure, root `<RW_CLOS>`)
- `.github/SampleData/RW_CLOS_CA_Main_*_GRID.xml` — Production GRID XML files (GRIDFIELDS structure)
- `.github/SampleData/RW_CLOS_CA_Main_ListView.xml` — Production ListView XML (all grids registered)
- `.github/SampleData/RW_CLOS_CA_Main.properties` — Production properties file
- `.github/SampleData/sqlscipts.text` — Production SQL view scripts (complex JOIN/subquery examples)
- `.github/SampleData/RW_CLOS_CA_Main_ACCOUNT_TURNOVER_GRID.xml` — Sample GRID XML (account turnover columns reference)
- `.github/SampleData/CA_Main_full_mapping.txt` — Complete grid→XML→DB view mapping table

---

# Mandatory Pre-Generation Questions
Before generating ANY template files, ALWAYS ask the user these questions first and wait for answers. Do not proceed until all mandatory inputs are collected.

**Q1 — Process Name** *(ask once per template, mandatory)*
> "What is the **process name** (e.g., `RW_CLOS`, `SME`, `CA`)?"
- Used as: **root XML element** in ALL XML files (MAIN, GRID, ListView) — e.g., `<RW_CLOS>`
- Used as: prefix in ALL file names — e.g., `RW_CLOS_CA_Main_MAIN.xml`, `RW_CLOS_CA_Main_FACILITIES_GRID.xml`
- Used as: prefix in MAPXMLNAME in ListView XML — e.g., `RW_CLOS_CA_Main_FACILITIES_GRID`

**Q2 — Variable View Name (EXTTABLENAME)** *(ask once per template, mandatory)*
> "What is the **view name** for individual variables (e.g., `RW_CLOS_VEHICLE_FINANCING_VIEW`)?"
- This is always a **view name**, not a raw table name — the underlying SQL view may join from multiple database tables.
- Used as: `EXTTABLENAME` in the `.properties` file and as the view name in the variable SQL view (`CREATE OR REPLACE VIEW [name] AS ...`).
- The SQL view body (SELECT columns and FROM/JOIN clauses) must be provided by the user or confirmed before generation.

**Q3 — Grid/Table View Name AND Source Table** *(ask every time a new grid/table is detected in the template, mandatory)*
> "What is the **view name** for the `[GRIDNAME]` grid (e.g., `RW_CLOS_VEHICLE_GRID_VW`)?"
> "What is the **source database table** for this grid (e.g., `CLOS_FACILITY_TABLE`)?"
- This is always a **view name** — the underlying SQL view may join from multiple database tables.
- Used as: `DBTABLENAME` in `TableListView.xml` and as the view name in the grid SQL view.
- The SQL view body (SELECT columns and FROM/JOIN clauses) must be provided by the user or confirmed before generation.
- **CRITICAL:** The source table for grid views is NEVER the route/external table (e.g., `CLOS_route_table`). The route table is ONLY for individual variable fields (Q2/MAIN XML). Each grid has its own specific source table — you MUST ask the user for it. Do NOT assume or default to the route table.

---

# Step-by-step Instructions

## Output Folder Rule (Mandatory)
**When generating template files, ALWAYS create a new folder named after the template/document name inside the workspace root.**
- Folder name = document name (e.g., `CIB_Offer_Letter`, `CA_Main`, `Vehicle_Financing`)
- ALL generated files for that template (properties, HTML, XML, SQL) go inside this folder
- This keeps the workspace organized and avoids file clutter at the root level
- Example: For a template named `CIB_Offer_Letter`, create folder `CIB_Offer_Letter/` and place all files inside it

## File Naming Conventions (Production-Verified from SampleData)
| File | Naming Pattern | Example |
|---|---|---|
| Properties | `processname_docname.properties` | `RW_CLOS_CA_Main.properties` |
| MAIN XML | `processname_docname_MAIN.xml` | `RW_CLOS_CA_Main_MAIN.xml` |
| GRID XML | `processname_docname_GRIDNAME.xml` | `RW_CLOS_CA_Main_FACILITIES_GRID.xml` |
| ListView XML | `processname_docname_ListView.xml` | `RW_CLOS_CA_Main_ListView.xml` |
| Variable SQL view | As given in EXTTABLENAME (Q2) | `RW_CLOS_CA_TEMPLATE_VW` |
| Grid SQL view | As given per grid (Q3) | `CA_ADHOC_FACILITY_GRID_VW` |

**Root element rule:** ALL XML files (MAIN, GRID, ListView) use **process name** as root element — e.g., `<RW_CLOS>` — NOT the document name.

**XMLFILENAME in properties:** Store only the **document name part** (e.g., `CA_Main`), NOT the full `processname_docname`. The system resolves the full file name.

**MAPXMLNAME in ListView:** Full GRID XML filename **without `.xml`** extension — e.g., `RW_CLOS_CA_Main_FACILITIES_GRID`.

---

1. **Properties File Creation:**
   - Start by generating a config/properties file with all template-level metadata.
   - `XMLFILENAME` = document name only (e.g., `CA_Main`), NOT full processname_docname
   - `EXTTABLENAME` = full view name for individual variables (from Q2)
   Example (from production `RW_CLOS_CA_Main.properties`):
```
DOCUMENTNAME=CA_Main
XMLFILENAME=CA_Main
EXTTABLENAME=RW_CLOS_CA_TEMPLATE_VW
VIEWER=doc
TEMPLATECODE=CA_Main
```


2. **HTML Template Generation:**
   - Create the core HTML structure as requested (tables, paragraphs, variables), using `##TAGNAME##` markers for dynamic content.
	 - IF simple variable mapping is requested then create html with `##TAGNAME##` for example <p>##PROPOSAL_NO##</p> this is simple paragraph mapping with variable xml file
	 - If a table is requested, create the HTML structure map only xmlfile name in the table mapping
		 Example: <div>##Payment_Schedule_Grid##</div> this is the table mapping with xml file name which we will create in next step
	 	 


3. **XML Mapping Files:**
   - For dynamic elements, generate XML mapping files with different structures for variables vs tables:
   
   **A. Single Variable Mapping (Common XML File):**
   - Create ONE common XML file for all individual variables
   - Use **FIELDS** structure: EXTNAME, TEMPNAME, ISFORMAT (= `NA`), FORMAT (= `NA`)
   - **File naming: `processname_docname_MAIN.xml`** (e.g., `RW_CLOS_CA_Main_MAIN.xml`)
   - **Root element = process name only** (e.g., `<RW_CLOS>`)
   - EXTNAME and TEMPNAME must exactly match the `##TAG##` names in the HTML
   - Production example (`RW_CLOS_CA_Main.xml` → `.github/SampleData/`):
     ```xml
     <RW_CLOS>
       <FIELDS>
         <EXTNAME>PROPOSAL_NO</EXTNAME>
         <TEMPNAME>PROPOSAL_NO</TEMPNAME>
         <ISFORMAT>NA</ISFORMAT>
         <FORMAT>NA</FORMAT>
       </FIELDS>
       <FIELDS>
         <EXTNAME>APPLICATION_DATE</EXTNAME>
         <TEMPNAME>APPLICATION_DATE</TEMPNAME>
         <ISFORMAT>NA</ISFORMAT>
         <FORMAT>NA</FORMAT>
       </FIELDS>
     </RW_CLOS>
     ```

   **B. Table/Grid Mapping (Separate XML Files):**
   - Create SEPARATE XML files for each table/grid
   - Use GRIDFIELDS structure: LBLNAME, DBCOLNAME, MAPCOLNAME, LBLWIDTH, COLALIGN
   - **File naming: `processname_docname_GRIDNAME.xml`** (e.g., `RW_CLOS_CA_Main_FACILITIES_GRID.xml`)
   - **Root element = process name only** (e.g., `<RW_CLOS>`)
   - **DBCOLNAME** may contain a SQL expression (e.g., `TO_CHAR(NVL(REPLACE(ACTUAL,'NULL',0),0),'999,999,999,999,990.00') AS ACTUAL`); in that case **MAPCOLNAME = the alias** (the part after `AS`)
   - LBLWIDTH is column width percentage (all columns in a grid should sum to ~100)
   - COLALIGN = LEFT | RIGHT | CENTER
   - Production example (`RW_CLOS_CA_Main_FACILITIES_GRID.xml` → `.github/SampleData/`):
     ```xml
     <RW_CLOS>
       <GRIDFIELDS>
         <LBLNAME>Facility</LBLNAME>
         <DBCOLNAME>Facility</DBCOLNAME>
         <MAPCOLNAME>Facility</MAPCOLNAME>
         <LBLWIDTH>14</LBLWIDTH>
         <COLALIGN>LEFT</COLALIGN>
       </GRIDFIELDS>
       <GRIDFIELDS>
         <LBLNAME>Outstanding Amount</LBLNAME>
         <DBCOLNAME>Outstanding_Amount</DBCOLNAME>
         <MAPCOLNAME>Outstanding_Amount</MAPCOLNAME>
         <LBLWIDTH>11</LBLWIDTH>
         <COLALIGN>RIGHT</COLALIGN>
       </GRIDFIELDS>
     </RW_CLOS>
     ```    

4. **Master XML Table List (ListView XML):**
   
   **A. Individual Variables (MAIN XML):**
   - Defined in `processname_docname_MAIN.xml`; NO entry needed in ListView XML
   - Maps via EXTTABLENAME from .properties to the variable SQL view
   
   **B. Grid/Table Registration (ListView XML `processname_docname_ListView.xml`):**
   - Every GRID XML must be registered here — NEVER omit a grid
   - Root element = process name (e.g., `<RW_CLOS>`)
   - `TEMPLBLNAME` = exact grid tag name from HTML (without `##`) — e.g., `FACILITIES_GRID`
   - `MAPXMLNAME` = GRID XML filename **without `.xml`** — e.g., `RW_CLOS_CA_Main_FACILITIES_GRID`
   - `DBTABLENAME` = DB view name from Q3 — e.g., `CA_ADHOC_FACILITY_GRID_VW`
   - `FONTTYPE` = Verdana (default)
   - `FONTSIZE` = 10.0pt (default)
   - Production example (from `RW_CLOS_CA_Main_ListView.xml` → `.github/SampleData/`):
     ```xml
     <RW_CLOS>
       <GRIDDETAILFIELDS>
         <TEMPLBLNAME>FACILITIES_GRID</TEMPLBLNAME>
         <MAPXMLNAME>RW_CLOS_CA_Main_FACILITIES_GRID</MAPXMLNAME>
         <DBTABLENAME>CA_ADHOC_FACILITY_GRID_VW</DBTABLENAME>
         <FONTTYPE>Verdana</FONTTYPE>
         <FONTSIZE>10.0pt</FONTSIZE>
       </GRIDDETAILFIELDS>
       <GRIDDETAILFIELDS>
         <TEMPLBLNAME>BORROWING_GRID</TEMPLBLNAME>
         <MAPXMLNAME>RW_CLOS_CA_Main_BORROWING_GRID</MAPXMLNAME>
         <DBTABLENAME>RW_CLOS_CA_Main_BORROWING_VW</DBTABLENAME>
         <FONTTYPE>Verdana</FONTTYPE>
         <FONTSIZE>10.0pt</FONTSIZE>
       </GRIDDETAILFIELDS>
     </RW_CLOS>
     ```


5. **SQL View Creation:**
   - Generate SQL views with different approaches for variables vs tables:
   
   **A. Single Variable View (Common View):**
   - View name = EXTTABLENAME from .properties (collected via Q2 before generation)
   - This is always a VIEW — the SELECT body may join from multiple underlying database tables
   - Each SELECT column alias must exactly match the EXTNAME/TEMPNAME values in `processname_docname_MAIN.xml`
   - The FROM/JOIN clause and source table names must be provided by the user (ask if not supplied)
   - Add a header comment block referencing the MAIN.xml file and .properties file
     Example:
     ```sql
     -- SQL View for AMAZON_PAY_RECEIPT individual variable fields
     -- Maps to  : AMAZON_PAY_RECEIPT_MAIN.xml  (FIELDS: EXTNAME/TEMPNAME) this external table or view name
     -- Referenced: EXTTABLENAME in AMAZON_PAY_RECEIPT.properties
     CREATE OR REPLACE VIEW AMAZON_PAY_RECEIPT_VIEW AS
     SELECT
       'Paid successfully'            AS paymentstatus,
       349                            AS amount,
       'UPIIntent'                    AS paymenttype,
       'VODAFONEIDEA LIMITED'         AS paidtoname,
       'vil.payu@hdfcbank'            AS paidtoupi,
       'Amazon Pay UPI'               AS paidfrommthd,
       'Kotak Mahindra Bank ****9885' AS paidfrombank,
       '9888495960@apl'               AS paidfrompmupi
     FROM DUAL;
     ```
   
   **B. Table/Grid Views (Separate Views):**
   - Create SEPARATE views for each table/grid (collected via Q3 for every new grid)
   - This is always a VIEW — the SELECT body may join from multiple underlying database tables
   - Each view contains only the columns for that specific grid; aliases must match GRIDFIELDS DBCOLNAME
   - The FROM/JOIN clause and source table names must be provided by the user (ask if not supplied)
   - View name = answer from Q3; registered as DBTABLENAME in TableListView.xml
   
     Example:
     ```sql
     CREATE OR REPLACE VIEW PAYMENT_RECEIPT_GRID_VW AS
     SELECT
       'Paid successfully' AS PAID_STATUS,
       349 AS AMOUNT,
       '529223330106' AS UPI_TRANSACTION_ID
     FROM DUAL;
     ```
   
   **Complete File Structure Pattern (Production-Verified):**
   For a template with variables + tables, always generate this complete set:
   1. `processname_docname.properties` — Config: DOCUMENTNAME, XMLFILENAME (docname only), EXTTABLENAME, VIEWER, TEMPLATECODE
   2. `docname.html` — HTML with `##variable##` and `##GRIDNAME##` markers
   3. `processname_docname_MAIN.xml` — FIELDS for all individual variables; root = `<processname>`
   4. `processname_docname_GRIDNAME.xml` — GRIDFIELDS for each table; root = `<processname>`
   5. `processname_docname_ListView.xml` — GRIDDETAILFIELDS for every grid; root = `<processname>`
   6. `EXTTABLENAME.sql` — SQL view for individual variables (body from user)
   7. `DBTABLENAME.sql` — SQL view for each grid (body from user, one file per grid)

   > Production reference: `.github/SampleData/RW_CLOS_CA_Main.*` files demonstrate every file in this set.


6. **Supporting Functions/Procedures:**
   - When requested or required by mapping, produce SQL functions or stored procedures, mapping them to the correct views.


7. **Dynamic HTML Assembly:**
   - Output the final dynamic HTML by integrating all mappings (`##TAGNAME##` for variables/tables) and ensuring all steps are referenced.

     Example:
  <html>
    <body>
    <p>##PROPOSAL_NO##</p> // this is simple paragraph mapping with variable xml file
    // if user waht table with vehicle details so the table will be like below or want simple paragraph so in this case we will create table as per the requirement.
    
     </body>
</html>
    <table>
  <tr><th>Vehicle Details</th></tr> // this is header of the table as per the requirement user want create table with vehicle details
  <tr>
    <p>##Vehicle_Details_Grid##</p> // this is the table mapping with xml file name which we will create in next step
    </tr>
</table>



8. **Extract text accurately from images.**

Detect table structures.

Generate all required files.

Validate column mappings.

Ask the user if database schema is missing.

Don't give half mapping and file , example create full xml files and sql views 

# Error Handling
- If any required information is missing (table/column names, process info), ask the user for details or propose sensible defaults.
- Flag and explain mapping errors or format issues.

# Examples
- *User requests a table of vehicle details*: Generate the properties file, HTML with a table, XML for column mappings, SQL view, and map all together.
- *User needs a paragraph with a proposal number*: Generate single variable XML, HTML placeholder, SQL view, and integrate as above.

 now we will create main tablelist xml file where all the table xml will be define so the file name will be TableListView.xml so the xml file will be like below. as below file contains all the table xml file definition so can easly map with view and html file.

         <RW_CLOS> // this is the root element name of Process 

    <GRIDDETAILFIELDS> // this is the main element for each table xml file definition
		<TEMPLBLNAME>Vehicle_Details_Grid</TEMPLBLNAME> // this is the template label name which will map with html file as ##Vehicle_Details_Grid## you can give any unique name already created in html file
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_Vehicle_Details_Grid</MAPXMLNAME> // this is the mapping xml file name which we created in step 2 in this name i will barake down like RW_CLOS is the root element name of the project or process Vehicle_Financing_Credit_Application_form is the product or template name and Vehicle_Details_Grid is the table xml file name which we created in step 2
		<DBTABLENAME>RW_CLOS_VEHICLE_GRID_VW</DBTABLENAME> // this is the database  view name which we will create in next step
        <FONTTYPE>Verdana</FONTTYPE> // this is the font type for the html table
		<FONTSIZE>10.0pt</FONTSIZE>// this is the font size for the html table
	</GRIDDETAILFIELDS>

	<GRIDDETAILFIELDS>
		<TEMPLBLNAME>DIRECTOR_SHAREHOLDER_GRID</TEMPLBLNAME>
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_SHAREHOLDER_GRID</MAPXMLNAME>
		<DBTABLENAME>RW_CLOS_CA_IM_LIFELINE_DIRECTOR_SHAREHOLD_VW</DBTABLENAME>
		<FONTTYPE>Verdana</FONTTYPE>
		<FONTSIZE>10.0pt</FONTSIZE>
	</GRIDDETAILFIELDS>
	<GRIDDETAILFIELDS>
		<TEMPLBLNAME>CHECKLIST_GRID</TEMPLBLNAME>
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_CheckList_GRID</MAPXMLNAME>
		<DBTABLENAME>RW_CLOS_COMPLIANCE_CHECKLIST</DBTABLENAME>
	</GRIDDETAILFIELDS>
<GRIDDETAILFIELDS>
		<TEMPLBLNAME>FACILITIES_GRID</TEMPLBLNAME>
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_FACILITIES_GRID</MAPXMLNAME>
		<DBTABLENAME>RW_CLOS_VEHICLE_FINCN_FACILITY</DBTABLENAME>
	</GRIDDETAILFIELDS>
	
	<GRIDDETAILFIELDS>
		<TEMPLBLNAME>FINANICAL_INSITUTUION</TEMPLBLNAME>
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_FINANICAL_GRID</MAPXMLNAME>
		<DBTABLENAME>RW_CLOS_VEHICAL_FINAN_INSTITUT</DBTABLENAME>
	</GRIDDETAILFIELDS>
	<GRIDDETAILFIELDS>
		<TEMPLBLNAME>HIGHLIGHTS_GRID</TEMPLBLNAME>
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_FINANICAL_HEIGHLIGHT</MAPXMLNAME>
		<DBTABLENAME>RW_CLOS_CA_IM_LIFELINE_FINANCIAL_HIGH_VW</DBTABLENAME>
		<FONTTYPE>Verdana</FONTTYPE>
		<FONTSIZE>10.0pt</FONTSIZE>
    </GRIDDETAILFIELDS>

	<GRIDDETAILFIELDS>
		<TEMPLBLNAME>TANGIBLE_COLLATERALS_GRID</TEMPLBLNAME>
		<MAPXMLNAME>RW_CLOS_Vehicle_Financing_Credit_Application_form_TANGIBLE_COLLATERALS_GRID</MAPXMLNAME>
		<DBTABLENAME>RW_CLOS_CA_IM_LIFELINE_TANGIBLE_COLLATERAL_VW</DBTABLENAME>
		<FONTTYPE>Verdana</FONTTYPE>
		<FONTSIZE>10.0pt</FONTSIZE>
	</GRIDDETAILFIELDS>
	
	</RW_CLOS>

# Follow-up
- After outputting files, prompt the user for any additional data mappings or special customizations required.
- Support further refinement and iteration upon request.

# context
This instruction set is designed to guide the generation of a dynamic document template system that maps data from HTML templates through XML mappings to SQL views and database tables. The instructions cover the entire process, from creating properties files to generating HTML, XML, and SQL code, ensuring a cohesive and functional system. For context read file:[.github/docs/template_generation.md](.github/docs/template_generation.md)
[.github/example/**]

# Step 9 — Workflow Documentation File (Post-Confirmation, Mandatory)

**After the user confirms the generated template is correct**, create a **workflow documentation file** that fully describes how the template works, end-to-end flow, every file's purpose, and all data mappings.

## When to Create
- ONLY after the user explicitly confirms the template files are correct and complete
- Ask the user: *"Template generation is complete. Shall I create the workflow documentation file?"*
- Do NOT create this file during template generation — wait until confirmation

## File Details
- **File name:** `processname_docname_WORKFLOW.md` (e.g., `RW_CLOS_CA_Main_WORKFLOW.md`)
- **Location:** Inside the template output folder (same folder as all other generated files)

## Required Sections in Workflow File

### 1. Template Overview
- Template/Document name
- Process name
- Purpose and description of the document
- Date of generation

### 2. File Inventory
- Complete list of ALL generated files with their purpose
- File name → Role mapping table
  | File | Type | Purpose |
  |---|---|---|
  | `processname_docname.properties` | Config | Template metadata and view mapping |
  | `docname.html` | HTML Template | Dynamic document with ##TAG## markers |
  | `processname_docname_MAIN.xml` | Variable XML | Maps individual variables to DB columns |
  | ... | ... | ... |

### 3. System Flow Diagram (Text-Based)
- Show the complete data flow from database to rendered document:
```
Database Tables
    ↓
SQL Views (SELECT + JOINs)
    ↓
XML Mapping Files (FIELDS / GRIDFIELDS)
    ↓
HTML Template (##TAG## markers replaced with data)
    ↓
Final Rendered Document
```

### 4. Variable Mapping Table
- Complete mapping of every individual variable across all layers:
  | HTML Tag | XML EXTNAME | XML TEMPNAME | SQL View Column | Source Table |
  |---|---|---|---|---|
  | `##PROPOSAL_NO##` | PROPOSAL_NO | PROPOSAL_NO | PROPOSAL_NO | route_table |
  | ... | ... | ... | ... | ... |

### 5. Grid/Table Mapping Table
- For each grid, document:
  - Grid name (HTML tag)
  - Grid XML file name
  - ListView registration (MAPXMLNAME, DBTABLENAME)
  - Column-level mapping:
    | Grid Column (LBLNAME) | DBCOLNAME | MAPCOLNAME | Width | Align | SQL View Column |
    |---|---|---|---|---|---|
    | Facility | Facility | Facility | 14 | LEFT | Facility |
    | ... | ... | ... | ... | ... | ... |

### 6. SQL View Details
- For each SQL view:
  - View name
  - Purpose (variable view or which grid)
  - Source database table(s)
  - JOIN conditions (if any)
  - Column count

### 7. How It Works — Step-by-Step
- Describe the runtime flow in numbered steps:
  1. System reads `.properties` file to get template config
  2. System loads `docname.html` as the base template
  3. System reads `processname_docname_MAIN.xml` to get variable field mappings
  4. System queries the SQL view (EXTTABLENAME) to fetch variable data
  5. System replaces each `##TAG##` in HTML with corresponding data from the view
  6. For each grid: system reads `ListView.xml` → finds GRID XML → queries grid SQL view → renders table rows
  7. Final document is assembled and rendered

### 8. Key Configuration Reference
- Properties file key settings and what they control
- XMLFILENAME → which MAIN XML to load
- EXTTABLENAME → which SQL view for variables
- DBTABLENAME (per grid) → which SQL view for each grid

### 9. Troubleshooting Guide
- Common issues and how to resolve:
  - Tag not replaced → Check XML EXTNAME matches HTML tag exactly (case-sensitive)
  - Grid not rendering → Check ListView.xml registration (TEMPLBLNAME must match HTML tag)
  - SQL view error → Verify column aliases match XML EXTNAME/DBCOLNAME exactly
  - Missing data → Verify SQL view FROM/JOIN clause and source table

---

# Step 10 — Arabic / RTL Template Handling

**When the template content is in Arabic (or any right-to-left language), apply these mandatory standards to the generated HTML file. Never translate or change the template language — keep all text exactly as provided.**

## Reference Sample Data:
- `.github/SampleData/1105.html` — Production Arabic HTML template (real estate financing agreement in Arabic)

## Mandatory HTML Changes for Arabic/RTL Templates:

### 1. HTML Root
```html
<html lang="ar">
```
- Set `lang="ar"` (or the appropriate RTL language code) on the `<html>` element.

### 2. CSS Direction & Font
```css
body {
    direction: rtl;
    font-family: "Arial", sans-serif;
    /* ... other styles ... */
}

.arabic {
    direction: rtl;
    font-family: arial, sans-serif;
}
```
- Set `direction: rtl` on the `<body>` element.
- Use Arabic-compatible fonts: `Arial`, `sans-serif` (avoid fonts that don't render Arabic glyphs properly).
- Add an `.arabic` CSS class for RTL styling.

### 3. Body Class
```html
<body class="arabic">
```
- Add `class="arabic"` to the `<body>` tag.

### 4. Text Alignment
- Default text alignment should be `text-align: right` (since Arabic reads right-to-left).
- Use `text-align: left` only for explicitly LTR content (e.g., English labels, numbers, logos).
- Use `text-align: center` for centered headings/titles as needed.

### 5. Table Direction
- All tables inherit `direction: rtl` from the body.
- Table cell alignment defaults to `text-align: right` for Arabic content.

### 6. Print Header/Footer (if applicable)
- Use `unicode-bidi: bidi-override` on print header/footer elements when mixing LTR and RTL content.
- Page numbering follows RTL format: `صفحة X من Y` (Page X of Y in Arabic).
- Logo/image sections may use `direction: ltr` if the logo is in LTR layout.

### 7. Language Preservation Rule
- **NEVER** translate, transliterate, or modify the original Arabic text.
- Keep all Arabic content exactly as provided by the user.
- `##TAG##` variable markers remain in English/Latin characters — only the surrounding template text is in Arabic.
- XML EXTNAME/TEMPNAME values remain in English/Latin characters as usual.

## How to Detect Arabic Templates:
- User explicitly states the template is in Arabic.
- Source HTML/DOCX file contains Arabic Unicode characters (U+0600–U+06FF range).
- Source file uses `lang="ar"` or `direction: rtl`.
- User provides a `.docx` or `.html` file with Arabic text content.

## What Does NOT Change for Arabic Templates:
- XML file structure (FIELDS, GRIDFIELDS) — same format, same English tag names.
- SQL view structure — same format, English column aliases.
- Properties file — same format.
- ListView XML — same format.
- File naming conventions — same pattern.
- Only the **HTML template file** gets RTL/Arabic-specific styling changes described above.

---

# Final Result 

html page with table and variable mapping, xml mapping files for each variable/table, master xml table list file, sql views for each table/variable, any necessary supporting functions/procedures, and a workflow documentation file (after user confirmation).

# Vector Database (Mandatory Context Retrieval)

**IMPORTANT: Before starting any task, the agent MUST call the MCP Qdrant vector database (`get_context`) to retrieve relevant context.**

## When to call `get_context`:
- **Before generating any new files** (HTML, XML, SQL, properties) — search for existing patterns, naming conventions, and related templates.
- **Before modifying existing files** — search for related mappings, dependencies, and current data structures.
- **When the user asks a question about the project** — search for relevant documentation, schema details, or prior template examples.
- **When resolving ambiguity** — if tag names, column names, view names, or table structures are unclear, query the vector database for matching context.
- **Before creating SQL views** — search for actual database table/column names and schema information.
- **Before creating XML mappings** — search for existing mapping patterns and field definitions.

## How to call:
- Use **both** MCP tools for context retrieval:
  - `get_context` — vector semantic search (Qdrant embeddings)
  - `page_search` with `topK: 3` — BM25 keyword search (vectorless, always available)
- **Always use dynamic queries based on the current template/task** — never hardcode a specific template name. Use the actual document name, process name, or topic from the user's current request.
- Example query patterns (replace placeholders with actual values from the user's request):
  - `"[DOCUMENTNAME] grid columns"` — e.g., "loan agreement grid columns"
  - `"[DOCUMENTNAME] variable fields"` — e.g., "invoice variable fields"
  - `"[PROCESS] view schema"` — e.g., "vehicle financing view schema"
  - `"[TOPIC] template mapping"` — based on the current task context
- Prefer `page_search` when looking for exact structure patterns (GRIDFIELDS, VARIABLEFIELDS, TableListView, SQL view format).
- If one search returns insufficient results, try the other tool or use alternative keywords.

## Purpose:
- Ensures all generated files and mappings align with the latest project requirements and actual data structures.
- Avoids assumptions by grounding responses in stored project knowledge.
- Provides accurate column names, view names, and table structures from the indexed project documentation.

---

# DOCX Extraction Tool (Node.js)

**Before manually extracting data from a Word document, use the built-in Node.js extractor tool.**

## Node.js Installation Check (Mandatory Before Running the Tool)

Before running any `node` or `npm` command, **always verify that Node.js is installed** on the user's system:

```bash
node --version
```

- **If Node.js is installed:** Proceed with the tool setup and extraction as normal.
- **If Node.js is NOT installed (command not found / error):**
  1. Inform the user:
     > "Node.js is not installed on your system. It is required to run the DOCX extraction tool."
  2. Offer to install it:
     > "Shall I install Node.js for you now? I can run the installer automatically."
  3. If the user agrees, install Node.js using `winget` (Windows):
     ```bash
     winget install OpenJS.NodeJS.LTS
     ```
     Or guide the user to download manually from: https://nodejs.org/
  4. After installation, verify with `node --version` again before proceeding.
  5. If installation fails or the user prefers a manual install, provide the direct download link and pause until the user confirms Node.js is ready.

> **Never attempt to run `node` or `npm` commands if Node.js is not confirmed to be installed.**

## Project structure:
The Node.js project lives inside the `tools/` folder to keep the workspace root clean:
```
tools/
  ├── extract-docx.js      # Extractor script
  ├── package.json          # Node dependencies
  ├── package-lock.json
  └── node_modules/         # Installed packages (mammoth.js)
```

## Setup (one-time):
```bash
cd tools
npm install
```

## Usage (run from workspace root):
```bash
node tools/extract-docx.js "<path-to-docx>" [output-dir]
```

**Auto-folder creation:** When no `[output-dir]` is specified, the tool automatically creates a new folder named after the document (e.g., `CIB_OFFER_LETTER/`) and places all extracted files inside it. This folder is then used for all generated template files too.

Example:
```bash
node tools/extract-docx.js "CIB OFFER LETTER.docx"
# → Creates folder: CIB_OFFER_LETTER/
# → Outputs: CIB_OFFER_LETTER/CIB_OFFER_LETTER_extracted.json, .html, .txt
```

## What it extracts:
| Output | Description |
|---|---|
| `*_extracted.json` | Structured JSON with comments, tables, dot-dot fields, and metadata |
| `*_extracted.html` | Full HTML conversion of the document |
| `*_extracted.txt` | Plain text extraction |

## How to use the output:
1. Run the extractor on the user's `.docx` file (it auto-creates the template folder)
2. Read the `_extracted.json` to identify:
   - **Comments** → dynamic variable fields (with `annotatedText` showing what text they are attached to)
   - **Tables** → grid/table structures (headers + data rows)
   - **Dot-dot fields** → placeholder fields marked with `……` patterns
3. Generate all template files (HTML, XML, SQL, properties) **inside the same folder**

## Example:
```bash
node tools/extract-docx.js "CIB OFFER LETTER.docx" ./extraction_output
```
This avoids repeating the manual docx-to-zip extraction process each time.

---

# Step 11 — Screenshot / Visual Fallback (When DOCX Extraction is Incomplete)

**When the DOCX extraction tool does not fully capture the template layout** — for example, missing header colors, background fills, styled borders, merged cells, watermarks, logos, or complex formatting — switch to a **screenshot-based visual workflow**.

## When to trigger this fallback:
- The extracted HTML looks unstyled or is missing sections that are visible in the Word file.
- Header/footer colors, table shading, or cell backgrounds are absent in the extracted output.
- The extracted JSON/HTML lacks tables or grids that are clearly visible in the Word document.
- The user reports that the extracted output does not match the Word file visually.
- Any formatting detail that cannot be captured as plain text (colors, fonts, layout, column widths) is missing.

## How to handle (Mandatory Steps):

### Step 1 — Request a Screenshot
Ask the user to provide a screenshot (or screenshots) of the Word document:
> "The extraction did not fully capture the formatting/layout of this template. Please share a screenshot of the Word document (or the relevant pages/sections) so I can replicate it accurately."

- Accept: PNG, JPG, PDF screenshot, or screen capture of the Word file.
- If the document has multiple pages or sections, ask for screenshots of each.

### Step 2 — Visual Analysis of the Screenshot
Once the screenshot is provided, carefully analyze it section by section:

| What to look for | What to generate |
|---|---|
| Header area (logo, title, colors, background) | Matching HTML `<header>` or `<div>` with inline CSS (background-color, color, font) |
| Table structure (borders, shading, merged cells) | HTML `<table>` with `border`, `cellpadding`, `colspan`, `rowspan`, `background-color` |
| Column headers (bold, background color, text) | `<th>` with matching `background-color`, `color`, `font-weight`, `text-align` |
| Data rows (alternating colors, borders) | `<tr>` / `<td>` with matching styles |
| Variable fields (blanks, dot-dot lines, labels) | `##TAGNAME##` markers in the correct position |
| Grid / table with data columns | Full HTML table + identify as a GRID for XML/SQL mapping |
| Footer area (page numbers, signatures, lines) | Matching `<footer>` or `<div>` with inline CSS |
| Fonts, font sizes, spacing | CSS `font-family`, `font-size`, `line-height`, `padding`, `margin` |
| RTL / Arabic content | Apply RTL rules from Step 10 |

### Step 3 — Replica HTML Generation Rules
- **The goal is a pixel-accurate replica** of the provided screenshot — not an approximation.
- **Never assume colors, fonts, or layout** — derive everything from what is visible in the screenshot.
- If a color is not clearly visible (e.g., borderline dark gray vs. black), **ask the user to confirm** before coding it.
- If a column width, padding, or margin cannot be determined precisely, **ask the user** rather than guessing.
- Use **inline CSS** where needed for per-cell or per-row styling; use a `<style>` block for shared styles.
- Preserve all text exactly as visible in the screenshot — do NOT paraphrase, translate, or reformat.
- Replace all dynamic/variable content with `##TAGNAME##` markers at the correct positions.

### Step 4 — Table / Grid Detection from Screenshot
If a table is visible in the screenshot:
1. **Count columns** and note each column header label.
2. **Note column widths** (approximate % based on visual proportions).
3. **Note alignment** per column (left / center / right).
4. **Check for merged header rows** — replicate `colspan` / `rowspan` exactly.
5. **Identify the grid name** — ask the user for the `##GRIDNAME##` tag to use.
6. Generate the full HTML table structure with the `##GRIDNAME##` placeholder where data rows will appear.
7. Proceed to create the corresponding GRID XML, ListView entry, and SQL view as per the standard workflow.

### Step 5 — User Confirmation (Mandatory Before Proceeding)
After generating the replica HTML from the screenshot:
> "I've created the HTML replica based on the screenshot. Please review it and confirm it matches the Word document before I proceed with generating the XML, SQL, and properties files."

- **Do NOT generate XML, SQL, or other files until the user confirms the HTML replica is correct.**
- If the user requests changes, update the HTML and ask for confirmation again.
- Only after confirmation — proceed with the full template generation workflow (XML, SQL, properties, ListView).

### Step 6 — What NEVER to do
- **Never assume** any color, background, font, or layout detail not visible in the screenshot.
- **Never skip confirmation** — always verify the HTML replica with the user before proceeding.
- **Never generate partial HTML** — the replica must cover the full visible page/section from the screenshot.
- **Never translate or change text** — replicate it exactly as shown.
- **Never combine guessed data with screenshot data** — if something is unclear from both the DOCX extraction and the screenshot, ask the user explicitly.

