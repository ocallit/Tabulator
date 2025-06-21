# Tabulator.js 6.3 - Ultimate Ninja Reference Guide

The definitive reference for mastering Tabulator.js 6.3 - from basic initialization to advanced server-side integration, reactive data, and comprehensive event handling.

## Table of Contents
- [Quick Start & Installation](#quick-start--installation)
- [Table Initialization & Complete Setup Options](#table-initialization--complete-setup-options)
- [Column Definition - Complete Reference](#column-definition---complete-reference)
- [Formatters - Built-in & Custom](#formatters---built-in--custom)
- [Validators - Built-in & Custom](#validators---built-in--custom)
- [Reactive Data - Complete Guide](#reactive-data---complete-guide)
- [AJAX & Server-Side Operations](#ajax--server-side-operations)
- [Filtering & Sorting](#filtering--sorting)
- [Events - Complete Reference](#events---complete-reference)
- [Advanced Patterns & Best Practices](#advanced-patterns--best-practices)

## Quick Start & Installation

### CDN Installation
```html
<!-- Latest Version -->
<link href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js"></script>

<!-- Auto-updating to latest -->
<link href="https://unpkg.com/tabulator-tables/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables/dist/js/tabulator.min.js"></script>
```

### ES6 Module Import
```javascript
// Full library with all modules
import {TabulatorFull as Tabulator} from 'tabulator-tables';

// Core library only (120kb)
import {Tabulator} from 'tabulator-tables';

// ESM from CDN
import {Tabulator} from 'https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator_esm.min.mjs';
```

### NPM Installation
```bash
npm install tabulator-tables
yarn add tabulator-tables
```

## Table Initialization & Complete Setup Options

### Basic Initialization
```javascript
var table = new Tabulator("#example-table", {
    height: "400px",
    data: tableData,
    columns: columns,
    // ... other options
});
```

### Complete Setup Options Reference

#### Core Table Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | string/number | - | Table height (triggers virtual DOM) |
| `minHeight` | number | - | Minimum table height |
| `maxHeight` | number | - | Maximum table height |
| `width` | string/number | - | Table width |
| `data` | array | [] | Initial data array |
| `ajaxURL` | string | - | URL for AJAX data loading |
| `columns` | array | [] | Column definitions |
| `autoColumns` | boolean | false | Auto-generate columns from data |
| `layout` | string | "fitData" | Column layout mode |
| `layoutColumnsOnNewData` | boolean | false | Recalculate column layout on new data |
| `responsiveLayout` | string/boolean | false | Responsive column handling |
| `responsiveLayoutCollapseStartOpen` | boolean | true | Start with responsive columns open |
| `responsiveLayoutCollapseUseFormatters` | boolean | true | Use formatters in collapsed view |
| `columnDefaults` | object | {} | Default properties for all columns |
| `locale` | boolean/string | false | Localization settings |
| `langs` | object | {} | Language definitions |
| `textDirection` | string | "auto" | Text direction (ltr/rtl/auto) |

#### Data & Loading Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ajaxConfig` | string/object | "GET" | AJAX request configuration |
| `ajaxContentType` | string | "form" | Content type for AJAX requests |
| `ajaxParams` | object | {} | Additional AJAX parameters |
| `ajaxParamsFunc` | function | - | Dynamic AJAX parameters |
| `ajaxHeaders` | object | {} | AJAX request headers |
| `ajaxRequesting` | function | - | Callback before AJAX request |
| `ajaxResponse` | function | - | Process AJAX response |
| `ajaxError` | function | - | Handle AJAX errors |
| `ajaxURLGenerator` | function | - | Generate custom AJAX URLs |
| `ajaxRequestFunc` | function | - | Replace built-in AJAX function |
| `ajaxLoader` | boolean/function | true | Show loading overlay |
| `ajaxLoaderLoading` | string | "Loading..." | Loading message |
| `ajaxLoaderError` | string | "Error..." | Error message |
| `dataLoader` | boolean | true | Enable data loading |
| `dataLoaderLoading` | string | "Loading Data" | Loading text |
| `dataLoaderError` | string | "Unable to load data" | Error text |
| `progressiveLoad` | string | false | Progressive loading mode |
| `progressiveLoadDelay` | number | 0 | Delay between progressive loads |
| `progressiveLoadScrollMargin` | number | 0 | Scroll margin for progressive load |

#### Reactivity Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reactiveData` | boolean | false | **Enable reactive data binding** |
| `nestedFieldSeparator` | string | "." | Separator for nested field access |

#### Tree view
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dataTree` | boolean | false | Enable tree data structure |
| `dataTreeElementColumn` | string/boolean | - | Column to show tree elements |
| `dataTreeBranchElement` | string/boolean | - | Branch element for tree |
| `dataTreeChildIndent` | number | 9 | Indentation for child rows |
| `dataTreeChildField` | string | "_children" | Field containing child data |
| `dataTreeCollapseElement` | string/boolean | - | Collapse element |
| `dataTreeExpandElement` | string/boolean | - | Expand element |
| `dataTreeStartExpanded` | boolean/array/function | false | Start with expanded rows |

#### Pagination Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination` | boolean/string | false | Enable pagination |
| `paginationMode` | string | "local" | Pagination mode (local/remote) |
| `paginationSize` | number | 10 | Rows per page |
| `paginationSizeSelector` | array/boolean | false | Page size options |
| `paginationElement` | DOM element | - | Custom pagination element |
| `paginationDataSent` | object | {} | Parameter names for server |
| `paginationDataReceived` | object | {} | Response property names |
| `paginationAddRow` | string | "page" | Where to add new rows |
| `paginationButtonCount` | number | 5 | Number of pagination buttons |
| `paginationCounter` | string | "rows" | Pagination counter type |

#### Sorting Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialSort` | array | [] | Initial sort configuration |
| `sortOrderReverse` | boolean | false | Reverse sort order |
| `headerSort` | boolean | true | Enable header sorting |
| `headerSortTristate` | boolean | false | Enable tri-state sorting |

#### Filtering Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialFilter` | array | [] | Initial filters |
| `initialHeaderFilter` | array | [] | Initial header filters |
| `headerFilterLiveFilterDelay` | number | 300 | Header filter delay |
| `headerFilterPlaceholder` | string | false | Default header filter placeholder |

#### Row Selection Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectable` | boolean/number | true | Row selection mode |
| `selectableRangeMode` | string | "drag" | Range selection mode |
| `selectableRollingSelection` | boolean | true | Rolling selection |
| `selectablePersistence` | boolean | true | Persist selection on data change |
| `selectableCheck` | function | - | Check if row is selectable |

#### Row Grouping Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `groupBy` | string/array/function | false | Group rows by field(s) |
| `groupStartOpen` | boolean/array/function | true | Start with groups open |
| `groupValues` | array | [] | Group value order |
| `groupHeader` | function | - | Custom group header |
| `groupHeaderPrint` | function | - | Group header for printing |
| `groupHeaderClipboard` | function | - | Group header for clipboard |
| `groupHeaderHtmlOutput` | function | - | Group header for HTML output |
| `groupHeaderDownload` | function | - | Group header for downloads |
| `groupToggleElement` | string/boolean | "arrow" | Group toggle element |
| `groupClosedShowCalcs` | boolean | false | Show calcs when group closed |

#### Movable Rows Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `movableRows` | boolean | false | Enable row movement |
| `movableRowsConnectedTables` | array | [] | Connected tables for row movement |
| `movableRowsSender` | function | - | Sender validation function |
| `movableRowsReceiver` | function | - | Receiver validation function |
| `movableRowsConnectedElements` | string | - | Connected elements |
| `movableRowsElementDrop` | function | - | Element drop callback |

#### Download Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `downloadDataFormatter` | function | - | Format data for download |
| `downloadReady` | function | - | Download ready callback |
| `downloadComplete` | function | - | Download complete callback |
| `downloadConfig` | object | {} | Download configuration |
| `downloadRowRange` | string | "active" | Row range for download |

#### Clipboard Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clipboard` | boolean/string | false | Enable clipboard functionality |
| `clipboardCopyRowRange` | string | "active" | Row range for copy |
| `clipboardCopyFormatter` | string | "table" | Copy formatter |
| `clipboardCopyConfig` | object | {} | Copy configuration |
| `clipboardPasteParser` | string | "table" | Paste parser |
| `clipboardPasteAction` | string | "insert" | Paste action |

#### Print Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `printAsHtml` | boolean | false | Print as HTML |
| `printFormatter` | function | - | Print formatter |
| `printHeader` | string | - | Print header |
| `printFooter` | string | - | Print footer |
| `printCopyStyle` | boolean | true | Copy styles when printing |
| `printVisibleRows` | boolean | true | Print only visible rows |
| `printRowRange` | string | "active" | Row range for printing |
| `printConfig` | object | {} | Print configuration |

#### Validation Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `validationMode` | string | "blocking" | Validation mode (blocking/highlight/manual) |

#### History Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `history` | boolean | false | Enable undo/redo history |

#### Persistence Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `persistence` | boolean/object | false | Enable state persistence |
| `persistenceID` | string | - | Unique ID for persistence |
| `persistenceMode` | string | "local" | Persistence mode |
| `persistentLayout` | boolean | false | Persist layout |
| `persistentSort` | boolean | false | Persist sorting |
| `persistentFilter` | boolean | false | Persist filters |

#### Placeholder Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string/DOM element/function | - | Placeholder for empty table |
| `placeholderHeaderFilter` | string | - | Header filter placeholder |

#### Row Formatting Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rowFormatter` | function | - | Format entire rows |
| `addRowPos` | string | "bottom" | Position for new rows |
| `rowHeight` | number | - | Fixed row height |
| `resizableRows` | boolean | false | Enable row resizing |

#### Debug Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debugInvalidOptions` | boolean | false | Debug invalid options |
| `debugInvalidComponentFuncs` | boolean | false | Debug invalid component functions |
| `debugInitialLoad` | boolean | false | Debug initial load |
| `debugDeprecation` | boolean | false | Debug deprecated features |

## Column Definition - Complete Reference

### Basic Column Structure
```javascript
columns: [
    {
        title: "Name",              // Column header text
        field: "name",              // Data field key
        width: 150,                 // Fixed width in pixels
        // ... other properties
    }
]
```

### Complete Column Properties

#### Basic Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | - | Column header text |
| `field` | string | - | Data field in row objects |
| `visible` | boolean | true | Column visibility |
| `cssClass` | string | - | CSS class for cells |

#### Width & Layout Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | number | - | Fixed width in pixels |
| `widthGrow` | number | 1 | Column growth factor |
| `widthShrink` | number | 1 | Column shrink factor |
| `minWidth` | number | 40 | Minimum width |
| `maxWidth` | number | - | Maximum width |
| `resizable` | boolean | true | Allow column resizing |
| `frozen` | boolean/string | false | Freeze column (true/"left"/"right") |
| `responsive` | number | 1 | Responsive priority (higher = hidden sooner) |

#### Alignment & Display Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hozAlign` | string | - | Horizontal alignment (left/center/right) |
| `vertAlign` | string | - | Vertical alignment (top/middle/bottom) |
| `headerHozAlign` | string | - | Header horizontal alignment |
| `headerVertAlign` | string | - | Header vertical alignment |
| `headerVertical` | boolean/string | false | Vertical header text (true/false/"flip") |
| `variableHeight` | boolean | false | Variable cell height |

#### Formatting Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `formatter` | string/function | "plaintext" | Cell formatter |
| `formatterParams` | object/function | - | Formatter parameters |
| `titleFormatter` | string/function | - | Title formatter |
| `titleFormatterParams` | object/function | - | Title formatter parameters |

#### Header Properties
| Property | Type | Default | Description                                                           |
|----------|------|---------|-----------------------------------------------------------------------|
| `headerSort` | boolean | true | Enable header sorting                                                 |
| `headerSortStartingDir` | string | "asc" | Starting sort direction                                               |
| `headerSortTristate` | boolean | false | Enable tri-state sorting                                              |
| `headerTooltip` | string/function/boolean | false | Header tooltip                                                        |
| `headerFilter` | string/function/boolean | false | Header filter                                                         |
| `headerFilterPlaceholder` | string | - | Header filter placeholder                                             |
| `headerFilterParams` | object | - | Header filter parameters                                              |
| `headerFilterEmptyCheck` | function | - | Check if filter is empty                                              |
| `headerFilterFunc` | string/function | - | Custom filter function                                                |
| `headerFilterFuncParams` | object | - | Filter function parameters                                            |
| `headerFilterLiveFilter` | boolean | true | Live filtering. * For custom filters set headerFilterLiveFilter:false |
| `headerMenu` | array/function | - | Header context menu                                                   |
| `headerClick` | function | - | Header click callback                                                 |
| `headerDblClick` | function | - | Header double-click callback                                          |
| `headerContext` | function | - | Header right-click callback                                           |

#### Editing Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `editor` | string/function/boolean | false | Cell editor |
| `editorParams` | object/function | - | Editor parameters |
| `editable` | boolean/function | true | Allow cell editing |
| `editableTitle` | boolean | false | Allow title editing |
| `validator` | string/array/function | - | Cell validation |

#### Interaction Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cellClick` | function | - | Cell click callback |
| `cellDblClick` | function | - | Cell double-click callback |
| `cellContext` | function | - | Cell right-click callback |
| `cellTap` | function | - | Cell tap callback (touch) |
| `cellDblTap` | function | - | Cell double-tap callback |
| `cellTapHold` | function | - | Cell tap-hold callback |
| `cellMouseEnter` | function | - | Cell mouse enter callback |
| `cellMouseLeave` | function | - | Cell mouse leave callback |
| `tooltip` | string/function/boolean | false | Cell tooltip |
| `contextMenu` | array/function | - | Cell context menu |
| `clickMenu` | array/function | - | Cell click menu |

#### Sorting Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sorter` | string/function | "string" | Sort function |
| `sorterParams` | object | - | Sorter parameters |

#### Calculation Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `topCalc` | string/function | - | Top calculation |
| `topCalcParams` | object | - | Top calculation parameters |
| `topCalcFormatter` | string/function | - | Top calculation formatter |
| `topCalcFormatterParams` | object | - | Top calc formatter params |
| `bottomCalc` | string/function | - | Bottom calculation |
| `bottomCalcParams` | object | - | Bottom calculation parameters |
| `bottomCalcFormatter` | string/function | - | Bottom calculation formatter |
| `bottomCalcFormatterParams` | object | - | Bottom calc formatter params |

#### Data Processing Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mutator` | function | - | Incoming data mutator |
| `mutatorParams` | object | - | Mutator parameters |
| `mutatorData` | function | - | Outgoing data mutator |
| `mutatorDataParams` | object | - | Data mutator parameters |
| `mutatorEdit` | function | - | Edit data mutator |
| `mutatorEditParams` | object | - | Edit mutator parameters |
| `mutatorClipboard` | function | - | Clipboard data mutator |
| `mutatorClipboardParams` | object | - | Clipboard mutator parameters |
| `accessor` | function | - | Data accessor |
| `accessorParams` | object | - | Accessor parameters |
| `accessorDownload` | function | - | Download data accessor |
| `accessorDownloadParams` | object | - | Download accessor parameters |
| `accessorClipboard` | function | - | Clipboard data accessor |
| `accessorClipboardParams` | object | - | Clipboard accessor parameters |
| `accessorPrint` | function | - | Print data accessor |
| `accessorPrintParams` | object | - | Print accessor parameters |
| `accessorHtmlOutput` | function | - | HTML output accessor |
| `accessorHtmlOutputParams` | object | - | HTML accessor parameters |

#### Output Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `download` | boolean | true | Include in downloads |
| `titleDownload` | string | - | Download title |
| `clipboard` | boolean | true | Include in clipboard |
| `print` | boolean | true | Include in print |
| `titlePrint` | string | - | Print title |
| `htmlOutput` | boolean | true | Include in HTML output |

#### Row Handling Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rowHandle` | boolean | false | Row handle for moving |

#### Cell Events Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cellEditing` | function | - | Cell editing start callback |
| `cellEdited` | function | - | Cell edited callback |
| `cellEditCancelled` | function | - | Cell edit cancelled callback |

## Formatters - Built-in & Custom

### All Built-in Formatters

| Formatter | Description | Parameters |
|-----------|-------------|------------|
| `plaintext` | Default - escaped text | None |
| `textarea` | Text with carriage returns | None |
| `html` | Display HTML content | None |
| `money` | Currency formatting | `symbol`, `precision`, `thousand`, `decimal` |
| `image` | Display image from URL | `height`, `width`, `urlPrefix`, `urlSuffix` |
| `link` | Display hyperlink | `url`, `target`, `labelField`, `urlField`, `urlPrefix` |
| `datetime` | Format date/time | `inputFormat`, `outputFormat`, `invalidPlaceholder`, `timezone` |
| `datetimediff` | Date difference | `inputFormat`, `date`, `units`, `humanize`, `suffix` |
| `tickCross` | Green tick/red cross | `allowEmpty`, `allowTruthy`, `tickElement`, `crossElement` |
| `star` | Star rating display | `stars` (default: 5) |
| `progress` | Progress bar | `min`, `max`, `color`, `legend`, `legendColor`, `legendAlign` |
| `progressBar` | Alias for progress | Same as progress |
| `color` | Color swatch | None |
| `buttonTick` | Tick icon button | None |
| `buttonCross` | Cross icon button | None |
| `rownum` | Row number | None |
| `handle` | Drag handle | None |
| `rowSelection` | Selection checkboxes | None |
| `responsiveCollapse` | Responsive collapse control | None |
| `email` | Email link | None |
| `lookup` | Value lookup | `lookupObj` |
| `traffic` | Traffic light indicator | None |
| `number` | Number formatting | `precision`, `thousand`, `decimal` |
| `array` | Array with separator | `separator` (default: ",") |
| `file` | File icon by extension | None |
| `json` | Pretty print JSON | None |
| `adaptable` | Auto-select formatter | `formatterLookup`, `paramsLookup` |

### Formatter Examples

#### Money Formatter
```javascript
{
    title: "Price", 
    field: "price", 
    formatter: "money",
    formatterParams: {
        symbol: "$",
        precision: 2,
        thousand: ",",
        decimal: "."
    }
}
```

#### DateTime Formatter
```javascript
{
    title: "Created", 
    field: "created_at", 
    formatter: "datetime",
    formatterParams: {
        inputFormat: "yyyy-MM-dd HH:mm:ss",
        outputFormat: "dd/MM/yyyy",
        invalidPlaceholder: "(invalid date)",
        timezone: "America/Los_Angeles"
    }
}
```

#### Progress Formatter
```javascript
{
    title: "Progress", 
    field: "completion", 
    formatter: "progress",
    formatterParams: {
        min: 0,
        max: 100,
        color: ["red", "orange", "green"],
        legend: true,
        legendColor: "#000000",
        legendAlign: "center"
    }
}
```

#### Image Formatter
```javascript
{
    title: "Avatar", 
    field: "photo", 
    formatter: "image",
    formatterParams: {
        height: "50px",
        width: "50px",
        urlPrefix: "https://images.mysite.com/",
        urlSuffix: ".jpg"
    }
}
```

### Custom Formatters

#### Simple Custom Formatter
```javascript
{
    title: "Status",
    field: "status",
    formatter: function(cell, formatterParams, onRendered) {
        var value = cell.getValue();
        var row = cell.getRow().getData();
        
        if(value === "active") {
            return "<span style='color:green; font-weight:bold;'>✓ Active</span>";
        } else if(value === "pending") {
            return "<span style='color:orange;'>⏳ Pending</span>";
        } else {
            return "<span style='color:red;'>✗ Inactive</span>";
        }
    }
}
```

#### Advanced Custom Formatter with DOM Elements
```javascript
{
    title: "Actions",
    field: "actions",
    formatter: function(cell, formatterParams, onRendered) {
        var container = document.createElement("div");
        container.style.display = "flex";
        container.style.gap = "5px";
        
        var editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.className = "btn btn-sm btn-primary";
        editBtn.onclick = function() {
            var row = cell.getRow();
            console.log("Edit row:", row.getData());
        };
        
        var deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.className = "btn btn-sm btn-danger";
        deleteBtn.onclick = function() {
            var row = cell.getRow();
            if(confirm("Delete this row?")) {
                row.delete();
            }
        };
        
        container.appendChild(editBtn);
        container.appendChild(deleteBtn);
        
        return container;
    },
    width: 120,
    hozAlign: "center"
}
```

### Global Formatter Extension
```javascript
// Add custom formatters globally
Tabulator.extendModule("format", "formatters", {
    uppercase: function(cell, formatterParams) {
        return (cell.getValue() || "").toString().toUpperCase();
    },
    
    badge: function(cell, formatterParams) {
        var value = cell.getValue();
        var color = formatterParams.color || "primary";
        return `<span class="badge badge-${color}">${value}</span>`;
    },
    
    currency: function(cell, formatterParams) {
        var value = parseFloat(cell.getValue()) || 0;
        var currency = formatterParams.currency || "USD";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(value);
    }
});

// Use the custom formatters
{title: "Name", field: "name", formatter: "uppercase"}
{title: "Status", field: "status", formatter: "badge", formatterParams: {color: "success"}}
{title: "Amount", field: "amount", formatter: "currency", formatterParams: {currency: "EUR"}}
```

## Validators - Built-in & Custom

### Validation Modes
```javascript
var table = new Tabulator("#example-table", {
    validationMode: "blocking",  // "blocking", "highlight", "manual"
    // ...
});
```

- **blocking**: User cannot leave cell until valid (default)
- **highlight**: Cell is highlighted but edit completes
- **manual**: No automatic validation, trigger manually

### All Built-in Validators

| Validator | Description | Usage Example |
|-----------|-------------|---------------|
| `required` | Not null or empty string | `validator: "required"` |
| `unique` | Unique within column | `validator: "unique"` |
| `integer` | Valid integer | `validator: "integer"` |
| `float` | Valid float | `validator: "float"` |
| `numeric` | Valid number | `validator: "numeric"` |
| `string` | Non-numeric string | `validator: "string"` |
| `alphanumeric` | Letters and numbers only | `validator: "alphanumeric"` |
| `email` | Valid email format | `validator: "email"` |
| `url` | Valid URL format | `validator: "url"` |
| `min` | Minimum value | `validator: "min:5"` |
| `max` | Maximum value | `validator: "max:100"` |
| `minLength` | Minimum string length | `validator: "minLength:3"` |
| `maxLength` | Maximum string length | `validator: "maxLength:50"` |
| `in` | Value in list | `validator: "in:red,green,blue"` |
| `regex` | Regular expression | `validator: {type:"regex", regex:"^[A-Z]+$"}` |

### Validator Usage Examples

#### Single Validator
```javascript
{title: "Email", field: "email", editor: "input", validator: "email"}
```

#### Multiple Validators
```javascript
{
    title: "Username", 
    field: "username", 
    editor: "input", 
    validator: ["required", "minLength:3", "maxLength:20", "alphanumeric"]
}
```

#### Validator with Parameters (Object Form)
```javascript
{
    title: "Age", 
    field: "age", 
    editor: "number", 
    validator: [
        "required",
        {type: "min", parameters: 18},
        {type: "max", parameters: 65},
        "integer"
    ]
}
```

#### Regular Expression Validator
```javascript
{
    title: "Phone", 
    field: "phone", 
    editor: "input", 
    validator: {
        type: "regex", 
        regex: "^\\+?[1-9]\\d{1,14}$"  // International phone format
    }
}
```

### Custom Validators

#### Simple Custom Validator
```javascript
{
    title: "Password",
    field: "password",
    editor: "input",
    validator: function(cell, value, parameters) {
        // Must contain at least one number, one uppercase, one lowercase, min 8 chars
        var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return pattern.test(value);
    }
}
```

#### Advanced Custom Validator with Error Messages
```javascript
{
    title: "Credit Card",
    field: "credit_card",
    editor: "input",
    validator: function(cell, value, parameters) {
        if(!value) return true; // Allow empty if not required
        
        // Remove spaces and check if numeric
        var cleanValue = value.replace(/\s/g, '');
        if(!/^\d+$/.test(cleanValue)) {
            return "Credit card must contain only numbers";
        }
        
        // Check length
        if(cleanValue.length < 13 || cleanValue.length > 19) {
            return "Credit card must be 13-19 digits";
        }
        
        // Luhn algorithm
        var sum = 0;
        var alternate = false;
        for(var i = cleanValue.length - 1; i >= 0; i--) {
            var n = parseInt(cleanValue.charAt(i), 10);
            if(alternate) {
                n *= 2;
                if(n > 9) n = (n % 10) + 1;
            }
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10) === 0 || "Invalid credit card number";
    }
}
```

#### Context-Aware Validator
```javascript
{
    title: "End Date",
    field: "end_date",
    editor: "date",
    validator: function(cell, value, parameters) {
        var rowData = cell.getRow().getData();
        var startDate = new Date(rowData.start_date);
        var endDate = new Date(value);
        
        if(endDate <= startDate) {
            return "End date must be after start date";
        }
        return true;
    }
}
```

### Global Validator Extension
```javascript
// Add custom validators globally
Tabulator.extendModule("validate", "validators", {
    strongPassword: function(cell, value, parameters) {
        var minLength = parameters.minLength || 8;
        var requireUpper = parameters.requireUpper !== false;
        var requireLower = parameters.requireLower !== false;
        var requireNumber = parameters.requireNumber !== false;
        var requireSpecial = parameters.requireSpecial !== false;
        
        if(value.length < minLength) return false;
        if(requireUpper && !/[A-Z]/.test(value)) return false;
        if(requireLower && !/[a-z]/.test(value)) return false;
        if(requireNumber && !/\d/.test(value)) return false;
        if(requireSpecial && !/[!@#$%^&*]/.test(value)) return false;
        
        return true;
    },
    
    businessEmail: function(cell, value, parameters) {
        var excludedDomains = parameters.excludedDomains || ['gmail.com', 'yahoo.com', 'hotmail.com'];
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!emailPattern.test(value)) return false;
        
        var domain = value.split('@')[1];
        return !excludedDomains.includes(domain.toLowerCase());
    }
});

// Usage
{
    title: "Password", 
    field: "password", 
    validator: ["required", "strongPassword"],
    validatorParams: {
        minLength: 10,
        requireSpecial: true
    }
}
```

### Validation Events
```javascript
// Listen for validation failures
table.on("validationFailed", function(cell, value, validators) {
    console.log("Validation failed for:", cell.getField());
    console.log("Value:", value);
    console.log("Failed validators:", validators);
    
    // Show custom error message
    var errorMessages = validators.map(v => {
        switch(v.type) {
            case "required": return "This field is required";
            case "email": return "Please enter a valid email";
            case "min": return `Value must be at least ${v.parameters}`;
            default: return `Invalid ${v.type}`;
        }
    });
    
    // Display error (you could use toast, modal, etc.)
    alert("Validation Error: " + errorMessages.join(", "));
});
```

### Manual Validation
```javascript
// Validate entire table
table.validate()
    .then(function(valid) {
        if(valid === true) {
            console.log("All data is valid");
            submitData();
        } else {
            console.log("Validation failed:", valid);
            highlightErrors(valid);
        }
    });

// Validate specific row
var row = table.getRow(1);
row.validate()
    .then(function(valid) {
        if(valid === true) {
            console.log("Row is valid");
        } else {
            console.log("Row validation failed:", valid);
        }
    });

// Validate specific cell
var cell = table.getCell(1, "email");
cell.validate()
    .then(function(valid) {
        if(valid === true) {
            console.log("Cell is valid");
        } else {
            console.log("Cell validation failed:", valid);
        }
    });
```

## Reactive Data - Complete Guide

### Enabling Reactive Data
```javascript
var tableData = [
    {id: 1, name: "John", age: 25},
    {id: 2, name: "Jane", age: 30}
];

var table = new Tabulator("#example-table", {
    reactiveData: true,  // Enable reactive data binding
    data: tableData,     // Pass your data array
    columns: [
        {title: "Name", field: "name"},
        {title: "Age", field: "age"}
    ]
});
```

### Reactive Data Operations

#### Adding Data Reactively
```javascript
// Add new row - table automatically updates
tableData.push({id: 3, name: "Bob", age: 35});

// Add multiple rows
tableData.push(
    {id: 4, name: "Alice", age: 28},
    {id: 5, name: "Charlie", age: 32}
);
```

#### Updating Data Reactively
```javascript
// Update existing row data - table automatically reflects changes
tableData[0].name = "John Updated";
tableData[0].age = 26;

// Or find and update
var john = tableData.find(row => row.id === 1);
if(john) {
    john.name = "John Smith";
}
```

#### Removing Data Reactively
```javascript
// Remove by index
tableData.splice(0, 1);  // Remove first row

// Remove by condition
var indexToRemove = tableData.findIndex(row => row.id === 2);
if(indexToRemove !== -1) {
    tableData.splice(indexToRemove, 1);
}

// Filter out items
var originalLength = tableData.length;
tableData = tableData.filter(row => row.age >= 30);
// Note: You need to reassign if creating new array
if(tableData.length !== originalLength) {
    table.setData(tableData);
}
```

#### Reactive Data with Nested Objects
```javascript
var complexData = [
    {
        id: 1, 
        user: {name: "John", email: "john@email.com"}, 
        stats: {views: 100, clicks: 25}
    }
];

var table = new Tabulator("#example-table", {
    reactiveData: true,
    data: complexData,
    nestedFieldSeparator: ".",  // Enable nested field access
    columns: [
        {title: "Name", field: "user.name"},
        {title: "Email", field: "user.email"},
        {title: "Views", field: "stats.views"},
        {title: "Clicks", field: "stats.clicks"}
    ]
});

// Update nested data reactively
complexData[0].user.name = "John Updated";
complexData[0].stats.views = 150;
```

### Framework Integration Examples

#### Vue.js 3 Composition API
```javascript
<template>
    <div>
        <button @click="addRow">Add Row</button>
        <button @click="updateFirst">Update First Row</button>
        <button @click="removeFirst">Remove First Row</button>
        <div ref="tableElement"></div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

const tableElement = ref(null);
const table = ref(null);
const tableData = reactive([
    {id: 1, name: "John", age: 25},
    {id: 2, name: "Jane", age: 30}
]);

onMounted(() => {
    table.value = new Tabulator(tableElement.value, {
        reactiveData: true,
        data: tableData,
        columns: [
            {title: "ID", field: "id"},
            {title: "Name", field: "name"},
            {title: "Age", field: "age"}
        ]
    });
});

const addRow = () => {
    tableData.push({
        id: Date.now(),
        name: `User ${tableData.length + 1}`,
        age: Math.floor(Math.random() * 50) + 20
    });
};

const updateFirst = () => {
    if(tableData.length > 0) {
        tableData[0].name = `Updated ${Date.now()}`;
    }
};

const removeFirst = () => {
    if(tableData.length > 0) {
        tableData.splice(0, 1);
    }
};
</script>
```

#### React with useState
```javascript
import React, { useState, useEffect, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

function ReactiveTableComponent() {
    const tableRef = useRef(null);
    const tabulator = useRef(null);
    const [tableData, setTableData] = useState([
        {id: 1, name: "John", age: 25},
        {id: 2, name: "Jane", age: 30}
    ]);

    useEffect(() => {
        tabulator.current = new Tabulator(tableRef.current, {
            reactiveData: true,
            data: tableData,
            columns: [
                {title: "ID", field: "id"},
                {title: "Name", field: "name", editor: "input"},
                {title: "Age", field: "age", editor: "number"}
            ]
        });

        return () => {
            if(tabulator.current) {
                tabulator.current.destroy();
            }
        };
    }, []);

    // Update table data when state changes
    useEffect(() => {
        if(tabulator.current) {
            tabulator.current.setData(tableData);
        }
    }, [tableData]);

    const addRow = () => {
        setTableData(prev => [...prev, {
            id: Date.now(),
            name: `User ${prev.length + 1}`,
            age: Math.floor(Math.random() * 50) + 20
        }]);
    };

    const updateFirst = () => {
        setTableData(prev => prev.map((row, index) => 
            index === 0 ? {...row, name: `Updated ${Date.now()}`} : row
        ));
    };

    return (
        <div>
            <button onClick={addRow}>Add Row</button>
            <button onClick={updateFirst}>Update First</button>
            <div ref={tableRef}></div>
        </div>
    );
}
```

### Reactive Data Limitations and Best Practices

#### Limitations
- Only works with local data arrays (not AJAX sources)
- Array methods that create new arrays require manual `setData()`
- Deep object watching has performance implications with very large datasets

#### Best Practices
```javascript
// ✅ Good: Direct property modification
tableData[0].name = "New Name";

// ✅ Good: Array methods that modify in place
tableData.push(newRow);
tableData.splice(index, 1);

// ❌ Avoid: Array methods that create new arrays without reassigning
tableData = tableData.filter(row => row.active); // Won't trigger update
// ✅ Better: 
var newData = tableData.filter(row => row.active);
table.setData(newData);

// ✅ Good: Batch updates for performance
// Instead of multiple individual updates, batch them:
tableData.forEach((row, index) => {
    row.processed = true;
    row.processedAt = new Date();
});
```

## AJAX & Server-Side Operations

### Basic AJAX Setup
```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "https://api.example.com/data",
    ajaxConfig: "GET",  // or {method: "GET", headers: {...}}
    ajaxContentType: "json",
    ajaxParams: {
        token: "your-api-token",
        format: "json"
    },
    columns: [
        {title: "Name", field: "name"},
        {title: "Email", field: "email"}
    ]
});
```

### Complete AJAX Configuration

#### AJAX Options
```javascript
var table = new Tabulator("#example-table", {
    // Basic AJAX settings
    ajaxURL: "https://api.example.com/data",
    ajaxConfig: {
        method: "POST",
        headers: {
            "Authorization": "Bearer your-token",
            "Content-Type": "application/json"
        }
    },
    ajaxContentType: "json",  // "form", "json"
    ajaxParams: {
        static_param: "value"
    },
    
    // Dynamic parameters
    ajaxParamsFunc: function() {
        return {
            timestamp: Date.now(),
            user_id: getCurrentUserId()
        };
    },
    
    // Custom headers
    ajaxHeaders: {
        "X-Custom-Header": "value",
        "Accept": "application/json"
    },
    
    // Request lifecycle callbacks
    ajaxRequesting: function(url, params) {
        console.log("Making request to:", url, params);
        showLoader();
        return true; // return false to abort request
    },
    
    ajaxResponse: function(url, params, response) {
        console.log("Response received:", response);
        hideLoader();
        
        // Transform response data if needed
        if(response.success) {
            return response.data; // Return the data array
        } else {
            throw new Error(response.message);
        }
    },
    
    ajaxError: function(xhr, textStatus, errorThrown) {
        console.error("AJAX Error:", textStatus, errorThrown);
        hideLoader();
        showErrorMessage("Failed to load data");
    },
    
    // Custom URL generation
    ajaxURLGenerator: function(url, config, params) {
        // Build custom URL with parameters
        var queryString = Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');
        
        return url + (url.includes('?') ? '&' : '?') + queryString;
    },
    
    // Replace built-in AJAX function
    ajaxRequestFunc: function(url, config, params) {
        return new Promise((resolve, reject) => {
            // Custom request logic (e.g., using a different HTTP library)
            yourCustomHttpClient.request({
                url: url,
                method: config.method || 'GET',
                data: params,
                headers: config.headers
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error));
        });
    },
    
    columns: [...]
});
```

### Server-Side Pagination

#### Enable Remote Pagination
```javascript
var table = new Tabulator("#example-table", {
    pagination: true,
    paginationMode: "remote",
    paginationSize: 20,
    paginationSizeSelector: [10, 20, 50, 100],
    
    ajaxURL: "https://api.example.com/data",
    
    // Customize parameter names sent to server
    paginationDataSent: {
        page: "page_number",      // Send page number as "page_number"
        size: "items_per_page"    // Send page size as "items_per_page"
    },
    
    // Customize response property names
    paginationDataReceived: {
        last_page: "total_pages", // Expect total pages in "total_pages" property
        data: "items"             // Expect data array in "items" property
    },
    
    columns: [...]
});
```

#### Expected Server Response for Pagination
```json
{
    "total_pages": 15,
    "items": [
        {"id": 1, "name": "John", "email": "john@example.com"},
        {"id": 2, "name": "Jane", "email": "jane@example.com"}
    ]
}
```

#### Server-Side Implementation Example (Node.js/Express)
```javascript
app.get('/api/data', (req, res) => {
    const page = parseInt(req.query.page_number) || 1;
    const size = parseInt(req.query.items_per_page) || 10;
    const offset = (page - 1) * size;
    
    // Get total count
    const totalQuery = `SELECT COUNT(*) as total FROM users`;
    const total = db.query(totalQuery)[0].total;
    const totalPages = Math.ceil(total / size);
    
    // Get paginated data
    const dataQuery = `SELECT * FROM users LIMIT ${size} OFFSET ${offset}`;
    const items = db.query(dataQuery);
    
    res.json({
        total_pages: totalPages,
        items: items
    });
});
```

### Server-Side Sorting

#### Enable Remote Sorting
```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "https://api.example.com/data",
    sortMode: "remote",  // Send sort data to server
    
    // Customize sort parameter names
    ajaxParams: {}, // Base params
    
    columns: [
        {title: "Name", field: "name", sorter: "string"},
        {title: "Email", field: "email", sorter: "string"},
        {title: "Created", field: "created_at", sorter: "date"}
    ]
});
```

#### Sort Parameters Sent to Server
```javascript
// When user sorts by name descending, server receives:
{
    "sorters": [
        {
            "column": "name",
            "field": "name", 
            "dir": "desc"
        }
    ]
}
```

#### Server-Side Sort Implementation
```javascript
app.get('/api/data', (req, res) => {
    let query = 'SELECT * FROM users';
    const params = [];
    
    // Handle sorting
    if(req.query.sorters) {
        const sorters = JSON.parse(req.query.sorters);
        if(sorters.length > 0) {
            const orderClauses = sorters.map(sorter => {
                const direction = sorter.dir.toUpperCase();
                return `${sorter.field} ${direction}`;
            });
            query += ` ORDER BY ${orderClauses.join(', ')}`;
        }
    }
    
    const data = db.query(query, params);
    res.json(data);
});
```

### Server-Side Filtering

#### Enable Remote Filtering
```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "https://api.example.com/data",
    filterMode: "remote",  // Send filter data to server
    
    columns: [
        {
            title: "Name", 
            field: "name", 
            headerFilter: "input"
        },
        {
            title: "Age", 
            field: "age", 
            headerFilter: "number",
            headerFilterParams: {min: 0, max: 100}
        },
        {
            title: "Department",
            field: "department",
            headerFilter: "select",
            headerFilterParams: {
                values: ["IT", "HR", "Finance", "Marketing"]
            }
        }
    ]
});
```

#### Filter Parameters Sent to Server
```javascript
// When filters are applied, server receives:
{
    "filters": [
        {
            "field": "name",
            "type": "like",
            "value": "john"
        },
        {
            "field": "age", 
            "type": ">=",
            "value": 25
        },
        {
            "field": "department",
            "type": "=",
            "value": "IT"
        }
    ]
}
```

#### Server-Side Filter Implementation
```javascript
app.get('/api/data', (req, res) => {
    let query = 'SELECT * FROM users';
    let whereConditions = [];
    const params = [];
    let paramIndex = 1;
    
    // Handle filtering
    if(req.query.filters) {
        const filters = JSON.parse(req.query.filters);
        
        filters.forEach(filter => {
            const field = filter.field;
            const type = filter.type;
            const value = filter.value;
            
            switch(type) {
                case '=':
                    whereConditions.push(`${field} = ${paramIndex}`);
                    params.push(value);
                    break;
                case 'like':
                    whereConditions.push(`${field} ILIKE ${paramIndex}`);
                    params.push(`%${value}%`);
                    break;
                case '>':
                    whereConditions.push(`${field} > ${paramIndex}`);
                    params.push(value);
                    break;
                case '>=':
                    whereConditions.push(`${field} >= ${paramIndex}`);
                    params.push(value);
                    break;
                case '<':
                    whereConditions.push(`${field} < ${paramIndex}`);
                    params.push(value);
                    break;
                case '<=':
                    whereConditions.push(`${field} <= ${paramIndex}`);
                    params.push(value);
                    break;
                case 'in':
                    const placeholders = value.map(() => `${paramIndex++}`);
                    whereConditions.push(`${field} IN (${placeholders.join(',')})`);
                    params.push(...value);
                    paramIndex--; // Adjust for the extra increment
                    break;
            }
            paramIndex++;
        });
    }
    
    if(whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    const data = db.query(query, params);
    res.json(data);
});
```

### Combined Server-Side Operations
```javascript
var table = new Tabulator("#example-table", {
    pagination: true,
    paginationMode: "remote",
    paginationSize: 25,
    
    sortMode: "remote",
    filterMode: "remote",
    
    ajaxURL: "https://api.example.com/users",
    ajaxConfig: {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthToken()
        }
    },
    
    ajaxParams: {
        include_metadata: true
    },
    
    // Transform request data
    ajaxURLGenerator: function(url, config, params) {
        // Send data in request body for POST
        config.body = JSON.stringify(params);
        return url;
    },
    
    // Process server response
    ajaxResponse: function(url, params, response) {
        // Expected response format:
        // {
        //   data: [...],
        //   pagination: {
        //     total_pages: 10,
        //     current_page: 1,
        //     total_records: 250
        //   }
        // }
        
        // Set pagination info
        if(response.pagination) {
            this.setMaxPage(response.pagination.total_pages);
        }
        
        return response.data;
    },
    
    columns: [
        {title: "ID", field: "id", sorter: "number"},
        {title: "Name", field: "name", headerFilter: "input"},
        {title: "Email", field: "email", headerFilter: "input"},
        {title: "Role", field: "role", headerFilter: "select", 
         headerFilterParams: {values: ["admin", "user", "manager"]}},
        {title: "Created", field: "created_at", sorter: "date"}
    ]
});
```

### Progressive Loading
```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "https://api.example.com/data",
    progressiveLoad: "scroll",  // "scroll" or "load"
    progressiveLoadDelay: 200,   // Delay between requests
    progressiveLoadScrollMargin: 300, // Distance from bottom to trigger load
    paginationSize: 50,         // Rows per request
    
    columns: [...]
});
```

## Filtering & Sorting

### Local Filtering

#### Programmatic Filtering
```javascript
// Set single filter
table.setFilter("age", ">", 25);

// Set multiple filters
table.setFilter([
    {field: "age", type: ">", value: 25},
    {field: "name", type: "like", value: "john"},
    {field: "active", type: "=", value: true}
]);

// Custom filter function
table.setFilter(function(data, filterParams) {
    return data.age > 25 && data.department === "IT";
});

// Add filter (doesn't replace existing)
table.addFilter("department", "=", "Engineering");

// Remove specific filter
table.removeFilter("age", ">", 25);

// Clear all filters
table.clearFilter();

// Get current filters
var filters = table.getFilters();
```

#### Header Filters
```javascript
columns: [
    {
        title: "Name",
        field: "name",
        headerFilter: "input",
        headerFilterPlaceholder: "Search names..."
    },
    {
        title: "Age",
        field: "age", 
        headerFilter: "number",
        headerFilterParams: {
            min: 0,
            max: 100
        }
    },
    {
        title: "Department",
        field: "department",
        headerFilter: "select",
        headerFilterParams: {
            values: {
                "": "All Departments",
                "IT": "Information Technology", 
                "HR": "Human Resources",
                "FIN": "Finance"
            }
        }
    },
    {
        title: "Active",
        field: "active",
        headerFilter: "tickCross",
        headerFilterParams: {
            tristate: true  // true/false/null
        }
    },
    {
        title: "Salary",
        field: "salary",
        headerFilter: "number",
        headerFilterFunc: ">=",  // Filter function
        headerFilterPlaceholder: "Min salary"
    }
]
```

#### Custom Filter Functions
```javascript
// Global custom filter
function customAgeFilter(headerValue, rowValue, rowData, filterParams) {
    return rowValue >= headerValue; // Filter logic
}

// Register globally
Tabulator.extendModule("filter", "filters", {
    customAge: customAgeFilter
});

// Use in column
{
    title: "Age",
    field: "age",
    headerFilter: "input", 
    headerFilterFunc: "customAge"
}

// Or inline custom filter
{
    title: "Score",
    field: "score",
    headerFilter: "input",
    headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        var threshold = parseFloat(headerValue);
        if(isNaN(threshold)) return true;
        
        // Custom logic: filter based on score and bonus
        var totalScore = rowValue + (rowData.bonus || 0);
        return totalScore >= threshold;
    }
}
```

#### Filter Events
```javascript
// Before filtering
table.on("dataFiltering", function(filters) {
    console.log("About to filter with:", filters);
    showFilteringIndicator();
});

// After filtering
table.on("dataFiltered", function(filters, rows) {
    console.log("Filtered complete:", filters);
    console.log("Visible rows:", rows.length);
    hideFilteringIndicator();
    updateResultCount(rows.length);
});

// Header filter change
table.on("headerFilterFocus", function(column) {
    console.log("Filter focus on:", column.getField());
});

table.on("headerFilterBlur", function(column) {
    console.log("Filter blur on:", column.getField());
});
```

### Local Sorting

#### Programmatic Sorting
```javascript
// Sort by single column
table.setSort("name", "asc");

// Sort by multiple columns
table.setSort([
    {column: "department", dir: "asc"},
    {column: "name", dir: "asc"},
    {column: "age", dir: "desc"}
]);

// Add sort (doesn't replace existing)
table.addSort("salary", "desc");

// Clear all sorting
table.clearSort();

// Get current sort
var sorters = table.getSorters();
```

#### Custom Sorters
```javascript
// Global custom sorter
Tabulator.extendModule("sort", "sorters", {
    // Case-insensitive string sort
    stringCaseInsensitive: function(a, b, aRow, bRow, column, dir, sorterParams) {
        var aVal = (a || "").toString().toLowerCase();
        var bVal = (b || "").toString().toLowerCase();
        
        if(aVal < bVal) return -1;
        if(aVal > bVal) return 1;
        return 0;
    },
    
    // Sort by string length
    stringLength: function(a, b, aRow, bRow, column, dir, sorterParams) {
        var aLen = (a || "").toString().length;
        var bLen = (b || "").toString().length;
        return aLen - bLen;
    },
    
    // Custom date format sorter
    customDate: function(a, b, aRow, bRow, column, dir, sorterParams) {
        var format = sorterParams.format || "MM/DD/YYYY";
        var aDate = moment(a, format);
        var bDate = moment(b, format);
        
        if(!aDate.isValid()) return 1;
        if(!bDate.isValid()) return -1;
        
        return aDate.valueOf() - bDate.valueOf();
    }
});

// Use custom sorters
{
    title: "Name",
    field: "name", 
    sorter: "stringCaseInsensitive"
},
{
    title: "Birth Date",
    field: "birth_date",
    sorter: "customDate",
    sorterParams: {
        format: "DD/MM/YYYY"
    }
}
```

#### Built-in Sorters
- `string` - String sorting
- `number` - Numeric sorting
- `alphanum` - Alphanumeric sorting
- `boolean` - Boolean sorting
- `exists` - Check if value exists
- `date` - Date sorting
- `time` - Time sorting
- `datetime` - DateTime sorting
- `array` - Array length sorting

#### Sort Events
```javascript
// Before sorting
table.on("dataSorting", function(sorters) {
    console.log("About to sort with:", sorters);
    showSortingIndicator();
});

// After sorting
table.on("dataSorted", function(sorters, rows) {
    console.log("Sort complete:", sorters);
    console.log("Row order:", rows.map(r => r.getData()));
    hideSortingIndicator();
});
```

## Events - Complete Reference

### Table Lifecycle Events
```javascript
// Table building and initialization
table.on("tableBuilding", function() {
    console.log("Table is being built");
});

table.on("tableBuilt", function() {
    console.log("Table build complete");
    initializeCustomFeatures();
});

table.on("tableDestroying", function() {
    console.log("Table is being destroyed");
    cleanup();
});

table.on("tableDestroyed", function() {
    console.log("Table destroyed");
});
```

### Data Events
```javascript
// Data loading events
table.on("dataLoading", function(data) {
    console.log("Data loading started");
    showLoadingSpinner();
});

table.on("dataLoaded", function(data) {
    console.log("Data loaded:", data.length, "rows");
    hideLoadingSpinner();
});

table.on("dataLoadError", function(error) {
    console.error("Data load failed:", error);
    showErrorMessage("Failed to load data");
});

// Data processing events
table.on("dataProcessing", function(data) {
    console.log("Processing data");
});

table.on("dataProcessed", function(data) {
    console.log("Data processing complete");
});

// Data change events
table.on("dataChanged", function(data) {
    console.log("Table data changed");
    markDataAsModified();
});
```

### Row Events
```javascript
// Row interaction events
table.on("rowClick", function(e, row) {
    console.log("Row clicked:", row.getData());
    highlightRow(row);
});

table.on("rowDblClick", function(e, row) {
    console.log("Row double-clicked:", row.getData());
    editRow(row);
});

table.on("rowContext", function(e, row) {
    console.log("Row right-clicked:", row.getData());
    showContextMenu(e, row);
});

// Touch events
table.on("rowTap", function(e, row) {
    console.log("Row tapped:", row.getData());
});

table.on("rowDblTap", function(e, row) {
    console.log("Row double-tapped:", row.getData());
});

table.on("rowTapHold", function(e, row) {
    console.log("Row tap-hold:", row.getData());
    showRowActions(row);
});

// Mouse events
table.on("rowMouseEnter", function(e, row) {
    row.getElement().style.backgroundColor = "#f5f5f5";
});

table.on("rowMouseLeave", function(e, row) {
    row.getElement().style.backgroundColor = "";
});

// Row lifecycle events
table.on("rowAdded", function(row) {
    console.log("Row added:", row.getData());
    animateRowIn(row);
});

table.on("rowDeleted", function(row) {
    console.log("Row deleted:", row.getData().id);
    logDeletion(row.getData());
});

table.on("rowMoved", function(row) {
    console.log("Row moved:", row.getData());
    saveRowOrder();
});

table.on("rowUpdated", function(row) {
    console.log("Row updated:", row.getData());
    markRowAsModified(row);
});

table.on("rowSelectionChanged", function(data, rows) {
    console.log("Selection changed:", data.length, "rows selected");
    updateSelectionActions(data.length);
});

table.on("rowSelected", function(row) {
    console.log("Row selected:", row.getData());
});

table.on("rowDeselected", function(row) {
    console.log("Row deselected:", row.getData());
});
```

### Cell Events
```javascript
// Cell interaction events
table.on("cellClick", function(e, cell) {
    console.log("Cell clicked:", cell.getField(), "=", cell.getValue());
});

table.on("cellDblClick", function(e, cell) {
    console.log("Cell double-clicked:", cell.getField());
    if(cell.getColumn().getDefinition().editable) {
        cell.edit();
    }
});

table.on("cellContext", function(e, cell) {
    console.log("Cell right-clicked:", cell.getField());
    showCellContextMenu(e, cell);
});

// Touch events
table.on("cellTap", function(e, cell) {
    console.log("Cell tapped:", cell.getField());
});

table.on("cellDblTap", function(e, cell) {
    console.log("Cell double-tapped:", cell.getField());
});

table.on("cellTapHold", function(e, cell) {
    console.log("Cell tap-hold:", cell.getField());
});

// Mouse events
table.on("cellMouseEnter", function(e, cell) {
    cell.getElement().style.backgroundColor = "#e3f2fd";
});

table.on("cellMouseLeave", function(e, cell) {
    cell.getElement().style.backgroundColor = "";
});

// Cell editing events
table.on("cellEditing", function(cell) {
    console.log("Cell editing started:", cell.getField());
    var row = cell.getRow();
    row.getElement().classList.add("editing");
});

table.on("cellEdited", function(cell) {
    console.log("Cell edited:", cell.getField(), 
                "Old:", cell.getOldValue(), 
                "New:", cell.getValue());
    
    var row = cell.getRow();
    row.getElement().classList.remove("editing");
    markCellAsModified(cell);
    
    // Auto-save after edit
    saveRowToServer(row);
});

table.on("cellEditCancelled", function(cell) {
    console.log("Cell edit cancelled:", cell.getField());
    var row = cell.getRow();
    row.getElement().classList.remove("editing");
});
```

### Column Events
```javascript
// Column interaction events
table.on("columnMoved", function(column, columns) {
    console.log("Column moved:", column.getField());
    saveColumnOrder(columns.map(c => c.getField()));
});

table.on("columnResized", function(column) {
    console.log("Column resized:", column.getField(), "Width:", column.getWidth());
    saveColumnWidths();
});

table.on("columnVisibilityChanged", function(column, visible) {
    console.log("Column visibility changed:", column.getField(), visible);
    saveColumnVisibility();
});

table.on("columnTitleChanged", function(column) {
    console.log("Column title changed:", column.getField());
});

// Header events
table.on("headerClick", function(e, column) {
    console.log("Header clicked:", column.getField());
});

table.on("headerDblClick", function(e, column) {
    console.log("Header double-clicked:", column.getField());
    autoResizeColumn(column);
});

table.on("headerContext", function(e, column) {
    console.log("Header right-clicked:", column.getField());
    showHeaderContextMenu(e, column);
});
```

### Validation Events
```javascript
table.on("validationFailed", function(cell, value, validators) {
    console.log("Validation failed:", {
        field: cell.getField(),
        value: value,
        validators: validators
    });
    
    // Show custom validation message
    showValidationError(cell, validators);
});

function showValidationError(cell, validators) {
    var messages = validators.map(validator => {
        switch(validator.type) {
            case "required": return "This field is required";
            case "email": return "Please enter a valid email address";
            case "min": return `Value must be at least ${validator.parameters}`;
            case "max": return `Value must be no more than ${validator.parameters}`;
            case "minLength": return `Must be at least ${validator.parameters} characters`;
            case "maxLength": return `Must be no more than ${validator.parameters} characters`;
            default: return `Invalid ${validator.type}`;
        }
    });
    
    // Show tooltip or modal with error
    showTooltip(cell.getElement(), messages.join(", "));
}
```

### Filter and Sort Events
```javascript
// Filtering events
table.on("dataFiltering", function(filters) {
    console.log("Filtering started:", filters);
    updateFilterStatus(filters);
});

table.on("dataFiltered", function(filters, rows) {
    console.log("Filtering complete:", filters.length, "filters,", rows.length, "visible rows");
    updateResultsCount(rows.length);
});

// Header filter events
table.on("headerFilterFocus", function(column) {
    console.log("Header filter focused:", column.getField());
    highlightColumn(column);
});

table.on("headerFilterBlur", function(column) {
    console.log("Header filter blurred:", column.getField());
    removeColumnHighlight(column);
});

table.on("headerFilterClearButtonClick", function(column) {
    console.log("Header filter cleared:", column.getField());
});

// Sorting events
table.on("dataSorting", function(sorters) {
    console.log("Sorting started:", sorters);
    showSortingIndicator();
});

table.on("dataSorted", function(sorters, rows) {
    console.log("Sorting complete:", sorters);
    hideSortingIndicator();
    updateSortIndicators(sorters);
});
```

### Pagination Events
```javascript
table.on("pageLoaded", function(pageno) {
    console.log("Page loaded:", pageno);
    updatePageIndicator(pageno);
});

table.on("pageSizeChanged", function(size) {
    console.log("Page size changed:", size);
    saveUserPreference("pageSize", size);
});
```

### AJAX Events
```javascript
table.on("ajaxRequesting", function(url, params) {
    console.log("AJAX request starting:", url);
    showLoadingBar();
});

table.on("ajaxResponse", function(url, params, response) {
    console.log("AJAX response received:", response);
    hideLoadingBar();
});

table.on("ajaxError", function(xhr, textStatus, errorThrown) {
    console.error("AJAX error:", textStatus, errorThrown);
    hideLoadingBar();
    showErrorNotification("Failed to load data from server");
});
```

### History Events (Undo/Redo)
```javascript
table.on("historyUndo", function(action, component, data) {
    console.log("Undo action:", action, data);
    showUndoNotification(action);
});

table.on("historyRedo", function(action, component, data) {
    console.log("Redo action:", action, data);
    showRedoNotification(action);
});
```

### Clipboard Events
```javascript
table.on("clipboardCopied", function(clipboard) {
    console.log("Data copied to clipboard");
    showCopyNotification();
});

table.on("clipboardPasted", function(clipboard, rowData, rows) {
    console.log("Data pasted from clipboard:", rowData.length, "rows");
    showPasteNotification(rowData.length);
});

table.on("clipboardPasteError", function(clipboard) {
    console.error("Clipboard paste error");
    showPasteErrorNotification();
});
```

### Download Events
```javascript
table.on("downloadReady", function(fileContents, blob) {
    console.log("Download ready");
});

table.on("downloadComplete", function() {
    console.log("Download complete");
    showDownloadNotification();
});
```

## Advanced Patterns & Best Practices

### Performance Optimization

#### Virtual DOM Setup
```javascript
// Enable virtual DOM for large datasets
var table = new Tabulator("#example-table", {
    height: "400px",  // Required for virtual DOM
    virtualDom: true, // Enable virtual DOM (default when height is set)
    virtualDomBuffer: 20, // Extra rows to render outside visible area
    
    // Optimize for large datasets
    data: largeDataArray, // 10,000+ rows
    columns: columns
});
```

#### Efficient Data Updates
```javascript
// ✅ Good: Batch operations
table.updateOrAddData([
    {id: 1, name: "Updated Name 1"},
    {id: 2, name: "Updated Name 2"},
    {id: 3, name: "Updated Name 3"}
]);

// ❌ Avoid: Individual updates in loop
// for(let item of updates) {
//     table.updateOrAddRow(item.id, item);
// }

// ✅ Good: Use reactive data for frequent updates
var table = new Tabulator("#example-table", {
    reactiveData: true,
    data: myDataArray,
    columns: columns
});

// Then update the array directly
myDataArray[0].name = "New Name";
myDataArray.push(newItem);
```

#### Memory Management
```javascript
// Destroy table when no longer needed
function cleanupTable() {
    if(table) {
        table.destroy();
        table = null;
    }
}

// Remove event listeners
window.addEventListener('beforeunload', cleanupTable);

// For SPA frameworks, destroy in component cleanup
// React: useEffect cleanup, Vue: beforeDestroy, Angular: ngOnDestroy
```

### Error Handling Patterns

#### Comprehensive Error Handling
```javascript
var table = new Tabulator("#example-table", {
    ajaxURL: "https://api.example.com/data",
    
    ajaxError: function(xhr, textStatus, errorThrown) {
        console.error("AJAX Error:", {
            status: xhr.status,
            statusText: xhr.statusText,
            textStatus: textStatus,
            errorThrown: errorThrown
        });
        
        // Show user-friendly error message
        switch(xhr.status) {
            case 401:
                showError("Authentication required. Please log in.");
                redirectToLogin();
                break;
            case 403:
                showError("You don't have permission to access this data.");
                break;
            case 404:
                showError("Data not found. Please try again.");
                break;
            case 500:
                showError("Server error. Please try again later.");
                break;
            default:
                showError("Unable to load data. Please check your connection.");
        }
    },
    
    ajaxRequesting: function(url, params) {
        // Add request timeout
        this.ajaxConfig = {
            ...this.ajaxConfig,
            timeout: 30000 // 30 seconds
        };
        return true;
    },
    
    // Handle validation errors gracefully
    validationMode: "highlight",
    
    columns: [...]
});

// Handle validation globally
table.on("validationFailed", function(cell, value, validators) {
    var errorMsg = getValidationErrorMessage(validators);
    showFieldError(cell, errorMsg);
});

function getValidationErrorMessage(validators) {
    var messages = validators.map(v => {
        switch(v.type) {
            case "required": return "This field is required";
            case "email": return "Please enter a valid email";
            case "min": return `Minimum value is ${v.parameters}`;
            default: return "Invalid value";
        }
    });
    return messages.join(", ");
}
```

### State Management Patterns

#### Save and Restore Table State
```javascript
// Save table state
function saveTableState() {
    var state = {
        filters: table.getFilters(),
        sort: table.getSorters(),
        columns: table.getColumnLayout(),
        pageSize: table.getPageSize(),
        page: table.getPage()
    };
    
    localStorage.setItem('tableState', JSON.stringify(state));
}

// Restore table state
function restoreTableState() {
    var savedState = localStorage.getItem('tableState');
    if(savedState) {
        var state = JSON.parse(savedState);
        
        // Restore filters
        if(state.filters && state.filters.length > 0) {
            table.setFilter(state.filters);
        }
        
        // Restore sorting
        if(state.sort && state.sort.length > 0) {
            table.setSort(state.sort);
        }
        
        // Restore column layout
        if(state.columns) {
            table.setColumns(state.columns);
        }
        
        // Restore page size
        if(state.pageSize) {
            table.setPageSize(state.pageSize);
        }
        
        // Restore page (after data loads)
        table.on("dataLoaded", function() {
            if(state.page) {
                table.setPage(state.page);
            }
        });
    }
}

// Auto-save state on changes
table.on("dataFiltered", saveTableState);
table.on("dataSorted", saveTableState);
table.on("columnMoved", saveTableState);
table.on("columnResized", saveTableState);
table.on("pageSizeChanged", saveTableState);
table.on("pageLoaded", saveTableState);
```

#### Advanced Data Sync Pattern
```javascript
class TableDataManager {
    constructor(tableSelector, apiUrl) {
        this.apiUrl = apiUrl;
        this.pendingChanges = new Map();
        this.saveTimeout = null;
        
        this.table = new Tabulator(tableSelector, {
            ajaxURL: apiUrl,
            reactiveData: true,
            columns: this.getColumns(),
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Track changes for auto-save
        this.table.on("cellEdited", (cell) => {
            var row = cell.getRow();
            var data = row.getData();
            
            this.pendingChanges.set(data.id, {
                action: 'update',
                data: data,
                timestamp: Date.now()
            });
            
            this.scheduleAutoSave();
        });
        
        this.table.on("rowAdded", (row) => {
            var data = row.getData();
            this.pendingChanges.set(data.id, {
                action: 'create',
                data: data,
                timestamp: Date.now()
            });
            
            this.scheduleAutoSave();
        });
        
        this.table.on("rowDeleted", (row) => {
            var data = row.getData();
            this.pendingChanges.set(data.id, {
                action: 'delete',
                data: data,
                timestamp: Date.now()
            });
            
            this.scheduleAutoSave();
        });
    }
    
    scheduleAutoSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveChanges();
        }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    async saveChanges() {
        if(this.pendingChanges.size === 0) return;
        
        var changes = Array.from(this.pendingChanges.values());
        
        try {
            var response = await fetch(this.apiUrl + '/batch', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({changes: changes})
            });
            
            if(response.ok) {
                this.pendingChanges.clear();
                this.showSaveStatus('All changes saved');
            } else {
                throw new Error('Save failed');
            }
        } catch(error) {
            console.error('Save failed:', error);
            this.showSaveStatus('Save failed - will retry', 'error');
            
            // Retry after delay
            setTimeout(() => this.saveChanges(), 5000);
        }
    }
    
    showSaveStatus(message, type = 'success') {
        // Show save status to user
        var indicator = document.getElementById('save-indicator');
        indicator.textContent = message;
        indicator.className = `save-status ${type}`;
        
        if(type === 'success') {
            setTimeout(() => {
                indicator.textContent = '';
                indicator.className = 'save-status';
            }, 3000);
        }
    }
    
    getColumns() {
        return [
            {title: "ID", field: "id", visible: false},
            {title: "Name", field: "name", editor: "input", validator: "required"},
            {title: "Email", field: "email", editor: "input", validator: "email"},
            {title: "Phone", field: "phone", editor: "input"},
            {title: "Department", field: "department", editor: "select", 
             editorParams: {values: ["IT", "HR", "Finance", "Marketing"]}}
        ];
    }
}

// Usage
var dataManager = new TableDataManager("#example-table", "https://api.example.com/users");
```

### Integration Patterns

#### Framework Integration - React Hook
```javascript
import { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

function useTabulatorTable(selector, options) {
    const tableRef = useRef(null);
    const [table, setTable] = useState(null);
    const [data, setData] = useState([]);
    
    useEffect(() => {
        if(tableRef.current) {
            const tabulatorInstance = new Tabulator(tableRef.current, {
                ...options,
                data: data,
                reactiveData: true
            });
            
            setTable(tabulatorInstance);
            
            return () => {
                tabulatorInstance.destroy();
            };
        }
    }, []);
    
    const addRow = (rowData) => {
        if(options.reactiveData) {
            setData(prev => [...prev, rowData]);
        } else {
            table?.addRow(rowData);
        }
    };
    
    const updateRow = (id, updates) => {
        if(options.reactiveData) {
            setData(prev => prev.map(row => 
                row.id === id ? {...row, ...updates} : row
            ));
        } else {
            table?.updateRow(id, updates);
        }
    };
    
    const deleteRow = (id) => {
        if(options.reactiveData) {
            setData(prev => prev.filter(row => row.id !== id));
        } else {
            table?.deleteRow(id);
        }
    };
    
    return {
        tableRef,
        table,
        data,
        setData,
        addRow,
        updateRow,
        deleteRow
    };
}

// Usage in component
function MyTableComponent() {
    const { tableRef, table, addRow, updateRow, deleteRow } = useTabulatorTable("#my-table", {
        height: "400px",
        reactiveData: true,
        columns: [
            {title: "Name", field: "name", editor: "input"},
            {title: "Age", field: "age", editor: "number"}
        ]
    });
    
    return (
        <div>
            <button onClick={() => addRow({id: Date.now(), name: "New User", age: 25})}>
                Add Row
            </button>
            <div ref={tableRef}></div>
        </div>
    );
}
```

### Testing Patterns

#### Unit Testing with Jest
```javascript
// Mock Tabulator for testing
jest.mock('tabulator-tables', () => ({
    TabulatorFull: jest.fn().mockImplementation(() => ({
        setData: jest.fn(),
        getData: jest.fn(() => []),
        addRow: jest.fn(),
        updateRow: jest.fn(),
        deleteRow: jest.fn(),
        on: jest.fn(),
        destroy: jest.fn()
    }))
}));

describe('TableManager', () => {
    let tableManager;
    let mockTable;
    
    beforeEach(() => {
        mockTable = new Tabulator();
        tableManager = new TableManager('#test-table');
        tableManager.table = mockTable;
    });
    
    test('should add row with correct data', () => {
        const rowData = {id: 1, name: 'Test User'};
        tableManager.addRow(rowData);
        
        expect(mockTable.addRow).toHaveBeenCalledWith(rowData);
    });
    
    test('should handle validation errors', () => {
        const consoleSpy = jest.spyOn(console, 'error');
        tableManager.handleValidationError({type: 'required'});
        
        expect(consoleSpy).toHaveBeenCalled();
    });
});
```

This comprehensive guide covers all the major aspects of Tabulator.js 6.3, from basic setup to advanced patterns. Use it as your go-to reference for building sophisticated data tables with reactive data, server-side operations, custom formatters and validators, and robust event handling.
        