# Ocallit Tabulator - Development Guidelines

## Project Overview
A collection of utility functions and guidelines for using Tabulator.js in a web project.
The main component, `TabulatorColumnBuilder.php`, generates a Tabulator column definition array from database metadata.

## Build and Configuration Instructions

### Requirements
- PHP 8.2 or higher
- MySQL database
- Web server (Apache, Nginx, etc.)

### Installation
1. Clone the repository
2. Run `composer install` to install dependencies
3. Include the library in your project using Composer's autoloader

```php
require_once 'vendor/autoload.php';
```

### Configuration
No specific configuration files are needed. The library uses the ocallit/sqler package for database operations, which should be configured according to its documentation.

## Testing Information

### Setting Up Tests
1. Create a `tests` directory in the project root
2. Create test files with the naming convention `*Test.php`
3. Use PHPUnit for running tests

### Example Test File
Below is an example test for the TabulatorColumnBuilder class:

```php
<?php
// tests/TabulatorColumnBuilderTest.php

use PHPUnit\Framework\TestCase;
use Ocallit\Tabulator\TabulatorColumnBuilder;
use Ocallit\Sqler\SQLExecutor;

class TabulatorColumnBuilderTest extends TestCase
{
    private $mockSqlExecutor;

    protected function setUp(): void
    {
        // Create a mock SQLExecutor
        $this->mockSqlExecutor = $this->createMock(SQLExecutor::class);
    }

    public function testGetTabulatorColumns()
    {
        // Configure the mock to return expected metadata
        $mockStmt = $this->createMock(\mysqli_stmt::class);
        $mockMetadata = $this->createMock(\mysqli_result::class);

        // Set up the mock field object
        $field = new stdClass();
        $field->name = 'test_field';
        $field->orgname = 'test_field';
        $field->table = 'test_table';
        $field->orgtable = 'test_table';
        $field->type = MYSQLI_TYPE_LONG;
        $field->length = 11;
        $field->max_length = 11;
        $field->flags = 0;
        $field->decimals = 0;

        // Configure the mocks to return our test data
        $mockMetadata->expects($this->once())
            ->method('fetch_fields')
            ->willReturn([$field]);

        $mockStmt->expects($this->once())
            ->method('result_metadata')
            ->willReturn($mockMetadata);

        $this->mockSqlExecutor->expects($this->once())
            ->method('prepareStatement')
            ->willReturn($mockStmt);

        // Create the builder with our mock
        $builder = new TabulatorColumnBuilder($this->mockSqlExecutor, "SELECT * FROM test_table");

        // Get the columns
        $columns = $builder->getTabulatorColumns();

        // Assert that we have at least 3 columns (row number, actions, and our test field)
        $this->assertCount(3, $columns);

        // Check that our test field is in the columns
        $testFieldFound = false;
        foreach ($columns as $column) {
            if (isset($column['field']) && $column['field'] === 'test_field') {
                $testFieldFound = true;
                break;
            }
        }

        $this->assertTrue($testFieldFound, 'Test field column not found in the result');
    }
}
```

### Running Tests
To run tests, execute the following command from the project root:

```bash
vendor/bin/phpunit tests
```

## Development Guidelines

### Code Style
- Follow PSR-12 coding standards
- Use meaningful variable and method names
- Add comments for complex logic
- Keep methods focused on a single responsibility

### CSS Guidelines
- Prefix all CSS classes with `ocTabulator`
- Use plain CSS (no preprocessors)
- Keep styles modular and reusable

### JavaScript Guidelines
- Use ES6 compatible JavaScript
- Prefix all JavaScript IDs and functions with `ocTabulator`
- Avoid jQuery or other frameworks
- Use proper error handling for asynchronous operations

### HTML Guidelines
- Use HTML5 standards
- Keep markup semantic and accessible
- Prefix all IDs with `ocTabulator`

### Database Interactions
- All database operations should use the ocallit/sqler package
- Use prepared statements for all queries
- Handle database errors appropriately

## Example Usage

### Basic Example
```php
<?php
require_once 'vendor/autoload.php';

use Ocallit\Tabulator\TabulatorColumnBuilder;
use Ocallit\Sqler\SQLExecutor;

// Create a database connection
$connection = new mysqli('localhost', 'username', 'password', 'database');

// Create a SQL executor
$sqlExecutor = new SQLExecutor($connection);

// Create a column builder with a query
$builder = new TabulatorColumnBuilder($sqlExecutor, "SELECT * FROM users");

// Get the Tabulator columns configuration
$columns = $builder->getTabulatorColumns();

// Get the JavaScript initialization code
$jsCode = $builder->getTabulatorInitialization();

// Get the HTML output
$html = $builder->getHTMLOutput();
```

## Debugging Tips
- Enable PHP error reporting during development
- Use browser developer tools to debug JavaScript issues
- Check the browser console for JavaScript errors
- Verify database queries by logging them during development
