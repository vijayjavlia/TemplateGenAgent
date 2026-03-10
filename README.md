# 📄 Template Generation Agent

> **AI-powered dynamic document template generator** — Automatically creates HTML templates, XML mappings, SQL views, and all supporting files from your source documents.

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

## 💡 Tips

| Tip | Details |
|---|---|
| 🎯 **Use Claude model** | Gives the most accurate and complete template generation |
| 📎 **Provide sample data** | Production HTML, SQL scripts, or schema exports speed up generation |
| 📂 **Auto-organized** | Each template gets its own output folder automatically |
| ✅ **Confirm before workflow** | Agent creates workflow docs only after you approve the template |
| 🔄 **Iterative refinement** | You can ask the agent to adjust any file after generation |

---

## 📜 License

Internal use — Newgen Software Technologies

---

<p align="center">
  <b>Built with ❤️ using GitHub Copilot + Claude</b>
</p>
