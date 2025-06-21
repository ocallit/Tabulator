# ocTabulatorRowSelector.js - Complete Documentation

A comprehensive widget class that adds advanced checkbox selection functionality to Tabulator.js tables with filtering, bulk operations, and export capabilities.

## Quick Reference - Public Methods

| Method | One-Line Description | Sample Usage |
|--------|---------------------|--------------|
| `constructor(table, options)` | Creates a new row selector widget for the given Tabulator table | ```javascript<br>const selector = new ocTabulatorRowSelector(table, {<br>&nbsp;&nbsp;&nbsp;&nbsp;checkboxColumnTitle: '☑',<br>&nbsp;&nbsp;&nbsp;&nbsp;checkboxColumnWidth: 80<br>});<br>``` |
| `getCheckboxColumnDefinition(options)` | **Static method** - Returns column definition for checkbox column | ```javascript<br>const checkboxCol = ocTabulatorRowSelector.getCheckboxColumnDefinition({<br>&nbsp;&nbsp;&nbsp;&nbsp;title: '✓',<br>&nbsp;&nbsp;&nbsp;&nbsp;width: 60<br>});<br>``` |
| `addCheckboxColumn()` | Adds checkbox column to existing table (auto-positioned after row numbers) | ```javascript<br>selector.addCheckboxColumn();<br>``` |
| `checkAll()` | Checks all rows in the table | ```javascript<br>selector.checkAll();<br>``` |
| `uncheckAll()` | Unchecks all rows in the table | ```javascript<br>selector.uncheckAll();<br>``` |
| `checkVisible()` | Checks only currently visible rows | ```javascript<br>selector.checkVisible();<br>``` |
| `uncheckVisible()` | Unchecks only currently visible rows | ```javascript<br>selector.uncheckVisible();<br>``` |
| `setFilter(type)` | Filters table by checkbox state | ```javascript<br>selector.setFilter('checked'); // 'checked', 'unchecked', 'all'<br>``` |
| `exportChecked(format)` | Exports only checked rows in specified format | ```javascript<br>selector.exportChecked('xlsx'); // 'csv', 'xlsx', 'pdf'<br>``` |
| `exportUnchecked(format)` | Exports only unchecked rows in specified format | ```javascript<br>selector.exportUnchecked('pdf');<br>``` |
| `getCheckedData()` | Returns array of data objects for checked rows | ```javascript<br>const checkedData = selector.getCheckedData();<br>``` |
| `getUncheckedData()` | Returns array of data objects for unchecked rows | ```javascript<br>const uncheckedData = selector.getUncheckedData();<br>``` |
| `setRowChecked(rowId, checked)` | Programmatically check/uncheck a specific row | ```javascript<br>selector.setRowChecked(123, true);<br>``` |
| `isRowChecked(rowId)` | Check if a specific row is checked | ```javascript<br>const isChecked = selector.isRowChecked(123);<br>``` |
| `getCheckedCount()` | Returns number of checked rows | ```javascript<br>const count = selector.getCheckedCount();<br>``` |
| `getUncheckedCount()` | Returns number of unchecked rows | ```javascript<br>const count = selector.getUncheckedCount();<br>``` |
| `getVisibleCount()` | Returns number of visible rows | ```javascript<br>const count = selector.getVisibleCount();<br>``` |

## Complete Reference

### Constructor Options

```javascript
const options = {
    checkboxColumnTitle: '☑',        // Header title for checkbox column
    checkboxColumnWidth: 80,         // Width of checkbox column in pixels
    checkboxFieldName: '_selected',  // Field name for checkbox state
    controlsContainerId: null,       // ID of container for controls (unused in current version)
    exportOptions: {                 // Export format availability
        pdf: true,
        excel: true,
        csv: true
    }
};
```

### Basic Setup Patterns

#### Pattern 1: Auto-Add Checkbox Column
```javascript
// Create table first
const table = new Tabulator("#example-table", {
    data: myData,
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        {title: "Name", field: "name"},
        {title: "Email", field: "email"},
        {title: "Department", field: "department"}
    ]
});

// Initialize selector (will auto-add checkbox column)
const selector = new ocTabulatorRowSelector(table);
selector.addCheckboxColumn(); // Explicitly add if needed
```

#### Pattern 2: Pre-Define Checkbox Column
```javascript
// Define checkbox column upfront
const columns = [
    {formatter: "rownum", hozAlign: "center", width: 40},
    ocTabulatorRowSelector.getCheckboxColumnDefinition({
        title: '✓',
        width: 60,
        fieldName: '_selected'
    }),
    {title: "Name", field: "name"},
    {title: "Email", field: "email"},
    {title: "Department", field: "department"}
];

const table = new Tabulator("#example-table", {
    data: myData,
    columns: columns
});

const selector = new ocTabulatorRowSelector(table, {
    checkboxFieldName: '_selected'
});
```

### Checkbox Column Features

The checkbox column provides:

#### Header Controls
- **Master Checkbox**: Check/uncheck all rows
- **Filter Buttons**:
  - 👁 (Eye) - View all rows
  - ☑ (Checked box) - Show only checked rows
  - ☐ (Empty box) - Show only unchecked rows

#### Cell Features
- Individual checkboxes for each row
- Automatic state synchronization
- Click handling with proper event propagation

#### Visual States
- **Checked**: All rows selected
- **Indeterminate**: Some rows selected
- **Unchecked**: No rows selected

### Filtering Methods

#### Built-in Filter Controls
```javascript
// Filters are triggered by clicking header buttons:
// 👁 - Shows all rows (calls table.clearFilter())
// ☑ - Shows only checked rows
// ☐ - Shows only unchecked rows
```

#### Programmatic Filtering
```javascript
// Filter by checkbox state
selector.setFilter('all');       // Show all rows
selector.setFilter('checked');   // Show only checked rows  
selector.setFilter('unchecked'); // Show only unchecked rows
```

### Bulk Operations

#### Check/Uncheck All Rows
```javascript
selector.checkAll();     // Check all rows in table
selector.uncheckAll();   // Uncheck all rows in table
```

#### Check/Uncheck Visible Rows
```javascript
selector.checkVisible();   // Check only currently visible rows
selector.uncheckVisible(); // Uncheck only currently visible rows
```

### Export Functionality

#### Export Checked Rows
```javascript
// Export only checked rows
selector.exportChecked('csv');   // CSV format
selector.exportChecked('xlsx');  // Excel format
selector.exportChecked('pdf');   // PDF format
```

#### Export Unchecked Rows
```javascript
// Export only unchecked rows
selector.exportUnchecked('csv');   // CSV format
selector.exportUnchecked('xlsx');  // Excel format
selector.exportUnchecked('pdf');   // PDF format
```

#### Export Options
- **CSV**: Standard comma-separated values
- **XLSX**: Excel format with "Data" sheet name
- **PDF**: Landscape orientation with formatted title

### Data Access Methods

#### Get Checked/Unchecked Data
```javascript
// Get data objects (not row objects)
const checkedData = selector.getCheckedData();
const uncheckedData = selector.getUncheckedData();

// Example usage
checkedData.forEach(item => {
    console.log(`Checked: ${item.name} - ${item.email}`);
});
```

#### Get Row Objects
```javascript
// Get actual Tabulator row objects
const checkedRows = selector.getCheckedRows();
const uncheckedRows = selector.getUncheckedRows();

// Example usage
checkedRows.forEach(row => {
    row.getElement().style.backgroundColor = 'lightgreen';
});
```

#### Count Methods
```javascript
const checkedCount = selector.getCheckedCount();     // Number of checked rows
const uncheckedCount = selector.getUncheckedCount(); // Number of unchecked rows
const visibleCount = selector.getVisibleCount();     // Number of visible rows

console.log(`${checkedCount} of ${checkedCount + uncheckedCount} rows selected`);
```

### Programmatic Row Control

#### Check/Uncheck Specific Rows
```javascript
// Check row by ID
selector.setRowChecked(123, true);   // Check row with ID 123
selector.setRowChecked(456, false);  // Uncheck row with ID 456

// Check if row is checked
const isChecked = selector.isRowChecked(123);
if (isChecked) {
    console.log('Row 123 is checked');
}
```

#### Row ID Resolution
The widget automatically determines row IDs using this priority:
1. `data.id` property
2. `data._id` property  
3. JSON stringified data object (fallback)

### State Persistence

#### Automatic State Management
```javascript
// State is automatically maintained across:
// - Data reloads
// - Filtering operations  
// - Sorting operations
// - Table rebuilds

// The widget listens to these Tabulator events:
table.on("dataLoaded", () => {
    // Restores checkbox states
});

table.on("dataFiltered", () => {
    // Updates UI counters
});
```

### Integration Examples

#### Complete Working Example
```javascript
// HTML
// <div id="controls"></div>
// <div id="example-table"></div>

// Sample data
const tableData = [
    {id: 1, name: "John Doe", email: "john@example.com", department: "IT"},
    {id: 2, name: "Jane Smith", email: "jane@example.com", department: "HR"},
    {id: 3, name: "Bob Wilson", email: "bob@example.com", department: "Finance"}
];

// Create table with checkbox column
const table = new Tabulator("#example-table", {
    data: tableData,
    layout: "fitColumns",
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        ocTabulatorRowSelector.getCheckboxColumnDefinition({
            title: '☑',
            width: 80
        }),
        {title: "Name", field: "name", width: 150},
        {title: "Email", field: "email", width: 200},
        {title: "Department", field: "department", width: 120}
    ]
});

// Initialize selector
const selector = new ocTabulatorRowSelector(table);

// Add custom controls
document.getElementById('controls').innerHTML = `
    <div class="controls-panel">
        <button onclick="selector.checkAll()">Check All</button>
        <button onclick="selector.uncheckAll()">Uncheck All</button>
        <button onclick="selector.checkVisible()">Check Visible</button>
        <button onclick="selector.uncheckVisible()">Uncheck Visible</button>
        
        <span class="separator">|</span>
        
        <button onclick="selector.exportChecked('csv')">Export Checked (CSV)</button>
        <button onclick="selector.exportChecked('xlsx')">Export Checked (Excel)</button>
        <button onclick="selector.exportChecked('pdf')">Export Checked (PDF)</button>
        
        <span class="separator">|</span>
        
        <span id="status">
            Checked: <span id="checked-count">0</span> | 
            Total: <span id="total-count">0</span>
        </span>
    </div>
`;

// Update status display
function updateStatus() {
    document.getElementById('checked-count').textContent = selector.getCheckedCount();
    document.getElementById('total-count').textContent = selector.getVisibleCount();
}

// Update status on table events
table.on("dataLoaded", updateStatus);
table.on("dataFiltered", updateStatus);
table.on("cellEdited", updateStatus);
```

#### React Integration Example
```jsx
import React, { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

function TabulatorWithCheckboxes({ data }) {
    const tableRef = useRef(null);
    const selectorRef = useRef(null);
    const [checkedCount, setCheckedCount] = useState(0);

    useEffect(() => {
        const table = new Tabulator(tableRef.current, {
            data: data,
            columns: [
                {formatter: "rownum", width: 40},
                ocTabulatorRowSelector.getCheckboxColumnDefinition(),
                {title: "Name", field: "name"},
                {title: "Email", field: "email"}
            ]
        });

        selectorRef.current = new ocTabulatorRowSelector(table);

        // Update React state when checkboxes change
        const updateCount = () => {
            setCheckedCount(selectorRef.current.getCheckedCount());
        };

        table.on("dataLoaded", updateCount);
        table.on("cellEdited", updateCount);

        return () => {
            table.destroy();
        };
    }, [data]);

    return (
        <div>
            <div className="controls">
                <button onClick={() => selectorRef.current?.checkAll()}>
                    Check All
                </button>
                <button onClick={() => selectorRef.current?.uncheckAll()}>
                    Uncheck All
                </button>
                <span>Checked: {checkedCount}</span>
            </div>
            <div ref={tableRef}></div>
        </div>
    );
}
```

### CSS Styling

#### Required CSS for Header Controls


```css
.header-filter-btn {
    opacity: 0.6;
    transition: opacity 0.2s;
    user-select: none;
}

.header-filter-btn:hover {
    opacity: 0.8;
}

.header-filter-btn.active {
    opacity: 1;
    font-weight: bold;
}

/* Optional: Style the controls panel */
.controls-panel {
    padding: 10px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.controls-panel button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 3px;
}

.controls-panel button:hover {
    background: #f0f0f0;
}

.separator {
    color: #ccc;
    margin: 0 5px;
}
```

### Dependencies

#### Required
- **Tabulator.js 6.3+** - Core table functionality
- **Modern Browser** - Uses ES6 classes, Sets, and modern DOM APIs

#### Optional (for full export functionality)
```html
<!-- For Excel export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<!-- For PDF export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
```

### Error Handling

#### Common Issues and Solutions

**1. Export fails with "No checked rows"**
```javascript
// Check if there are checked rows before exporting
if (selector.getCheckedCount() > 0) {
    selector.exportChecked('xlsx');
} else {
    alert('Please select some rows to export');
}
```

**2. Checkbox states not persisting**
```javascript
// Ensure your data has unique ID fields
const data = [
    {id: 1, name: "John"},  // ✅ Good: has unique ID
    {name: "Jane"}          // ❌ Bad: no ID, will use JSON stringify
];
```

**3. Header checkbox not updating**
```javascript
// The header checkbox automatically updates, but you can manually trigger:
// (This is handled internally by the widget)
```

### Key Features Summary

1. **Smart Checkbox Column**: Auto-positions after row numbers, includes filtering controls
2. **State Management**: Persistent across data operations and table rebuilds  
3. **Flexible Filtering**: Built-in visual filters plus programmatic API
4. **Bulk Operations**: Check/uncheck all or visible rows with single commands
5. **Export Integration**: Seamless export of selected subsets in multiple formats
6. **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular
7. **Event-Driven**: Proper event handling and state synchronization
8. **Production Ready**: Robust error handling and defensive programming