<?php

namespace Ocallit\Tabulator;

use Ocallit\Sqler\SqlExecutor;
use Ocallit\Sqler\DatabaseMetadata;
use Exception;

/**
 * TabulatorColumnGenerator
 * 
 * Generates Tabulator.js column definitions from MySQL SELECT queries
 * with appropriate formatters, validators, and editors based on column metadata.
 */
class TabulatorColumnGenerator
{
    private SqlExecutor $sqlExecutor;
    private DatabaseMetadata $metadata;
    
    public function __construct(SqlExecutor $sqlExecutor)
    {
        $this->sqlExecutor = $sqlExecutor;
        
        // Initialize DatabaseMetadata if not already done
        try {
            $this->metadata = DatabaseMetadata::getInstance();
        } catch (Exception $e) {
            DatabaseMetadata::initialize($sqlExecutor);
            $this->metadata = DatabaseMetadata::getInstance();
        }
    }
    
    /**
     * Generate Tabulator column definitions from a SELECT query
     * 
     * @param string $query The SELECT query to analyze
     * @param array $parameters Query parameters
     * @return array Array of Tabulator column definitions
     * @throws Exception
     */
    public function generateColumns(string $query, array $parameters = []): array
    {
        // Get query metadata
        $queryMetadata = $this->metadata->query($query, $parameters);
        
        $columns = [];
        
        foreach ($queryMetadata as $fieldName => $fieldInfo) {
            $column = $this->buildColumnDefinition($fieldName, $fieldInfo);
            $columns[] = $column;
        }
        
        return $columns;
    }
    
    /**
     * Generate and output JavaScript code for Tabulator columns
     * 
     * @param string $query The SELECT query to analyze
     * @param array $parameters Query parameters
     * @param string $variableName JavaScript variable name (default: 'columns')
     * @return string JavaScript code
     * @throws Exception
     */
    public function generateJavaScript(string $query, array $parameters = [], string $variableName = 'columns'): string
    {
        $columns = $this->generateColumns($query, $parameters);
        
        $js = "// Generated Tabulator column definitions\n";
        $js .= "// Field names use server field names for automatic server-side operations\n";
        $js .= "var {$variableName} = [\n";
        
        foreach ($columns as $i => $column) {
            $js .= $this->arrayToJavaScript($column, 1);
            if ($i < count($columns) - 1) {
                $js .= ",";
            }
            $js .= "\n";
        }
        
        $js .= "];\n";
        
        return $js;
    }
    
    /**
     * Build a single column definition
     * 
     * @param string $fieldName
     * @param array $fieldInfo
     * @return array
     */
    private function buildColumnDefinition(string $fieldName, array $fieldInfo): array
    {
        // Use server field name for the field property (for sorting/filtering)
        $serverField = $this->getServerFieldName($fieldInfo);
        $displayTitle = $this->generateTitle($fieldName, $fieldInfo);
        
        $column = [
            'title' => $displayTitle,
            'field' => $serverField, // Use server field for automatic server-side operations
        ];
        
        // Check if this is a primary key column
        $isPrimaryKey = $this->isPrimaryKeyColumn($fieldInfo);
        
        if ($isPrimaryKey) {
            $column['visible'] = false;
            $column['download'] = false;
            $column['clipboard'] = false;
            $column['print'] = false;
            // Don't add editor for primary keys
        } else {
            // Add width estimation
            $column['width'] = $this->estimateWidth($fieldInfo);
            
            // Add alignment
            $alignment = $this->getAlignment($fieldInfo);
            if ($alignment) {
                $column['hozAlign'] = $alignment;
            }
            
            // Add formatter
            $formatter = $this->getFormatter($fieldInfo);
            if ($formatter) {
                $column = array_merge($column, $formatter);
            }
            
            // Add editor and validator for table fields (not derived/calculated)
            if (($fieldInfo['kind'] ?? '') === 'table') {
                $editor = $this->getEditor($fieldInfo);
                if ($editor) {
                    $column = array_merge($column, $editor);
                }
                
                $validator = $this->getValidator($fieldInfo);
                if ($validator) {
                    $column['validator'] = $validator;
                }
            }
        }
        
        return $column;
    }
    
    /**
     * Generate human-readable title from field name, considering aliases
     */
    private function generateTitle(string $fieldName, array $fieldInfo): string
    {
        // If this field has an alias (fieldName != orgname), use the alias as title
        $orgName = $fieldInfo['orgname'] ?? '';
        
        // If fieldName is different from orgname, it means we have an alias
        if (!empty($orgName) && $fieldName !== $orgName) {
            // Use the alias (fieldName) as the title
            return ucwords(str_replace('_', ' ', $fieldName));
        }
        
        // No alias, use the original field name
        // Remove table prefix if present (e.g., "user.name" -> "name", "t.name" -> "name")
        $name = strpos($fieldName, '.') !== false ? 
            substr($fieldName, strrpos($fieldName, '.') + 1) : $fieldName;
        
        // Convert snake_case to Title Case
        return ucwords(str_replace('_', ' ', $name));
    }
    
    /**
     * Get the field name to use for server communication (sorting, filtering, etc.)
     */
    private function getServerFieldName(array $fieldInfo): string
    {
        $table = $fieldInfo['table'] ?? '';
        $orgTable = $fieldInfo['orgtable'] ?? '';
        $orgName = $fieldInfo['orgname'] ?? '';
        
        // If we have table and orgname, construct the full field reference
        if (!empty($table) && !empty($orgName)) {
            return $table . '.' . $orgName;
        }
        
        // If we have orgtable and orgname, use that
        if (!empty($orgTable) && !empty($orgName)) {
            return $orgTable . '.' . $orgName;
        }
        
        // Fall back to just the original field name
        if (!empty($orgName)) {
            return $orgName;
        }
        
        // If all else fails, use the field name as-is
        return $fieldInfo['name'] ?? '';
    }
    
    /**
     * Check if this column is a primary key
     */
    private function isPrimaryKeyColumn(array $fieldInfo): bool
    {
        // Check if this field is marked as primary key
        $flags = $fieldInfo['flags'] ?? 0;
        if ($flags & MYSQLI_PRI_KEY_FLAG) {
            return true;
        }
        
        // Alternative check using Key field from SHOW COLUMNS
        $key = $fieldInfo['Key'] ?? '';
        if ($key === 'PRI') {
            return true;
        }
        
        // Check if field name ends with '_id' and is from a table (common primary key pattern)
        $orgName = $fieldInfo['orgname'] ?? '';
        $orgTable = $fieldInfo['orgtable'] ?? '';
        
        if (!empty($orgTable) && !empty($orgName)) {
            // Check if this matches the pattern table_id (e.g., user_id for users table)
            $expectedPkName = rtrim($orgTable, 's') . '_id'; // Remove trailing 's' and add '_id'
            if ($orgName === $expectedPkName || $orgName === 'id') {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Estimate column width based on field type and length
     */
    private function estimateWidth(array $fieldInfo): int
    {
        $type = strtolower($fieldInfo['Type'] ?? '');
        $length = $fieldInfo['length'] ?? 0;
        
        // Special cases
        if (strpos($type, 'tinyint(1)') !== false) return 80;  // Boolean
        if (strpos($type, 'date') !== false) return 120;
        if (strpos($type, 'time') !== false) return 100;
        if (strpos($type, 'year') !== false) return 80;
        
        // Numeric types
        if (preg_match('/^(int|bigint|smallint|mediumint|tinyint)/', $type)) {
            return min(max($length * 10, 80), 150);
        }
        
        if (preg_match('/^(decimal|float|double)/', $type)) {
            return min(max($length * 12, 100), 180);
        }
        
        // String types
        if (preg_match('/^(varchar|char)/', $type)) {
            if ($length <= 10) return 100;
            if ($length <= 50) return 150;
            if ($length <= 100) return 200;
            return 250;
        }
        
        // Text types
        if (preg_match('/text/', $type)) return 250;
        
        // Default
        return 150;
    }
    
    /**
     * Get column alignment based on data type
     */
    private function getAlignment(array $fieldInfo): ?string
    {
        $type = strtolower($fieldInfo['Type'] ?? '');
        
        // Numeric types - right align
        if (preg_match('/^(int|bigint|smallint|mediumint|tinyint|decimal|float|double)/', $type)) {
            return 'right';
        }
        
        // Boolean - center align
        if (strpos($type, 'tinyint(1)') !== false) {
            return 'center';
        }
        
        // Date/time - center align
        if (preg_match('/^(date|time|datetime|timestamp|year)/', $type)) {
            return 'center';
        }
        
        return null; // Default left alignment
    }
    
    /**
     * Get formatter configuration
     */
    private function getFormatter(array $fieldInfo): ?array
    {
        $type = strtolower($fieldInfo['Type'] ?? '');
        
        // Boolean (tinyint(1))
        if (strpos($type, 'tinyint(1)') !== false) {
            return ['formatter' => 'tickCross'];
        }
        
        // Numeric types with decimal places
        if (preg_match('/^(decimal|float|double)\((\d+),(\d+)\)/', $type, $matches)) {
            $decimals = (int)$matches[3];
            return [
                'formatter' => 'number',
                'formatterParams' => [
                    'precision' => $decimals,
                    'thousand' => ',',
                    'decimal' => '.'
                ]
            ];
        }
        
        // Integer types
        if (preg_match('/^(int|bigint|smallint|mediumint|tinyint)/', $type)) {
            return [
                'formatter' => 'number',
                'formatterParams' => [
                    'precision' => 0,
                    'thousand' => ','
                ]
            ];
        }
        
        // Date types
        if (preg_match('/^date/', $type)) {
            return [
                'formatter' => 'datetime',
                'formatterParams' => [
                    'inputFormat' => 'yyyy-MM-dd',
                    'outputFormat' => 'dd/MM/yy'
                ]
            ];
        }
        
        // DateTime types
        if (preg_match('/^(datetime|timestamp)/', $type)) {
            return [
                'formatter' => 'datetime',
                'formatterParams' => [
                    'inputFormat' => 'yyyy-MM-dd HH:mm:ss',
                    'outputFormat' => 'dd/MM/yy HH:mm'
                ]
            ];
        }
        
        // Time types
        if (preg_match('/^time/', $type)) {
            return [
                'formatter' => 'datetime',
                'formatterParams' => [
                    'inputFormat' => 'HH:mm:ss',
                    'outputFormat' => 'HH:mm'
                ]
            ];
        }
        
        return null;
    }
    
    /**
     * Get editor configuration
     */
    private function getEditor(array $fieldInfo): ?array
    {
        $type = strtolower($fieldInfo['Type'] ?? '');
        $null = ($fieldInfo['Null'] ?? 'NO') === 'YES';
        
        // Boolean (tinyint(1))
        if (strpos($type, 'tinyint(1)') !== false) {
            return ['editor' => 'tickCross'];
        }
        
        // ENUM type
        if (preg_match('/^enum\((.*)\)/', $type, $matches)) {
            $values = $this->parseEnumValues($matches[1]);
            $editorParams = ['values' => $values];
            
            if ($null) {
                $editorParams['values'] = array_merge([''], $values);
            }
            
            return [
                'editor' => 'select',
                'editorParams' => $editorParams
            ];
        }
        
        // SET type
        if (preg_match('/^set\((.*)\)/', $type, $matches)) {
            $values = $this->parseEnumValues($matches[1]);
            return [
                'editor' => 'select',
                'editorParams' => [
                    'values' => $values,
                    'multiselect' => true
                ]
            ];
        }
        
        // Foreign key - create AJAX select
        if (isset($fieldInfo['orgtable']) && isset($fieldInfo['orgname'])) {
            $foreignKey = $this->getForeignKeyInfo($fieldInfo['orgtable'], $fieldInfo['orgname']);
            if ($foreignKey) {
                return $this->createForeignKeyEditor($foreignKey, $null);
            }
        }
        
        // Numeric types
        if (preg_match('/^(int|bigint|smallint|mediumint|tinyint|decimal|float|double)/', $type)) {
            $editorParams = [];
            
            // Extract min/max for numeric types
            if (preg_match('/unsigned/', $type)) {
                $editorParams['min'] = 0;
            }
            
            // Set step for decimal types
            if (preg_match('/^(decimal|float|double)/', $type)) {
                $editorParams['step'] = 'any';
            } else {
                $editorParams['step'] = 1;
            }
            
            return [
                'editor' => 'number',
                'editorParams' => $editorParams
            ];
        }
        
        // Date types
        if (preg_match('/^date/', $type)) {
            return ['editor' => 'date'];
        }
        
        // DateTime types
        if (preg_match('/^(datetime|timestamp)/', $type)) {
            return ['editor' => 'datetime'];
        }
        
        // Time types
        if (preg_match('/^time/', $type)) {
            return ['editor' => 'time'];
        }
        
        // Text area for text types
        if (preg_match('/text/', $type)) {
            return ['editor' => 'textarea'];
        }
        
        // Default input for varchar/char
        if (preg_match('/^(varchar|char)/', $type)) {
            return ['editor' => 'input'];
        }
        
        return ['editor' => 'input']; // Default
    }
    
    /**
     * Get validator configuration
     */
    private function getValidator(array $fieldInfo): ?array
    {
        $validators = [];
        $type = strtolower($fieldInfo['Type'] ?? '');
        $null = ($fieldInfo['Null'] ?? 'NO') === 'YES';
        
        // Required validation
        if (!$null) {
            $validators[] = 'required';
        }
        
        // Numeric validators
        if (preg_match('/^(int|bigint|smallint|mediumint|tinyint)/', $type)) {
            $validators[] = 'integer';
            
            if (preg_match('/unsigned/', $type)) {
                $validators[] = 'min:0';
            }
            
            // Add max values for specific integer types
            if (strpos($type, 'tinyint') !== false && strpos($type, 'tinyint(1)') === false) {
                $validators[] = preg_match('/unsigned/', $type) ? 'max:255' : 'min:-128';
                if (!preg_match('/unsigned/', $type)) $validators[] = 'max:127';
            }
        }
        
        if (preg_match('/^(decimal|float|double)/', $type)) {
            $validators[] = 'numeric';
            
            if (preg_match('/unsigned/', $type)) {
                $validators[] = 'min:0';
            }
        }
        
        // String length validators
        if (preg_match('/^(varchar|char)\((\d+)\)/', $type, $matches)) {
            $maxLength = (int)$matches[2];
            $validators[] = "maxLength:$maxLength";
        }
        
        // Email validation for email-like fields
        if (preg_match('/email/i', $fieldInfo['Field'] ?? '')) {
            $validators[] = 'email';
        }
        
        // URL validation for url-like fields
        if (preg_match('/url|website|link/i', $fieldInfo['Field'] ?? '')) {
            $validators[] = 'url';
        }
        
        return empty($validators) ? null : $validators;
    }
    
    /**
     * Parse ENUM/SET values from MySQL type definition
     */
    private function parseEnumValues(string $enumString): array
    {
        $values = [];
        preg_match_all("/'([^']*)'/", $enumString, $matches);
        return $matches[1];
    }
    
    /**
     * Get foreign key information for a field
     */
    private function getForeignKeyInfo(string $tableName, string $columnName): ?array
    {
        try {
            $foreignKeys = $this->metadata->getForeignKeys($tableName);
            return $foreignKeys[$columnName] ?? null;
        } catch (Exception $e) {
            return null;
        }
    }
    
    /**
     * Create foreign key editor with AJAX
     */
    private function createForeignKeyEditor(array $foreignKey, bool $allowNull): array
    {
        $referencedTable = $foreignKey['referenced_table'];
        $referencedColumn = $foreignKey['referenced_column'];
        
        // Try to find a display column (name, title, description, etc.)
        $displayColumn = $this->findDisplayColumn($referencedTable);
        
        $editorParams = [
            'values' => [], // Start empty for AJAX loading
            'ajaxURL' => "/api/foreign-key-options.php", // You'll need to create this endpoint
            'ajaxParams' => [
                'table' => $referencedTable,
                'value_column' => $referencedColumn,
                'display_column' => $displayColumn
            ],
            'ajaxConfig' => 'GET',
            'ajaxRequesting' => 'function(url, params) { console.log("Loading options for " + params.table); }',
            'ajaxResponse' => 'function(url, params, response) { return response; }'
        ];
        
        if ($allowNull) {
            $editorParams['placeholderEmpty'] = '-- Select --';
        }
        
        return [
            'editor' => 'select',
            'editorParams' => $editorParams
        ];
    }
    
    /**
     * Find a suitable display column for foreign key references
     */
    private function findDisplayColumn(string $tableName): string
    {
        try {
            $columns = $this->metadata->table($tableName);
            $columnNames = array_column($columns, 'Field');
            
            // Preferred display columns in order
            $preferredColumns = ['name', 'title', 'description', 'label', 'text'];
            
            foreach ($preferredColumns as $preferred) {
                if (in_array($preferred, $columnNames)) {
                    return $preferred;
                }
            }
            
            // Look for columns ending with common suffixes
            foreach ($columnNames as $column) {
                if (preg_match('/(name|title|desc|label)$/i', $column)) {
                    return $column;
                }
            }
            
            // Return first non-id column
            foreach ($columnNames as $column) {
                if (!preg_match('/id$/i', $column)) {
                    return $column;
                }
            }
            
            // Fallback to first column
            return $columnNames[0] ?? 'id';
            
        } catch (Exception $e) {
            return 'name'; // Safe fallback
        }
    }
    
    /**
     * Convert PHP array to JavaScript object notation
     */
    private function arrayToJavaScript(array $array, int $indentLevel = 0): string
    {
        $indent = str_repeat('    ', $indentLevel);
        $js = "{\n";
        
        $items = [];
        foreach ($array as $key => $value) {
            $line = $indent . '    ';
            
            // Add key
            if (is_string($key)) {
                $line .= '"' . addslashes($key) . '": ';
            }
            
            // Add value
            if (is_array($value)) {
                $line .= $this->arrayToJavaScript($value, $indentLevel + 1);
            } elseif (is_string($value)) {
                // Check if it's a JavaScript function
                if (strpos($value, 'function(') === 0) {
                    $line .= $value;
                } else {
                    $line .= '"' . addslashes($value) . '"';
                }
            } elseif (is_bool($value)) {
                $line .= $value ? 'true' : 'false';
            } elseif (is_null($value)) {
                $line .= 'null';
            } else {
                $line .= $value;
            }
            
            $items[] = $line;
        }
        
        $js .= implode(",\n", $items) . "\n";
        $js .= $indent . '}';
        
        return $js;
    }
}

// Example usage with aliases and table prefixes
/*

// Usage Examples:

// 1. Query with aliases - server field names are used automatically
$query1 = "SELECT u.id, u.name as 'Full Name', u.email as 'Email Address', 
           u.department_id as 'Department', u.created_at as 'Registration Date'
           FROM users u";

// 2. Query with table prefixes  
$query2 = "SELECT u.id, u.name, d.name as department_name, u.salary 
           FROM users u 
           JOIN departments d ON u.department_id = d.id";

// 3. Complex query with multiple tables and aliases
$query3 = "SELECT u.user_id, u.username as 'User Name', 
           p.title as 'Project Title', t.name as 'Task Name',
           t.status as 'Current Status'
           FROM users u
           JOIN project_assignments pa ON u.user_id = pa.user_id  
           JOIN projects p ON pa.project_id = p.project_id
           JOIN tasks t ON p.project_id = t.project_id";

try {
    $generator = new TabulatorColumnGenerator($sqlExecutor);
    
    // Generate columns for aliased query
    echo "=== Query with Aliases ===\n";
    echo $generator->generateJavaScript($query1, [], 'userColumns');
    
    /* Output will be something like:
    var userColumns = [
        {
            "title": "ID",           // Primary key
            "field": "u.id",         // Server field name
            "visible": false,        // Hidden primary key
            "download": false
        },
        {
            "title": "Full Name",    // Uses alias as title
            "field": "u.name",       // Server field name - works automatically with server-side operations
            "width": 150,
            "editor": "input",
            "validator": ["required"]
        },
        {
            "title": "Email Address", // Uses alias as title
            "field": "u.email",       // Server field name - automatic server-side support
            "width": 200,
            "editor": "input",
            "validator": ["email"]
        },
        {
            "title": "Department",
            "field": "u.department_id",
            "editor": "select",
            "editorParams": {
                "ajaxURL": "/api/foreign-key-options.php",
                "ajaxParams": {
                    "table": "departments",
                    "value_column": "id", 
                    "display_column": "name"
                }
            }
        }
        // ... more columns
    ];

    
    echo "\n=== Server-side handling is automatic! ===\n";
    echo "No custom mapping needed - Tabulator sends the correct field names\n";
    echo "Sort request: {column: 'u.name', dir: 'asc'}\n";
    echo "Filter request: {field: 'u.email', type: 'like', value: 'john'}\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

// Server-side example - standard Tabulator handling:
/*
// Your server now receives the correct field names automatically!

// PHP example for handling sorts:
$sorters = json_decode($_GET['sorters'], true);
foreach($sorters as $sort) {
    // $sort['column'] will be 'u.name', 'u.email', etc. - ready to use!
    $orderBy[] = $sort['column'] . ' ' . strtoupper($sort['dir']);
}

// PHP example for handling filters:
$filters = json_decode($_GET['filters'], true);  
foreach($filters as $filter) {
    // $filter['field'] will be 'u.name', 'u.email', etc. - ready to use!
    switch($filter['type']) {
        case 'like':
            $whereClause[] = $filter['field'] . " LIKE '%" . $filter['value'] . "%'";
            break;
        case '=':
            $whereClause[] = $filter['field'] . " = '" . $filter['value'] . "'";
            break;
    }
}

// No mapping arrays needed! ✅
*/

// Foreign Key API Endpoint (/api/foreign-key-options.php):
// <?php
// This would be a separate file to handle AJAX requests for foreign key options

require_once 'vendor/autoload.php';
use Ocallit\Sqler\SqlExecutor;

header('Content-Type: application/json');

try {
    // Initialize your SqlExecutor
    $sql = new SqlExecutor([
        'hostname' => 'localhost',
        'username' => 'your_user', 
        'password' => 'your_pass',
        'database' => 'your_db'
    ]);
    
    $table = $_GET['table'] ?? '';
    $valueColumn = $_GET['value_column'] ?? 'id';
    $displayColumn = $_GET['display_column'] ?? 'name';
    
    if (empty($table)) {
        throw new Exception('Table parameter required');
    }
    
    // Build safe query
    $query = sprintf(
        "SELECT `%s` as value, `%s` as label FROM `%s` ORDER BY `%s` LIMIT 1000",
        $valueColumn,
        $displayColumn, 
        $table,
        $displayColumn
    );
    
    $options = $sql->array($query);
    
    // Format for Tabulator select editor
    $result = [];
    foreach ($options as $option) {
        $result[$option['value']] = $option['label'];
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

*/