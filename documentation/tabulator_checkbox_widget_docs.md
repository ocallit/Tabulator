# ocTabulatorRowSelector Documentation

A comprehensive widget for Tabulator.js that adds checkbox selection functionality with filtering, bulk operations, and export capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [Advanced Configuration](#-advanced-configuration)
- [API Reference](#-api-reference)
- [Events](#-events)
- [HTML Structure](#-html-structure)
- [Examples](#-examples)
- [Styling](#-styling)
- [Troubleshooting](#-troubleshooting)


## ⚡ Quick Start

1. Include dependencies:
```html
<link href="tabulator.min.css" rel="stylesheet">
<script src="tabulator.min.js"></script>
<script src="ocTabulatorRowSelector.js"></script>

<div id="table-controls"></div>
<div id="my-table"></div>

const table = new Tabulator("#my-table", { /* config */ });
const checkboxWidget = new ocTabulatorRowSelector(table, {
controlsContainerId: 'table-controls'
});
```
## ✨ Features

### Core Functionality
- ✅ **Checkbox Column**: Automatically positioned after row numbers
- ✅ **Smart Filtering**: Show all/checked/unchecked rows
- ✅ **Bulk Operations**: Check/uncheck all or visible rows
- ✅ **Export Support**: CSV/Excel/PDF for checked or unchecked rows only
- ✅ **Persistent State**: Maintains selections across data reloads
- ✅ **Programmatic API**: Control checkboxes via JavaScript
- ✅ **Event System**: Custom events for integration
- ✅ **Responsive UI**: Modern control interface

### Filter Controls
- **All Rows**: Display all rows (default)
- **Checked Only**: Hide unchecked rows
- **Unchecked Only**: Hide checked rows

### Bulk Operations
- **Check All**: Select all rows in the table
- **Uncheck All**: Clear all selections
- **Check Visible**: Select only currently visible rows
- **Uncheck Visible**: Deselect only currently visible rows

### Export Options
- **CSV Export**: Checked rows only / Unchecked rows only
- **Excel Export**: Checked rows only / Unchecked rows only
- **PDF Export**: Checked rows only / Unchecked rows only

## 📦 Requirements

### Essential Dependencies
```html
<!-- Tabulator CSS and JS -->
<link href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js"></script>

<!-- ocTabulatorRowSelector -->
<script src="path/to/tabulator-checkbox-widget.js"></script>
```

### Export Dependencies (Optional)
Only include these if you need export functionality:

```html
<!-- For Excel Export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<!-- For PDF Export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
```

### Browser Support
- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- ES6 support required (Classes, Arrow functions, Set, etc.)

## 🚀 Installation

### 1. Include the Script
Download and include `tabulator-checkbox-widget.js` in your project:

```html
<script src="js/tabulator-checkbox-widget.js"></script>
```

### 2. HTML Structure
Create containers for your table and controls:

```html
<div id="table-controls"></div>
<div id="example-table"></div>
```

## 📖 Basic Usage

### Simple Setup (Automatic Column Insertion)

```javascript
// Create your Tabulator table
const table = new Tabulator("#example-table", {
    data: [
        {id: 1, name: "John Doe", email: "john@example.com", age: 30},
        {id: 2, name: "Jane Smith", email: "jane@example.com", age: 25},
        {id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35}
    ],
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        // Checkbox column will be automatically inserted here
        {title: "Name", field: "name", editor: "input"},
        {title: "Email", field: "email", editor: "input"},
        {title: "Age", field: "age", editor: "number"}
    ]
});

// Initialize the checkbox widget
const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'table-controls'
});
```

### Manual Column Definition

```javascript
// Define columns including checkbox
const columns = [
    {formatter: "rownum", hozAlign: "center", width: 40},
    ocTabulatorRowSelector.getCheckboxColumnDefinition({
        title: '✓',
        width: 60
    }),
    {title: "Name", field: "name"},
    {title: "Email", field: "email"},
    {title: "Age", field: "age"}
];

const table = new Tabulator("#example-table", {
    data: myData,
    columns: columns
});

const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'table-controls'
});
```

## ⚙️ Advanced Configuration

### Constructor Options

```javascript
const checkboxWidget = new ocTabulatorRowSelector(table, {
    // Checkbox column appearance
    checkboxColumnTitle: '☑',           // Column header text
    checkboxColumnWidth: 50,            // Column width in pixels
    checkboxFieldName: '_selected',     // Field name for checkbox data

    // UI container
    controlsContainerId: 'my-controls', // ID of controls container

    // Export options
    exportOptions: {
        pdf: true,      // Enable PDF export buttons
        excel: true,    // Enable Excel export buttons
        csv: true       // Enable CSV export buttons
    }
});
```

### Static Column Definition Options

```javascript
const checkboxColumn = ocTabulatorRowSelector.getCheckboxColumnDefinition({
    title: '✓',              // Column header
    width: 60,               // Column width
    fieldName: '_checked'    // Field name for data storage
});
```

## 🔧 API Reference

### Instance Methods

#### Selection Control
```javascript
// Check/uncheck specific row
checkboxWidget.setRowChecked(rowId, true);   // Check row
checkboxWidget.setRowChecked(rowId, false);  // Uncheck row

// Check row status
const isChecked = checkboxWidget.isRowChecked(rowId);
```

#### Bulk Operations
```javascript
checkboxWidget.checkAll();          // Check all rows
checkboxWidget.uncheckAll();        // Uncheck all rows
checkboxWidget.checkVisible();      // Check visible rows only
checkboxWidget.uncheckVisible();    // Uncheck visible rows only
```

#### Data Retrieval
```javascript
// Get checked row data
const checkedData = checkboxWidget.getCheckedData();

// Get unchecked row data
const uncheckedData = checkboxWidget.getUncheckedData();

// Get row objects
const checkedRows = checkboxWidget.getCheckedRows();
const uncheckedRows = checkboxWidget.getUncheckedRows();
```

#### Statistics
```javascript
const checkedCount = checkboxWidget.getCheckedCount();
const uncheckedCount = checkboxWidget.getUncheckedCount();
const visibleCount = checkboxWidget.getVisibleCount();
```

#### Filtering
```javascript
checkboxWidget.setFilter('all');        // Show all rows
checkboxWidget.setFilter('checked');     // Show checked rows only
checkboxWidget.setFilter('unchecked');   // Show unchecked rows only
```

#### Export
```javascript
checkboxWidget.exportChecked('csv');      // Export checked rows as CSV
checkboxWidget.exportChecked('xlsx');     // Export checked rows as Excel
checkboxWidget.exportChecked('pdf');      // Export checked rows as PDF

checkboxWidget.exportUnchecked('csv');    // Export unchecked rows as CSV
checkboxWidget.exportUnchecked('xlsx');   // Export unchecked rows as Excel
checkboxWidget.exportUnchecked('pdf');    // Export unchecked rows as PDF
```

## 📡 Events

The widget dispatches custom events that you can listen for:

### checkboxChanged
Fired when any checkbox is toggled.

```javascript
table.element.addEventListener('checkboxChanged', function(e) {
    const { row, checked, data } = e.detail;
    
    console.log('Checkbox changed:', {
        rowData: data,
        isChecked: checked,
        rowComponent: row
    });
    
    // Example: Update external UI
    updateSummaryPanel(checkboxWidget.getCheckedData());
});
```

### Example Event Handlers
```javascript
// Listen for checkbox changes
table.element.addEventListener('checkboxChanged', function(e) {
    const { checked, data } = e.detail;
    
    if (checked) {
        console.log('Row checked:', data.name);
        // Add to shopping cart, selection list, etc.
    } else {
        console.log('Row unchecked:', data.name);
        // Remove from shopping cart, selection list, etc.
    }
    
    // Update totals
    updateTotalCalculations();
});

// Update UI when selections change
function updateTotalCalculations() {
    const checkedData = checkboxWidget.getCheckedData();
    const total = checkedData.reduce((sum, row) => sum + (row.amount || 0), 0);
    
    document.getElementById('selected-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('selected-count').textContent = checkedData.length;
}
```

## 🏗️ HTML Structure

### Required HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>Tabulator Checkbox Widget Example</title>
    <!-- Tabulator CSS -->
    <link href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css" rel="stylesheet">
</head>
<body>
    <!-- Controls container (widget will populate this) -->
    <div id="table-controls"></div>
    
    <!-- Table container -->
    <div id="example-table"></div>
    
    <!-- External summary panel (optional) -->
    <div id="summary-panel">
        Selected: <span id="selected-count">0</span> items
        Total: <span id="selected-total">$0.00</span>
    </div>

    <!-- Dependencies -->
    <script src="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js"></script>
    
    <!-- Export dependencies (optional) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
    
    <!-- Widget -->
    <script src="js/tabulator-checkbox-widget.js"></script>
    
    <!-- Your code -->
    <script>
        // Initialize table and widget here
    </script>
</body>
</html>
```

## 📚 Examples

### Example 1: E-commerce Product Selection

```javascript
const productsData = [
    {id: 1, name: "Laptop", price: 999.99, category: "Electronics"},
    {id: 2, name: "Mouse", price: 29.99, category: "Electronics"},
    {id: 3, name: "Desk Chair", price: 199.99, category: "Furniture"}
];

const table = new Tabulator("#products-table", {
    data: productsData,
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        {title: "Product", field: "name"},
        {title: "Price", field: "price", formatter: "money", formatterParams: {symbol: "$"}},
        {title: "Category", field: "category"}
    ]
});

const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'product-controls'
});

// Update cart when selections change
table.element.addEventListener('checkboxChanged', function(e) {
    updateShoppingCart();
});

function updateShoppingCart() {
    const selectedProducts = checkboxWidget.getCheckedData();
    const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = selectedProducts.length;
}
```

### Example 2: User Management with Bulk Operations

```javascript
const usersData = [
    {id: 1, username: "john_doe", email: "john@example.com", role: "admin", active: true},
    {id: 2, username: "jane_smith", email: "jane@example.com", role: "user", active: true},
    {id: 3, username: "bob_inactive", email: "bob@example.com", role: "user", active: false}
];

const table = new Tabulator("#users-table", {
    data: usersData,
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        {title: "Username", field: "username"},
        {title: "Email", field: "email"},
        {title: "Role", field: "role"},
        {title: "Active", field: "active", formatter: "tickCross"}
    ]
});

const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'user-controls'
});

// Add custom bulk action buttons
document.getElementById('user-controls').insertAdjacentHTML('beforeend', `
    <div style="margin-top: 10px;">
        <button id="bulk-activate" class="btn-action">Activate Selected</button>
        <button id="bulk-deactivate" class="btn-action">Deactivate Selected</button>
        <button id="bulk-delete" class="btn-action" style="background: #dc3545;">Delete Selected</button>
    </div>
`);

// Handle bulk operations
document.getElementById('bulk-activate').addEventListener('click', function() {
    const selected = checkboxWidget.getCheckedData();
    selected.forEach(user => {
        // Update user status in your backend
        updateUserStatus(user.id, true);
    });
});

document.getElementById('bulk-delete').addEventListener('click', function() {
    const selected = checkboxWidget.getCheckedData();
    if(confirm(`Delete ${selected.length} users?`)) {
        selected.forEach(user => {
            // Delete user in your backend
            deleteUser(user.id);
        });
    }
});
```

### Example 3: Financial Data with Export

```javascript
const financialData = [
    {id: 1, date: "2024-01-01", description: "Office Supplies", amount: 150.00, category: "Expenses"},
    {id: 2, date: "2024-01-02", description: "Client Payment", amount: 2500.00, category: "Income"},
    {id: 3, date: "2024-01-03", description: "Internet Bill", amount: 89.99, category: "Expenses"}
];

const table = new Tabulator("#financial-table", {
    data: financialData,
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        {title: "Date", field: "date", formatter: "datetime", formatterParams: {outputFormat: "MM/dd/yyyy"}},
        {title: "Description", field: "description"},
        {title: "Amount", field: "amount", formatter: "money", formatterParams: {symbol: "$"}},
        {title: "Category", field: "category"}
    ]
});

const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'financial-controls',
    exportOptions: {
        pdf: true,
        excel: true,
        csv: true
    }
});

// Real-time total calculation
table.element.addEventListener('checkboxChanged', function(e) {
    updateFinancialSummary();
});

function updateFinancialSummary() {
    const selectedTransactions = checkboxWidget.getCheckedData();

    const income = selectedTransactions
        .filter(t => t.category === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = selectedTransactions
        .filter(t => t.category === 'Expenses')
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('selected-income').textContent = `$${income.toFixed(2)}`;
    document.getElementById('selected-expenses').textContent = `$${expenses.toFixed(2)}`;
    document.getElementById('selected-net').textContent = `$${(income - expenses).toFixed(2)}`;
}
```

## 🎨 Styling

### Default Styles
The widget includes built-in styles for a clean, modern appearance. The styles are automatically injected when you create the controls UI.

### Custom Styling
You can override the default styles:

```css
/* Customize control buttons */
.tabulator-checkbox-controls .btn-filter {
    background: #6c757d;
    border-radius: 8px;
    font-weight: 600;
}

.tabulator-checkbox-controls .btn-filter.active {
    background: linear-gradient(45deg, #007bff, #0056b3);
    box-shadow: 0 2px 4px rgba(0,123,255,0.3);
}

/* Customize export buttons */
.tabulator-checkbox-controls .btn-export {
    background: linear-gradient(45deg, #17a2b8, #138496);
    border: none;
    transition: all 0.3s ease;
}

.tabulator-checkbox-controls .btn-export:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(23,162,184,0.3);
}

/* Customize status display */
.status-info {
    font-family: 'Courier New', monospace;
    background: #f8f9fa;
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #dee2e6;
}
```

### Responsive Design
The controls are responsive and will wrap on smaller screens:

```css
.tabulator-checkbox-controls {
    flex-wrap: wrap;
    gap: 5px;
}

@media (max-width: 768px) {
    .tabulator-checkbox-controls {
        flex-direction: column;
    }
    
    .tabulator-checkbox-controls > div {
        width: 100%;
        justify-content: center;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Controls not appearing
**Problem**: The controls container is not showing up.
**Solution**: Ensure the `controlsContainerId` exists in the DOM before initializing the widget.

```javascript
// ❌ Wrong - element might not exist yet
const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'my-controls'
});

// ✅ Correct - ensure element exists
document.addEventListener('DOMContentLoaded', function() {
    const checkboxWidget = new ocTabulatorRowSelector(table, {
        controlsContainerId: 'my-controls'
    });
});
```

#### 2. Export not working
**Problem**: Export buttons don't work or throw errors.
**Solution**: Include the required export dependencies.

```html
<!-- Make sure these are included for export functionality -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
```

#### 3. Checkboxes not persisting
**Problem**: Checkbox states are lost when data is reloaded.
**Solution**: Ensure your data has consistent unique identifiers.

```javascript
// ❌ Data without consistent IDs
const data = [
    {name: "John", email: "john@example.com"},  // No ID
    {name: "Jane", email: "jane@example.com"}   // No ID
];

// ✅ Data with unique IDs
const data = [
    {id: 1, name: "John", email: "john@example.com"},
    {id: 2, name: "Jane", email: "jane@example.com"}
];
```

#### 4. Column not positioned correctly
**Problem**: Checkbox column appears in wrong position.
**Solution**: Ensure row number column is defined correctly.

```javascript
// ✅ Correct row number column definition
{formatter: "rownum", hozAlign: "center", width: 40}
```

### Performance Considerations

- The widget maintains a `Set` of checked row IDs for fast lookups
- Export operations temporarily replace table data - avoid on very large datasets
- Event listeners are optimized to prevent memory leaks
- Use `getCheckedData()` sparingly on large datasets - cache results when possible

3. **Troubleshooting Matrix**

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| Checkboxes not persisting | Data lacks unique IDs | Ensure each row has `id` or `_id` field |
| Export buttons missing | Missing export dependencies | Include xlsx/jspdf libraries |
| Controls not appearing | Container ID mismatch | Verify `controlsContainerId` matches HTML |

4. **Performance Tips**
```markdown
## 🚀 Performance Tips

- For tables with 1000+ rows:
  - Use `setRowChecked()` instead of bulk operations
  - Debounce rapid checkbox changes
  - Avoid complex formatters in checkbox column
  - Disable live filtering (`headerFilterLiveFilter: false`)
  
### Browser Compatibility

- **Chrome 60+**: Full support
- **Firefox 55+**: Full support  
- **Safari 12+**: Full support
- **Edge 79+**: Full support
- **IE**: Not supported (ES6 required)

---

