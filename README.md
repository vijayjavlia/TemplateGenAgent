# vijay.k

# 📄 Template Generation Agent


 **AI-powered dynamic document template generator** — Automatically creates HTML templates, XML mappings, SQL views, and all supporting files from your source documents.

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| **VS Code** | Latest | IDE with Copilot |
| **GitHub Copilot** | Active subscription | AI agent for generation |
| **Node.js** | 16+ | Word document extraction |

---

## 🚀 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vijayjavlia/TemplateGenAgent.git
cd TemplateGenAgent
```

### 2. Install Node Dependencies (for Word Extraction)

```bash
cd tools
npm install
```

> 💡 This installs [mammoth.js](https://www.npmjs.com/package/mammoth) for extracting content from `.docx` files.

### 3. Open in VS Code

```bash
code .
```

---

## 🤖 Usage

### 🔑 Use Claude Model for Best Results

> **Important:** For the best template generation results, select the **Claude** model in GitHub Copilot.
>
> `Copilot Chat → Model Selector → Claude`
>
> Claude provides superior understanding of document structures, table detection, and consistent file generation.

---

### 📝 Generate a Template

1. Open **GitHub Copilot Chat** in VS Code
2. Select **Claude** as the model
3. Provide your source document (PDF, Word, or image) and say:

```
Generate template from this document.
Process name is [YOUR_PROCESS] and external table is [YOUR_TABLE].
```

4. Answer the mandatory questions when prompted:
   - **Q1:** Process name (e.g., `RW_CLOS`)
   - **Q2:** Variable view name (e.g., `RW_CLOS_VEHICLE_FINANCING_VIEW`)
   - **Q3:** Grid view name + source table (per grid)

5. Review generated files and confirm ✅
6. Agent creates a **Workflow Documentation** file after confirmation

---

### 📦 Extract Data from a Word File

If you want to extract comments, tables, and dynamic fields from a `.docx` file:

```bash
cd tools
npm install          # first time only
node extract-docx.js "../path/to/your/document.docx"
```

**Output:** Creates a folder named after your document containing:
- `comments.json` — All document comments (dynamic field markers)
- `tables.json` — Detected table structures
- `dotdot_fields.json` — Fields marked with `..` placeholders

---

## 📁 Generated File Structure

For each template, the agent generates a complete set of files:

```
📂 TemplateName/
├── 📄 processname_docname.properties    ← Template config
├── 📄 docname.html                      ← HTML with ##TAG## markers
├── 📄 processname_docname_MAIN.xml      ← Variable field mappings
├── 📄 processname_docname_GRID.xml      ← Table/grid field mappings
├── 📄 processname_docname_ListView.xml  ← Grid registration
├── 📄 EXTTABLENAME.sql                  ← SQL view for variables
├── 📄 DBTABLENAME.sql                   ← SQL view per grid
└── 📄 processname_docname_WORKFLOW.md   ← Workflow documentation
```

---

## 🔄 System Flow

```
┌─────────────────────┐
│   Database Tables    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  SQL Views           │
│  (SELECT + JOINs)    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  XML Mapping Files   │
│  (FIELDS/GRIDFIELDS) │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  HTML Template       │
│  (##TAG## → data)    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Final Document 📄   │
└─────────────────────┘
```

---

## 🗂️ Project Structure

```
TemplateGenAgent/
├── .github/
│   ├── instructions/          ← Copilot instructions
│   ├── SampleData/            ← Production reference files
│   └── docs/                  ← Documentation
├── tools/
│   ├── extract-docx.js        ← Word document extractor
│   ├── package.json           ← Node.js dependencies
│   └── package-lock.json
├── .gitignore
└── README.md
```

---

## � Sample Data Support

For the most accurate template generation, provide sample data **before** the agent starts asking questions. This eliminates guesswork for tag names, column names, and structures.

| Format | What it gives |
|---|---|
| **Production HTML file** | Exact `##TAG##` variable names + grid/table names |
| **SQL CREATE TABLE / CREATE VIEW** | Exact column names for XML and SQL mappings |
| **Sample rows (CSV / JSON / Excel)** | Column names, data types, sample values |
| **Existing SQL SELECT query** | FROM/JOIN clause for the SQL view |
| **Database schema export** | Full table structure for complete mapping |

> The agent automatically scans `##TAG##` patterns from production HTML, classifies them into variables vs grids, and uses exact tag names throughout all generated files.

---

## 🌍 Arabic / RTL Template Support

The agent fully supports **Arabic and right-to-left (RTL)** templates:

- Sets `lang="ar"` and `direction: rtl` on the HTML
- Uses Arabic-compatible fonts (`Arial`, `sans-serif`)
- Applies `text-align: right` as default alignment
- Handles RTL table rendering and print headers/footers
- **Never translates or modifies** the original Arabic text — all content is preserved exactly
- XML, SQL, and properties files remain unchanged — only the HTML gets RTL styling

---

## 🖼️ Screenshot / Visual Fallback

When the DOCX extractor cannot fully capture formatting (header colors, backgrounds, merged cells, watermarks, etc.), the agent switches to a **screenshot-based visual workflow**:

1. **Request screenshot** — Agent asks you to share a screenshot of the Word document
2. **Visual analysis** — Agent replicates the layout pixel-accurately (colors, fonts, borders, table structure)
3. **Replica HTML** — Generates a faithful HTML replica with inline CSS and `##TAG##` markers
4. **Confirmation** — Agent waits for your approval before generating XML, SQL, and other files

---

## 📝 Workflow Documentation (Auto-Generated)

After you confirm the generated template, the agent creates a **workflow documentation file** (`processname_docname_WORKFLOW.md`) inside the template folder. It includes:

- Template overview and purpose
- Complete file inventory with roles
- System flow diagram (DB → SQL → XML → HTML → Document)
- Variable mapping table (HTML tag → XML → SQL → DB)
- Grid/table column-level mapping
- SQL view details (source tables, JOINs)
- Step-by-step runtime explanation
- Troubleshooting guide for common issues

---

## 🧠 Vector Database Context (Qdrant)

The agent uses an **MCP Qdrant vector database** to retrieve relevant context before generating any files:

- Searches for existing patterns, naming conventions, and related templates
- Retrieves actual database table/column names and schema information
- Ensures generated files align with the latest project requirements
- Uses both **semantic search** (embeddings) and **BM25 keyword search** for accuracy

---

## 🔄 Self-Learning Agent

The agent **learns from your feedback** and updates its own instructions:

- When a new requirement is confirmed by the user, the agent updates its instruction file for future use
- If a generated output is rejected, the agent asks for the correct approach and saves it
- This ensures consistent, improving results across all future template generation sessions

---

## 💡 Tips

| Tip | Details |
|---|---|
| 🎯 **Use Claude model** | Gives the most accurate and complete template generation |
| 📎 **Provide sample data** | Production HTML, SQL scripts, or schema exports speed up generation |
| 📂 **Auto-organized** | Each template gets its own output folder automatically |
| ✅ **Confirm before workflow** | Agent creates workflow docs only after you approve the template |
| 🔄 **Iterative refinement** | You can ask the agent to adjust any file after generation |
| 🌍 **RTL/Arabic ready** | Full right-to-left support with no extra configuration |
| 🖼️ **Visual fallback** | Share a screenshot when DOCX extraction misses formatting |
| 🧠 **Context-aware** | Vector database provides accurate schema and pattern context |

---

## 📜 License



<p align="center">
<b>Author:Vijay.k</b>
  <b>Built with ❤️ using GitHub Copilot + Claude</b>
</p>
