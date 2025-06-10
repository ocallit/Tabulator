<?php

namespace Ocallit\Tabulator\Tests;

use PHPUnit\Framework\TestCase;
use Ocallit\Tabulator\TabulatorColumnBuilder;
use Ocallit\Sqler\SQLExecutor;
use Ocallit\Sqler\DatabaseMetadata;
use ReflectionClass;
use ReflectionMethod;

/**
 * Test-specific subclass of TabulatorColumnBuilder that overrides database-dependent methods
 */
class TestTabulatorColumnBuilder extends TabulatorColumnBuilder
{
    /**
     * Override the constructor to avoid calling analyzeQuery
     */
    public function __construct(SQLExecutor $sqlExecutor, string $query = '')
    {
        $this->sqlExecutor = $sqlExecutor;
        $this->dbMetadata = DatabaseMetadata::getInstance($sqlExecutor);
        $this->query = ['sql' => $query];
        // Skip analyzeQuery() call
    }

    /**
     * Override the analyzeQuery method to avoid database interactions
     */
    protected function analyzeQuery(): void
    {
        // Do nothing - we'll set up fields manually in tests
    }

    /**
     * Set fields directly for testing
     */
    public function setFields(array $fields): void
    {
        $this->fields = $fields;
    }

    /**
     * Set tableLookups directly for testing
     */
    public function setTableLookups(array $tableLookups): void
    {
        $this->tableLookups = $tableLookups;
    }
}

class TabulatorColumnBuilderTest extends TestCase
{
    /**
     * @var \PHPUnit\Framework\MockObject\MockObject|SQLExecutor
     */
    private $sqlExecutorMock;

    /**
     * @var \PHPUnit\Framework\MockObject\MockObject|DatabaseMetadata
     */
    private $dbMetadataMock;

    /**
     * Set up the test environment
     */
    protected function setUp(): void
    {
        // Create a mock for SQLExecutor
        $this->sqlExecutorMock = $this->createMock(SQLExecutor::class);

        // Create a mock for DatabaseMetadata
        $this->dbMetadataMock = $this->getMockBuilder(DatabaseMetadata::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Set up a reflection to set the static instance
        $reflection = new \ReflectionClass(DatabaseMetadata::class);
        if ($reflection->hasProperty('instance')) {
            $instanceProperty = $reflection->getProperty('instance');
            $instanceProperty->setAccessible(true);
            $instanceProperty->setValue(null, $this->dbMetadataMock);
        }
    }

    /**
     * Test the constructor and initialization
     */
    public function testConstructorAndInitialization(): void
    {
        // Create the TestTabulatorColumnBuilder instance with a dummy query
        $builder = new TestTabulatorColumnBuilder($this->sqlExecutorMock, 'SELECT 1');

        // Assert that the builder was created successfully
        $this->assertInstanceOf(TabulatorColumnBuilder::class, $builder);
        $this->assertInstanceOf(TestTabulatorColumnBuilder::class, $builder);
    }

    /**
     * Test the formatTitle method
     */
    public function testFormatTitle(): void
    {
        // Create a reflection of the TabulatorColumnBuilder class
        $reflection = new ReflectionClass(TabulatorColumnBuilder::class);

        // Get the formatTitle method and make it accessible
        $formatTitleMethod = $reflection->getMethod('formatTitle');
        $formatTitleMethod->setAccessible(true);

        // Create a mock builder instance
        $builder = $this->getMockBuilder(TabulatorColumnBuilder::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Test with snake_case
        $this->assertEquals('User Name', $formatTitleMethod->invoke($builder, 'user_name'));

        // Test with camelCase
        $this->assertEquals('User Name', $formatTitleMethod->invoke($builder, 'userName'));

        // Test with PascalCase
        $this->assertEquals('User Name', $formatTitleMethod->invoke($builder, 'UserName'));

        // Test with simple string
        $this->assertEquals('Username', $formatTitleMethod->invoke($builder, 'username'));
    }

    /**
     * Test the isNumericType method
     */
    public function testIsNumericType(): void
    {
        // Create a reflection of the TabulatorColumnBuilder class
        $reflection = new ReflectionClass(TabulatorColumnBuilder::class);

        // Get the isNumericType method and make it accessible
        $isNumericTypeMethod = $reflection->getMethod('isNumericType');
        $isNumericTypeMethod->setAccessible(true);

        // Create a mock builder instance
        $builder = $this->getMockBuilder(TabulatorColumnBuilder::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Test with numeric types
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_TINY));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_SHORT));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_LONG));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_FLOAT));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_DOUBLE));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_DECIMAL));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_NEWDECIMAL));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_LONGLONG));
        $this->assertTrue($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_INT24));

        // Test with non-numeric types
        $this->assertFalse($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_STRING));
        $this->assertFalse($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_VAR_STRING));
        $this->assertFalse($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_BLOB));
        $this->assertFalse($isNumericTypeMethod->invoke($builder, MYSQLI_TYPE_DATE));
    }

    /**
     * Test the isDateType method
     */
    public function testIsDateType(): void
    {
        // Create a reflection of the TabulatorColumnBuilder class
        $reflection = new ReflectionClass(TabulatorColumnBuilder::class);

        // Get the isDateType method and make it accessible
        $isDateTypeMethod = $reflection->getMethod('isDateType');
        $isDateTypeMethod->setAccessible(true);

        // Create a mock builder instance
        $builder = $this->getMockBuilder(TabulatorColumnBuilder::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Test with date types
        $this->assertTrue($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_TIMESTAMP));
        $this->assertTrue($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_DATE));
        $this->assertTrue($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_TIME));
        $this->assertTrue($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_DATETIME));
        $this->assertTrue($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_YEAR));
        $this->assertTrue($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_NEWDATE));

        // Test with non-date types
        $this->assertFalse($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_STRING));
        $this->assertFalse($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_VAR_STRING));
        $this->assertFalse($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_BLOB));
        $this->assertFalse($isDateTypeMethod->invoke($builder, MYSQLI_TYPE_LONG));
    }

    /**
     * Test the getDateInputFormat method
     */
    public function testGetDateInputFormat(): void
    {
        // Create a reflection of the TabulatorColumnBuilder class
        $reflection = new ReflectionClass(TabulatorColumnBuilder::class);

        // Get the getDateInputFormat method and make it accessible
        $getDateInputFormatMethod = $reflection->getMethod('getDateInputFormat');
        $getDateInputFormatMethod->setAccessible(true);

        // Create a mock builder instance
        $builder = $this->getMockBuilder(TabulatorColumnBuilder::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Test with different date types
        $this->assertEquals('yyyy-MM-dd', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_DATE));
        $this->assertEquals('yyyy-MM-dd', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_NEWDATE));
        $this->assertEquals('HH:mm:ss', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_TIME));
        $this->assertEquals('yyyy-MM-dd HH:mm:ss', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_DATETIME));
        $this->assertEquals('yyyy-MM-dd HH:mm:ss', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_TIMESTAMP));
        $this->assertEquals('yyyy', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_YEAR));

        // Test with a non-date type (should return default)
        $this->assertEquals('yyyy-MM-dd', $getDateInputFormatMethod->invoke($builder, MYSQLI_TYPE_STRING));
    }

    /**
     * Test the getDateOutputFormat method
     */
    public function testGetDateOutputFormat(): void
    {
        // Create a reflection of the TabulatorColumnBuilder class
        $reflection = new ReflectionClass(TabulatorColumnBuilder::class);

        // Get the getDateOutputFormat method and make it accessible
        $getDateOutputFormatMethod = $reflection->getMethod('getDateOutputFormat');
        $getDateOutputFormatMethod->setAccessible(true);

        // Create a mock builder instance
        $builder = $this->getMockBuilder(TabulatorColumnBuilder::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Test with different date types
        $this->assertEquals('d/MMM/yyyy', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_DATE));
        $this->assertEquals('d/MMM/yyyy', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_NEWDATE));
        $this->assertEquals('HH:mm:ss', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_TIME));
        $this->assertEquals('d/MMM/yyyy HH:mm', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_DATETIME));
        $this->assertEquals('d/MMM/yyyy HH:mm', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_TIMESTAMP));
        $this->assertEquals('yyyy', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_YEAR));

        // Test with a non-date type (should return default)
        $this->assertEquals('d/MMM/yyyy', $getDateOutputFormatMethod->invoke($builder, MYSQLI_TYPE_STRING));
    }

    /**
     * Test the isBinaryContent method
     */
    public function testIsBinaryContent(): void
    {
        // Create a reflection of the TabulatorColumnBuilder class
        $reflection = new ReflectionClass(TabulatorColumnBuilder::class);

        // Get the isBinaryContent method and make it accessible
        $isBinaryContentMethod = $reflection->getMethod('isBinaryContent');
        $isBinaryContentMethod->setAccessible(true);

        // Create a mock builder instance
        $builder = $this->getMockBuilder(TabulatorColumnBuilder::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Test with binary content field names
        $this->assertTrue($isBinaryContentMethod->invoke($builder, ['name' => 'user_image']));
        $this->assertTrue($isBinaryContentMethod->invoke($builder, ['name' => 'profile_photo']));
        $this->assertTrue($isBinaryContentMethod->invoke($builder, ['name' => 'product_picture']));
        $this->assertTrue($isBinaryContentMethod->invoke($builder, ['name' => 'attachment_file']));
        $this->assertTrue($isBinaryContentMethod->invoke($builder, ['name' => 'binary_data']));

        // Test with non-binary content field names
        $this->assertFalse($isBinaryContentMethod->invoke($builder, ['name' => 'username']));
        $this->assertFalse($isBinaryContentMethod->invoke($builder, ['name' => 'first_name']));
        $this->assertFalse($isBinaryContentMethod->invoke($builder, ['name' => 'description']));
    }

    /**
     * Test the getTableStyles method
     */
    public function testGetTableStyles(): void
    {
        // Create the TestTabulatorColumnBuilder instance with a dummy query
        $builder = new TestTabulatorColumnBuilder($this->sqlExecutorMock, 'SELECT 1');

        // Get the table styles
        $styles = $builder->getTableStyles();

        // Assert that the styles contain expected CSS rules
        $this->assertStringContainsString('.tabulator-row.editing', $styles);
        $this->assertStringContainsString('background-color: #fff8e1', $styles);
        $this->assertStringContainsString('.tabulator-cell button', $styles);
        $this->assertStringContainsString('img.thumb', $styles);
    }

    /**
     * Test the getTabulatorColumns method with a simple field
     */
    public function testGetTabulatorColumnsWithSimpleField(): void
    {
        // Create a field object with simple string type
        $field = new \stdClass();
        $field->name = 'username';
        $field->orgname = 'username';
        $field->table = 'users';
        $field->orgtable = 'users';
        $field->type = MYSQLI_TYPE_VAR_STRING;
        $field->length = 255;
        $field->max_length = 0;
        $field->flags = 0;
        $field->decimals = 0;

        // Create the TestTabulatorColumnBuilder instance with a dummy query
        $builder = new TestTabulatorColumnBuilder($this->sqlExecutorMock, 'SELECT 1');

        // Configure the dbMetadataMock
        $this->dbMetadataMock->method('getForeignKeys')->willReturn([]);

        // Set up the fields manually
        $builder->setFields([
            'username' => [
                'name' => 'username',
                'orgName' => 'username',
                'table' => 'users',
                'orgTable' => 'users',
                'type' => MYSQLI_TYPE_VAR_STRING,
                'length' => 255,
                'maxLength' => 0,
                'flags' => 0,
                'decimals' => 0,
                'isNumeric' => false,
                'isDate' => false,
                'isEnum' => false,
                'isPrimaryKey' => false,
                'isNotNull' => false,
                'isAutoIncrement' => false,
                'isUnique' => false,
                'isForeignKey' => false,
                'enumValues' => null,
            ]
        ]);

        // Get the tabulator columns
        $columns = $builder->getTabulatorColumns();

        // Assert that the columns array contains the expected structure
        $this->assertIsArray($columns);
        $this->assertGreaterThan(2, count($columns)); // At least rownum, actions, and our field

        // Find our field in the columns
        $usernameColumn = null;
        foreach ($columns as $column) {
            if (isset($column['field']) && $column['field'] === 'username') {
                $usernameColumn = $column;
                break;
            }
        }

        // Assert that our field was found and has the expected properties
        $this->assertNotNull($usernameColumn);
        $this->assertEquals('Username', $usernameColumn['title']);
        $this->assertEquals('left', $usernameColumn['hozAlign']);
        $this->assertEquals('plaintext', $usernameColumn['formatter']);
        $this->assertArrayHasKey('editor', $usernameColumn);
        $this->assertEquals('input', $usernameColumn['editor']);
    }

    /**
     * Test the getTabulatorInitialization method
     */
    public function testGetTabulatorInitialization(): void
    {
        // Create the TestTabulatorColumnBuilder instance with a dummy query
        $builder = new TestTabulatorColumnBuilder($this->sqlExecutorMock, 'SELECT 1');

        // Configure the dbMetadataMock
        $this->dbMetadataMock->method('getForeignKeys')->willReturn([]);

        // Set up the fields manually with a primary key
        $builder->setFields([
            'id' => [
                'name' => 'id',
                'orgName' => 'id',
                'table' => 'users',
                'orgTable' => 'users',
                'type' => MYSQLI_TYPE_LONG,
                'length' => 11,
                'maxLength' => 0,
                'flags' => MYSQLI_PRI_KEY_FLAG | MYSQLI_AUTO_INCREMENT_FLAG,
                'decimals' => 0,
                'isNumeric' => true,
                'isDate' => false,
                'isEnum' => false,
                'isPrimaryKey' => true,
                'isNotNull' => true,
                'isAutoIncrement' => true,
                'isUnique' => true,
                'isForeignKey' => false,
                'enumValues' => null,
            ]
        ]);

        // Get the tabulator initialization
        $init = $builder->getTabulatorInitialization();

        // Assert that the initialization contains expected JavaScript
        $this->assertStringContainsString('const userTable = new ocTabulator', $init);
        $this->assertStringContainsString('deleteIdentifierField: "id"', $init);
        $this->assertStringContainsString('const table = new Tabulator("#table"', $init);
        $this->assertStringContainsString('columns:', $init);
    }

    /**
     * Test the getHTMLOutput method
     */
    public function testGetHTMLOutput(): void
    {
        // Create the TestTabulatorColumnBuilder instance with a dummy query
        $builder = new TestTabulatorColumnBuilder($this->sqlExecutorMock, 'SELECT 1');

        // Get the HTML output
        $html = $builder->getHTMLOutput();

        // Assert that the HTML contains expected elements
        $this->assertStringContainsString('<!DOCTYPE html>', $html);
        $this->assertStringContainsString('<div id="table"></div>', $html);
        $this->assertStringContainsString('<script src="https://unpkg.com/tabulator-tables@6.3.0/dist/js/tabulator.min.js"></script>', $html);
        $this->assertStringContainsString('<script src="/assets/tabulator/js/ocTabulator.js"></script>', $html);
    }
}
