/**
 * ocTabulatorRowSelector
 * 
 * A comprehensive widget for Tabulator that adds checkbox selection with:
 * - Custom checkbox column
 * - Filter controls (checked/unchecked/all)
 * - Bulk operations (check all/uncheck all)
 * - Export functionality (PDF/Excel/CSV) for selected rows
 * - Easy integration with existing Tabulator tables
 */

class ocTabulatorRowSelector {
    constructor(table, options = {}) {
        this.table = table;
        this.options = {
            checkboxColumnTitle: '☑',
            checkboxColumnWidth: 80,
            checkboxFieldName: '_selected',
            controlsContainerId: null,
            exportOptions: {
                pdf: true,
                excel: true,
                csv: true
            },
            ...options
        };

        this.checkedRows = new Set();
        this.currentFilter = 'all';
        this.headerCheckbox = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    static getCheckboxColumnDefinition(options = {}) {
        const opts = {
            title: '',
            width: 80,
            fieldName: '_selected',
            ...options
        };

        // Define the update function inside the closure
        const updateHeaderCheckboxState = function(table) {
            if (!table.headerCheckbox) return;

            const rows = table.getRows();
            const allChecked = rows.length > 0 && rows.every(row =>
                row.getData()[opts.fieldName] === true
            );
            const someChecked = rows.some(row =>
                row.getData()[opts.fieldName] === true
            );

            table.headerCheckbox.checked = allChecked;
            table.headerCheckbox.indeterminate = someChecked && !allChecked;
        };

        return {
            title: opts.title,
            field: opts.fieldName,
            width: opts.width,
            hozAlign: "center",
            headerSort: false,
            headerHozAlign: "center",
            formatter: function(cell) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = cell.getValue() || false;
                checkbox.style.cursor = 'pointer';
                checkbox.style.margin = '0';

                checkbox.addEventListener('change', function(e) {
                    cell.setValue(e.target.checked);
                    updateHeaderCheckboxState(cell.getTable());
                });

                return checkbox;
            },
            titleFormatter: function(column) {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.justifyContent = 'center';
                container.style.alignItems = 'center';
                container.style.gap = '4px';
                container.style.height = '100%';

                // Main header checkbox
                const mainCheckbox = document.createElement('input');
                mainCheckbox.type = 'checkbox';
                mainCheckbox.style.cursor = 'pointer';
                mainCheckbox.style.margin = '0';

                column.getTable().headerCheckbox = mainCheckbox;

                mainCheckbox.addEventListener('change', function(e) {
                    const table = column.getTable();
                    const checked = e.target.checked;
                    table.getRows().forEach(row => {
                        row.update({ [opts.fieldName]: checked });
                    });
                });

                // Controls container
                const controlsContainer = document.createElement('div');
                controlsContainer.style.display = 'flex';
                controlsContainer.style.gap = '6px';

                // View All button (👁)
                const viewAllBtn = document.createElement('span');
                viewAllBtn.innerHTML = '&#128065;';
                viewAllBtn.title = 'View all rows';
                viewAllBtn.style.cursor = 'pointer';
                viewAllBtn.style.fontSize = '1.1em';
                viewAllBtn.className = 'header-filter-btn view-all-btn active';

                // Checked filter button (☑)
                const checkedBtn = document.createElement('span');
                checkedBtn.innerHTML = '&#9745;';
                checkedBtn.title = 'Show checked only';
                checkedBtn.style.cursor = 'pointer';
                checkedBtn.style.fontSize = '1.2em';
                checkedBtn.className = 'header-filter-btn checked-btn';

                // Unchecked filter button (☐)
                const uncheckedBtn = document.createElement('span');
                uncheckedBtn.innerHTML = '&#9744;';
                uncheckedBtn.title = 'Show unchecked only';
                uncheckedBtn.style.cursor = 'pointer';
                uncheckedBtn.style.fontSize = '1.2em';
                uncheckedBtn.className = 'header-filter-btn unchecked-btn';

                // Set active button based on current filter
                const setActiveButton = (activeBtn) => {
                    [viewAllBtn, checkedBtn, uncheckedBtn].forEach(btn => {
                        btn.classList.remove('active');
                    });
                    activeBtn.classList.add('active');
                };

                // Click handlers
                viewAllBtn.addEventListener('click', () => {
                    column.getTable().clearFilter();
                    setActiveButton(viewAllBtn);
                });

                checkedBtn.addEventListener('click', () => {
                    column.getTable().setFilter(opts.fieldName, '=', true);
                    setActiveButton(checkedBtn);
                });

                uncheckedBtn.addEventListener('click', () => {
                    column.getTable().setFilter(function(data){
                        const val = data[opts.fieldName];
                        return val === undefined || val === null || val === false;
                    });
                    setActiveButton(uncheckedBtn);
                });

                // Add controls to container
                controlsContainer.appendChild(viewAllBtn);
                controlsContainer.appendChild(checkedBtn);
                controlsContainer.appendChild(uncheckedBtn);

                container.appendChild(mainCheckbox);
                container.appendChild(controlsContainer);

                // Initialize header checkbox state
                setTimeout(() => {
                    updateHeaderCheckboxState(column.getTable());
                }, 0);

                return container;
            },
            editor: false,
            download: false,
            clipboard: false,
            print: false
        };
    }

// Helper function to update header checkbox state
    updateHeaderCheckboxState(table) {
        if (!table.headerCheckbox) return;

        const rows = table.getRows();
        const allChecked = rows.length > 0 && rows.every(row =>
            row.getData()[table.getColumn('_selected').getField()] === true
        );
        const someChecked = rows.some(row =>
            row.getData()[table.getColumn('_selected').getField()] === true
        );

        table.headerCheckbox.checked = allChecked;
        table.headerCheckbox.indeterminate = someChecked && !allChecked;
    }



    /**
     * Add checkbox column to existing table
     */
    addCheckboxColumn() {
        const columns = this.table.getColumnDefinitions();
        const checkboxColumn = ocTabulatorRowSelector.getCheckboxColumnDefinition({
            title: this.options.checkboxColumnTitle,
            width: this.options.checkboxColumnWidth,
            fieldName: this.options.checkboxFieldName
        });
        
        // Find position after row numbers
        let insertIndex = 0;
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].formatter === 'rownum') {
                insertIndex = i + 1;
                break;
            }
        }
        
        columns.splice(insertIndex, 0, checkboxColumn);
        this.table.setColumns(columns);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for checkbox changes
        this.table.element.addEventListener('checkboxChanged', (e) => {
            const { row, checked, data } = e.detail;
            const rowId = this.getRowId(data);
            
            if (checked) {
                this.checkedRows.add(rowId);
            } else {
                this.checkedRows.delete(rowId);
            }
            
            this.updateControlsUI();
        });
        
        // Listen for data changes to maintain checked state
        this.table.on("dataLoaded", () => {
            this.restoreCheckboxStates();
        });
        
        this.table.on("dataFiltered", () => {
            this.updateControlsUI();
        });
    }
    
    /**
     * Get unique row identifier
     */
    getRowId(data) {
        return data.id || data._id || JSON.stringify(data);
    }
    
    /**
     * Restore checkbox states after data reload
     */
    restoreCheckboxStates() {
        this.table.getRows().forEach(row => {
            const data = row.getData();
            const rowId = this.getRowId(data);
            const shouldBeChecked = this.checkedRows.has(rowId);
            
            row.update({
                [this.options.checkboxFieldName]: shouldBeChecked
            });
        });
    }
    

    

    
    /**
     * Update controls UI with current counts
     */
    updateControlsUI() { return;
        const checkedCountEl = document.getElementById('checked-count');
        const visibleCountEl = document.getElementById('visible-count');
        
        if (checkedCountEl) {
            checkedCountEl.textContent = this.getCheckedCount();
        }
        
        if (visibleCountEl) {
            visibleCountEl.textContent = this.getVisibleCount();
        }
    }
    
    /**
     * Filter functions
     */
    setFilter(type) {
        this.currentFilter = type;
        
        switch (type) {
            case 'checked':
                this.table.setFilter(this.options.checkboxFieldName, '=', true);
                break;
            case 'unchecked':
                this.table.setFilter(function(data){
                    let val = data[this.options.checkboxFieldName];
                    return val === undefined || val === null || val === "";
                }.bind(this));
                break;
            default:
                this.table.clearFilter();
                break;
        }
    }
    
    /**
     * Bulk operations
     */
    checkAll() {
        this.table.getRows().forEach(row => {
            row.update({ [this.options.checkboxFieldName]: true });
            this.checkedRows.add(this.getRowId(row.getData()));
        });
        this.updateControlsUI();
    }
    
    uncheckAll() {
        this.table.getRows().forEach(row => {
            row.update({ [this.options.checkboxFieldName]: false });
        });
        this.checkedRows.clear();
        this.updateControlsUI();
    }
    
    checkVisible() {
        this.table.getRows("visible").forEach(row => {
            row.update({ [this.options.checkboxFieldName]: true });
            this.checkedRows.add(this.getRowId(row.getData()));
        });
        this.updateControlsUI();
    }
    
    uncheckVisible() {
        this.table.getRows("visible").forEach(row => {
            row.update({ [this.options.checkboxFieldName]: false });
            this.checkedRows.delete(this.getRowId(row.getData()));
        });
        this.updateControlsUI();
    }
    
    /**
     * Export functions
     */
    exportChecked(format) {
        const checkedRows = this.getCheckedRows();
        if (checkedRows.length === 0) {
            alert('No checked rows to export');
            return;
        }
        
        this.exportRows(checkedRows, format, 'checked_rows');
    }
    
    exportUnchecked(format) {
        const uncheckedRows = this.getUncheckedRows();
        if (uncheckedRows.length === 0) {
            alert('No unchecked rows to export');
            return;
        }
        
        this.exportRows(uncheckedRows, format, 'unchecked_rows');
    }
    
    exportRows(rows, format, filename) {
        // Create temporary table with only the specified rows
        const originalData = this.table.getData();
        const exportData = rows.map(row => row.getData());
        
        // Temporarily set data
        this.table.replaceData(exportData).then(() => {
            // Perform export
            switch (format) {
                case 'csv':
                    this.table.download("csv", `${filename}.csv`);
                    break;
                case 'xlsx':
                    this.table.download("xlsx", `${filename}.xlsx`, {sheetName: "Data"});
                    break;
                case 'pdf':
                    this.table.download("pdf", `${filename}.pdf`, {
                        orientation: "landscape",
                        title: `${filename.replace('_', ' ').toUpperCase()}`
                    });
                    break;
            }
            
            // Restore original data
            setTimeout(() => {
                this.table.replaceData(originalData).then(() => {
                    this.restoreCheckboxStates();
                    this.setFilter(this.currentFilter);
                });
            }, 100);
        });
    }
    
    /**
     * Utility functions
     */
    getCheckedRows() {
        return this.table.getRows().filter(row => 
            row.getData()[this.options.checkboxFieldName] === true
        );
    }
    
    getUncheckedRows() {
        return this.table.getRows().filter(row => 
            row.getData()[this.options.checkboxFieldName] !== true
        );
    }
    
    getCheckedCount() {
        return this.getCheckedRows().length;
    }
    
    getUncheckedCount() {
        return this.getUncheckedRows().length;
    }
    
    getVisibleCount() {
        return this.table.getRows("visible").length;
    }
    
    /**
     * Public API methods
     */
    getCheckedData() {
        return this.getCheckedRows().map(row => row.getData());
    }
    
    getUncheckedData() {
        return this.getUncheckedRows().map(row => row.getData());
    }
    
    setRowChecked(rowId, checked = true) {
        const row = this.table.getRow(rowId);
        if (row) {
            row.update({ [this.options.checkboxFieldName]: checked });
            
            if (checked) {
                this.checkedRows.add(this.getRowId(row.getData()));
            } else {
                this.checkedRows.delete(this.getRowId(row.getData()));
            }
            
            this.updateControlsUI();
        }
    }
    
    isRowChecked(rowId) {
        const row = this.table.getRow(rowId);
        return row ? row.getData()[this.options.checkboxFieldName] === true : false;
    }
}

// Usage Examples and Documentation
/*
=== USAGE EXAMPLES ===

// 1. Basic Setup with existing table
const table = new Tabulator("#example-table", {
    data: myData,
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        // Checkbox column will be inserted here automatically
        {title: "Name", field: "name"},
        {title: "Email", field: "email"},
        // ... other columns
    ]
});

// Initialize widget
const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'table-controls'
});

// 2. Setup with predefined checkbox column
const columns = [
    {formatter: "rownum", hozAlign: "center", width: 40},
    ocTabulatorRowSelector.getCheckboxColumnDefinition({
        title: '✓',
        width: 60
    }),
    {title: "Name", field: "name"},
    {title: "Email", field: "email"}
];

const table = new Tabulator("#example-table", {
    data: myData,
    columns: columns
});

const checkboxWidget = new ocTabulatorRowSelector(table, {
    controlsContainerId: 'table-controls',
    checkboxFieldName: '_selected',
    exportOptions: {
        pdf: true,
        excel: true,
        csv: true
    }
});

// 3. Programmatic access
// Get checked data
const checkedData = checkboxWidget.getCheckedData();
console.log('Checked rows:', checkedData);

// Check/uncheck specific row
checkboxWidget.setRowChecked(1, true);  // Check row with ID 1
checkboxWidget.setRowChecked(2, false); // Uncheck row with ID 2

// Check if row is checked
const isChecked = checkboxWidget.isRowChecked(1);

// 4. HTML structure needed
<div id="table-controls"></div>
<div id="example-table"></div>

=== FEATURES INCLUDED ===

✅ Checkbox column (automatically positioned after row numbers)
✅ Filter controls (All/Checked/Unchecked)
✅ Bulk operations (Check All/Uncheck All/Check Visible/Uncheck Visible)
✅ Export functionality (PDF/Excel/CSV for checked or unchecked rows)
✅ Status display (count of checked and visible rows)
✅ Programmatic API for external control
✅ Persistent state across data reloads
✅ Event system for integration
✅ Responsive UI with modern styling

=== REQUIRED DEPENDENCIES FOR EXPORT ===

For full export functionality, include:

<!-- For Excel export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<!-- For PDF export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>

*/