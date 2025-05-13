<?php

namespace Ocallit\Tabulator;


use  \Ocallit\Sqler;
use Ocallit\Sqler\DatabaseMetadata;

/**
 * Given a SQL query, this class builds a Tabulator column configuration
 * based on the metadata of the result set.
 * The main idea is to paste and fine tune the column definition into a page, but it could be used directly
 */
class TabulatorColumnBuilder {
    protected \Ocallit\Sqler\SQLExecutor $sqlExecutor;
    protected \Ocallit\Sqler\DatabaseMetadata $dbMetadata;
    protected array $query;
    protected array $fields = [];
    protected array $tableLookups = [];

    public function __construct(\Ocallit\Sqler\SQLExecutor $sqlExecutor, string $query) {
        $this->sqlExecutor = $sqlExecutor;
        $this->dbMetadata = DatabaseMetadata::getInstance($sqlExecutor);
        $this->query = ['sql' => $query];
        $this->analyzeQuery();
    }

    protected function analyzeQuery(): void {
        try {
            $stmt = $this->sqlExecutor->prepareStatement($this->query['sql']);
            $metadata = $stmt->result_metadata();

            if(!$metadata) {
                throw new \Exception("Unable to retrieve metadata for query");
            }

            $fields = $metadata->fetch_fields();

            foreach($fields as $field) {
                $fieldInfo = $this->getFieldInfo($field);

                if($this->isForeignKey($field)) {
                    $this->tableLookups[$field->name] = $this->getForeignKeyInfo($field);
                }

                $this->fields[$field->name] = $fieldInfo;
            }

            $metadata->free();
            $stmt->close();
        } catch(\Exception $e) {
            throw new \Exception("Error analyzing query: " . $e->getMessage());
        }
    }

    protected function getFieldInfo(object $field): array {
        $info = [
          'name' => $field->name,
          'orgName' => $field->orgname,
          'table' => $field->table,
          'orgTable' => $field->orgtable,
          'type' => $field->type,
          'length' => $field->length,
          'maxLength' => $field->max_length,
          'flags' => $field->flags,
          'decimals' => $field->decimals,
          'isNumeric' => $this->isNumericType($field->type),
          'isDate' => $this->isDateType($field->type),
          'isEnum' => $this->isEnumType($field),
          'isPrimaryKey' => ($field->flags & MYSQLI_PRI_KEY_FLAG) === MYSQLI_PRI_KEY_FLAG,
          'isNotNull' => ($field->flags & MYSQLI_NOT_NULL_FLAG) === MYSQLI_NOT_NULL_FLAG,
          'isAutoIncrement' => ($field->flags & MYSQLI_AUTO_INCREMENT_FLAG) === MYSQLI_AUTO_INCREMENT_FLAG,
          'isUnique' => ($field->flags & MYSQLI_UNIQUE_KEY_FLAG) === MYSQLI_UNIQUE_KEY_FLAG,
          'isForeignKey' => $this->isForeignKey($field),
          'enumValues' => $this->getEnumValues($field),
        ];

        if(!empty($field->orgname) && !empty($field->orgtable)) {
            $info['defaultValue'] = $this->getDefaultValue($field->orgtable, $field->orgname);
        }

        return $info;
    }

    protected function isNumericType(int $type): bool {
        $numericTypes = [
          MYSQLI_TYPE_TINY, MYSQLI_TYPE_SHORT, MYSQLI_TYPE_LONG,
          MYSQLI_TYPE_FLOAT, MYSQLI_TYPE_DOUBLE, MYSQLI_TYPE_DECIMAL,
          MYSQLI_TYPE_NEWDECIMAL, MYSQLI_TYPE_LONGLONG, MYSQLI_TYPE_INT24,
        ];

        return in_array($type, $numericTypes);
    }

    protected function isDateType(int $type): bool {
        $dateTypes = [
          MYSQLI_TYPE_TIMESTAMP, MYSQLI_TYPE_DATE, MYSQLI_TYPE_TIME,
          MYSQLI_TYPE_DATETIME, MYSQLI_TYPE_YEAR, MYSQLI_TYPE_NEWDATE,
        ];

        return in_array($type, $dateTypes);
    }

    protected function isEnumType(object $field): bool {
        if($field->type === MYSQLI_TYPE_ENUM) {
            return TRUE;
        }

        if(!empty($field->orgname) && !empty($field->orgtable)) {
            $columnInfo = $this->dbMetadata->getColumnInfo($field->orgtable, $field->orgname);
            return isset($columnInfo['DATA_TYPE']) && $columnInfo['DATA_TYPE'] === 'enum';
        }

        return FALSE;
    }

    protected function getEnumValues(object $field): ?array {
        if(!$this->isEnumType($field)) {
            return NULL;
        }

        if(!empty($field->orgname) && !empty($field->orgtable)) {
            $columnInfo = $this->dbMetadata->getColumnInfo($field->orgtable, $field->orgname);

            if(isset($columnInfo['COLUMN_TYPE']) && str_starts_with($columnInfo['COLUMN_TYPE'], 'enum(')) {
                preg_match("/^enum\(\'(.*)\'\)$/", $columnInfo['COLUMN_TYPE'], $matches);
                if(isset($matches[1])) {
                    return array_map('trim', explode("','", $matches[1]));
                }
            }
        }

        return NULL;
    }

    protected function isForeignKey(object $field): bool {
        if(empty($field->orgname) || empty($field->orgtable)) {
            return FALSE;
        }

        $fkInfo = $this->dbMetadata->getForeignKeys($field->orgtable);

        foreach($fkInfo as $fk) {
            if($fk['COLUMN_NAME'] === $field->orgname) {
                return TRUE;
            }
        }

        return FALSE;
    }

    protected function getForeignKeyInfo(object $field): ?array {
        if(!$this->isForeignKey($field)) {
            return NULL;
        }

        $fkInfo = $this->dbMetadata->getForeignKeys($field->orgtable);

        foreach($fkInfo as $fk) {
            if($fk['COLUMN_NAME'] === $field->orgname) {
                return [
                  'refTable' => $fk['REFERENCED_TABLE_NAME'],
                  'refColumn' => $fk['REFERENCED_COLUMN_NAME'],
                  'displayColumns' => $this->getDisplayColumns($fk['REFERENCED_TABLE_NAME']),
                ];
            }
        }

        return NULL;
    }

    protected function getDisplayColumns(string $tableName): array {
        $columns = $this->dbMetadata->getTableColumns($tableName);
        $displayColumns = [];

        $namePatterns = ['/^name$/i', '/name$/i', '/^title$/i', '/^label$/i', '/description$/i'];

        foreach($namePatterns as $pattern) {
            foreach($columns as $column) {
                if(preg_match($pattern, $column['COLUMN_NAME'])) {
                    $displayColumns[] = $column['COLUMN_NAME'];
                }
            }

            if(!empty($displayColumns)) {
                return $displayColumns;
            }
        }

        foreach($columns as $column) {
            if($column['COLUMN_KEY'] !== 'PRI') {
                $displayColumns[] = $column['COLUMN_NAME'];
                return $displayColumns;
            }
        }

        foreach($columns as $column) {
            if($column['COLUMN_KEY'] === 'PRI') {
                $displayColumns[] = $column['COLUMN_NAME'];
                return $displayColumns;
            }
        }

        return $displayColumns;
    }

    protected function getDefaultValue(string $table, string $column): mixed {
        $columnInfo = $this->dbMetadata->getColumnInfo($table, $column);

        if(isset($columnInfo['COLUMN_DEFAULT'])) {
            return $columnInfo['COLUMN_DEFAULT'];
        }

        return NULL;
    }

    protected function formatTitle(string $fieldName): string {
        $title = preg_replace('/[_]/', ' ', $fieldName);
        $title = preg_replace('/([a-z])([A-Z])/', '$1 $2', $title);
        return ucwords($title);
    }

    protected function getDateInputFormat(int $type): string {
        switch($type) {
            case MYSQLI_TYPE_DATE:
            case MYSQLI_TYPE_NEWDATE:
                return 'yyyy-MM-dd';
            case MYSQLI_TYPE_TIME:
                return 'HH:mm:ss';
            case MYSQLI_TYPE_DATETIME:
            case MYSQLI_TYPE_TIMESTAMP:
                return 'yyyy-MM-dd HH:mm:ss';
            case MYSQLI_TYPE_YEAR:
                return 'yyyy';
            default:
                return 'yyyy-MM-dd';
        }
    }

    protected function getDateOutputFormat(int $type): string {
        switch($type) {
            case MYSQLI_TYPE_DATE:
            case MYSQLI_TYPE_NEWDATE:
                return 'd/MMM/yyyy';
            case MYSQLI_TYPE_TIME:
                return 'HH:mm:ss';
            case MYSQLI_TYPE_DATETIME:
            case MYSQLI_TYPE_TIMESTAMP:
                return 'd/MMM/yyyy HH:mm';
            case MYSQLI_TYPE_YEAR:
                return 'yyyy';
            default:
                return 'd/MMM/yyyy';
        }
    }

    protected function isBinaryContent(array $fieldInfo): bool {
        $binaryPatterns = ['/image/i', '/photo/i', '/picture/i', '/file/i', '/attachment/i', '/binary/i'];

        foreach($binaryPatterns as $pattern) {
            if(preg_match($pattern, $fieldInfo['name'])) {
                return TRUE;
            }
        }

        return FALSE;
    }

    protected function getForeignKeyValues(array $lookupInfo): array {
        $refTable = $lookupInfo['refTable'];
        $refColumn = $lookupInfo['refColumn'];
        $displayColumns = $lookupInfo['displayColumns'];

        $displayColumnStr = implode(', ', array_map(function($col) {
            return "`$col`";
        }, $displayColumns));

        $query = "SELECT `$refColumn`, $displayColumnStr FROM `$refTable` ORDER BY " .
          (count($displayColumns) > 0 ? "`{$displayColumns[0]}`" : "`$refColumn`");

        $result = $this->sqlExecutor->executeQuery($query);
        $values = [];

        while($row = $result->fetch_assoc()) {
            $key = $row[$refColumn];

            $label = [];
            foreach($displayColumns as $col) {
                if(isset($row[$col])) {
                    $label[] = $row[$col];
                }
            }

            $values[$key] = !empty($label) ? implode(' - ', $label) : $key;
        }

        return $values;
    }

    protected function getValidators(array $fieldInfo): array {
        $validators = [];

        if($fieldInfo['isNotNull'] && !isset($fieldInfo['defaultValue'])) {
            $validators[] = 'required';
        }

        if($fieldInfo['isNumeric']) {
            if($fieldInfo['type'] === MYSQLI_TYPE_DECIMAL || $fieldInfo['type'] === MYSQLI_TYPE_NEWDECIMAL) {
                $precision = $fieldInfo['length'] - $fieldInfo['decimals'] - 1;
                $maxValue = pow(10, $precision) - pow(10, -$fieldInfo['decimals']);
                $validators[] = 'max:' . $maxValue;

                if(!$fieldInfo['isNotNull'] || !isset($fieldInfo['defaultValue'])) {
                    $validators[] = 'min:' . (pow(10, $precision) * -1);
                } else {
                    $validators[] = 'min:0';
                }
            } elseif(in_array($fieldInfo['type'], [MYSQLI_TYPE_TINY, MYSQLI_TYPE_SHORT, MYSQLI_TYPE_LONG, MYSQLI_TYPE_LONGLONG, MYSQLI_TYPE_INT24])) {
                if(($fieldInfo['flags'] & MYSQLI_UNSIGNED_FLAG) === MYSQLI_UNSIGNED_FLAG) {
                    $validators[] = 'min:0';

                    switch($fieldInfo['type']) {
                        case MYSQLI_TYPE_TINY:
                            $validators[] = 'max:255';
                            break;
                        case MYSQLI_TYPE_SHORT:
                            $validators[] = 'max:65535';
                            break;
                        case MYSQLI_TYPE_LONG:
                        case MYSQLI_TYPE_INT24:
                            $validators[] = 'max:4294967295';
                            break;
                    }
                } else {
                    switch($fieldInfo['type']) {
                        case MYSQLI_TYPE_TINY:
                            $validators[] = 'min:-128';
                            $validators[] = 'max:127';
                            break;
                        case MYSQLI_TYPE_SHORT:
                            $validators[] = 'min:-32768';
                            $validators[] = 'max:32767';
                            break;
                        case MYSQLI_TYPE_LONG:
                        case MYSQLI_TYPE_INT24:
                            $validators[] = 'min:-2147483648';
                            $validators[] = 'max:2147483647';
                            break;
                    }
                }

                $validators[] = 'integer';
            }
        } elseif($fieldInfo['type'] === MYSQLI_TYPE_VAR_STRING || $fieldInfo['type'] === MYSQLI_TYPE_STRING) {
            $validators[] = 'max:' . $fieldInfo['length'];
        }

        return $validators;
    }

    public function getTabulatorColumns(): array {
        $columns = [];

        // Add row number column
        $columns[] = [
          'formatter' => 'rownum',
          'hozAlign' => 'center',
          'width' => 60,
          'resizable' => FALSE,
        ];

        // Add action column for row-based editing
        $columns[] = [
          'title' => 'Actions',
          'field' => 'actions',
          'formatter' => 'html',
          'width' => 120,
          'hozAlign' => 'center',
          'resizable' => FALSE,
          'headerSort' => FALSE,
          'formatterParams' => [
            'action' => 'edit',
          ],
        ];

        // Process field columns
        foreach($this->fields as $fieldName => $fieldInfo) {
            $column = [
              'title' => $this->formatTitle($fieldName),
              'field' => $fieldName,
              'headerSort' => TRUE,
            ];

            // Set horizontal alignment
            if($fieldInfo['isNumeric']) {
                $column['hozAlign'] = 'right';
            } elseif($fieldInfo['isDate']) {
                $column['hozAlign'] = 'center';
            } else {
                $column['hozAlign'] = 'left';
            }

            // Add formatter
            if($fieldInfo['isNumeric']) {
                if($fieldInfo['decimals'] > 0) {
                    $column['formatter'] = 'money';
                    $column['formatterParams'] = [
                      'decimal' => '.',
                      'thousand' => ',',
                      'symbol' => '',
                      'precision' => $fieldInfo['decimals'],
                    ];
                } else {
                    $column['formatter'] = 'number';
                }
            } elseif($fieldInfo['isDate']) {
                $column['formatter'] = 'datetime';
                $column['formatterParams'] = [
                  'inputFormat' => $this->getDateInputFormat($fieldInfo['type']),
                  'outputFormat' => $this->getDateOutputFormat($fieldInfo['type']),
                ];
            } elseif($fieldInfo['isForeignKey'] && isset($this->tableLookups[$fieldName])) {
                $column['formatter'] = 'lookup';
                $column['formatterParams'] = [
                  'lookupObj' => '{LOOKUP_VALUES}',
                ];
            } elseif($fieldInfo['type'] === MYSQLI_TYPE_BLOB || $fieldInfo['type'] === MYSQLI_TYPE_LONG_BLOB) {
                if($this->isBinaryContent($fieldInfo)) {
                    $column['formatter'] = 'html';
                    $column['formatterParams'] = [
                      'binary' => TRUE,
                    ];
                } else {
                    $column['formatter'] = 'textarea';
                }
            } elseif($fieldInfo['type'] === MYSQLI_TYPE_BIT) {
                $column['formatter'] = 'tickCross';
            } elseif($fieldInfo['length'] > 255) {
                $column['formatter'] = 'textarea';
            } else {
                $column['formatter'] = 'plaintext';
            }

            // Add editor
            if(!($fieldInfo['isPrimaryKey'] && $fieldInfo['isAutoIncrement'])) {
                if($fieldInfo['isEnum'] && !empty($fieldInfo['enumValues'])) {
                    $column['editor'] = 'select';
                    $column['editorParams'] = [
                      'values' => array_combine($fieldInfo['enumValues'], $fieldInfo['enumValues']),
                    ];
                } elseif($fieldInfo['isForeignKey'] && isset($this->tableLookups[$fieldName])) {
                    $column['editor'] = 'select';
                    $column['editorParams'] = [
                      'values' => function() use ($fieldInfo) {
                          return $this->getForeignKeyValues($this->tableLookups[$fieldInfo['name']]);
                      },
                    ];
                } elseif($fieldInfo['isNumeric']) {
                    $column['editor'] = 'number';
                    $params = [];

                    if($fieldInfo['decimals'] > 0) {
                        $params['step'] = 0.1 ** $fieldInfo['decimals'];
                    }

                    if(!empty($params)) {
                        $column['editorParams'] = $params;
                    }
                } elseif($fieldInfo['isDate']) {
                    $column['editor'] = 'date';
                    $column['editorParams'] = [
                      'format' => $this->getDateInputFormat($fieldInfo['type']),
                    ];
                } elseif($fieldInfo['type'] === MYSQLI_TYPE_BLOB || $fieldInfo['type'] === MYSQLI_TYPE_LONG_BLOB) {
                    if($this->isBinaryContent($fieldInfo)) {
                        $column['editor'] = 'input';
                        $column['editorParams'] = [
                          'type' => 'file',
                          'accept' => 'image/*',
                        ];
                    } else {
                        $column['editor'] = 'textarea';
                    }
                } elseif($fieldInfo['type'] === MYSQLI_TYPE_BIT) {
                    $column['editor'] = 'tickCross';
                } elseif($fieldInfo['length'] > 255) {
                    $column['editor'] = 'textarea';
                } else {
                    $column['editor'] = 'input';
                }

                // Add default value if available
                if(isset($fieldInfo['defaultValue'])) {
                    $column['editorParams'] = $column['editorParams'] ?? [];
                    $column['editorParams']['defaultValue'] = $fieldInfo['defaultValue'];
                }
            }

            // Add validators
            $validators = $this->getValidators($fieldInfo);
            if(!empty($validators)) {
                $column['validator'] = $validators;
            }

            $columns[] = $column;
        }

        return $columns;
    }

    public function getActionFormatter(): string {
        return <<<JS
function actionFormatter(cell) {
    const row = cell.getRow();
    return editingRows.has(row)
        ? '<button class="save-btn">💾</button> <button class="cancel-btn">✖️</button>'
        : '<button class="edit-btn">✏️</button>';
}
JS;
    }

    public function getActionClickHandler(): string {
        return <<<JS
function onActionClick(e, cell) {
    const row = cell.getRow();

    if (e.target.classList.contains("edit-btn")) {
        const originalData = JSON.parse(JSON.stringify(row.getData()));
        editingRows.set(row, originalData);
        row.getElement().classList.add("editing");

        row.getCells().forEach(c => {
            const field = c.getColumn().getField();
            if (field && field !== "actions") c.edit(true);
        });

        refreshActionCell(row);
    }

    else if (e.target.classList.contains("cancel-btn")) {
        const originalData = editingRows.get(row);
        editingRows.delete(row);
        row.getElement().classList.remove("editing");

        row.getCells().forEach(c => c.cancelEdit && c.cancelEdit());
        row.update(originalData).then(() => refreshActionCell(row));
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

        saveRowToServer(updatedData).then(resp => {
            if (resp.success) {
                editingRows.delete(row);
                row.getElement().classList.remove("editing");
                row.update(resp.data || updatedData).then(() => {
                    refreshActionCell(row);
                });
            } else {
                alert("Server error: " + resp.message);
            }
        }).catch(() => alert("Network/server error"));
    }
}

function refreshActionCell(row) {
    const cell = row.getCell("actions");
    if (cell) cell.getElement().innerHTML = actionFormatter(cell);
}

function saveRowToServer(data) {
    return fetch("/api/save-row", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json());
}
JS;
    }

    public function getTableStyles(): string {
        return <<<CSS
.tabulator-row.editing {
    background-color: #fff8e1;
}
.tabulator-cell button {
    margin: 0 2px;
    cursor: pointer;
}
img.thumb {
    height: 64px;
    max-width: 100%;
    object-fit: contain;
}
CSS;
    }

    public function getTabulatorInitialization(): string {
        $columns = json_encode($this->getTabulatorColumns(), JSON_PRETTY_PRINT);

        return <<<JS
const editingRows = new Map();

\${$this->getActionFormatter()}

\${$this->getActionClickHandler()}

const table = new Tabulator("#table", {
    layout: "fitColumns",
    responsiveLayout: "collapse",
    reactiveData: true,
    columnDefaults: {
        resizable: true
    },
    columns: ${$columns},
    placeholder: "No Data Available"
});
JS;
    }

    public function getHTMLOutput(): string {
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Table</title>
    <link href="https://unpkg.com/tabulator-tables@6.3.0/dist/css/tabulator.min.css" rel="stylesheet">
    <style>
        \${$this->getTableStyles()}
    </style>
</head>
<body>
    <div id="table"></div>

    <script src="https://unpkg.com/tabulator-tables@6.3.0/dist/js/tabulator.min.js"></script>
    <script>
        \${$this->getTabulatorInitialization()}
    </script>
</body>
</html>
HTML;
    }
}