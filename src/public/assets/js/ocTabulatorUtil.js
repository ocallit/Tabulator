// noinspection EqualityComparisonWithCoercionJS,JSUnusedLocalSymbols,JSUnusedGlobalSymbols

/**
 * ocTabulatorUtil - Tabulator.js Utilities
 * Filters: with operators for numbers, strings and ymd string dates
 * Sorting: Natural sorting, insensitive to accents and case
 * Toolbar: Export
 */

var ocTabulatorUtil = {

    /* region: filters */
    headerFilterNumber: function(cell, onRendered, success, cancel, editorParams) {
        const container = document.createElement("div");
        container.className = "custom-filter-header";

        // Filter type dropdown
        const typeSelect = document.createElement("select");
        typeSelect.className = "filter-type-select";
        typeSelect.innerHTML = `
                <option value="eq">Igual</option>
                <option value="ne">Diferente</option>
                <option value="lt">Menor</option>
                <option value="gt">Mayor</option>
                <option value="nu">Vacío</option>
                <option value="nn">Con valor</option>
            `;

        // Filter input (only shown for numeric comparisons)
        const input = document.createElement("input");
        input.className = "filter-input";
        input.setAttribute("placeholder", "Valor...");
        input.type = "number";
        input.step = "any";

        // Set initial values if they exist
        const currentValue = cell.getValue();
        if(currentValue) {
            typeSelect.value = currentValue.type || "eq";
            if(currentValue.value !== undefined) {
                input.value = currentValue.value;
            }
        }

        // Clear button
        const clearBtn = document.createElement("div");
        clearBtn.className = "clear-filter";
        clearBtn.innerHTML = "×";
        clearBtn.title = "Clear filter";

        container.appendChild(typeSelect);
        container.appendChild(input);
        container.appendChild(clearBtn);

        // Show/hide input based on filter type
        function toggleInputVisibility() {
            const showInput = !["nu", "nn"].includes(typeSelect.value);
            input.style.display = showInput ? "" : "none";
            if(showInput) {
                input.focus();
            }
        }

        toggleInputVisibility();

        function applyFilter() {
            const filterType = typeSelect.value;
            let filterValue;

            if(["nu", "nn"].includes(filterType)) {
                filterValue = ""; // No value needed for these filter types
            } else {
                filterValue = input.value;
            }

            success({
                type: filterType,
                value: filterValue
            });
        }

        // Event listeners
        typeSelect.addEventListener("change", function() {
            toggleInputVisibility();
            applyFilter();
        });

        input.addEventListener("keyup", function(e) {
            if(e.key === "Enter") {
                e.preventDefault();
                applyFilter();
            }
        });

        input.addEventListener("blur", function() {
            setTimeout(applyFilter, 200);
        });

        clearBtn.addEventListener("mousedown", function(e) {
            e.preventDefault();
            typeSelect.value = "eq";
            input.value = "";
            toggleInputVisibility();
            applyFilter();
        });

        onRendered(function() {
            input.focus();
        });

        return container;
    },

    headerFilterFuncNumber: function(headerValue, rowValue, rowData, filterParams) {
        const filterFunc = ocTabulatorUtil._createNumberFilter(headerValue.type);
        return filterFunc(headerValue.value, rowValue, rowData, filterParams);
    },

    _createNumberFilter: function(filterType) {
        return function(headerValue, rowValue, rowData, filterParams) {
            // Handle empty value cases first
            const isEmpty = (value) => value === null || value === undefined || value === '';

            // For "nu" and "nn" filters, we don't need to compare numbers
            if(filterType === "nu") {
                return isEmpty(rowValue);
            }
            if(filterType === "nn") {
                return !isEmpty(rowValue);
            }

            // If the filter value is empty and we're not checking for empty values, show all
            if(isEmpty(headerValue)) {
                return true;
            }

            // Convert both values to numbers
            const filterNum = Number(headerValue);
            const rowNum = Number(rowValue);

            // If either conversion resulted in NaN, don't match
            if(isNaN(filterNum) || isNaN(rowNum)) {
                return false;
            }

            // Apply the appropriate number comparison
            switch(filterType) {
                case "eq":
                    return rowNum == filterNum;
                case "ne":
                    return rowNum != filterNum;
                case "lt":
                    return rowNum < filterNum;
                case "gt":
                    return rowNum > filterNum;
                default:
                    return true;
            }
        };
    },

    headerFilterString: function(cell, onRendered, success, cancel, editorParams) {
        const container = document.createElement("div");
        container.className = "custom-filter-header";

        // Filter type dropdown
        const typeSelect = document.createElement("select");
        typeSelect.className = "filter-type-select";
        typeSelect.innerHTML = `
                <option value="contains">Contiene</option>
                <option value="startsWith">Inicia con</option>
                <option value="endsWith">Termina con</option>
                <option value="eq">Igual</option>
                <option value="ne">Diferente</option>
            `;

        // Filter input
        const input = document.createElement("input");
        input.className = "filter-input";
        input.setAttribute("placeholder", "Filtrar...");
        input.value = cell.getValue()?.value || "";

        // Set initial filter type if exists
        if(cell.getValue()?.type) {
            typeSelect.value = cell.getValue().type;
        }

        // Clear button
        const clearBtn = document.createElement("div");
        clearBtn.className = "clear-filter";
        clearBtn.innerHTML = "×";
        clearBtn.title = "Clear filter";

        container.appendChild(typeSelect);
        container.appendChild(input);
        container.appendChild(clearBtn);

        function applyFilter() {
            success({
                value: input.value,
                type: typeSelect.value
            });
        }

        // Event listeners
        input.addEventListener("keyup", function(e) {
            if(e.key === "Enter") {
                e.preventDefault(); // Prevent default form submission behavior
                applyFilter();
            }
        });

        // Use mousedown instead of click for clear button to prevent blur event issues
        clearBtn.addEventListener("mousedown", function(e) {
            e.preventDefault(); // Prevent input blur
            input.value = "";
            applyFilter();
        });

        typeSelect.addEventListener("change", function() {
            applyFilter();
        });

        // Apply filter on blur (when clicking outside)
        input.addEventListener("blur", function() {
            setTimeout(applyFilter, 200); // Small delay to allow clear button click to process
        });

        onRendered(function() {
            input.focus();
        });

        return container;
    },

    headerFilterFuncString: function(headerValue, rowValue, rowData, filterParams) {
        const filterFunc = ocTabulatorUtil._createStringFilter(headerValue.type);
        return filterFunc(headerValue.value, rowValue, rowData, filterParams);
    },

    _createStringFilter: function(filterType) {
        return function(headerValue, rowValue, rowData, filterParams) {
            if(!headerValue) return true; // No filter applied

            // Normalize strings by removing accents/diacritics and converting to lowercase
            const normalizeString = (str) => {
                if(str === null || typeof str === "undefined")
                    str = "";
                return str.toString()
                    .normalize("NFD") // decompose accented characters
                    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
                    .toLowerCase();
            };

            // Get normalized versions of the strings
            const normalizedHeader = normalizeString(headerValue);
            const normalizedRow = normalizeString(rowValue);

            // Apply different filter types
            switch(filterType) {
                case "eq":
                    return normalizedRow == normalizedHeader;
                case "ne":
                    return normalizedRow != normalizedHeader;
                case "startsWith":
                    return normalizedRow.startsWith(normalizedHeader);
                case "endsWith":
                    return normalizedRow.endsWith(normalizedHeader);
                case "contains":
                default:
                    return normalizedRow.includes(normalizedHeader);
            }
        }
    },

    /**
     * Date filter for YYYY-MM-DD format strings with HTML5 datepicker
     */
    headerFilterYmdDate: function(cell, onRendered, success, cancel, editorParams) {
        const container = document.createElement("div");
        container.className = "custom-filter-header";

        // Filter type dropdown
        const typeSelect = document.createElement("select");
        typeSelect.className = "filter-type-select";
        typeSelect.innerHTML = `
        <option value="eq">Igual</option>
        <option value="ne">Diferente</option>
        <option value="lt">Antes de</option>
        <option value="gt">Después de</option>
        <option value="nu">Vacío</option>
        <option value="nn">Con valor</option>
    `;

        // Date input (HTML5 datepicker)
        const input = document.createElement("input");
        input.className = "filter-input";
        input.setAttribute("placeholder", "yyyy-mm-dd");
        input.type = "date";
        input.pattern = "[0-9]{4}-[0-9]{2}-[0-9]{2}";

        // Set initial values if they exist
        const currentValue = cell.getValue();
        if(currentValue) {
            typeSelect.value = currentValue.type || "eq";
            if(currentValue.value !== undefined) {
                input.value = currentValue.value;
            }
        }

        // Clear button
        const clearBtn = document.createElement("div");
        clearBtn.className = "clear-filter";
        clearBtn.innerHTML = "×";
        clearBtn.title = "Clear filter";

        container.appendChild(typeSelect);
        container.appendChild(input);
        container.appendChild(clearBtn);

        // Show/hide input based on filter type
        function toggleInputVisibility() {
            const showInput = !["nu", "nn"].includes(typeSelect.value);
            input.style.display = showInput ? "" : "none";
            if(showInput) {
                input.focus();
            }
        }

        toggleInputVisibility();

        function applyFilter() {
            const filterType = typeSelect.value;
            let filterValue;

            if(["nu", "nn"].includes(filterType)) {
                filterValue = ""; // No value needed for these filter types
            } else {
                filterValue = input.value; // Will be in yyyy-mm-dd format
            }

            success({
                type: filterType,
                value: filterValue
            });
        }

        // Event listeners
        typeSelect.addEventListener("change", function() {
            toggleInputVisibility();
            applyFilter();
        });

        input.addEventListener("change", applyFilter);
        input.addEventListener("blur", function() {
            setTimeout(applyFilter, 200);
        });

        clearBtn.addEventListener("mousedown", function(e) {
            e.preventDefault();
            typeSelect.value = "eq";
            input.value = "";
            toggleInputVisibility();
            applyFilter();
        });

        onRendered(function() {
            input.focus();
        });

        return container;
    },

    /**
     * Date filter function for YYYY-MM-DD format strings
     */
    headerFilterFuncYmdDate: function(headerValue, rowValue, rowData, filterParams) {
        const filterFunc = ocTabulatorUtil._createDateFilter(headerValue.type);
        return filterFunc(headerValue.value, rowValue, rowData, filterParams);
    },

    /**
     * Creates a date comparison filter function
     */
    _createDateFilter: function(filterType) {
        return function(headerValue, rowValue) {
            // Handle empty value cases first
            const isEmpty = (value) => value === null || value === undefined || value === '';

            // For "nu" and "nn" filters
            if(filterType === "nu") return isEmpty(rowValue);
            if(filterType === "nn") return !isEmpty(rowValue);

            // If the filter value is empty and we're not checking for empty values, show all
            if(isEmpty(headerValue)) return true;

            // Compare dates as strings (works because YYYY-MM-DD is lexically sortable)
            switch(filterType) {
                case "eq": return rowValue === headerValue;
                case "ne": return rowValue !== headerValue;
                case "lt": return rowValue < headerValue;  // Before
                case "gt": return rowValue > headerValue;  // After
                default: return true;
            }
        };
    },

    /* endregion */

    /* region: Sorting */

    /**
     * Natural sorting, insensitive to accents and case
     */
    stringSorter: function(a, b, aRow, bRow, column, dir) {
        console.log("stringSorter", dir)
        // Handle null/undefined/empty values - put them FIRST
        const aEmpty = (a === null || a === undefined || a === "");
        const bEmpty = (b === null || b === undefined || b === "");

        if(aEmpty && bEmpty) return 0;
        if(aEmpty) return -1; // empty goes FIRST
        if(bEmpty) return 1;  // non-empty comes after empty
        return ocTabulatorUtil._natSort(a.toString(), b.toString());
    },

    /**
     * Set locale and recreate the natural sorter
     */
    setLocale: function(locale = "es-MX") {
        this._defaultLocale = locale;
        this._natSort = new Intl.Collator(locale, {
            sensitivity: 'base',
            numeric: true,
            caseFirst: 'false'
        }).compare;
    },

    /**
     * Efficient natural sort comparator using Intl.Collator
     */
    _natSort: new Intl.Collator('es-MX', {
        sensitivity: 'base',   // case & accent insensitive
        numeric: true,         // "2" < "10"
        caseFirst: 'false'     // case-insensitive order
    }).compare,

    /* endregion */

    /* region: toolbar */

    /**
     * Sets an export toolbar
     */
    toolbar: function( ) {
        let table = this;
        const footer = table.element.querySelector(".tabulator-footer");
        if(footer.querySelector(".ocExporter_toolbar"))
            return;

        if(!footer.querySelector(".ocExporter_toolbar")) {
            const toolbar = document.createElement("div");
            toolbar.className = "ocExporter_toolbar";
            toolbar.innerHTML = `
              <button class="ocExporter_btn" data-action="copy" title="Copy"><i class="fas fa-copy"></i></button>
              <button class="ocExporter_btn" data-action="print" title="Print"><i class="fas fa-print"></i></button>
              <button class="ocExporter_btn" data-action="csv" title="Export CSV"><i class="fas fa-file-csv"></i></button>
              <button class="ocExporter_btn" data-action="xlsx" title="Export XLSX"><i class="fas fa-file-excel"></i></button>
              <button class="ocExporter_btn" data-action="pdf" title="Export PDF"><i class="fas fa-file-pdf"></i></button>
              <button class="ocExporter_btn" data-action="image" title="Export Image"><i class="fas fa-file-image"></i></button>
            `;
            footer.appendChild(toolbar);

            toolbar.querySelectorAll(".ocExporter_btn").forEach(btn => {
                if (btn.dataset.bound === "1") return;
                btn.dataset.bound = "1";
                btn.addEventListener("click", () => {
                    const action = btn.dataset.action;
                    switch (action) {
                        case "copy":
                            table.copyToClipboard("visible", "table");
                            break;
                        case "print":
                            table.print(false, true);
                            break;
                        case "csv":
                            table.download("csv", "data.csv");
                            break;
                        case "xlsx":
                            table.download("xlsx", "data.xlsx", {sheetName: "Export"});
                            break;
                        case "pdf":
                            table.download("pdf", "data.pdf", {
                                orientation: "landscape",
                                title: "Exported Data"
                            });
                            break;
                        case "image":
                            table.download("png", "table.png");
                            break;
                    }
                });
            });
        }
    }

    /* endregion */

};
