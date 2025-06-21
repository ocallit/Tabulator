/**
 * Enhanced TabulatorRowEditManager with Add Row functionality
 * 
 * Extends the existing class to support adding new rows that can be saved or cancelled.
 * New rows are automatically put in edit mode and handled the same way as existing row edits.
 */

class TabulatorRowEditManager {
    constructor(table, options = {}) {
        this.table = table;
        this.options = {
            // API endpoints
            saveEndpoint: '/api/save',           // PUT endpoint for saving existing rows
            createEndpoint: '/api/create',       // POST endpoint for creating new rows
            deleteEndpoint: '/api/delete',       // DELETE endpoint for deleting
            
            // Row identification
            idField: 'id',                       // Field containing row ID
            editStateField: '_editing',          // Field to track edit state
            newRowStateField: '_isNewRow',       // Field to track if row is new
            
            // New row defaults
            newRowDefaults: {},                  // Default values for new rows
            newRowPosition: 'top',               // 'top' or 'bottom' - where to add new rows
            
            // Delete confirmation
            deleteConfirmFields: ['name'],       // Fields to show in delete confirmation
            showRowNumberInDelete: true,         // Show row number in delete confirmation
            
            // HTTP configuration
            httpHeaders: {
                'Content-Type': 'application/json'
            },
            
            // Callbacks
            onSaveSuccess: null,                 // (id, oldData, newData) => {}
            onSaveError: null,                   // (id, error, rowData) => {}
            onCreateSuccess: null,               // (tempId, newData) => {}
            onCreateError: null,                 // (tempId, error, rowData) => {}
            onDeleteSuccess: null,               // (id, deletedData) => {}
            onDeleteError: null,                 // (id, error, rowData) => {}
            onEditStart: null,                   // (id, rowData) => {}
            onEditCancel: null,                  // (id, originalData) => {}
            onAddRowStart: null,                 // (tempId, rowData) => {}
            onAddRowCancel: null,                // (tempId, rowData) => {}
            
            ...options
        };
        
        // Instance state
        this.originalRowData = new Map();       // Store original data for cancel
        this.currentEditingRowId = null;        // Track currently editing row
        this.tempRowCounter = 0;                // Counter for temporary row IDs
        
        this.init();
    }
    
    /**
     * Initialize the row edit manager
     */
    init() {
        this.addActionsColumn();
        this.setupGlobalFunctions();
        this.addAddRowButton();
    }
    
    /**
     * Add the "Add Row" button above the table
     */
    addAddRowButton() {
        // Check if button already exists
        var existingButton = document.querySelector('.tabulator-add-row-btn[data-table-id="' + this.instanceId + '"]');
        if (existingButton) {
            return;
        }
        
        // Create add row button
        var addButton = document.createElement('button');
        addButton.innerHTML = '➕ Add Row';
        addButton.className = 'btn btn-add-row tabulator-add-row-btn';
        addButton.setAttribute('data-table-id', this.instanceId);
        addButton.style.cssText = `
            margin-bottom: 10px;
            padding: 8px 16px;
            background: #28a745;
            color: white;
            border: 1px solid #28a745;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        
        // Add hover effect
        addButton.onmouseenter = function() { this.style.opacity = '0.8'; };
        addButton.onmouseleave = function() { this.style.opacity = '1'; };
        
        // Add click handler
        var self = this;
        addButton.onclick = function() {
            self.addNewRow();
        };
        
        // Insert button before table
        var tableElement = this.table.element;
        tableElement.parentNode.insertBefore(addButton, tableElement);
    }
    
    /**
     * Get the actions column definition
     */
    static getActionsColumnDefinition(instanceId = 'default') {
        return {
            title: "Actions",
            field: "actions",
            width: 140,
            hozAlign: "center",
            formatter: function(cell, formatterParams, onRendered) {
                const data = cell.getRow().getData();
                const id = data.id || data._id;
                const isEditing = data._editing;
                const isNewRow = data._isNewRow;
                
                if (isEditing) {
                    return `
                        <div class="action-buttons editing">
                            <button class="btn btn-save" onclick="window.tabulatorRowEditInstances['${instanceId}'].saveRow('${id}')" title="Save changes">
                                💾 Save
                            </button>
                            <button class="btn btn-cancel" onclick="window.tabulatorRowEditInstances['${instanceId}'].cancelEdit('${id}')" title="Cancel editing">
                                ❌ Cancel
                            </button>
                        </div>
                    `;
                } else {
                    return `
                        <div class="action-buttons normal">
                            <button class="btn btn-edit" onclick="window.tabulatorRowEditInstances['${instanceId}'].editRow('${id}')" title="Edit row">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-delete" onclick="window.tabulatorRowEditInstances['${instanceId}'].deleteRow('${id}')" title="Delete row">
                                🗑️ Delete
                            </button>
                        </div>
                    `;
                }
            },
            headerSort: false,
            editor: false,
            download: false,
            clipboard: false,
            print: false
        };
    }
    
    /**
     * Add actions column to existing table
     */
    addActionsColumn() {
        const columns = this.table.getColumnDefinitions();
        
        // Generate unique instance ID
        this.instanceId = 'instance_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const actionsColumn = TabulatorRowEditManager.getActionsColumnDefinition(this.instanceId);
        
        // Find position after row numbers
        let insertIndex = 0;
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].formatter === 'rownum') {
                insertIndex = i + 1;
                break;
            }
        }
        
        columns.splice(insertIndex, 0, actionsColumn);
        this.table.setColumns(columns);
        
        // Register this instance globally
        if (!window.tabulatorRowEditInstances) {
            window.tabulatorRowEditInstances = {};
        }
        window.tabulatorRowEditInstances[this.instanceId] = this;
    }
    
    /**
     * Setup global functions and styles
     */
    setupGlobalFunctions() {
        // Add CSS if not already added
        if (!document.getElementById('tabulator-row-edit-styles')) {
            const styles = `
                <style id="tabulator-row-edit-styles">
                .tabulator-row .row-modified {
                    background-color: #fff3cd !important;
                }

                .tabulator-row[data-editing="true"] {
                    background-color: #e3f2fd !important;
                    border-left: 4px solid #2196f3;
                }

                .tabulator-row[data-new-row="true"] {
                    background-color: #f0f8e8 !important;
                    border-left: 4px solid #28a745;
                }

                .action-buttons {
                    display: flex;
                    gap: 5px;
                    justify-content: center;
                }

                .action-buttons .btn {
                    padding: 4px 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                    text-decoration: none;
                }

                .btn-edit { background: #28a745; color: white; border-color: #28a745; }
                .btn-delete { background: #dc3545; color: white; border-color: #dc3545; }
                .btn-save { background: #007bff; color: white; border-color: #007bff; }
                .btn-cancel { background: #6c757d; color: white; border-color: #6c757d; }
                .btn-add-row { background: #28a745; color: white; border-color: #28a745; }

                .btn:hover { 
                    opacity: 0.8; 
                    transform: translateY(-1px); 
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .delete-confirmation {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.4;
                }

                .delete-confirmation h4 {
                    margin: 0 0 15px 0;
                    color: #dc3545;
                    font-size: 18px;
                }

                .delete-confirmation .row-info {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 6px;
                    margin: 10px 0;
                    border-left: 4px solid #dc3545;
                }

                .delete-confirmation .row-info strong {
                    color: #495057;
                }

                .delete-confirmation .buttons {
                    margin-top: 20px;
                    text-align: right;
                }

                .delete-confirmation .buttons button {
                    padding: 8px 16px;
                    margin-left: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .confirm-delete {
                    background: #dc3545;
                    color: white;
                }

                .cancel-delete {
                    background: #6c757d;
                    color: white;
                }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
    
    /**
     * Add a new row for editing
     */
    addNewRow() {
        // Check if another row is being edited
        if (this.currentEditingRowId) {
            const shouldSwitch = confirm(
                "Another row is currently being edited. Do you want to cancel those changes and add a new row instead?"
            );
            
            if (shouldSwitch) {
                this.cancelEdit(this.currentEditingRowId);
            } else {
                return;
            }
        }
        
        // Generate temporary ID
        const tempId = 'temp_' + (++this.tempRowCounter) + '_' + Date.now();
        
        // Create new row data with defaults
        const newRowData = {
            [this.options.idField]: tempId,
            [this.options.editStateField]: true,
            [this.options.newRowStateField]: true,
            ...this.options.newRowDefaults
        };
        
        // Store original data (empty for new rows)
        this.originalRowData.set(tempId, {});
        this.currentEditingRowId = tempId;
        
        // Add row to table
        let addedRow;
        if (this.options.newRowPosition === 'top') {
            addedRow = this.table.addRow(newRowData, true); // Add to top
        } else {
            addedRow = this.table.addRow(newRowData); // Add to bottom (default)
        }
        
        // Set visual indicators
        addedRow.getElement().setAttribute('data-editing', 'true');
        addedRow.getElement().setAttribute('data-new-row', 'true');
        
        // Call callback
        if (this.options.onAddRowStart) {
            this.options.onAddRowStart(tempId, newRowData);
        }
        
        return addedRow;
    }
    
    /**
     * Start editing a row
     */
    async editRow(id) {
        // Check if another row is being edited
        if (this.currentEditingRowId && this.currentEditingRowId !== id) {
            const shouldSwitch = confirm(
                "Another row is currently being edited. Do you want to cancel those changes and edit this row instead?"
            );
            
            if (shouldSwitch) {
                this.cancelEdit(this.currentEditingRowId);
            } else {
                return;
            }
        }
        
        const row = this.table.getRow(id);
        const data = row.getData();
        
        // Store original data for cancel functionality
        this.originalRowData.set(id, {...data});
        this.currentEditingRowId = id;
        
        // Set editing state
        row.update({[this.options.editStateField]: true});
        row.getElement().setAttribute('data-editing', 'true');
        
        // Refresh the row to update UI
        row.reformat();
        
        // Call callback
        if (this.options.onEditStart) {
            this.options.onEditStart(id, data);
        }
    }
    
    /**
     * Cancel editing a row
     */
    cancelEdit(id) {
        const row = this.table.getRow(id);
        const currentData = row.getData();
        const originalData = this.originalRowData.get(id);
        const isNewRow = currentData[this.options.newRowStateField];
        
        if (isNewRow) {
            // For new rows, delete the row entirely
            row.delete();
            
            // Call callback
            if (this.options.onAddRowCancel) {
                this.options.onAddRowCancel(id, currentData);
            }
        } else {
            // For existing rows, restore original data
            if (originalData) {
                row.update({
                    ...originalData,
                    [this.options.editStateField]: false
                });
            } else {
                row.update({[this.options.editStateField]: false});
            }
            
            // Update UI
            row.getElement().setAttribute('data-editing', 'false');
            row.getElement().classList.remove('row-modified');
            row.reformat();
            
            // Call callback
            if (this.options.onEditCancel) {
                this.options.onEditCancel(id, originalData);
            }
        }
        
        // Clean up
        this.originalRowData.delete(id);
        if (this.currentEditingRowId === id) {
            this.currentEditingRowId = null;
        }
    }
    
    /**
     * Save a row (handles both new and existing rows)
     */
    async saveRow(id) {
        const row = this.table.getRow(id);
        const currentData = row.getData();
        const originalData = this.originalRowData.get(id);
        const isNewRow = currentData[this.options.newRowStateField];
        
        // Validate row data
        try {
            const validationResult = await row.validate();
            if (validationResult !== true) {
                this.showError("Please fix validation errors before saving");
                return;
            }
        } catch (error) {
            this.showError("Validation failed: " + error.message);
            return;
        }
        
        // Show loading state
        this.setRowLoading(row, true);
        
        try {
            let response, result;
            
            if (isNewRow) {
                // Handle new row creation
                const createData = {...currentData};
                
                // Remove internal fields
                delete createData[this.options.editStateField];
                delete createData[this.options.newRowStateField];
                delete createData[this.options.idField]; // Remove temp ID
                
                response = await fetch(this.options.createEndpoint, {
                    method: 'POST',
                    headers: this.options.httpHeaders,
                    body: JSON.stringify(createData)
                });
                
                result = await response.json();
                
                if (response.ok) {
                    // Success - replace row with server response
                    const serverData = result.data || result.row || result;
                    
                    // Remove the temporary row
                    row.delete();
                    
                    // Add the new row with server data
                    let newRow;
                    if (this.options.newRowPosition === 'top') {
                        newRow = this.table.addRow(serverData, true);
                    } else {
                        newRow = this.table.addRow(serverData);
                    }
                    
                    // Clean up
                    this.originalRowData.delete(id);
                    this.currentEditingRowId = null;
                    
                    // Call success callback
                    if (this.options.onCreateSuccess) {
                        this.options.onCreateSuccess(id, serverData);
                    }
                    
                } else {
                    // Server error - stay in edit mode
                    this.showError("Create failed: " + (result.message || result.error || 'Unknown error'));
                    
                    // Call error callback
                    if (this.options.onCreateError) {
                        this.options.onCreateError(id, result, currentData);
                    }
                }
                
            } else {
                // Handle existing row update
                const saveData = {
                    id: currentData[this.options.idField],
                    row: {...currentData},
                    old: originalData ? {...originalData} : null
                };
                
                // Remove internal fields
                delete saveData.row[this.options.editStateField];
                if (saveData.old) {
                    delete saveData.old[this.options.editStateField];
                }
                
                response = await fetch(this.options.saveEndpoint, {
                    method: 'PUT',
                    headers: this.options.httpHeaders,
                    body: JSON.stringify(saveData)
                });
                
                result = await response.json();
                
                if (response.ok) {
                    // Success - update row with server response
                    const serverData = result.data || result.row || currentData;
                    
                    row.update({
                        ...serverData,
                        [this.options.editStateField]: false
                    });
                    
                    // Clean up
                    this.originalRowData.delete(id);
                    this.currentEditingRowId = null;
                    
                    // Update UI
                    row.getElement().setAttribute('data-editing', 'false');
                    row.getElement().classList.remove('row-modified');
                    row.reformat();
                    
                    // Call success callback
                    if (this.options.onSaveSuccess) {
                        this.options.onSaveSuccess(id, originalData, serverData);
                    }
                    
                } else {
                    // Server error - stay in edit mode
                    this.showError("Save failed: " + (result.message || result.error || 'Unknown error'));
                    
                    // Call error callback
                    if (this.options.onSaveError) {
                        this.options.onSaveError(id, result, currentData);
                    }
                }
            }
            
        } catch (error) {
            // Network error - stay in edit mode
            this.showError((isNewRow ? "Create" : "Save") + " failed: " + error.message);
            
            // Call error callback
            if (isNewRow && this.options.onCreateError) {
                this.options.onCreateError(id, error, currentData);
            } else if (!isNewRow && this.options.onSaveError) {
                this.options.onSaveError(id, error, currentData);
            }
        } finally {
            // Remove loading state
            this.setRowLoading(row, false);
        }
    }
    
    /**
     * Delete a row with confirmation
     */
    async deleteRow(id) {
        const row = this.table.getRow(id);
        const data = row.getData();
        
        // Build confirmation message
        const rowInfo = this.buildDeleteConfirmation(row, data);
        
        // Show custom confirmation dialog
        const confirmed = await this.showDeleteConfirmation(rowInfo);
        
        if (!confirmed) {
            return;
        }
        
        // Show loading state
        this.setRowLoading(row, true);
        
        try {
            const response = await fetch(`${this.options.deleteEndpoint}/${id}`, {
                method: 'DELETE',
                headers: this.options.httpHeaders
            });
            
            if (response.ok) {
                // Success - remove row
                row.delete();
                
                // Clean up if this row was being edited
                if (this.currentEditingRowId === id) {
                    this.currentEditingRowId = null;
                    this.originalRowData.delete(id);
                }
                
                // Call success callback
                if (this.options.onDeleteSuccess) {
                    this.options.onDeleteSuccess(id, data);
                }
                
            } else {
                const result = await response.json();
                this.showError("Delete failed: " + (result.message || result.error || 'Unknown error'));
                
                // Call error callback
                if (this.options.onDeleteError) {
                    this.options.onDeleteError(id, result, data);
                }
            }
        } catch (error) {
            this.showError("Delete failed: " + error.message);
            
            // Call error callback
            if (this.options.onDeleteError) {
                this.options.onDeleteError(id, error, data);
            }
        } finally {
            // Remove loading state
            this.setRowLoading(row, false);
        }
    }
    
    /**
     * Build delete confirmation info
     */
    buildDeleteConfirmation(row, data) {
        let info = '';
        
        // Add row number if requested
        if (this.options.showRowNumberInDelete) {
            const rowPosition = row.getPosition();
            info += `<strong>Row #${rowPosition}</strong><br>`;
        }
        
        // Add specified fields
        this.options.deleteConfirmFields.forEach(field => {
            const value = data[field];
            if (value !== undefined && value !== null && value !== '') {
                const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
                info += `<strong>${fieldLabel}:</strong> ${value}<br>`;
            }
        });
        
        return info;
    }
    
    /**
     * Show custom delete confirmation dialog
     */
    showDeleteConfirmation(rowInfo) {
        return new Promise((resolve) => {
            // Create modal backdrop
            const backdrop = document.createElement('div');
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Create confirmation dialog
            const dialog = document.createElement('div');
            dialog.className = 'delete-confirmation';
            dialog.style.cssText = `
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
            `;
            
            dialog.innerHTML = `
                <h4>🗑️ Confirm Delete</h4>
                <p>Are you sure you want to delete this row?</p>
                <div class="row-info">
                    ${rowInfo}
                </div>
                <div class="buttons">
                    <button class="cancel-delete">Cancel</button>
                    <button class="confirm-delete">Delete</button>
                </div>
            `;
            
            backdrop.appendChild(dialog);
            document.body.appendChild(backdrop);
            
            // Handle button clicks
            dialog.querySelector('.confirm-delete').onclick = () => {
                document.body.removeChild(backdrop);
                resolve(true);
            };
            
            dialog.querySelector('.cancel-delete').onclick = () => {
                document.body.removeChild(backdrop);
                resolve(false);
            };
            
            // Handle backdrop click
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    document.body.removeChild(backdrop);
                    resolve(false);
                }
            };
            
            // Handle escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(backdrop);
                    document.removeEventListener('keydown', escapeHandler);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    }
    
    /**
     * Set row loading state
     */
    setRowLoading(row, isLoading) {
        const element = row.getElement();
        if (isLoading) {
            element.style.opacity = "0.6";
            element.style.pointerEvents = "none";
        } else {
            element.style.opacity = "1";
            element.style.pointerEvents = "auto";
        }
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // Simple implementation - you can replace with your notification system
        alert("Error: " + message);
        console.error("TabulatorRowEditManager Error:", message);
    }
    
    /**
     * Get smart editor function for columns
     */
    getSmartEditor(editorType = "input") {
        return function(cell) {
            const row = cell.getRow();
            const isEditing = row.getData()._editing;
            return isEditing ? editorType : false;
        };
    }
    
    /**
     * Cleanup - call when destroying the table
     */
    destroy() {
        // Remove add row button
        var addButton = document.querySelector('.tabulator-add-row-btn[data-table-id="' + this.instanceId + '"]');
        if (addButton) {
            addButton.remove();
        }
        
        // Remove global reference
        if (window.tabulatorRowEditInstances && this.instanceId) {
            delete window.tabulatorRowEditInstances[this.instanceId];
        }
        
        // Clear maps
        this.originalRowData.clear();
        this.currentEditingRowId = null;
    }
}

/*
=== USAGE EXAMPLE WITH ADD ROW ===

const table = new Tabulator("#example-table", {
    data: [
        {id: 1, name: "John Doe", email: "john@example.com", role: "admin"},
        {id: 2, name: "Jane Smith", email: "jane@example.com", role: "user"}
    ],
    columns: [
        {formatter: "rownum", hozAlign: "center", width: 40},
        // Actions column will be inserted here automatically
        {
            title: "Name", 
            field: "name", 
            editor: editManager.getSmartEditor("input"),
            validator: ["required", "minLength:2"]
        },
        {
            title: "Email", 
            field: "email", 
            editor: editManager.getSmartEditor("input"),
            validator: ["required", "email"]
        },
        {
            title: "Role", 
            field: "role", 
            editor: editManager.getSmartEditor("select"),
            editorParams: {values: {admin: "Administrator", user: "User", manager: "Manager"}}
        }
    ]
});

const editManager = new TabulatorRowEditManager(table, {
    // Existing row operations
    saveEndpoint: '/api/users',
    deleteEndpoint: '/api/users',
    
    // New row operations
    createEndpoint: '/api/users',
    newRowDefaults: {
        name: "",
        email: "", 
        role: "user"
    },
    newRowPosition: 'top', // 'top' or 'bottom'
    
    deleteConfirmFields: ['name', 'email'],
    showRowNumberInDelete: true,
    
    // Callbacks
    onCreateSuccess: (tempId, newData) => {
        console.log('New row created:', tempId, '→', newData.id);
        showSuccessMessage('Row created successfully!');
    },
    
    onCreateError: (tempId, error, rowData) => {
        console.error('Create failed:', tempId, error);
        showErrorMessage('Failed to create row: ' + (error.message || 'Unknown error'));
    },
    
    onAddRowStart: (tempId, rowData) => {
        console.log('Started adding new row:', tempId);
    },
    
    onAddRowCancel: (tempId, rowData) => {
        console.log('Cancelled adding new row:', tempId);
    }
});

=== SERVER ENDPOINT EXAMPLES ===

// Create endpoint (POST /api/users)
// Request body:
{
    "name": "New User",
    "email": "newuser@example.com",
    "role": "user"
}

// Success response:
{
    "success": true,
    "data": {
        "id": 123,
        "name": "New User",
        "email": "newuser@example.com",
        "role": "user",
        "created_at": "2024-01-15T10:30:00Z"
    }
}

// Error response:
{
    "success": false,
    "message": "Email address already exists",
    "errors": {
        "email": ["This email is already taken"]
    }
}
*/