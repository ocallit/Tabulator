# ocTabulatorUtil.js - Complete Documentation & Examples

A comprehensive utility library that supercharges Tabulator.js with advanced filtering, sorting, and date handling capabilities. This documentation provides everything you need to build sophisticated data tables with enhanced user experience.

## 🌟 Key Features

- **Multi-operator filters** with dropdown operator selection
- **Accent & case insensitive** string filtering and sorting  
- **Intelligent number parsing** with comma/space formatting support
- **Natural sorting** with proper locale support (numbers, strings, mixed data)
- **Date string utilities** with timezone-safe yyyy-mm-dd handling
- **Built-in operator sets** for different data types
- **Safari iOS/macOS compatible** - tested on all platforms

## 📦 Installation & Setup

```html
<!-- Include Tabulator.js first -->
<link href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css" rel="stylesheet">
<script src="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js"></script>

<!-- Include ocTabulatorUtil.js -->
<script src="ocTabulatorUtil.js"></script>
```

## 🎯 Quick Start Example

```javascript
var table = new Tabulator("#example-table", {
    height: "400px",
    data: [
        {id: 1, name: "José García", age: 25, salary: "1,250.50", dob: "1998-05-15"},
        {id: 2, name: "Müller, Hans", age: 32, salary: "2,100.75", dob: "1991-12-03"},
        {id: 3, name: "O'Connor", age: 28, salary: "1,875.25", dob: "1995-08-22"}
    ],
    columns: [
        {
            title: "Name",
            field: "name",

        },
        {
            title: "Age", 
            field: "age",
            headerFilter: ocTabulatorUtil.headerFilterNumber,
            headerFilterFunc: ocTabulatorUtil.headerFilterFuncNumber,
            headerFilterLiveFilter: false,
            sorter: "number"
        },
        {
            title: "Salary",
            field: "salary",
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_NUMBER,
                "number",
                {placeholder: "Min salary..."}
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.autoSorter
        },
        {
            title: "Date of Birth",
            field: "dob",
            formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"),
            headerFilter: ocTabulatorUtil.datePickerFilter(),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "string", // yyyy-mm-dd sorts chronologically as strings
            editor: "input",
            editorParams: {type: "date"},
            validator: ocTabulatorUtil.ymdValidator
        }
    ]
});
```

## 🔍 Advanced Filtering System

### Multi-Operator Filter Creation

The `createOperatorFilter()` function creates sophisticated filter inputs with dropdown operator selection.

```javascript
// Basic syntax
headerFilter: ocTabulatorUtil.createOperatorFilter(operators, dataType, options)
```

**Parameters:**
- `operators` - Array of operator objects (use predefined sets or custom)
- `dataType` - "text" or "number" 
- `options` - Configuration object

### Predefined Operator Sets

#### Text Operators (`OPERATORS_TEXT`)
```javascript
{
    title: "Product Name",
    field: "name",
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_TEXT,
        "text",
        {placeholder: "Search products..."}
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc
}
```

**Available operators:**
- `⊃` (like) - Contains text (default)
- `=` (equals) - Exact match
- `≠` (not equals) - Does not equal
- `A*` (starts) - Starts with
- `*Z` (ends) - Ends with  
- `∅` (empty) - Empty/null values
- `≢` (not_empty) - Non-empty values

#### Number Operators (`OPERATORS_NUMBER`)
```javascript
{
    title: "Price",
    field: "price", 
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_NUMBER,
        "number",
        {placeholder: "Min price..."}
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc
}
```

**Available operators:**
- `=` (equals) - Equal to (default)
- `≠` (not equals) - Not equal to
- `>` (greater) - Greater than
- `≥` (greater_equal) - Greater than or equal
- `<` (less) - Less than
- `≤` (less_equal) - Less than or equal

### Custom Operator Sets

```javascript
// Create custom operator set
const CUSTOM_OPERATORS = [
    {value: "like", label: "Contains", default: true},
    {value: "=", label: "Exactly"},
    {value: "starts", label: "Begins with"},
    {value: "empty", label: "Is empty"}
];

{
    title: "Category",
    field: "category",
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        CUSTOM_OPERATORS,
        "text"
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc
}
```

### Filter Features

#### Accent & Case Insensitive Filtering
```javascript
// These will all match:
// "José" matches "jose", "JOSE", "José"
// "Müller" matches "muller", "MÜLLER"
// "O'Connor" matches "oconnor", "O'CONNOR"

{
    title: "Customer Name",
    field: "customer_name",
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_TEXT,
        "text"
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc
}
```

#### Smart Number Filtering
```javascript
// Handles various number formats:
// "1,234.56", "1 234.56", "1234.56" all parsed as 1234.56

{
    title: "Revenue",
    field: "revenue", // Can contain "1,250,000.50"
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_NUMBER,
        "number"
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
    formatter: "money",
    formatterParams: {symbol: "$", precision: 2}
}
```

## 📅 Date String Utilities

### yyyy-mm-dd Date Handling

Perfect for server-side dates that need to remain timezone-independent.

#### Date Formatter
```javascript
{
    title: "Created Date",
    field: "created_at", // Server: "2023-05-15"
    formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"), // Display: "15/05/2023"
    sorter: "string" // yyyy-mm-dd sorts chronologically
}
```

**Available output formats:**
- `"dd/mm/yyyy"` → "15/05/2023"
- `"mm/dd/yyyy"` → "05/15/2023" 
- `"dd-mm-yyyy"` → "15-05-2023"
- `"yyyy/mm/dd"` → "2023/05/15"
- `"dd.mm.yyyy"` → "15.05.2023"
- `"d/MMM/yy"` → "15/May/23" (short format)

#### Date Picker Filter
```javascript
{
    title: "Event Date",
    field: "event_date",
    formatter: ocTabulatorUtil.ymdFormatter("d/MMM/yy"), // "3/Abr/24"
    headerFilter: ocTabulatorUtil.datePickerFilter(), // HTML5 date picker
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
    sorter: "string"
}
```

**Date filter operators:**
- `=` (equals) - Exact date
- `≠` (not equals) - Not this date
- `After` - After this date
- `≥` - On or after this date
- `Before` - Before this date
- `≤` - On or before this date
- `⊃` (like) - Contains (for partial dates like "2023" or "2023-05")
- `A*` (starts) - Starts with (for year/month filtering)

#### Date Validation
```javascript
{
    title: "Birth Date",
    field: "birth_date",
    editor: "input",
    editorParams: {type: "date"},
    validator: [
        "required",
        ocTabulatorUtil.ymdValidator
    ]
}

// With date range constraints
{
    title: "Employment Date", 
    field: "employment_date",
    editor: "input",
    editorParams: {type: "date"},
    validator: [
        "required",
        function(cell, value) {
            return ocTabulatorUtil.ymdValidator(cell, value, "min:1990-01-01,max:2025-12-31");
        }
    ]
}
```

## 🔄 Advanced Sorting System

### String Sorting with Locale Support

```javascript
// Set your locale (default: 'es-MX')
ocTabulatorUtil.setLocale('en-US');

{
    title: "Company Name",
    field: "company",
    sorter: ocTabulatorUtil.stringSorter // Natural, accent-insensitive sorting
}
```

**String sorter features:**
- **Natural sorting**: "item2" comes before "item10"
- **Accent insensitive**: "José" and "jose" sort together
- **Case insensitive**: "Apple" and "apple" sort together
- **Empty values first**: null/undefined/empty values appear at the top
- **Locale-aware**: Respects language-specific sorting rules

### Auto-Detect Sorting

Intelligently handles mixed data types in the same column.

```javascript
{
    title: "Mixed Data", 
    field: "mixed_column", // Contains: numbers, strings, dates, nulls
    sorter: ocTabulatorUtil.autoSorter
}
```

**Auto-sorter handles:**
- **Pure numbers**: 1, 2, 10, 100 (numeric order)
- **Number strings**: "1", "2", "10", "100" (numeric order)
- **Formatted numbers**: "1,234.56" (parsed as 1234.56)
- **Date objects**: Sorted by timestamp
- **Date vs strings**: Date objects converted to yyyy-mm-dd for comparison
- **Mixed types**: Falls back to natural string sorting
- **Empty values**: Always sorted first

## 🎨 Real-World Examples

### E-commerce Product Table

```javascript
var productTable = new Tabulator("#product-table", {
    height: "500px",
    pagination: true,
    paginationSize: 25,
    columns: [
        {
            title: "Product Name",
            field: "name",
            width: 250,
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_TEXT,
                "text",
                {placeholder: "Search products..."}
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.stringSorter
        },
        {
            title: "Price",
            field: "price", // Server: "1,299.99"
            width: 120,
            formatter: "money",
            formatterParams: {symbol: "$", precision: 2},
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_NUMBER,
                "number",
                {placeholder: "Min price..."}
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.autoSorter
        },
        {
            title: "Stock",
            field: "stock",
            width: 100,
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_NUMBER,
                "number"
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "number"
        },
        {
            title: "Category",
            field: "category",
            width: 150,
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_TEXT,
                "text"
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.stringSorter
        },
        {
            title: "Launch Date",
            field: "launch_date", // Server: "2023-05-15"
            width: 130,
            formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"),
            headerFilter: ocTabulatorUtil.datePickerFilter(),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "string"
        }
    ]
});
```

### Employee Management Table

```javascript
var employeeTable = new Tabulator("#employee-table", {
    height: "600px",
    layout: "fitColumns",
    columns: [
        {
            title: "Employee Name",
            field: "full_name",
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_TEXT,
                "text",
                {placeholder: "Search employees..."}
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.stringSorter,
            editor: "input",
            validator: "required"
        },
        {
            title: "Department",
            field: "department",
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                [
                    {value: "=", label: "=", default: true},
                    {value: "!=", label: "≠"},
                    {value: "empty", label: "∅"},
                    {value: "not_empty", label: "≢"}
                ],
                "text"
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.stringSorter,
            editor: "select",
            editorParams: {
                values: ["Engineering", "Marketing", "Sales", "HR", "Finance"]
            }
        },
        {
            title: "Salary",
            field: "salary", // Can be "75,000" or "75000"
            formatter: "money",
            formatterParams: {symbol: "$", thousand: ",", precision: 0},
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_NUMBER,
                "number",
                {placeholder: "Min salary..."}
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.autoSorter,
            editor: "number"
        },
        {
            title: "Hire Date",
            field: "hire_date",
            formatter: ocTabulatorUtil.ymdFormatter("d/MMM/yy"),
            headerFilter: ocTabulatorUtil.datePickerFilter(),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "string",
            editor: "input",
            editorParams: {type: "date"},
            validator: ocTabulatorUtil.ymdValidator
        },
        {
            title: "Performance Score",
            field: "performance_score", // Can be decimal like "4.25"
            formatter: function(cell) {
                var value = parseFloat(cell.getValue());
                return !isNaN(value) ? value.toFixed(2) : "";
            },
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_NUMBER,
                "number"
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "number"
        }
    ]
});
```

### International Customer Table

```javascript
// Set locale for proper international sorting
ocTabulatorUtil.setLocale('en-US'); // or 'es-MX', 'fr-FR', etc.

var customerTable = new Tabulator("#customer-table", {
    height: "400px",
    columns: [
        {
            title: "Customer Name",
            field: "name", // Contains: "José García", "Müller", "O'Connor"
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_TEXT,
                "text",
                {placeholder: "Search customers..."}
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.stringSorter // Handles accents properly
        },
        {
            title: "Country",
            field: "country",
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_TEXT,
                "text"
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: ocTabulatorUtil.stringSorter
        },
        {
            title: "Total Orders",
            field: "total_orders",
            headerFilter: ocTabulatorUtil.createOperatorFilter(
                ocTabulatorUtil.OPERATORS_NUMBER,
                "number"
            ),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "number"
        },
        {
            title: "Last Order",
            field: "last_order_date",
            formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"),
            headerFilter: ocTabulatorUtil.datePickerFilter(),
            headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
            sorter: "string"
        }
    ]
});
```

## 🔧 Advanced Configuration

### Custom Filter Options

```javascript
{
    title: "Status",
    field: "status",
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_TEXT,
        "text",
        {
            placeholder: "Filter status...",
            useRawValue: true  // Use raw cell value instead of formatted
        }
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc
}
```

### Custom Date Validation with Constraints

```javascript
{
    title: "Project Deadline",
    field: "deadline",
    formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"),
    editor: "input",
    editorParams: {type: "date"},
    validator: [
        "required",
        function(cell, value) {
            // Must be between today and 2 years from now
            var today = new Date().toISOString().split('T')[0];
            var maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 2);
            var max = maxDate.toISOString().split('T')[0];
            
            return ocTabulatorUtil.ymdValidator(cell, value, `min:${today},max:${max}`);
        }
    ]
}
```

### Combining with Tabulator Events

```javascript
var table = new Tabulator("#example-table", {
    // ... table config with ocTabulatorUtil columns
});

// Save filter state
table.on("dataFiltered", function(filters, rows) {
    localStorage.setItem('tableFilters', JSON.stringify(
        table.getHeaderFilters()
    ));
});

// Restore filter state
var savedFilters = localStorage.getItem('tableFilters');
if(savedFilters) {
    table.setHeaderFilterValue("name", JSON.parse(savedFilters).name);
}
```

## 📱 Mobile & Responsive Considerations

### Mobile-Optimized Columns

```javascript
{
    title: "Name",
    field: "name",
    minWidth: 150, // Ensure minimum width on mobile
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_TEXT,
        "text",
        {placeholder: "Search..."} // Shorter placeholder for mobile
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
    sorter: ocTabulatorUtil.stringSorter,
    responsive: 0 // Never hide this column
}
```

### Touch-Friendly Date Filters

```javascript
{
    title: "Date",
    field: "date",
    formatter: ocTabulatorUtil.ymdFormatter("d/MMM/yy"), // Compact format
    headerFilter: ocTabulatorUtil.datePickerFilter(), // Native date picker on mobile
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc,
    sorter: "string",
    responsive: 1
}
```

## 🐛 Troubleshooting

### Common Issues

**Q: Filters not working with formatted data**
```javascript
// ✅ Correct: Use rawValue for filtering
{
    field: "price",
    formatter: "money", // Displays "$1,234.56"
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_NUMBER,
        "number",
        {useRawValue: true} // Filter against raw data, not formatted
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc
}
```

**Q: Date sorting not working**
```javascript
// ✅ Correct: Use string sorter for yyyy-mm-dd dates
{
    field: "date", // "2023-05-15" format
    formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"),
    sorter: "string" // yyyy-mm-dd sorts chronologically as strings
}
```

**Q: Accent filtering not working**
```javascript
// ✅ Correct: Use operatorFilterFunc
{
    field: "name",
    headerFilter: ocTabulatorUtil.createOperatorFilter(
        ocTabulatorUtil.OPERATORS_TEXT,
        "text"
    ),
    headerFilterFunc: ocTabulatorUtil.operatorFilterFunc // Required for accent handling
}
```

## 🚀 Performance Tips

1. **Use reactive data for frequent updates**:
```javascript
var table = new Tabulator("#table", {
    reactiveData: true,
    data: myDataArray, // Direct reference
    columns: [...] // ocTabulatorUtil columns
});

// Updates automatically
myDataArray[0].name = "Updated Name";
```

2. **Enable virtual DOM for large datasets**:
```javascript
var table = new Tabulator("#table", {
    height: "400px", // Enables virtual DOM
    data: largeDataArray,
    columns: [...] // ocTabulatorUtil columns work perfectly
});
```

3. **Use appropriate sorters**:
- `ocTabulatorUtil.stringSorter` for text columns
- `"number"` for pure numeric columns  
- `ocTabulatorUtil.autoSorter` for mixed data types
- `"string"` for yyyy-mm-dd dates

## 🎯 Best Practices

1. **Always pair filters with their filter function**:
```javascript
headerFilter: ocTabulatorUtil.createOperatorFilter(...),
headerFilterFunc: ocTabulatorUtil.operatorFilterFunc // Required
```

2. **Use consistent date formats**:
```javascript
// Server always sends yyyy-mm-dd
formatter: ocTabulatorUtil.ymdFormatter("dd/mm/yyyy"),
sorter: "string"
```

3. **Set locale for international data**:
```javascript
ocTabulatorUtil.setLocale('en-US'); // Set once at app startup
```

4. **Validate date inputs**:
```javascript
editor: "input",
editorParams: {type: "date"},
validator: ocTabulatorUtil.ymdValidator
```

This utility library transforms Tabulator.js into a powerhouse for data tables with enterprise-grade filtering, sorting, and date handling. The accent-insensitive search, intelligent number parsing, and timezone-safe date utilities make it perfect for international applications and complex data management scenarios.