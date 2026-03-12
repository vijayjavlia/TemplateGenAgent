---
mode: agent
description: "Add a new grid/table to an existing template — XML, ListView, SQL view, and HTML mapping"
---

# Add Grid/Table to Existing Template

Add a new grid (table) to an already-generated template. This creates the grid XML, registers it in ListView, generates the SQL view, and updates the HTML.

## Required Information (ask if not provided)

- **Grid name**: The `##GRIDNAME##` tag for HTML (e.g., `FACILITIES_GRID`)
- **Column details**: Label name, DB column name, width %, alignment (LEFT/RIGHT/CENTER) for each column
- **Grid view name**: SQL view name for this grid (e.g., `RW_CLOS_FACILITY_GRID_VW`)
- **Source DB table**: The database table this grid pulls data from
- **Process name**: Already defined in the template's properties file

## Files to Create/Update

1. **Create** `processname_docname_GRIDNAME.xml` — GRIDFIELDS structure:
   ```xml
   <PROCESSNAME>
     <GRIDFIELDS>
       <LBLNAME>Column Label</LBLNAME>
       <DBCOLNAME>db_column</DBCOLNAME>
       <MAPCOLNAME>db_column</MAPCOLNAME>
       <LBLWIDTH>20</LBLWIDTH>
       <COLALIGN>LEFT</COLALIGN>
     </GRIDFIELDS>
   </PROCESSNAME>
   ```

2. **Update** `processname_docname_ListView.xml` — Add GRIDDETAILFIELDS entry:
   ```xml
   <GRIDDETAILFIELDS>
     <TEMPLBLNAME>GRIDNAME</TEMPLBLNAME>
     <MAPXMLNAME>processname_docname_GRIDNAME</MAPXMLNAME>
     <DBTABLENAME>GRID_VIEW_NAME</DBTABLENAME>
     <FONTTYPE>Verdana</FONTTYPE>
     <FONTSIZE>10.0pt</FONTSIZE>
   </GRIDDETAILFIELDS>
   ```

3. **Create** `GRID_VIEW_NAME.sql` — SQL view for the grid data

4. **Update** `docname.html` — Add `##GRIDNAME##` marker at the correct position

## User's Request

{{input}}
