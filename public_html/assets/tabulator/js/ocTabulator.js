/**
 * ocTabulator - A class for creating and managing Tabulator tables
 * This class encapsulates all variables and functions needed for Tabulator tables
 * to avoid global variable conflicts when using multiple tables on the same page.
 */
class ocTabulator {
  /**
   * Constructor for the ocTabulator class
   * @param {object} options - Configuration options for the Tabulator
   */
  constructor( options = {}) {
    // Instance properties instead of global variables
    this.editingRows = new Map();
    this.rowToDelete = null;
    this.deleteIdentifierField = options.deleteIdentifierField || "name";
    this.createDeleteDialog();
  }

  /**
   * Creates a unique delete confirmation dialog for this instance
   */
  createDeleteDialog() {
    // Generate a unique ID for this instance's dialog
    const dialogId = `deleteConfirmDialog_${Math.random().toString(36).substr(2, 9)}`;
    const confirmBtnId = `confirmDelete_${dialogId}`;
    const cancelBtnId = `cancelDelete_${dialogId}`;
    const identifierId = `deleteRowIdentifier_${dialogId}`;

    // Create the dialog element
    const dialog = document.createElement('dialog');
    dialog.id = dialogId;
    dialog.innerHTML = `
      <div>
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this row: <span id="${identifierId}"></span>?</p>
        <div style="text-align: right; margin-top: 20px;">
          <button id="${cancelBtnId}">Cancel</button>
          <button id="${confirmBtnId}">OK</button>
        </div>
      </div>
    `;

    // Apply styles to the dialog
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "5px";
    dialog.style.border = "1px solid #ccc";
    dialog.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

    // Style the title
    const title = dialog.querySelector('h3');
    title.style.marginTop = "0";
    title.style.color = "#d9534f";

    // Style the buttons
    const buttons = dialog.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.padding = "8px 16px";
      button.style.marginLeft = "10px";
      button.style.borderRadius = "4px";
      button.style.cursor = "pointer";
    });

    // Style the confirm button
    const confirmBtn = dialog.querySelector(`#${confirmBtnId}`);
    confirmBtn.style.backgroundColor = "#d9534f";
    confirmBtn.style.color = "white";
    confirmBtn.style.border = "none";

    // Style the cancel button
    const cancelBtn = dialog.querySelector(`#${cancelBtnId}`);
    cancelBtn.style.backgroundColor = "#f0f0f0";
    cancelBtn.style.border = "1px solid #ccc";

    // Add the dialog to the document
    document.body.appendChild(dialog);

    // Store references to the dialog elements
    this.deleteConfirmDialog = dialog;
    this.deleteRowIdentifier = document.getElementById(identifierId);

    // Add event listeners
    document.getElementById(confirmBtnId).addEventListener("click", () => {
      if (this.rowToDelete) {
        this.rowToDelete.delete();
        this.rowToDelete = null;
      }
      this.deleteConfirmDialog.close();
    });

    document.getElementById(cancelBtnId).addEventListener("click", () => {
      this.rowToDelete = null;
      this.deleteConfirmDialog.close();
    });
  }

  /**
   * Formats the action cell content
   * @param {object} cell - The cell object
   * @returns {string} HTML content for the cell
   */
  actionFormatter(cell) {
    const row = cell.getRow();
    return this.editingRows.has(row)
      ? `<button class="save-btn">💾</button> <button class="cancel-btn">✖️</button>`
      : `<button class="edit-btn">✏️</button> <button class="delete-btn">🗑️</button>`;
  }

  /**
   * Refreshes the action cell content
   * @param {object} row - The row object
   */
  refreshActionCell(row) {
    const cell = row.getCell("actions");
    if (cell) {
      // We need to bind 'this' to the formatter
      const formatterFn = this.actionFormatter.bind(this);
      cell.getElement().innerHTML = formatterFn(cell);
    }
  }

  /**
   * Handles clicks on action buttons
   * @param {Event} e - The click event
   * @param {object} cell - The cell object
   */
  onActionClick(e, cell) {
    const row = cell.getRow();

    if (e.target.classList.contains("edit-btn")) {
      const originalData = JSON.parse(JSON.stringify(row.getData()));
      this.editingRows.set(row, originalData);
      row.getElement().classList.add("editing");

      row.getCells().forEach(c => {
        const field = c.getColumn().getField();
        if (field && field !== "actions") c.edit(true);
      });

      this.refreshActionCell(row);
    }

    else if (e.target.classList.contains("cancel-btn")) {
      const originalData = this.editingRows.get(row);
      this.editingRows.delete(row);
      row.getElement().classList.remove("editing");

      row.getCells().forEach(c => c.cancelEdit && c.cancelEdit());
      row.update(originalData).then(() => this.refreshActionCell(row));
    }

    else if (e.target.classList.contains("save-btn")) {
      const isValid = row.getCells().every(c => {
        const field = c.getColumn().getField();
        if (field && field !== "actions") {
          const result = c.validate();
          return result === true || result.valid;
        }
        return true;
      });

      if (!isValid) {
        alert("Validation failed");
        return;
      }

      const updatedData = row.getData();

      this.fakeServerSave(updatedData).then(resp => {
        if (resp.success) {
          this.editingRows.delete(row);
          row.getElement().classList.remove("editing");
          row.update(resp.data || updatedData).then(() => {
            this.refreshActionCell(row);
          });
        } else {
          alert("Server error: " + resp.message);
        }
      }).catch(() => alert("Network/server error"));
    }

    else if (e.target.classList.contains("delete-btn")) {
      // Store the row to be deleted
      this.rowToDelete = row;

      // Get the identifier value from the specified field
      const rowData = row.getData();
      const identifierValue = rowData[this.deleteIdentifierField] || "Unknown";

      // Update the dialog with the identifier
      this.deleteRowIdentifier.textContent = identifierValue;

      // Show the confirmation dialog
      this.deleteConfirmDialog.showModal();
    }
  }

  /**
   * Uploads an image to the server
   * @param {File} file - The file to upload
   * @param {object} rowData - The row data
   * @returns {Promise} A promise that resolves with the server response
   */
  uploadImageToServer(file, rowData) {
    const formData = new FormData();
    formData.append("image", file);

    // Add all row data to formData
    if (rowData) {
      Object.entries(rowData).forEach(([key, value]) => {
        formData.append(key, value !== null && value !== undefined ? value : '');
      });
    }

    return fetch("/upload-image", {
      method: "POST",
      body: formData
    })
      .then(r => r.json())
      .then(data => {
        console.log("Server response:", data);
        return data; // Return the entire data object
      });
  }

  /**
   * Uploads an attachment to the server
   * @param {File} file - The file to upload
   * @param {object} rowData - The row data
   * @returns {Promise} A promise that resolves with the server response
   */
  uploadAttachmentToServer(file, rowData) {
    const formData = new FormData();
    formData.append("attachment", file);

    // Add all row data to formData
    if (rowData) {
      Object.entries(rowData).forEach(([key, value]) => {
        formData.append(key, value !== null && value !== undefined ? value : '');
      });
    }

    return fetch("/upload-attachment", {
      method: "POST",
      body: formData
    })
      .then(r => r.json())
      .then(data => (data.success && data.url ? data.url : null));
  }

  /**
   * Simulates saving data to a server
   * @param {object} data - The data to save
   * @returns {Promise} A promise that resolves with the server response
   */
  fakeServerSave(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (data.name === "error") {
          resolve({ success: false, message: "Invalid name" });
        } else {
          resolve({ success: true, data }); // echo back
        }
      }, 500);
    });
  }

}

