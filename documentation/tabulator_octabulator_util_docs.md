# ocTabulatorUtil.js - Complete Documentation

A utility library providing advanced filtering, natural sorting, and export functionality for Tabulator.js tables.

## Quick Reference - Public Methods

| Method | One-Line Description | Sample Usage|
|--------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `headerFilterNumber()` | Creates a custom number filter with operators (equal, different, less than, greater than, empty, not empty) | {title: "Price", field: "price",<br>headerFilter: ocTabulatorUtil.headerFilterNumber,<br>headerFilterFunc: ocTabulatorUtil.headerFilterFuncNumber,<br>headerFilterLiveFilter: false}|
| `headerFilterFuncNumber()` | Filter function that processes number comparisons with the selected operator |                                                                |
| `headerFilterString()` | Creates a custom string filter with operators (contains, starts with, ends with, equal, different) | { title: "Name", field: "name",<br>headerFilter: ocTabulatorUtil.headerFilterString,<br>headerFilterFunc: ocTabulatorUtil.headerFilterFuncString,<br>headerFilterLiveFilter: false }|
| `headerFilterFuncString()` | Filter function that processes string comparisons with accent/case insensitive matching |                                                                |
| `headerFilterYmdDate()` | Creates a custom date filter for YYYY-MM-DD format strings with HTML5 datepicker | { title: "Created", field: "created_date",<br>headerFilter: ocTabulatorUtil.headerFilterYmdDate,<br>headerFilterFunc: ocTabulatorUtil.headerFilterFuncYmdDate,<br>headerFilterLiveFilter: false }<br>|
| `headerFilterFuncYmdDate()` | Filter function that processes date comparisons for YYYY-MM-DD format strings |                                                                |
| `stringSorter()` | Natural sorting function that's insensitive to accents and case, with proper empty value handling | { title: "Product", field: "product_name",<br>sorter: ocTabulatorUtil.stringSorter }||
| `setLocale()` | Sets the locale for natural sorting (default: "es-MX") | ocTabulatorUtil.setLocale("en-US");|                                              |
| `toolbar()` | Adds an export toolbar with copy, print, CSV, XLSX, PDF, and image export buttons | table.on("tableBuilt", function() {<br>&nbsp;&nbsp;&nbsp;&nbsp;ocTabulatorUtil.toolbar.call(this);<br>});                                                 |

## Complete Reference

### Number Filtering

#### `headerFilterNumber(cell, onRendered, success, cancel, editorParams)`

Creates a sophisticated number filter with dropdown operators and numeric input.

**Parameters:**
- `cell` - Tabulator cell object
- `onRendered` - Callback when filter is rendered
- `success` - Callback to apply filter with `{type: string, value: string}`
- `cancel` - Callback to cancel filter
- `editorParams` - Additional parameters (unused)

**Filter Operators:**
- `eq` - Equal to
- `ne` - Not equal to (Different)
- `lt` - Less than (Menor)
- `gt` - Greater than (Mayor)
- `nu` - Is empty (Vacío)
- `nn` - Has value (Con valor)

**Usage:**
```javascript
{
    title: "Price",
    field: "price",
    headerFilter: ocTabulatorUtil.headerFilterNumber,
    headerFilterFunc: ocTabulatorUtil.headerFilterFuncNumber,
    headerFilterLiveFilter: false
}
```

#### `headerFilterFuncNumber(headerValue, rowValue, rowData, filterParams)`

Processes number filter comparisons.

**Parameters:**
- `headerValue` - Object with `{type: string, value: string}` from filter
- `rowValue` - Cell value to test
- `rowData` - Complete row data
- `filterParams` - Additional filter parameters

**Returns:** `boolean` - true if row matches filter

### String Filtering

#### `headerFilterString(cell, onRendered, success, cancel, editorParams)`

Creates a string filter with multiple comparison operators and accent-insensitive matching.

**Filter Operators:**
- `contains` - Contains text (default)
- `startsWith` - Starts with text
- `endsWith` - Ends with text
- `eq` - Exactly equal
- `ne` - Not equal

**Features:**
- Accent/diacritic insensitive matching
- Case insensitive matching
- Clear button for quick filter reset

**Usage:**
```javascript
{
    title: "Name",
    field: "name",
    headerFilter: ocTabulatorUtil.headerFilterString,
    headerFilterFunc: ocTabulatorUtil.headerFilterFuncString,
    headerFilterLiveFilter: false
}
```

#### `headerFilterFuncString(headerValue, rowValue, rowData, filterParams)`

Processes string filter comparisons with normalization.

**String Normalization:**
- Removes accents/diacritics using Unicode NFD normalization
- Converts to lowercase
- Handles null/undefined values as empty strings

**Example:**
```javascript
// These would match with "contains" filter:
// Filter: "jose" matches "José", "JOSÉ", "Josè"
// Filter: "munoz" matches "Muñoz", "MUÑOZ"
```

### Date Filtering

#### `headerFilterYmdDate(cell, onRendered, success, cancel, editorParams)`

Creates a date filter specifically for YYYY-MM-DD format strings using HTML5 datepicker.

**Filter Operators:**
- `eq` - Same date
- `ne` - Different date  
- `lt` - Before date (Antes de)
- `gt` - After date (Después de)
- `nu` - Empty date
- `nn` - Has date value

**Features:**
- HTML5 date input with native browser datepicker
- Validates YYYY-MM-DD pattern
- Auto-hides date input for empty/not-empty filters

**Usage:**
```javascript
{
    title: "Created Date",
    field: "created_date", // Must contain YYYY-MM-DD strings
    headerFilter: ocTabulatorUtil.headerFilterYmdDate,
    headerFilterFunc: ocTabulatorUtil.headerFilterFuncYmdDate,
    headerFilterLiveFilter: false
}
```

#### `headerFilterFuncYmdDate(headerValue, rowValue, rowData, filterParams)`

Processes date comparisons using lexical string comparison (works because YYYY-MM-DD is lexically sortable).

### Natural Sorting

#### `stringSorter(a, b, aRow, bRow, column, dir)`

Provides natural, locale-aware sorting that handles:
- **Natural numeric ordering**: "item2" comes before "item10"
- **Accent insensitive**: "José" sorts with "Jose"
- **Case insensitive**: "Apple" sorts with "apple"  
- **Empty value handling**: null/undefined/empty strings always sort first

**Parameters:**
- `a, b` - Values to compare
- `aRow, bRow` - Row objects (unused)
- `column` - Column object (unused)
- `dir` - Sort direction (unused, handled by Tabulator)

**Usage:**
```javascript
{
    title: "Product Name",
    field: "product_name",
    sorter: ocTabulatorUtil.stringSorter
}
```

**Examples:**
```javascript
// Natural numeric sorting:
["item1", "item2", "item10"] // Not: ["item1", "item10", "item2"]

// Accent insensitive:
["José", "Maria", "Ñoño"] // Sorts properly with Spanish names

// Empty values first:
["", null, "Apple", "Banana"] // Empty values always first
```

#### `setLocale(locale = "es-MX")`

Changes the locale for natural sorting. Affects accent handling and collation rules.

**Parameters:**
- `locale` - BCP 47 locale string (default: "es-MX")

**Usage:**
```javascript
// Set to US English
ocTabulatorUtil.setLocale("en-US");

// Set to European Spanish  
ocTabulatorUtil.setLocale("es-ES");

// Set to French
ocTabulatorUtil.setLocale("fr-FR");
```

### Export Toolbar

#### `toolbar()`

Adds a comprehensive export toolbar to the table footer with multiple export options.

**Must be called in table context:**
```javascript
// Call after table is built
table.on("tableBuilt", function() {
    ocTabulatorUtil.toolbar.call(this);
});
```

**Export Options:**
- **Copy** - Copy visible data to clipboard as table format
- **Print** - Print table with browser print dialog
- **CSV** - Download as comma-separated values
- **XLSX** - Download as Excel spreadsheet with "Export" sheet name
- **PDF** - Download as PDF in landscape orientation
- **Image** - Download table as PNG image

**Toolbar Features:**
- FontAwesome icons (requires FontAwesome CSS)
- Prevents duplicate toolbar creation
- Responsive button layout
- Tooltips for each button

## Complete Usage Example

```javascript
// Initialize table with ocTabulatorUtil features
var table = new Tabulator("#my-table", {
    data: tableData,
    columns: [
        {
            title: "ID",
            field: "id",
            headerFilter: ocTabulatorUtil.headerFilterNumber,
            headerFilterFunc: ocTabulatorUtil.headerFilterFuncNumber,
            headerFilterLiveFilter: false
        },
        {
            title: "Product Name", 
            field: "name",
            headerFilter: ocTabulatorUtil.headerFilterString,
            headerFilterFunc: ocTabulatorUtil.headerFilterFuncString,
            headerFilterLiveFilter: false,
            sorter: ocTabulatorUtil.stringSorter
        },
        {
            title: "Created Date",
            field: "created_date",
            headerFilter: ocTabulatorUtil.headerFilterYmdDate, 
            headerFilterFunc: ocTabulatorUtil.headerFilterFuncYmdDate,
            headerFilterLiveFilter: false
        },
        {
            title: "Price",
            field: "price",
            headerFilter: ocTabulatorUtil.headerFilterNumber,
            headerFilterFunc: ocTabulatorUtil.headerFilterFuncNumber,
            headerFilterLiveFilter: false,
            formatter: "money"
        }
    ]
});

// Set locale (optional, defaults to es-MX)
ocTabulatorUtil.setLocale("es-MX");

// Add export toolbar after table is built
table.on("tableBuilt", function() {
    ocTabulatorUtil.toolbar.call(this);
});
```

## CSS Requirements

The utility expects these CSS classes for proper styling:

```css
.custom-filter-header {
    display: flex;
    gap: 2px;
    align-items: center;
}

.filter-type-select {
    flex: 0 0 auto;
    min-width: 80px;
    font-size: 11px;
}

.filter-input {
    flex: 1;
    min-width: 60px;
}

.clear-filter {
    flex: 0 0 auto;
    cursor: pointer;
    padding: 2px 5px;
    background: #f0f0f0;
    border-radius: 3px;
    font-weight: bold;
}

.clear-filter:hover {
    background: #e0e0e0;
}

.ocExporter_toolbar {
    display: flex;
    gap: 5px;
    padding: 5px;
    background: #f9f9f9;
    border-top: 1px solid #ddd;
}

.ocExporter_btn {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 3px;
}

.ocExporter_btn:hover {
    background: #f0f0f0;
}
```

## Dependencies

- **Tabulator.js 6.3+** - Core table functionality
- **FontAwesome** - Icons for export toolbar (optional, can use text)
- **Modern Browser** - Uses Intl.Collator, HTML5 date input, and other ES6+ features

## Key Features Summary

1. **Advanced Filtering**: Dropdown operators for numbers, strings, and dates
2. **Internationalization**: Accent-insensitive string matching and natural sorting
3. **User Experience**: Clear buttons, proper focus handling, Enter key support
4. **Export Tools**: Comprehensive export options in convenient toolbar
5. **Vanilla JavaScript**: No framework dependencies beyond Tabulator.js