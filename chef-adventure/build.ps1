#Requires -PSEdition Core
param(
  [string]$pluginRootDirectory = "./src"
)

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$stopwatch.Start();

# This is a small powershell script that will install (or at least validate installation)
# the necessary dependencies to build and transpile a plugin to javascript.
Write-Host "[BEGIN] COMPILING RMMZ PLUGIN TO ONE JAVASCRIPT FILE OUTPUT." -BackgroundColor DarkBlue -ForegroundColor White

Write-Host "[BEGIN] USING '$pluginRootDirectory' AS CURRENT WORKING DIRECTORY."  -BackgroundColor DarkBlue -ForegroundColor White

# Validates global installation of the necessary plugins to execute the transpilation.
Write-Host "[STEP 0] Validating/installing global dependencies..." -BackgroundColor DarkMagenta -ForegroundColor White
npm i -g rollup @comuns-rpgmaker/plugin-metadata -sD | Out-Null

# Validates local installation (or installs globally) the necessary plugins to execute the transpilation.
Write-Host "[STEP 1] Validating/installing dependencies..." -BackgroundColor DarkMagenta -ForegroundColor White
npm i yaml @rollup/plugin-babel rollup-plugin-terser @babel/preset-env -sD | Out-Null

# Puts together the yaml metadata that ends up becoming the metadata at the top of the JS plugin.
Write-Host "[STEP 2] Running plugin metadata pre-build..." -BackgroundColor DarkMagenta -ForegroundColor White
mz-mtdt -i $pluginRootDirectory/config/plugin-metadata.yaml -o $pluginRootDirectory/config/annotations.js | Out-Null

# Actually transpiles the files into a single javascript file with the converted metadata.
Write-Host "[STEP 3] Compiling output..." -BackgroundColor DarkMagenta -ForegroundColor White
rollup -c | Out-Null

$stopwatch.Stop();
$totalElapsed = $stopwatch.ElapsedMilliseconds / 1000;
# Alert the user we're done here.
Write-Host "[FINISH] PROCESS COMPLETED IN ${totalElapsed}s." -BackgroundColor DarkBlue -ForegroundColor White