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
            exportOptions: {
                pdf: true,
                excel: true,
                csv: true
            },
            countSelectedId: null,
            countVisibleId: null,
            ...options
        };

        this.currentFilter = 'all';
        this.headerCheckbox = null;
        this._bulkOperationInProgress = false;

        this.init();
    }

    init() {
        this.table._ocTabulatorRowSelector = this;
        this._setupEventListeners();
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

                    // Get the widget instance to check bulk operation flag
                    const table = cell.getTable();
                    const widget = table._ocTabulatorRowSelector;

                    // Only dispatch individual events if not in bulk operation
                    if (!widget || !widget._bulkOperationInProgress) {
                        const event = new CustomEvent('ocTabulatorRowSelectionChanged', {
                            detail: {
                                row: cell.getRow(),
                                checked: e.target.checked,
                                data: cell.getRow().getData(),
                                field: cell.getField(),
                                source: 'user'
                            }
                        });
                        table.element.dispatchEvent(event);
                    }
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
                    const rows = table.getRows();

                    // Set bulk operation flag to prevent individual events
                    const widget = table._ocTabulatorRowSelector;
                    if (widget) {
                        widget._bulkOperationInProgress = true;
                    }

                    // Update all rows
                    rows.forEach(row => {
                        row.update({ [opts.fieldName]: checked });
                    });

                    // Reset bulk operation flag
                    if (widget) {
                        widget._bulkOperationInProgress = false;
                    }

                    // Dispatch bulk selection event
                    const event = new CustomEvent('ocTabulatorBulkSelectionChanged', {
                        detail: {
                            checked: checked,
                            affectedRows: rows,
                            action: checked ? 'checkAll' : 'uncheckAll',
                            source: 'header'
                        }
                    });
                    table.element.dispatchEvent(event);
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

    updateHeaderCheckboxState() {
        if (!this.table.headerCheckbox) return;

        const rows = this.table.getRows();
        const allChecked = rows.length > 0 && rows.every(row =>
            row.getData()[this.options.checkboxFieldName] === true
        );
        const someChecked = rows.some(row =>
            row.getData()[this.options.checkboxFieldName] === true
        );

        this.table.headerCheckbox.checked = allChecked;
        this.table.headerCheckbox.indeterminate = someChecked && !allChecked;
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
    _setupEventListeners() {
        // Listen for individual row selection changes
        this.table.element.addEventListener('ocTabulatorRowSelectionChanged', (e) => {
            const { field } = e.detail;

            // Only handle events from our checkbox field
            if (field !== this.options.checkboxFieldName) {
                return;
            }

            this.updateControlsUI();
            this.updateHeaderCheckboxState();
        });

        // Listen for bulk selection changes
        this.table.element.addEventListener('ocTabulatorBulkSelectionChanged', (e) => {
            this.updateControlsUI();
        });

        // Listen for data changes to update UI
        this.table.on("dataLoaded", () => {
            this.updateControlsUI();
            this.updateHeaderCheckboxState();
        });

        this.table.on("dataFiltered", () => {
            this.updateControlsUI();
        });
    }

    /**
     * Update controls UI with current counts
     */
    updateControlsUI() {
        const checkedCountEl = document.getElementById(this.options.countSelectedId);
        const visibleCountEl = document.getElementById(this.options.countVisibleId);
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
                    return val === undefined || val === null || val === false;
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
        const rows = this.table.getRows();

        // Set bulk operation flag
        this._bulkOperationInProgress = true;

        rows.forEach(row => {
            row.update({ [this.options.checkboxFieldName]: true });
        });

        // Reset bulk operation flag
        this._bulkOperationInProgress = false;

        // Dispatch bulk selection event
        const event = new CustomEvent('ocTabulatorBulkSelectionChanged', {
            detail: {
                checked: true,
                affectedRows: rows,
                action: 'checkAll',
                source: 'programmatic'
            }
        });
        this.table.element.dispatchEvent(event);

        this.updateControlsUI();
        this.updateHeaderCheckboxState();
    }

    uncheckAll() {
        const rows = this.table.getRows();

        // Set bulk operation flag
        this._bulkOperationInProgress = true;

        rows.forEach(row => {
            row.update({ [this.options.checkboxFieldName]: false });
        });

        // Reset bulk operation flag
        this._bulkOperationInProgress = false;

        // Dispatch bulk selection event
        const event = new CustomEvent('ocTabulatorBulkSelectionChanged', {
            detail: {
                checked: false,
                affectedRows: rows,
                action: 'uncheckAll',
                source: 'programmatic'
            }
        });
        this.table.element.dispatchEvent(event);

        this.updateControlsUI();
        this.updateHeaderCheckboxState();
    }

    checkVisible() {
        const rows = this.table.getRows("visible");

        // Set bulk operation flag
        this._bulkOperationInProgress = true;

        rows.forEach(row => {
            row.update({ [this.options.checkboxFieldName]: true });
        });

        // Reset bulk operation flag
        this._bulkOperationInProgress = false;

        // Dispatch bulk selection event
        const event = new CustomEvent('ocTabulatorBulkSelectionChanged', {
            detail: {
                checked: true,
                affectedRows: rows,
                action: 'checkVisible',
                source: 'programmatic'
            }
        });
        this.table.element.dispatchEvent(event);

        this.updateControlsUI();
        this.updateHeaderCheckboxState();
    }

    uncheckVisible() {
        const rows = this.table.getRows("visible");

        // Set bulk operation flag
        this._bulkOperationInProgress = true;

        rows.forEach(row => {
            row.update({ [this.options.checkboxFieldName]: false });
        });

        // Reset bulk operation flag
        this._bulkOperationInProgress = false;

        // Dispatch bulk selection event
        const event = new CustomEvent('ocTabulatorBulkSelectionChanged', {
            detail: {
                checked: false,
                affectedRows: rows,
                action: 'uncheckVisible',
                source: 'programmatic'
            }
        });
        this.table.element.dispatchEvent(event);

        this.updateControlsUI();
        this.updateHeaderCheckboxState();
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
                    this.setFilter(this.currentFilter);
                });
            }, 100);
        });
    }

    /**
     * Utility functions - all rely on data field directly
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

            // Dispatch row selection event
            const event = new CustomEvent('ocTabulatorRowSelectionChanged', {
                detail: {
                    row: row,
                    checked: checked,
                    data: row.getData(),
                    field: this.options.checkboxFieldName,
                    source: 'programmatic'
                }
            });
            this.table.element.dispatchEvent(event);
        }
    }

    isRowChecked(rowId) {
        const row = this.table.getRow(rowId);
        return row ? row.getData()[this.options.checkboxFieldName] === true : false;
    }
}