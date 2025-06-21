# Tabulator Options - Complete Possible Values

## Core Table Options - Possible Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `height` | string/number | CSS values: "400px", "50vh", 400, "auto" | - | Table height |
| `minHeight` | number | Any positive number | - | Minimum height in pixels |
| `maxHeight` | number | Any positive number | - | Maximum height in pixels |
| `width` | string/number | CSS values: "100%", "800px", 800, "auto" | - | Table width |
| `layout` | string | "fitData", "fitColumns", "fitDataFill", "fitDataStretch", "fitDataTable" | "fitData" | Column layout mode |
| `layoutColumnsOnNewData` | boolean | `true`, `false` | `false` | Recalculate on new data |
| `responsiveLayout` | string/boolean | `true`, `false`, "hide", "collapse" | `false` | Responsive behavior |
| `responsiveLayoutCollapseStartOpen` | boolean | `true`, `false` | `true` | Start collapsed columns open |
| `responsiveLayoutCollapseUseFormatters` | boolean | `true`, `false` | `true` | Use formatters in collapsed view |
| `locale` | boolean/string | `false`, "en-US", "es-ES", "fr-FR", etc. | `false` | Localization |
| `textDirection` | string | "auto", "ltr", "rtl" | "auto" | Text direction |

## Data & Loading Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `ajaxConfig` | string/object | "GET", "POST", {method: "POST", headers: {...}} | "GET" | AJAX configuration |
| `ajaxContentType` | string | "form", "json" | "form" | Request content type |
| `progressiveLoad` | string/boolean | `false`, "load", "scroll" | `false` | Progressive loading mode |
| `dataLoader` | boolean | `true`, `false` | `true` | Show data loading overlay |
| `reactiveData` | boolean | `true`, `false` | `false` | Enable reactive data |
| `nestedFieldSeparator` | string | ".", "_", "|", any string | "." | Nested field separator |

## Tree Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `dataTree` | boolean | `true`, `false` | `false` | Enable tree structure |
| `dataTreeElementColumn` | string/boolean | `false`, "columnField", `true` | - | Tree element column |
| `dataTreeBranchElement` | string/boolean | `false`, "▶", `true` | - | Branch element |
| `dataTreeChildIndent` | number | 0-50 (pixels) | 9 | Child indentation |
| `dataTreeChildField` | string | "_children", "children", "items" | "_children" | Child data field |
| `dataTreeCollapseElement` | string/boolean | `false`, "▼", `true` | - | Collapse element |
| `dataTreeExpandElement` | string/boolean | `false`, "▶", `true` | - | Expand element |
| `dataTreeStartExpanded` | boolean/array/function | `true`, `false`, [1,2,3], function | `false` | Start expanded |

## Pagination Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `pagination` | boolean/string | `true`, `false`, "local", "remote" | `false` | Enable pagination |
| `paginationMode` | string | "local", "remote" | "local" | Pagination mode |
| `paginationSize` | number | 1-1000+ | 10 | Rows per page |
| `paginationSizeSelector` | array/boolean | `false`, [5,10,25,50,100], `true` | `false` | Page size options |
| `paginationAddRow` | string | "page", "table" | "page" | Where to add new rows |
| `paginationButtonCount` | number | 1-20 | 5 | Number of page buttons |
| `paginationCounter` | string | "rows", "pages" | "rows" | Counter display type |

## Sorting Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `sortOrderReverse` | boolean | `true`, `false` | `false` | Reverse sort order |
| `headerSort` | boolean | `true`, `false` | `true` | Enable header sorting |
| `headerSortTristate` | boolean | `true`, `false` | `false` | Tri-state sorting |

## Filtering Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `headerFilterLiveFilterDelay` | number | 0-2000 (ms) | 300 | Filter delay |
| `headerFilterPlaceholder` | string/boolean | `false`, "Filter...", any string | `false` | Default placeholder |

## Selection Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `selectable` | boolean/number | `true`, `false`, 1, 5, 100 | `true` | Selection mode |
| `selectableRangeMode` | string | "click", "drag" | "drag" | Range selection |
| `selectableRollingSelection` | boolean | `true`, `false` | `true` | Rolling selection |
| `selectablePersistence` | boolean | `true`, `false` | `true` | Persist on data change |

## Grouping Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `groupStartOpen` | boolean/array/function | `true`, `false`, [0,1], function | `true` | Start groups open |
| `groupToggleElement` | string/boolean | `false`, "arrow", "header", `true` | "arrow" | Toggle element |
| `groupClosedShowCalcs` | boolean | `true`, `false` | `false` | Show calcs when closed |

## Movable Rows Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `movableRows` | boolean | `true`, `false` | `false` | Enable row movement |

## Download Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `downloadRowRange` | string | "active", "all", "visible", "selected" | "active" | Row range |

## Clipboard Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `clipboard` | boolean/string | `true`, `false`, "copy", "paste" | `false` | Clipboard mode |
| `clipboardCopyRowRange` | string | "active", "all", "visible", "selected" | "active" | Copy range |
| `clipboardCopyFormatter` | string | "table", "csv", "json" | "table" | Copy format |
| `clipboardPasteParser` | string | "table", "csv", "json" | "table" | Paste parser |
| `clipboardPasteAction` | string | "insert", "update", "replace" | "insert" | Paste action |

## Print Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `printAsHtml` | boolean | `true`, `false` | `false` | Print as HTML |
| `printCopyStyle` | boolean | `true`, `false` | `true` | Copy styles |
| `printVisibleRows` | boolean | `true`, `false` | `true` | Print visible only |
| `printRowRange` | string | "active", "all", "visible", "selected" | "active" | Print range |

## Validation Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `validationMode` | string | "blocking", "highlight", "manual" | "blocking" | Validation mode |

## History Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `history` | boolean | `true`, `false` | `false` | Enable undo/redo |

## Persistence Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `persistence` | boolean/object | `true`, `false`, {sort:true, filter:true} | `false` | Enable persistence |
| `persistenceMode` | string | "local", "cookie", "remote" | "local" | Storage mode |
| `persistentLayout` | boolean | `true`, `false` | `false` | Persist layout |
| `persistentSort` | boolean | `true`, `false` | `false` | Persist sorting |
| `persistentFilter` | boolean | `true`, `false` | `false` | Persist filters |

## Row Options Values

| Option | Type | Possible Values | Default | Description |
|--------|------|-----------------|---------|-------------|
| `addRowPos` | string | "bottom", "top" | "bottom" | New row position |
| `resizableRows` | boolean | `true`, `false` | `false` | Enable row resizing |

## Column Properties Values

| Property | Type | Possible Values | Default | Description |
|----------|------|-----------------|---------|-------------|
| `visible` | boolean | `true`, `false` | `true` | Column visibility |
| `resizable` | boolean | `true`, `false` | `true` | Allow resizing |
| `frozen` | boolean/string | `true`, `false`, "left", "right" | `false` | Freeze column |
| `responsive` | number | 0-10 | 1 | Responsive priority |
| `hozAlign` | string | "left", "center", "right" | - | Horizontal align |
| `vertAlign` | string | "top", "middle", "bottom" | - | Vertical align |
| `headerHozAlign` | string | "left", "center", "right" | - | Header h-align |
| `headerVertAlign` | string | "top", "middle", "bottom" | - | Header v-align |
| `headerVertical` | boolean/string | `true`, `false`, "flip" | `false` | Vertical header |
| `variableHeight` | boolean | `true`, `false` | `false` | Variable height |
| `headerSort` | boolean | `true`, `false` | `true` | Enable sorting |
| `headerSortStartingDir` | string | "asc", "desc" | "asc" | Initial sort dir |
| `headerSortTristate` | boolean | `true`, `false` | `false` | Tri-state sort |
| `headerFilter` | string/function/boolean | `false`, "input", "select", "number", custom | `false` | Header filter |
| `headerFilterLiveFilter` | boolean | `true`, `false` | `true` | Live filtering |
| `editor` | string/function/boolean | `false`, "input", "select", "number", custom | `false` | Cell editor |
| `editable` | boolean/function | `true`, `false`, function | `true` | Allow editing |
| `editableTitle` | boolean | `true`, `false` | `false` | Allow title edit |
| `tooltip` | string/function/boolean | `false`, "string", function | `false` | Cell tooltip |
| `sorter` | string/function | "string", "number", "date", "boolean", custom | "string" | Sort function |
| `topCalc` | string/function | "avg", "max", "min", "sum", "count", custom | - | Top calculation |
| `bottomCalc` | string/function | "avg", "max", "min", "sum", "count", custom | - | Bottom calculation |
| `download` | boolean | `true`, `false` | `true` | Include in download |
| `clipboard` | boolean | `true`, `false` | `true` | Include in clipboard |
| `print` | boolean | `true`, `false` | `true` | Include in print |
| `htmlOutput` | boolean | `true`, `false` | `true` | Include in HTML |
| `rowHandle` | boolean | `true`, `false` | `false` | Row drag handle |

## Formatter Values

| Formatter | Possible Values | Description |
|-----------|-----------------|-------------|
| `plaintext` | - | Default text (escaped) |
| `textarea` | - | Text with line breaks |
| `html` | - | Raw HTML content |
| `money` | - | Currency formatting |
| `image` | - | Display images |
| `link` | - | Hyperlinks |
| `datetime` | - | Date/time formatting |
| `datetimediff` | - | Date differences |
| `tickCross` | - | ✓/✗ display |
| `star` | - | Star ratings |
| `progress` | - | Progress bars |
| `color` | - | Color swatches |
| `buttonTick` | - | Tick buttons |
| `buttonCross` | - | Cross buttons |
| `rownum` | - | Row numbers |
| `handle` | - | Drag handles |
| `responsiveCollapse` | - | Responsive collapse |
| `lookup` | - | Value lookup |
| `array` | - | Array display |

## Editor Values

| Editor | Possible Values | Description |
|--------|-----------------|-------------|
| `input` | - | Text input |
| `textarea` | - | Multi-line text |
| `number` | - | Number input |
| `range` | - | Range slider |
| `select` | - | Dropdown |
| `autocomplete` | - | Auto-complete |
| `star` | - | Star rating |
| `tickCross` | - | Checkbox |
| `date` | - | Date picker |
| `time` | - | Time picker |
| `datetime` | - | DateTime picker |

## Validator Values

| Validator | Possible Values | Description |
|-----------|-----------------|-------------|
| `required` | - | Not null/empty |
| `unique` | - | Unique in column |
| `integer` | - | Valid integer |
| `float` | - | Valid float |
| `numeric` | - | Valid number |
| `string` | - | Non-numeric |
| `alphanumeric` | - | Letters/numbers |
| `email` | - | Valid email |
| `url` | - | Valid URL |
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `minLength` | number | Min string length |
| `maxLength` | number | Max string length |
| `in` | array | Value in list |
| `regex` | RegExp | Regex pattern |