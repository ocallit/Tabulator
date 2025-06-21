









{
title: "Age",
field: "age",
headerFilter: function(cell, onRendered, success, cancel, editorParams) {
var container = document.createElement("div");
container.style.display = "flex";
container.style.gap = "2px";

        // Operator select
        var operatorSelect = document.createElement("select");
        operatorSelect.innerHTML = `
            <option value="=">=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
        `;
        operatorSelect.style.width = "40px";
        
        // Value input
        var valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.style.width = "60px";
        
        container.appendChild(operatorSelect);
        container.appendChild(valueInput);
        
        // Filter function
        function applyFilter() {
            var operator = operatorSelect.value;
            var value = parseFloat(valueInput.value);
            
            if (isNaN(value)) {
                success(""); // Clear filter
                return;
            }
            
            success({operator: operator, value: value});
        }
        
        operatorSelect.addEventListener("change", applyFilter);
        valueInput.addEventListener("input", applyFilter);
        
        return container;
    },
    headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        if (!headerValue || !headerValue.operator || isNaN(headerValue.value)) {
            return true;
        }
        
        var cellValue = parseFloat(rowValue);
        var filterValue = headerValue.value;
        
        switch(headerValue.operator) {
            case "=": return cellValue === filterValue;
            case ">": return cellValue > filterValue;
            case ">=": return cellValue >= filterValue;
            case "<": return cellValue < filterValue;
            case "<=": return cellValue <= filterValue;
            default: return true;
        }
    }
}

// Helper function to create multi-operator filters
function createOperatorFilter(operators, inputType = "text") {
return function(cell, onRendered, success, cancel, editorParams) {
var container = document.createElement("div");
container.style.cssText = "display: flex; gap: 2px; width: 100%;";

        // Operator select
        var operatorSelect = document.createElement("select");
        operatorSelect.style.cssText = "flex: 0 0 45px; font-size: 11px;";
        
        operators.forEach(op => {
            var option = document.createElement("option");
            option.value = op.value;
            option.textContent = op.label;
            operatorSelect.appendChild(option);
        });
        
        // Value input
        var valueInput = document.createElement("input");
        valueInput.type = inputType;
        valueInput.style.cssText = "flex: 1; font-size: 11px; min-width: 0;";
        valueInput.placeholder = editorParams.placeholder || "";
        
        container.appendChild(operatorSelect);
        container.appendChild(valueInput);
        
        function applyFilter() {
            var operator = operatorSelect.value;
            var value = valueInput.value.trim();
            
            if (!value) {
                success("");
                return;
            }
            
            // Convert value based on input type
            var filterValue = value;
            if (inputType === "number") {
                filterValue = parseFloat(value);
                if (isNaN(filterValue)) {
                    success("");
                    return;
                }
            }
            
            success({operator: operator, value: filterValue});
        }
        
        operatorSelect.addEventListener("change", applyFilter);
        valueInput.addEventListener("input", applyFilter);
        
        return container;
    };
}

// Generic filter function
function operatorFilterFunc(headerValue, rowValue, rowData, filterParams) {
if (!headerValue || !headerValue.operator || headerValue.value === undefined || headerValue.value === "") {
return true;
}

    var cellValue = rowValue;
    var filterValue = headerValue.value;
    
    // Convert to numbers if needed
    if (typeof filterValue === "number") {
        cellValue = parseFloat(cellValue);
        if (isNaN(cellValue)) return false;
    }
    
    switch(headerValue.operator) {
        case "=": return cellValue == filterValue;
        case "!=": return cellValue != filterValue;
        case ">": return cellValue > filterValue;
        case ">=": return cellValue >= filterValue;
        case "<": return cellValue < filterValue;
        case "<=": return cellValue <= filterValue;
        case "like": return cellValue.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
        case "starts": return cellValue.toString().toLowerCase().startsWith(filterValue.toString().toLowerCase());
        case "ends": return cellValue.toString().toLowerCase().endsWith(filterValue.toString().toLowerCase());
        default: return true;
    }
}

// Usage examples:
const numberOperators = [
{value: "=", label: "="},
{value: ">", label: ">"},
{value: ">=", label: "≥"},
{value: "<", label: "<"},
{value: "<=", label: "≤"},
{value: "!=", label: "≠"}
];

const textOperators = [
{value: "=", label: "="},
{value: "like", label: "⊃"},
{value: "starts", label: "A*"},
{value: "ends", label: "*Z"},
{value: "!=", label: "≠"}
];

// In your columns:
{
title: "Age",
field: "age",
headerFilter: createOperatorFilter(numberOperators, "number"),
headerFilterFunc: operatorFilterFunc
},
{
title: "Name",
field: "name",
headerFilter: createOperatorFilter(textOperators, "text"),
headerFilterFunc: operatorFilterFunc,
headerFilterParams: {placeholder: "Search..."}
}

-- ---------------
columns: [
{
title: "Age",
field: "age",
headerFilter: "number",
headerFilterFunc: ">="  // Greater than or equal operator
},
{
title: "Name",
field: "name",
headerFilter: "input",
headerFilterFunc: "like"  // Contains operator (default for input)
}
]

columns: [
{
title: "Department",
field: "department",
headerFilter: "select",
headerFilterParams: {
values: {
"": "All Departments",  // Empty option to show all
"IT": "Information Technology",
"HR": "Human Resources",
"FIN": "Finance",
"MKT": "Marketing"
}
}
},
{
title: "Status",
field: "status",
headerFilter: "select",
headerFilterParams: {
values: ["active", "inactive", "pending"]  // Simple array
}
}
]
