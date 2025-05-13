/**
 * OCalliter Tabulator - A table generator based on the tabulator.info library
 * 
 * This module creates an editable tabulator with columns defined by a colDef array.
 * It supports various data types including string, url, email, phone, integer, money,
 * decimal, percentage, date, datetime, time, and select lists.
 * Includes features for row editing with action buttons, row numbering, and delete confirmation.
 */

// Main object to contain our tabulator functionality
var ocalliter_tabulator = {
    // Configuration variables
    config: {
        selector: '#data-table',  // Default selector for the table
        tableOptions: {
            height: 'auto',       // Default height
            layout: 'fitColumns', // Default layout
            responsiveLayout: 'collapse',
            pagination: 'local',  // Default pagination type
            paginationSize: 10,   // Default rows per page
            index: "id",          // Default index column
            rowNumColumn: true,   // Show row numbers
            rowNumColumnDefaults: {
                formatter: "rownum",
                hozAlign: "center",
                width: 60,
                headerSort: false
            }
        },
        prefix: 'ocalliter-',     // CSS class prefix
        editableRowIds: []        // Track which rows are currently in edit mode
    },
    
    // Store active listeners for easy cleanup
    activeListeners: [],
    
    // Store table instance
    table: null,
    
    /**
     * Initialize the tabulator
     * @param {Object} options - Configuration options
     * @param {string} options.selector - Table selector
     * @param {Array} options.colDef - Column definitions
     * @param {Array} options.data - Initial data
     * @param {Object} options.tableOptions - Tabulator options
     * @param {string} options.prefix - CSS class prefix (optional)
     */
    init: function(options) {
        try {
            // Merge options with defaults
            if (options) {
                if (options.selector) this.config.selector = options.selector;
                if (options.tableOptions) $.extend(this.config.tableOptions, options.tableOptions);
                if (options.prefix) this.config.prefix = options.prefix;
            }
            
            // Ensure we have column definitions
            if (!options.colDef || !Array.isArray(options.colDef) || options.colDef.length === 0) {
                throw new Error('Column definitions are required and must be an array');
            }
            
            // Add actions column at the beginning
            var actionColumn = {
                title: "Actions",
                headerSort: false,
                formatter: this.actionsColumnFormatter,
                width: 150,
                hozAlign: "center",
                cellClick: this.handleActionButtonClick
            };
            
            // Process column definitions
            var columnConfig = this.processColumnDefinitions(options.colDef);
            
            // Add the actions column at position 1 (after row numbers)
            columnConfig.unshift(actionColumn);
            
            // Prepare tabulator options
            var tabulatorOptions = {
                columns: columnConfig,
                data: options.data || [],
                layout: this.config.tableOptions.layout,
                height: this.config.tableOptions.height,
                responsiveLayout: this.config.tableOptions.responsiveLayout,
                pagination: this.config.tableOptions.pagination,
                paginationSize: this.config.tableOptions.paginationSize,
                cellEdited: this.onCellEdited,
                index: this.config.tableOptions.index,
                rowAdded: this.onRowAdded
            };
            
            // Add row numbers if enabled
            if (this.config.tableOptions.rowNumColumn) {
                tabulatorOptions.rowNumberColumn = true;
                tabulatorOptions.rowNumberColumnDefaults = this.config.tableOptions.rowNumColumnDefaults;
            }
            
            // Initialize Tabulator
            this.table = new Tabulator(this.config.selector, tabulatorOptions);
            
            // Set up listeners
            this.setupListeners();
            
            return this.table;
        } catch (err) {
            this.handleError('init', err);
            return null;
        }
    },
    
    /**
     * Formatter for the actions column
     * @param {Object} cell - Cell component
     * @returns {string} - HTML for the actions buttons
     */
    actionsColumnFormatter: function(cell) {
        var rowId = cell.getRow().getData().id;
        var isEditing = ocalliter_tabulator.isRowInEditMode(rowId);
        
        if (isEditing) {
            return '<button class="' + ocalliter_tabulator.config.prefix + 'save-btn" data-id="' + rowId + '">Save</button> ' +
                   '<button class="' + ocalliter_tabulator.config.prefix + 'cancel-btn" data-id="' + rowId + '">Cancel</button>';
        } else {
            return '<button class="' + ocalliter_tabulator.config.prefix + 'edit-btn" data-id="' + rowId + '">Edit</button> ' +
                   '<button class="' + ocalliter_tabulator.config.prefix + 'delete-btn" data-id="' + rowId + '">Delete</button>';
        }
    },
    
    /**
     * Handle clicks on action buttons
     * @param {Event} e - Click event
     * @param {Object} cell - Cell component
     */
    handleActionButtonClick: function(e, cell) {
        try {
            // Get the clicked element
            var target = e.target;
            
            // Only proceed if a button was clicked
            if (target.tagName !== 'BUTTON') return;
            
            // Get row data and ID
            var row = cell.getRow();
            var rowData = row.getData();
            var rowId = rowData.id;
            
            // Handle different button actions
            if (target.classList.contains(ocalliter_tabulator.config.prefix + 'edit-btn')) {
                ocalliter_tabulator.editRow(row);
            } else if (target.classList.contains(ocalliter_tabulator.config.prefix + 'save-btn')) {
                ocalliter_tabulator.saveRow(row);
            } else if (target.classList.contains(ocalliter_tabulator.config.prefix + 'cancel-btn')) {
                ocalliter_tabulator.cancelEdit(row);
            } else if (target.classList.contains(ocalliter_tabulator.config.prefix + 'delete-btn')) {
                // For delete, show confirmation dialog with the third column value
                var columns = row.getTable().getColumnDefinitions();
                var thirdColumnValue = "";
                
                // Find the third data column (after row number and actions)
                if (columns.length > 2) {
                    var thirdColumnField = columns[2].field;
                    thirdColumnValue = rowData[thirdColumnField] || "";
                }
                
                if (confirm("Confirme borrar: " + thirdColumnValue)) {
                    ocalliter_tabulator.deleteRow(row);
                }
            }
        } catch (err) {
            ocalliter_tabulator.handleError('handleActionButtonClick', err);
        }
    },
    
    /**
     * Check if a row is in edit mode
     * @param {number|string} rowId - Row ID
     * @returns {boolean} - True if row is in edit mode
     */
    isRowInEditMode: function(rowId) {
        return this.config.editableRowIds.indexOf(rowId) !== -1;
    },
    
    /**
     * Put a row into edit mode
     * @param {Object} row - Row component
     */
    editRow: function(row) {
        try {
            var rowData = row.getData();
            var rowId = rowData.id;
            
            // Add to editable rows
            if (!this.isRowInEditMode(rowId)) {
                this.config.editableRowIds.push(rowId);
            }
            
            // Update the actions column and formatters
            this.table.redraw(true);
            
            // Get all columns and make them editable
            var columns = this.table.getColumnDefinitions();
            
            // Skip first two columns (row number and actions)
            for (var i = 2; i < columns.length; i++) {
                var column = columns[i];
                if (column.field) { // Ensure there's a field property
                    var cell = row.getCell(column.field);
                    if (cell) {
                        var columnDef = this.getColumnDefByField(column.field);
                        
                        // Only make editable columns actually editable
                        if (columnDef && columnDef.editable !== false) {
                            cell.getElement().classList.add(this.config.prefix + 'editable-cell');
                            
                            // For cells with links (email, url, phone), we need special handling
                            var dataType = columnDef.dataType;
                            if (dataType === 'email' || dataType === 'url' || dataType === 'phone') {
                                // First update the formatter to plain text
                                this.table.redraw(true);
                                // Then start editing
                                setTimeout(function() {
                                    cell.edit();
                                }, 10);
                            } else {
                                cell.edit();
                            }
                        }
                    }
                }
            }
        } catch (err) {
            this.handleError('editRow', err);
        }
    },
    
    /**
     * Get column definition by field name
     * @param {string} field - Field name
     * @returns {Object|null} - Column definition or null if not found
     */
    getColumnDefByField: function(field) {
        try {
            var colDefs = this.table.getColumnDefinitions();
            
            for (var i = 0; i < colDefs.length; i++) {
                if (colDefs[i].field === field) {
                    return colDefs[i];
                }
            }
            
            return null;
        } catch (err) {
            this.handleError('getColumnDefByField', err);
            return null;
        }
    },
    
    /**
     * Save edited row data
     * @param {Object} row - Row component
     */
    saveRow: function(row) {
        try {
            var rowData = row.getData();
            var rowId = rowData.id;
            var isValid = true;
            var invalidFields = [];
            
            // Validate all cells
            var columns = this.table.getColumnDefinitions();
            
            // Skip first two columns (row number and actions)
            for (var i = 2; i < columns.length; i++) {
                var column = columns[i];
                if (column.field) {
                    var cell = row.getCell(column.field);
                    if (cell) {
                        // Get cell value
                        var value = cell.getValue();
                        
                        // Check if required
                        var isRequired = column.validator && column.validator.includes("required");
                        if (isRequired && (value === null || value === undefined || value === "")) {
                            isValid = false;
                            invalidFields.push(column.title);
                            cell.getElement().classList.add(this.config.prefix + 'invalid-cell');
                        } 
                        // Validate based on data type
                        else if (value !== null && value !== undefined && value !== "") {
                            var cellIsValid = this.validateCellByType(cell, column);
                            if (!cellIsValid) {
                                isValid = false;
                                invalidFields.push(column.title);
                                cell.getElement().classList.add(this.config.prefix + 'invalid-cell');
                            } else {
                                cell.getElement().classList.remove(this.config.prefix + 'invalid-cell');
                            }
                        }
                        else {
                            cell.getElement().classList.remove(this.config.prefix + 'invalid-cell');
                        }
                    }
                }
            }
            
            if (isValid) {
                // Remove from editable rows
                var index = this.config.editableRowIds.indexOf(rowId);
                if (index !== -1) {
                    this.config.editableRowIds.splice(index, 1);
                }
                
                // Update the row data
                row.update(row.getData());
                
                // Remove editable classes
                var cells = row.getCells();
                cells.forEach(function(cell) {
                    cell.getElement().classList.remove(ocalliter_tabulator.config.prefix + 'editable-cell');
                    cell.getElement().classList.remove(ocalliter_tabulator.config.prefix + 'invalid-cell');
                });
                
                // Update the actions column
                this.table.redraw(true);
                
                // Trigger event
                $(this.config.selector).trigger('rowSaved', [rowData, row.getIndex()]);
            } else {
                alert("Please correct the following fields: " + invalidFields.join(", "));
            }
        } catch (err) {
            this.handleError('saveRow', err);
        }
    },
    
    /**
     * Cancel row editing
     * @param {Object} row - Row component
     */
    cancelEdit: function(row) {
        try {
            var rowData = row.getData();
            var rowId = rowData.id;
            
            // Check if this is a new row
            var isNewRow = rowData._isNew === true;
            
            if (isNewRow) {
                // If it's a new row, delete it
                row.delete();
            } else {
                // Remove from editable rows
                var index = this.config.editableRowIds.indexOf(rowId);
                if (index !== -1) {
                    this.config.editableRowIds.splice(index, 1);
                }
                
                // Reset the row to original data
                row.update(rowData);
                
                // Remove editable classes
                var cells = row.getCells();
                cells.forEach(function(cell) {
                    cell.getElement().classList.remove(ocalliter_tabulator.config.prefix + 'editable-cell');
                    cell.getElement().classList.remove(ocalliter_tabulator.config.prefix + 'invalid-cell');
                });
                
                // Update the actions column
                this.table.redraw(true);
            }
        } catch (err) {
            this.handleError('cancelEdit', err);
        }
    },
    
    /**
     * Delete a row after confirmation
     * @param {Object} row - Row component
     */
    deleteRow: function(row) {
        try {
            var rowData = row.getData();
            
            // Delete the row
            row.delete();
            
            // Trigger event
            $(this.config.selector).trigger('rowDeleted', [rowData]);
        } catch (err) {
            this.handleError('deleteRow', err);
        }
    },
    
    /**
     * Handle newly added rows
     * @param {Object} row - Row component
     */
    onRowAdded: function(row) {
        try {
            // Mark as new row
            var rowData = row.getData();
            rowData._isNew = true;
            row.update(rowData);
            
            // Put into edit mode
            ocalliter_tabulator.editRow(row);
        } catch (err) {
            ocalliter_tabulator.handleError('onRowAdded', err);
        }
    },
    
    /**
     * Process column definitions into tabulator format
     * @param {Array} colDef - Column definitions array
     * @returns {Array} - Processed column configurations
     */
    processColumnDefinitions: function(colDef) {
        try {
            return colDef.map(function(col) {
                // Store the original data type for reference
                var dataType = col.dataType || 'string';
                
                // Base column configuration
                var columnConfig = {
                    field: col.colName,
                    title: col.Label || col.colName,
                    editor: col.editable ? this.getEditorByType(dataType) : false,
                    formatter: col.formatter || this.getFormatterByType(dataType),
                    headerFilter: true,
                    validator: col.required ? ["required"] : undefined,
                    cssClass: this.config.prefix + 'cell-' + dataType,
                    dataType: dataType, // Store the data type for later reference
                    editable: col.editable, // Store editable status for reference
                    clickable: false // Disable default cell click behavior for select, calendar, etc.
                };
                
                // Add additional configurations based on data type
                this.configureColumnByType(columnConfig, col);
                
                // For date and select fields, add cell click handler to prevent unwanted interactions
                if (dataType === 'date' || dataType === 'datetime' || dataType === 'time' || 
                    dataType === 'select' || dataType === 'select multiple') {
                    columnConfig.cellClick = function(e, cell) {
                        // Only allow interaction if the row is in edit mode
                        var row = cell.getRow();
                        var rowData = row.getData();
                        var rowId = rowData.id;
                        
                        if (!ocalliter_tabulator.isRowInEditMode(rowId)) {
                            // Prevent default interaction
                            e.stopPropagation();
                        }
                    };
                }
                
                return columnConfig;
            }, this);
        } catch (err) {
            this.handleError('processColumnDefinitions', err);
            return [];
        }
    },
    
    /**
     * Get the appropriate editor based on data type
     * @param {string} type - Data type
     * @returns {string} - Tabulator editor type
     */
    getEditorByType: function(type) {
        switch (type) {
            case 'integer':
            case 'decimal':
                return 'number';
            case 'money':
                return 'money';
            case 'percentage':
                return 'number';
            case 'date':
                return 'date';
            case 'datetime':
                return 'datetime';
            case 'time':
                return 'time';
            case 'select':
            case 'select multiple':
                return 'select';
            case 'url':
            case 'email':
            case 'phone':
            case 'string':
            default:
                return 'input';
        }
    },
    
    /**
     * Get the appropriate formatter based on data type
     * @param {string} type - Data type
     * @returns {string|function} - Tabulator formatter
     */
    getFormatterByType: function(type) {
        switch (type) {
            case 'url':
                return this.urlFormatter;
            case 'email':
                return this.emailFormatter;
            case 'phone':
                return this.phoneFormatter;
            case 'integer':
                return 'number';
            case 'money':
                return 'money';
            case 'decimal':
                return 'number';
            case 'percentage':
                return this.percentageFormatter;
            case 'date':
                return 'datetime';
            case 'datetime':
                return 'datetime';
            case 'time':
                return 'datetime';
            default:
                return 'plaintext';
        }
    },
    
    /**
     * Add additional configuration to column based on data type
     * @param {Object} columnConfig - Column configuration object
     * @param {Object} col - Original column definition
     */
    configureColumnByType: function(columnConfig, col) {
        switch (col.dataType) {
            case 'integer':
                columnConfig.validator = [
                    'required',
                    'integer'
                ];
                break;
            case 'decimal':
            case 'money':
                columnConfig.validator = [
                    'required',
                    'numeric'
                ];
                if (col.dataType === 'money') {
                    columnConfig.formatter = 'money';
                    columnConfig.formatterParams = {
                        thousand: ',',
                        decimal: '.',
                        symbol: '$'
                    };
                }
                break;
            case 'percentage':
                columnConfig.validator = [
                    'required',
                    'numeric'
                ];
                columnConfig.formatterParams = {
                    precision: 2
                };
                break;
            case 'date':
                columnConfig.sorter = 'date';
                break;
            case 'datetime':
                columnConfig.sorter = 'datetime';
                break;
            case 'time':
                columnConfig.sorter = 'time';
                break;
            case 'select':
            case 'select multiple':
                if (col.options) {
                    columnConfig.editor = 'select';
                    columnConfig.editorParams = {
                        values: col.options
                    };
                    if (col.dataType === 'select multiple') {
                        columnConfig.editorParams.multiselect = true;
                    }
                }
                break;
            case 'email':
                columnConfig.validator = [
                    'required',
                    { type: 'regex', regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }
                ];
                break;
            case 'url':
                columnConfig.validator = [
                    'required',
                    { type: 'regex', regex: '^(http|https):\\/\\/[a-zA-Z0-9-\\.]+\\.[a-zA-Z]{2,}(\\/\\S*)?$' }
                ];
                break;
            case 'phone':
                columnConfig.validator = [
                    'required',
                    { type: 'regex', regex: '^[+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$' }
                ];
                break;
        }
    },
    
    /**
     * URL formatter function
     * @param {Object} cell - Cell component
     * @returns {string} - Formatted HTML
     */
    urlFormatter: function(cell) {
        var value = cell.getValue();
        if (!value) return '';
        
        // Check if this row is in edit mode
        var row = cell.getRow();
        var rowData = row.getData();
        var rowId = rowData.id;
        
        // If row is in edit mode, don't make it a clickable link
        if (ocalliter_tabulator.isRowInEditMode(rowId)) {
            return value;
        }
        
        return '<a href="' + value + '" target="_blank" class="' + ocalliter_tabulator.config.prefix + 'url-link">' + value + '</a>';
    },
    
    /**
     * Email formatter function
     * @param {Object} cell - Cell component
     * @returns {string} - Formatted HTML
     */
    emailFormatter: function(cell) {
        var value = cell.getValue();
        if (!value) return '';
        
        // Check if this row is in edit mode
        var row = cell.getRow();
        var rowData = row.getData();
        var rowId = rowData.id;
        
        // If row is in edit mode, don't make it a clickable link
        if (ocalliter_tabulator.isRowInEditMode(rowId)) {
            return value;
        }
        
        return '<a href="mailto:' + value + '" class="' + ocalliter_tabulator.config.prefix + 'email-link">' + value + '</a>';
    },
    
    /**
     * Phone formatter function
     * @param {Object} cell - Cell component
     * @returns {string} - Formatted HTML
     */
    phoneFormatter: function(cell) {
        var value = cell.getValue();
        if (!value) return '';
        
        // Check if this row is in edit mode
        var row = cell.getRow();
        var rowData = row.getData();
        var rowId = rowData.id;
        
        // If row is in edit mode, don't make it a clickable link
        if (ocalliter_tabulator.isRowInEditMode(rowId)) {
            return value;
        }
        
        return '<a href="tel:' + value + '" class="' + ocalliter_tabulator.config.prefix + 'phone-link">' + value + '</a>';
    },
    
    /**
     * Percentage formatter function
     * @param {Object} cell - Cell component
     * @returns {string} - Formatted percentage
     */
    percentageFormatter: function(cell) {
        var value = cell.getValue();
        if (value === null || value === undefined || value === '') return '';
        return value + '%';
    },
    
    /**
     * Cell edited callback
     * @param {Object} cell - Cell component
     */
    onCellEdited: function(cell) {
        try {
            var field = cell.getField();
            var value = cell.getValue();
            var oldValue = cell.getOldValue();
            var row = cell.getRow();
            var data = row.getData();
            var columnDef = cell.getColumn().getDefinition();
            
            // Validate the cell based on data type
            var isValid = ocalliter_tabulator.validateCellByType(cell, columnDef);
            
            // Apply visual styling based on validity
            var element = cell.getElement();
            if (!isValid) {
                element.classList.add(ocalliter_tabulator.config.prefix + 'invalid-cell');
            } else {
                element.classList.remove(ocalliter_tabulator.config.prefix + 'invalid-cell');
            }
            
            // Trigger an event that can be listened for
            $(ocalliter_tabulator.config.selector).trigger('cellEdited', [field, value, oldValue, data, row.getIndex(), isValid]);
        } catch (err) {
            ocalliter_tabulator.handleError('onCellEdited', err);
        }
    },
    
    /**
     * Validate cell value based on data type
     * @param {Object} cell - Cell component
     * @param {Object} columnDef - Column definition
     * @returns {boolean} - True if valid, false if invalid
     */
    validateCellByType: function(cell, columnDef) {
        try {
            var value = cell.getValue();
            var dataType = columnDef.dataType || 'string';
            
            // If value is empty and not required, it's valid
            if ((value === null || value === undefined || value === '') && 
                (!columnDef.validator || !columnDef.validator.includes('required'))) {
                return true;
            }
            
            // Validate based on data type
            switch (dataType) {
                case 'email':
                    return this.validateEmail(value);
                case 'url':
                    return this.validateUrl(value);
                case 'phone':
                    return this.validatePhone(value);
                case 'integer':
                    return this.validateInteger(value);
                case 'decimal':
                case 'money':
                    return this.validateDecimal(value);
                case 'percentage':
                    return this.validatePercentage(value);
                default:
                    return true; // Default to valid for other types
            }
        } catch (err) {
            this.handleError('validateCellByType', err);
            return false;
        }
    },
    
    /**
     * Validate email format
     * @param {string} value - Email value
     * @returns {boolean} - True if valid
     */
    validateEmail: function(value) {
        if (!value) return false;
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
    },
    
    /**
     * Validate URL format
     * @param {string} value - URL value
     * @returns {boolean} - True if valid
     */
    validateUrl: function(value) {
        if (!value) return false;
        var urlRegex = /^(http|https):\/\/[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
        return urlRegex.test(value);
    },
    
    /**
     * Validate phone format
     * @param {string} value - Phone value
     * @returns {boolean} - True if valid
     */
    validatePhone: function(value) {
        if (!value) return false;
        var phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(value);
    },
    
    /**
     * Validate integer format
     * @param {*} value - Integer value
     * @returns {boolean} - True if valid
     */
    validateInteger: function(value) {
        if (value === null || value === undefined || value === '') return false;
        return Number.isInteger(Number(value));
    },
    
    /**
     * Validate decimal format
     * @param {*} value - Decimal value
     * @returns {boolean} - True if valid
     */
    validateDecimal: function(value) {
        if (value === null || value === undefined || value === '') return false;
        var num = Number(value);
        return !isNaN(num) && isFinite(num);
    },
    
    /**
     * Validate percentage format
     * @param {*} value - Percentage value
     * @returns {boolean} - True if valid
     */
    validatePercentage: function(value) {
        if (value === null || value === undefined || value === '') return false;
        var num = Number(value);
        return !isNaN(num) && isFinite(num) && num >= 0 && num <= 100;
    },
    
    /**
     * Set up event listeners
     */
    setupListeners: function() {
        try {
            // Example of setting up listeners
            var $table = $(this.config.selector);
            
            // Add row button
            $('#add-row-btn').on('click', function() {
                ocalliter_tabulator.addRow();
            });
            this.activeListeners.push({ selector: '#add-row-btn', event: 'click' });
            
            // Delete row button
            $('#delete-row-btn').on('click', function() {
                ocalliter_tabulator.deleteSelectedRows();
            });
            this.activeListeners.push({ selector: '#delete-row-btn', event: 'click' });
            
            // Save data button
            $('#save-data-btn').on('click', function() {
                ocalliter_tabulator.saveData();
            });
            this.activeListeners.push({ selector: '#save-data-btn', event: 'click' });
            
            // Custom cell edited listener
            $table.on('cellEdited', this.handleCellEdited);
            this.activeListeners.push({ selector: this.config.selector, event: 'cellEdited' });
            
            // Row saved event listener
            $table.on('rowSaved', function(e, rowData, rowIndex) {
                console.log('Row saved:', rowData);
            });
            this.activeListeners.push({ selector: this.config.selector, event: 'rowSaved' });
            
            // Row deleted event listener
            $table.on('rowDeleted', function(e, rowData) {
                console.log('Row deleted:', rowData);
            });
            this.activeListeners.push({ selector: this.config.selector, event: 'rowDeleted' });
        } catch (err) {
            this.handleError('setupListeners', err);
        }
    },
    
    /**
     * Handle cell edited event
     * @param {Event} event - jQuery event
     * @param {string} field - Field name
     * @param {*} value - New value
     * @param {*} oldValue - Old value
     * @param {Object} rowData - Row data
     * @param {number} rowIndex - Row index
     */
    handleCellEdited: function(event, field, value, oldValue, rowData, rowIndex) {
        try {
            // Custom handling for cell edits
            console.log('Cell edited:', field, 'Old:', oldValue, 'New:', value);
            
            // Example: mark row as modified
            var row = ocalliter_tabulator.table.getRow(rowIndex);
            row.getElement().classList.add(ocalliter_tabulator.config.prefix + 'modified-row');
        } catch (err) {
            ocalliter_tabulator.handleError('handleCellEdited', err);
        }
    },
    
    /**
     * Add a new row to the table
     * @param {Object} rowData - Data for the new row (optional)
     */
    addRow: function(rowData) {
        try {
            // Generate a unique ID if not provided
            var newRowData = rowData || {};
            if (!newRowData.id) {
                newRowData.id = this.generateUniqueId();
            }
            
            // Add the new row
            var newRow = this.table.addRow(newRowData);
            
            // Mark as new and put into edit mode automatically
            // Note: onRowAdded will handle this automatically
            
            return newRow;
        } catch (err) {
            this.handleError('addRow', err);
            return null;
        }
    },
    
    /**
     * Generate a unique ID for new rows
     * @returns {number} - Unique ID
     */
    generateUniqueId: function() {
        try {
            var data = this.table.getData();
            var maxId = 0;
            
            // Find the highest existing ID
            data.forEach(function(row) {
                if (row.id && parseInt(row.id) > maxId) {
                    maxId = parseInt(row.id);
                }
            });
            
            // Return next ID
            return maxId + 1;
        } catch (err) {
            this.handleError('generateUniqueId', err);
            return new Date().getTime(); // Fallback to timestamp
        }
    },
    
    /**
     * Delete selected rows
     */
    deleteSelectedRows: function() {
        try {
            var selectedRows = this.table.getSelectedRows();
            if (selectedRows.length > 0) {
                var self = this;
                var thirdColumnValue = "";
                
                // Get the third column for the first selected row
                if (selectedRows.length > 0) {
                    var columns = this.table.getColumnDefinitions();
                    if (columns.length > 2) {
                        var thirdColumnField = columns[2].field;
                        thirdColumnValue = selectedRows[0].getData()[thirdColumnField] || "";
                        
                        // If multiple rows, add "and X more"
                        if (selectedRows.length > 1) {
                            thirdColumnValue += " and " + (selectedRows.length - 1) + " more";
                        }
                    }
                }
                
                // Confirm before deleting
                if (confirm('Confirme borrar: ' + thirdColumnValue)) {
                    selectedRows.forEach(function(row) {
                        self.deleteRow(row);
                    });
                }
            } else {
                alert('No rows selected');
            }
        } catch (err) {
            this.handleError('deleteSelectedRows', err);
        }
    },
    
    /**
     * Get all table data
     * @returns {Array} - Table data
     */
    getData: function() {
        try {
            return this.table.getData();
        } catch (err) {
            this.handleError('getData', err);
            return [];
        }
    },
    
    /**
     * Save data (example implementation)
     * @param {Function} callback - Optional callback after save
     */
    saveData: function(callback) {
        try {
            var data = this.getData();
            console.log('Saving data:', data);
            
            // Example: Send to server
            /*
            $.ajax({
                url: '/save-data',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(response) {
                    console.log('Data saved successfully:', response);
                    if (typeof callback === 'function') callback(true, response);
                },
                error: function(error) {
                    console.error('Error saving data:', error);
                    if (typeof callback === 'function') callback(false, error);
                }
            });
            */
            
            // For now just simulate a successful save
            setTimeout(function() {
                alert('Data saved successfully (simulation)');
                if (typeof callback === 'function') callback(true, { message: 'Simulation successful' });
            }, 500);
        } catch (err) {
            this.handleError('saveData', err);
            if (typeof callback === 'function') callback(false, err);
        }
    },
    
    /**
     * Remove all event listeners
     */
    removeAllListeners: function() {
        try {
            this.activeListeners.forEach(function(listener) {
                $(listener.selector).off(listener.event);
            });
            this.activeListeners = [];
        } catch (err) {
            this.handleError('removeAllListeners', err);
        }
    },
    
    /**
     * Clean up and destroy the tabulator
     */
    destroy: function() {
        try {
            // Remove event listeners
            this.removeAllListeners();
            
            // Destroy tabulator instance
            if (this.table) {
                this.table.destroy();
                this.table = null;
            }
        } catch (err) {
            this.handleError('destroy', err);
        }
    },
    
    /**
     * Error handler
     * @param {string} functionName - Name of the function where error occurred
     * @param {Error} err - Error object
     */
    handleError: function(functionName, err) {
        try {
            // If js_report_error is defined, use it
            if (typeof js_report_error === 'function') {
                js_report_error(err);
            } else if (console.error) {
                console.error('ocalliter_tabulator.' + functionName + ':', err);
            } else if (console.log) {
                console.log('ERROR in ocalliter_tabulator.' + functionName + ':', err);
            }
        } catch (e) {
            // Last resort if even the error handler fails
            console.log('Error in error handler:', e);
        }
    }
};

/**
 * Example usage:
 * 
 * var colDef = [
 *   { colName: 'id', Label: 'ID', formatter: 'number', editable: false, required: true, dataType: 'integer' },
 *   { colName: 'name', Label: 'Name', formatter: null, editable: true, required: true, dataType: 'string' },
 *   { colName: 'email', Label: 'Email', formatter: null, editable: true, required: true, dataType: 'email' },
 *   { colName: 'website', Label: 'Website', formatter: null, editable: true, required: false, dataType: 'url' },
 *   { colName: 'status', Label: 'Status', formatter: null, editable: true, required: true, dataType: 'select', options: {'active': 'Active', 'inactive': 'Inactive'} }
 * ];
 * 
 * var initialData = [
 *   { id: 1, name: 'John Doe', email: 'john@example.com', website: 'https://example.com', status: 'active' }
 * ];
 * 
 * var table = ocalliter_tabulator.init({
 *   selector: '#my-table',
 *   colDef: colDef,
 *   data: initialData,
 *   prefix: 'my-app-'
 * });
 */
