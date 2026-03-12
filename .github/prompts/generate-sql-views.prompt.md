---
mode: agent
description: "Generate or update SQL views for template variables and grids"
---

# Generate SQL Views

Create SQL views that map database columns to XML field names for the template system.

## Two Types of Views

### A. Variable View (for individual `##TAG##` variables)
- View name = EXTTABLENAME from the `.properties` file
- Each column alias must exactly match EXTNAME/TEMPNAME in the MAIN XML
- Source tables and JOIN clauses must be provided by the user

```sql
-- SQL View for individual variable fields
-- Maps to: processname_docname_MAIN.xml (FIELDS: EXTNAME/TEMPNAME)
-- Referenced: EXTTABLENAME in processname_docname.properties
CREATE OR REPLACE VIEW VIEW_NAME AS
SELECT
  column1 AS TAG_NAME_1,
  column2 AS TAG_NAME_2
FROM source_table
WHERE conditions;
```

### B. Grid View (for table/grid data)
- One separate view per grid
- Column aliases must match GRIDFIELDS DBCOLNAME in the grid XML
- View name = DBTABLENAME registered in ListView XML

```sql
CREATE OR REPLACE VIEW GRID_VIEW_NAME AS
SELECT
  column1 AS GRID_COL_1,
  column2 AS GRID_COL_2
FROM source_table
WHERE conditions;
```

## Rules
- Always ask user for source table names and JOIN conditions — never assume
- Grid source table is NEVER the route/external table (that's only for variables)
- Column aliases are case-sensitive and must match XML exactly
- Add header comments referencing the XML file and properties file

## User's Request

{{input}}
