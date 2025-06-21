#!/usr/bin/env php
<?php
/*
In composer
"scripts": {
  "post-install-cmd": ["php publish.php vendor"],
  "post-update-cmd": ["php publish.php vendor"]
}
or
"post-update-cmd": [ "php publish.php --symlink vendor" ]

 */
$packages = [
  'tabultaor' => 'Tabultaor',
  'foobar'    => 'FooBar',
];

if (php_sapi_name() !== 'cli') {
    echo "🛑 Great publisher you are... but not through the browser, hmm?\n";
    http_response_code(403);
    exit;
}

// Accept `--symlink`, `--copy`, and vendor path
$mode = 'copy';
$vendorDir = null;

foreach ($argv as $arg) {
    if ($arg === '--symlink') $mode = 'symlink';
    elseif ($arg === '--copy') $mode = 'copy';
    elseif (is_dir($arg . '/ocallit')) $vendorDir = realpath($arg);
}

if (!$vendorDir) {
    echo "❌ Error: Vendor directory not specified or not found.\n";
    echo "Usage: php publish.php [--symlink|--copy] vendor\n";
    exit(1);
}

$projectRoot = dirname($vendorDir);
$publicRoot = "$projectRoot/public_html";

foreach ($packages as $pkg => $targetSubdir) {
    $source = "$vendorDir/ocallit/$pkg/public_html";
    $target = "$publicRoot/$targetSubdir";

    echo "\n🔍 Processing: ocallit/$pkg\n";
    echo "  Source: $source\n";
    echo "  Target: $target\n";
    echo "  Mode:   $mode\n";

    if (!is_dir($source)) {
        $msg = "❌ Package 'ocallit/$pkg' not found or missing public_html";
        echo "  $msg\n";
        error_log("[publish.php] $msg (expected at $source)");
        continue;
    }

    if (file_exists($target) || is_link($target)) {
        echo "  Removing previous target...\n";
        exec('rm -rf ' . escapeshellarg($target));
    }

    if ($mode === 'symlink' && strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
        echo "  Creating symlink...\n";
        if (!@symlink($source, $target)) {
            $msg = "⚠️  Failed to symlink $pkg; falling back to copy.";
            echo "  $msg\n";
            error_log("[publish.php] $msg");
            copy_dir($source, $target);
        }
    } else {
        echo "  Copying files...\n";
        copy_dir($source, $target);
    }

    echo "✅ Done: $pkg\n";
}

function copy_dir($src, $dst) {
    if (!is_dir($dst)) mkdir($dst, 0777, true);
    foreach (scandir($src) as $file) {
        if ($file === '.' || $file === '..') continue;
        $srcPath = "$src/$file";
        $dstPath = "$dst/$file";
        is_dir($srcPath) ? copy_dir($srcPath, $dstPath) : copy($srcPath, $dstPath);
    }
}
