@echo off
echo Removing problematic text nodes {' '} from TSX files...

:: Use PowerShell to find and replace {' '} patterns in all .tsx files
powershell -Command "(Get-ChildItem -Path '.' -Filter '*.tsx' -Recurse) | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match '\{\s*[''\"]\s*[''\"]\s*\}') { $newContent = $content -replace '\{\s*[''\"]\s*[''\"]\s*\}', ''; Set-Content -Path $_.FullName -Value $newContent; Write-Host 'Fixed:' $_.FullName } }"

echo.
echo Checking for any remaining {' '} patterns...
powershell -Command "(Get-ChildItem -Path '.' -Filter '*.tsx' -Recurse) | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match '\{\s*[''\"]\s*[''\"]\s*\}') { Write-Host 'Still found in:' $_.FullName } }"

echo.
echo Done! All text node issues should be resolved.
pause
