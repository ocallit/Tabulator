# Tabulator 6.3 - Comprehensive Reference Guide

A comprehensive reference covering column definition, formatting, row editing, validation, server-side operations, and observability in Tabulator 6.3.

## Table of Contents
- [Initialization](#initialization)
- [Column Definition](#column-definition)
- [Data Formatting](#data-formatting)
- [Row Edit Mode](#row-edit-mode)
- [Validation](#validation)
- [Server-side Operations](#server-side-operations)
- [Observability](#observability)

## Initialization

Basic initialization of a Tabulator table:

```javascript
var table = new Tabulator("#example-table", {
    height: "400px",
    layout: "fitColumns",
    columns: [
        {title: "Name", field: "name", width: 150},
        {title: "Age", field: "age", hozAlign: "right"},
        {title: "Rating", field: "rating", formatter: "star"}
    ],
    data: tableData // Array of row data objects
});
```

To use Tabulator with ES6 imports:

```javascript
import {Tabulator} from 'tabulator-tables';
```

## Column Definition

### Basic Column Structure

Column definitions are provided in the `columns` property of the table constructor as an array of objects:

```javascript
columns: [
    {
        title: "Name",       // Column header text
        field: "name",       // Data field in the row data
        width: 150,          // Fixed width in pixels (optional)
        headerFilter: true,  // Enable header filtering
        sorter: "string",    // Specify sorter type
        hozAlign: "left",    // Horizontal alignment
        vertAlign: "middle", // Vertical alignment
        frozen: true         // Freeze column (optional)
    }
]
```

### All Column Properties

| Property | Description | Default Value |
|----------|-------------|---------------|
| **Basic Properties** | | |
| `title` | The column header text | - |
| `field` | The key for the data in your row data objects | - |
| `visible` | Whether column is visible | `true` |
| `cssClass` | CSS class to add to cells | - |

| **Width & Layout** | | |
| `width` | Fixed width in pixels | - |
| `widthGrow` | Relative column growth factor | `1` |
| `widthShrink` | Relative column shrink factor | `1` |
| `minWidth` | Minimum width in pixels | `40` |
| `maxWidth` | Maximum width in pixels | - |
| `resizable` | Allow column to be resized | `true` |
| `responsive` | Responsive layout priority (higher = hidden sooner) | `1` |
| `frozen` | Freeze column (true/"left"/"right") | `false` |

| **Alignment & Formatting** | | |
| `hozAlign` | Horizontal alignment (left/center/right) | - |
| `vertAlign` | Vertical alignment (top/middle/bottom) | - |
| `headerHozAlign` | Horizontal header alignment | - |
| `headerVertAlign` | Vertical header alignment (top/middle/bottom) | - |
| `headerVertical` | Display header text vertically (true/false/"flip") | `false` |
| `formatter` | Cell formatter type | - |
| `formatterParams` | Parameters for the formatter | - |
| `variableHeight` | Allow cell to adjust height based on content | `false` |

| **Header Options** | | |
| `headerSort` | Enable header click sorting | `true` |
| `headerSortStartingDir` | Starting sort direction (asc/desc) | `asc` |
| `headerSortTristate` | Enable tri-state sorting | `false` |
| `headerTooltip` | Header tooltip | - |
| `headerFilter` | Enable header filtering | `false` |
| `headerFilterPlaceholder` | Placeholder for header filter | - |
| `headerFilterParams` | Parameters for header filter | - |
| `headerMenu` | Enable header menu | - |
| `headerDblClickPopup` | Show popup on header double click | - |
| `titleFormatter` | Formatter for title text | - |
| `titleFormatterParams` | Parameters for the title formatter | - |

| **Editing & Interaction** | | |
| `editor` | Cell editor type | - |
| `editorParams` | Parameters for the editor | - |
| `editable` | Allow cell to be edited (can be function) | `true` |
| `editableTitle` | Allow header title to be edited | `false` |
| `validator` | Validate cell input | - |
| `contextMenu` | Enable/configure context menu | - |
| `clickMenu` | Enable/configure click menu | - |
| `tooltip` | Cell tooltip (can be function) | - |
| `cellClick` | Callback for cell click | - |
| `cellDblClick` | Callback for cell double click | - |
| `cellContext` | Callback for cell right click | - |
| `cellTap` | Callback for cell tap (touch) | - |
| `cellDblTap` | Callback for cell double tap (touch) | - |
| `cellTapHold` | Callback for cell tap and hold (touch) | - |
| `cellMouseEnter` | Callback for mouse entering cell | - |
| `cellMouseLeave` | Callback for mouse leaving cell | - |
| `cellMouseOver` | Callback for mouse over cell | - |
| `cellMouseOut` | Callback for mouse out of cell | - |
| `cellMouseMove` | Callback for mouse moving over cell | - |
| `headerClick` | Callback for header click | - |
| `headerDblClick` | Callback for header double click | - |
| `headerContext` | Callback for header right click | - |
| `headerTap` | Callback for header tap (touch) | - |
| `headerDblTap` | Callback for header double tap (touch) | - |
| `headerTapHold` | Callback for header tap and hold (touch) | - |
| `headerMouseEnter` | Callback for mouse entering header | - |
| `headerMouseLeave` | Callback for mouse leaving header | - |
| `headerMouseOver` | Callback for mouse over header | - |
| `headerMouseOut` | Callback for mouse out of header | - |
| `headerMouseMove` | Callback for mouse moving over header | - |

| **Sorting & Filtering** | | |
| `sorter` | Column sorter type | Auto-detected |
| `sorterParams` | Parameters for the sorter | - |
| `headerFilterFuncParams` | Parameters for header filter function | - |
| `headerFilterFunc` | Custom header filter function | - |
| `headerFilterLiveFilter` | Apply filter as typing occurs | `true` |

| **Calculations & Special Features** | | |
| `topCalc` | Calculation function for top of column | - |
| `topCalcParams` | Parameters for top calculation | - |
| `topCalcFormatter` | Formatter for top calculation | - |
| `topCalcFormatterParams` | Parameters for top calculation formatter | - |
| `bottomCalc` | Calculation function for bottom of column | - |
| `bottomCalcParams` | Parameters for bottom calculation | - |
| `bottomCalcFormatter` | Formatter for bottom calculation | - |
| `bottomCalcFormatterParams` | Parameters for bottom calculation formatter | - |
| `mutator` | Mutator function for incoming data | - |
| `mutatorParams` | Parameters for the mutator | - |
| `mutatorData` | Mutator function for outgoing data | - |
| `mutatorDataParams` | Parameters for the data mutator | - |
| `mutatorEdit` | Mutator for edit data | - |
| `mutatorEditParams` | Parameters for edit mutator | - |
| `mutatorClipboard` | Mutator for clipboard data | - |
| `mutatorClipboardParams` | Parameters for clipboard mutator | - |
| `accessor` | Accessor function for cell data | - |
| `accessorParams` | Parameters for the accessor | - |
| `accessorDownload` | Accessor for download data | - |
| `accessorDownloadParams` | Parameters for download accessor | - |
| `accessorClipboard` | Accessor for clipboard | - |
| `accessorClipboardParams` | Parameters for clipboard accessor | - |
| `accessorPrint` | Accessor for print data | - |
| `accessorPrintParams` | Parameters for print accessor | - |
| `accessorHtmlOutput` | Accessor for HTML output | - |
| `accessorHtmlOutputParams` | Parameters for HTML output accessor | - |
| `clipboard` | Include column in clipboard operations | `true` |
| `download` | Include column in download | `true` |
| `print` | Include column in print output | `true` |
| `htmlOutput` | Include column in HTML output | `true` |

| **Row Header** | | |
| `rowHandle` | Column contains row handle for movable rows | `false` |
| `headerSort` | Enable header click sorting | `true` |
| `resizable` | Allow column to be resized | `true` |
| `minWidth` | Minimum width in pixels | `40` |
| `width` | Fixed width in pixels | - |

| **Custom & Advanced** | | |
| `cellEditing` | Callback for when cell editing starts | - |
| `cellEdited` | Callback for when cell is edited | - |
| `cellEditCancelled` | Callback for when editing is cancelled | - |
| `htmlOutput` | Include column in HTML output | `true` |
| `print` | Include column in print output | `true` |
| `titlePrint` | Title to show when printed | - |
| `titleDownload` | Title to use for downloads | - |

## Data Formatting

### Built-in Formatters

Tabulator provides numerous built-in formatters. Here's a comprehensive list of all available formatters in Tabulator 6.3:

| Formatter | Description | Parameters |
|-----------|-------------|------------|
| `plaintext` | Default formatter displaying value as escaped text | N/A |
| `textarea` | Shows text with carriage returns intact | N/A |
| `html` | Displays HTML content (use with caution) | N/A |
| `money` | Currency formatting with symbol | `symbol`, `precision`, `thousand`, `decimal` |
| `image` | Display an image based on a URL | `height`, `width`, `urlPrefix`, `urlSuffix` |
| `link` | Display a hyperlink | `url`, `target`, `labelField`, `urlField`, `urlPrefix` |
| `datetime` | Format date/time values | `inputFormat`, `outputFormat`, `invalidPlaceholder` |
| `datetimediff` | Show difference between two dates | `inputFormat`, `date`, `units`, `humanize`, `suffix` |
| `tickCross` | Green tick for true, red cross for false | `allowEmpty`, `allowTruthy`, `tickElement`, `crossElement` |
| `star` | Display star rating | `stars` (default: 5) |
| `progress` | Show progress bar | `min`, `max`, `color`, `legend`, `legendColor`, `legendAlign` |
| `progressBar` | Alias for `progress` | Same as `progress` |
| `color` | Shows a color swatch | N/A |
| `buttonTick` | Display a tick icon button | N/A |
| `buttonCross` | Display a cross icon button | N/A |
| `rownum` | Shows incremental row number | N/A |
| `handle` | Displays drag handle for movable rows | N/A |
| `rowSelection` | Displays checkboxes for row selection | N/A |
| `responsiveCollapse` | Control for collapsible responsive columns | N/A |
| `email` | Format and link email addresses | N/A |
| `lookup` | Display value from lookup object | `lookupObj` |
| `traffic` | Traffic light indicator (red/yellow/green) | N/A |
| `number` | Format numbers | `precision`, `thousand`, `decimal` |
| `array` | Display array with separator | `separator` (default: ",") |
| `file` | Display file icon based on file name extension | N/A |
| `adaptable` | Auto-select formatter based on value type | `formatterLookup`, `paramsLookup` |

### Custom Formatters

You can create custom formatters to handle complex display needs:

```javascript
{
    title: "Status",
    field: "status",
    formatter: function(cell, formatterParams) {
        var value = cell.getValue();
        
        if(value > 75) {
            return "<span style='color:green; font-weight:bold;'>" + value + "%</span>";
        } else if(value > 25) {
            return "<span style='color:orange;'>" + value + "%</span>";
        } else {
            return "<span style='color:red;'>" + value + "%</span>";
        }
    }
}
```

### Extending Built-in Formatters

You can add custom formatters to the global formatter list:

```javascript
Tabulator.extendModule("format", "formatters", {
    bold: function(cell, formatterParams) {
        return "<strong>" + cell.getValue() + "</strong>";
    },
    uppercase: function(cell, formatterParams) {
        return cell.getValue().toUpperCase();
    }
});

// Then use them like built-in formatters
{title: "Name", field: "name", formatter: "bold"}
```

### Custom Formatters

You can create custom formatters to handle complex display needs:

```javascript
{
    title: "Status",
    field: "status",
    formatter: function(cell, formatterParams) {
        var value = cell.getValue();
        
        if(value > 75) {
            return "<span style='color:green; font-weight:bold;'>" + value + "%</span>";
        } else if(value > 25) {
            return "<span style='color:orange;'>" + value + "%</span>";
        } else {
            return "<span style='color:red;'>" + value + "%</span>";
        }
    }
}
```

## Row Edit Mode

### Cell Editors

Specify editors in column definitions:

```javascript
// Basic text input
{title: "Name", field: "name", editor: "input"}

// Multi-line text input
{title: "Description", field: "desc", editor: "textarea"}

// Numeric input with step controls
{
    title: "Age", 
    field: "age", 
    editor: "number",
    editorParams: {
        min: 0,
        max: 100,
        step: 1
    }
}

// Select dropdown
{
    title: "Status", 
    field: "status", 
    editor: "select",
    editorParams: {
        values: ["Active", "Inactive", "Pending"]
    }
}

// Date editor
{
    title: "Birth Date", 
    field: "dob", 
    editor: "date",
    editorParams: {
        format: "YYYY-MM-DD"
    }
}

// Checkbox
{
    title: "Approved", 
    field: "approved", 
    editor: "tickCross",
    formatter: "tickCross"
}
```

### Editor Parameters

Common editor parameters:

```javascript
editorParams: {
    // For select editors
    values: ["Option 1", "Option 2"],  // Array of values
    // OR object of value:label pairs
    values: {
        "opt1": "Option 1",
        "opt2": "Option 2"
    },
    
    // For numeric inputs
    min: 0,
    max: 100,
    step: 1,
    
    // For dates
    format: "YYYY-MM-DD",
    
    // Editor behavior
    elementAttributes: {
        maxlength: "10"  // HTML attributes for the editor
    },
    verticalNavigation: "editor", // How arrow keys work (editor/table)
    mask: "(###) ###-####" // Input mask for formatted input
}
```

### Row Edit Events

```javascript
// Detect cell editing starting
table.on("cellEditing", function(cell) {
    console.log("Editing started on cell:", cell.getField());
});

// Detect when cell editing is completed
table.on("cellEdited", function(cell) {
    var field = cell.getField();
    var value = cell.getValue();
    var row = cell.getRow();
    var data = row.getData();
    
    console.log("Cell edited:", field, "New value:", value);
    console.log("Row data:", data);
});

// Detect when cell editing is cancelled
table.on("cellEditCancelled", function(cell) {
    console.log("Edit cancelled for cell:", cell.getField());
});
```

### Saving to Server

Manual saving on edit:

```javascript
table.on("cellEdited", function(cell) {
    var row = cell.getRow();
    var data = row.getData();
    
    // Show loading indicator
    row.getElement().style.backgroundColor = "#FFFFDD";
    
    // Send data to server
    fetch('update.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if(result.success) {
            // Success indication
            row.getElement().style.backgroundColor = "";
        } else {
            // Error handling
            cell.restoreOldValue();
            row.getElement().style.backgroundColor = "";
            alert("Error: " + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        cell.restoreOldValue();
        row.getElement().style.backgroundColor = "";
    });
});
```

Batch saving with button:

```javascript
document.getElementById("save-button").addEventListener("click", function() {
    // Get all data or just changed data
    var data = table.getData();
    
    // Send to server
    fetch('batch-update.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if(result.success) {
            alert("Data saved successfully!");
        } else {
            alert("Error: " + result.message);
        }
    });
});
```

## Validation

### Column Validation

Add validators to column definitions:

```javascript
{
    title: "Email",
    field: "email",
    editor: "input",
    validator: ["required", "email"]
}

{
    title: "Age",
    field: "age",
    editor: "number",
    validator: ["required", "min:18", "max:65", "integer"]
}

{
    title: "Website",
    field: "website",
    editor: "input",
    validator: "url"
}

{
    title: "Username",
    field: "username",
    editor: "input",
    validator: ["required", {type:"regex", regex:"^[A-Za-z0-9_]{3,15}$"}]
}
```

### Custom Validators

```javascript
{
    title: "Password",
    field: "password",
    editor: "input",
    validator: function(cell, value, parameters) {
        // Must contain at least one number, one uppercase letter,
        // one lowercase letter, and be at least 8 characters
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
    }
}
```

### Validation Methods

```javascript
// Validate an entire table
table.validate()
  .then(function(valid) {
      if(valid === true) {
          console.log("All data is valid");
      } else {
          console.log("Data validation failed:", valid);
      }
  });

// Validate a specific row
row.validate()
  .then(function(valid) {
      if(valid === true) {
          console.log("Row is valid");
      } else {
          console.log("Row validation failed:", valid);
      }
  });

// Validate a specific cell
cell.validate()
  .then(function(valid) {
      if(valid === true) {
          console.log("Cell is valid");
      } else {
          console.log("Cell validation failed:", valid);
      }
  });
```

### Validation Events

```javascript
// Listen for validation failures
table.on("validationFailed", function(cell, value, validators) {
    console.log("Validation failed for cell:", cell.getField());
    console.log("Value:", value);
    console.log("Failed validators:", validators);
    
    // Show custom error message
    alert("Invalid data: " + value + " in " + cell.getField());
});
```

## Server-side Operations

### AJAX Data Loading

```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "data.php",         // URL for data
    ajaxConfig: "POST",          // Request method
    ajaxContentType: "json",     // Request content type
    ajaxURLGenerator: function(url, config, params) {
        // Customize the URL based on parameters
        return url + "?page=" + params.page;
    },
    ajaxParams: {token: "ABC123"}, // Additional parameters
    ajaxResponse: function(url, params, response) {
        // Process the server response
        return response.data; // Return the data array
    },
    paginationSize: 20,
    pagination: true
});
```

### Server-side Filtering

```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "data.php",
    filterMode: "remote",  // Send filters to server
    columns: [
        {
            title: "Name", 
            field: "name", 
            headerFilter: true
        },
        {
            title: "Age", 
            field: "age", 
            headerFilter: "number", 
            headerFilterPlaceholder: "Min Age",
            headerFilterParams: {
                min: 0,
                max: 100
            }
        }
    ]
});

// The filter parameters sent to server will look like:
// [
//   {field: "name", type: "like", value: "John"}
//   {field: "age", type: ">", value: 25}
// ]
```

### Server-side Sorting

```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "data.php",
    ajaxSorting: true,  // Send sort info to server
    columns: [
        {title: "Name", field: "name", sorter: "string"},
        {title: "Age", field: "age", sorter: "number"}
    ]
});

// The sort parameters sent to server will look like:
// [
//   {column: "age", dir: "desc"}
// ]
```

### Server-side Pagination

```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "data.php",
    pagination: true,
    paginationMode: "remote",    // Remote pagination
    paginationSize: 10,          // Rows per page
    paginationSizeSelector: [5, 10, 20, 50, 100],  // Page size options
    ajaxParams: {                // Additional parameters
        customParam: "value"
    },
    paginationDataSent: {        // Parameter names
        page: "pageNum",         // Page number parameter name
        size: "pageSize"         // Page size parameter name
    },
    paginationDataReceived: {    // Response property names
        last_page: "totalPages", // Total pages property name
        data: "rows"             // Data property name
    }
});
```

### PHP Server-side Example

```php
<?php
// Server-side handler example (data.php)

// Database connection
$db = new PDO("mysql:host=localhost;dbname=mydatabase", "username", "password");

// Get pagination parameters
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$size = isset($_GET['size']) ? intval($_GET['size']) : 10;
$offset = ($page - 1) * $size;

// Get filter parameters (if any)
$filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];
$whereClause = "";
$params = [];

if (!empty($filters)) {
    $whereConditions = [];
    foreach ($filters as $filter) {
        $field = $filter['field'];
        $type = $filter['type'];
        $value = $filter['value'];
        
        switch ($type) {
            case "=":
            case "<":
            case ">":
            case "<=":
            case ">=":
                $whereConditions[] = "$field $type ?";
                $params[] = $value;
                break;
            case "like":
                $whereConditions[] = "$field LIKE ?";
                $params[] = "%$value%";
                break;
            case "in":
                $inParams = array_fill(0, count($value), '?');
                $whereConditions[] = "$field IN (" . implode(',', $inParams) . ")";
                $params = array_merge($params, $value);
                break;
        }
    }
    
    if (!empty($whereConditions)) {
        $whereClause = "WHERE " . implode(' AND ', $whereConditions);
    }
}

// Get sort parameters (if any)
$sorters = isset($_GET['sorters']) ? json_decode($_GET['sorters'], true) : [];
$orderClause = "";

if (!empty($sorters)) {
    $orderParts = [];
    foreach ($sorters as $sorter) {
        $column = $sorter['column'];
        $dir = $sorter['dir'];
        $orderParts[] = "$column " . ($dir === "desc" ? "DESC" : "ASC");
    }
    
    if (!empty($orderParts)) {
        $orderClause = "ORDER BY " . implode(', ', $orderParts);
    }
}

// Count total rows for pagination
$countStmt = $db->prepare("SELECT COUNT(*) FROM users $whereClause");
if (!empty($params)) {
    foreach ($params as $i => $param) {
        $countStmt->bindValue($i + 1, $param);
    }
}
$countStmt->execute();
$totalRows = $countStmt->fetchColumn();
$totalPages = ceil($totalRows / $size);

// Build and execute the main query
$query = "SELECT * FROM users $whereClause $orderClause LIMIT $offset, $size";
$stmt = $db->prepare($query);
if (!empty($params)) {
    foreach ($params as $i => $param) {
        $stmt->bindValue($i + 1, $param);
    }
}
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Send JSON response
header('Content-Type: application/json');
echo json_encode([
    'last_page' => $totalPages,
    'data' => $data
]);
```

## Observability

### Events

Subscribe to events to monitor table behavior:

```javascript
// Table initialization
table.on("tableBuilding", function() {
    console.log("Table is being built");
});

table.on("tableBuilt", function() {
    console.log("Table has been built");
});

// Data events
table.on("dataLoading", function(url, params) {
    console.log("Data loading", url, params);
});

table.on("dataLoaded", function(data) {
    console.log("Data has been loaded", data);
});

table.on("dataProcessed", function(data) {
    console.log("Data has been processed", data);
});

table.on("dataChanged", function(data) {
    console.log("Data has been changed", data);
});

// Row events
table.on("rowClick", function(e, row) {
    console.log("Row clicked:", row.getData());
});

table.on("rowDblClick", function(e, row) {
    console.log("Row double-clicked:", row.getData());
});

table.on("rowContext", function(e, row) {
    console.log("Row right-clicked:", row.getData());
});

table.on("rowAdded", function(row) {
    console.log("Row added:", row.getData());
});

table.on("rowDeleted", function(row) {
    console.log("Row deleted");
});

table.on("rowMoved", function(row) {
    console.log("Row moved:", row.getData());
});

// Cell events
table.on("cellClick", function(e, cell) {
    console.log(
        "Cell clicked:",
        cell.getField(), 
        "Value:", 
        cell.getValue()
    );
});

table.on("cellEditing", function(cell) {
    console.log("Cell editing started:", cell.getField());
});

table.on("cellEdited", function(cell) {
    console.log(
        "Cell edited:", 
        cell.getField(), 
        "New value:", 
        cell.getValue()
    );
});

// Filtering events
table.on("dataFiltering", function(filters) {
    console.log("Filters being applied:", filters);
});

table.on("dataFiltered", function(filters, rows) {
    console.log(
        "Data filtered with", 
        filters, 
        "Resulting in", 
        rows.length, 
        "rows"
    );
});

// Sorting events
table.on("dataSorting", function(sorters) {
    console.log("Data being sorted:", sorters);
});

table.on("dataSorted", function(sorters, rows) {
    console.log("Data sorted with", sorters);
});

// Pagination events
table.on("pageLoaded", function(pageno) {
    console.log("Page", pageno, "loaded");
});

// Validation events
table.on("validationFailed", function(cell, value, validators) {
    console.log(
        "Validation failed for", 
        cell.getField(), 
        "value:", 
        value, 
        "validators:", 
        validators
    );
});
```

### Debug Mode

Enable debug mode to get detailed console output:

```javascript
var table = new Tabulator("#example-table", {
    debugInvalidOptions: true,
    debugInvalidComponentFuncs: true,
    debugInitialLoad: true,
    debugDeprecation: true,
    columns: [
        // ... column definitions
    ]
});
```

### Data Tracking

Track row additions and changes:

```javascript
// Create variables to track changes
var changedRows = {};
var newRows = [];
var deletedRows = [];

// Track edits
table.on("cellEdited", function(cell) {
    var row = cell.getRow();
    var id = row.getData().id;
    
    if(!changedRows[id]) {
        changedRows[id] = {
            id: id,
            changes: {}
        };
    }
    
    changedRows[id].changes[cell.getField()] = cell.getValue();
});

// Track additions
table.on("rowAdded", function(row) {
    var data = row.getData();
    
    // If row doesn't have an ID, it's a new row
    if(!data.id) {
        newRows.push(data);
    }
});

// Track deletions
table.on("rowDeleted", function(row) {
    var id = row.getData().id;
    
    if(id) {
        deletedRows.push(id);
    }
});

// Get all changes in one operation
function getAllChanges() {
    return {
        updated: Object.values(changedRows),
        created: newRows,
        deleted: deletedRows
    };
}

// Reset tracking
function resetChangeTracking() {
    changedRows = {};
    newRows = [];
    deletedRows = [];
}
```

### Data History

Implement undo/redo functionality:

```javascript
// Stack for storing history
var history = [];
var historyIndex = -1;
var maxHistory = 50;

// Listen for edits
table.on("cellEdited", function(cell) {
    var row = cell.getRow();
    var field = cell.getField();
    var oldValue = cell.getOldValue();
    var newValue = cell.getValue();
    
    // Add to history
    addToHistory({
        type: "edit",
        rowId: row.getData().id,
        field: field,
        oldValue: oldValue,
        newValue: newValue
    });
});

// Add changes to history
function addToHistory(change) {
    // Remove any redo history
    if(historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    
    // Add to history
    history.push(change);
    
    // Limit history size
    if(history.length > maxHistory) {
        history.shift();
    }
    
    historyIndex = history.length - 1;
}

// Undo function
function undo() {
    if(historyIndex >= 0) {
        var change = history[historyIndex];
        
        if(change.type === "edit") {
            var row = table.getRow(change.rowId);
            if(row) {
                row.getCell(change.field).setValue(change.oldValue);
            }
        }
        // Handle other change types as needed
        
        historyIndex--;
        return true;
    }
    return false;
}

// Redo function
function redo() {
    if(historyIndex < history.length - 1) {
        historyIndex++;
        var change = history[historyIndex];
        
        if(change.type === "edit") {
            var row = table.getRow(change.rowId);
            if(row) {
                row.getCell(change.field).setValue(change.newValue);
            }
        }
        // Handle other change types as needed
        
        return true;
    }
    return false;
}

// Add keyboard shortcuts
document.addEventListener("keydown", function(e) {
    if(e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
    } else if(e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
    }
});
```

---

This reference guide covers the main features of Tabulator 6.3. For complete documentation, see the [official Tabulator docs](https://tabulator.info/docs/6.3).
