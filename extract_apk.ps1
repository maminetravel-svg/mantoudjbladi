Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceXapk = (Get-ChildItem "C:\mantoudj bladi\apk\*.xapk")[0].FullName
$tmpPath = "C:\mantoudj bladi\apk\tmp_xapk"
$outPath = "C:\mantoudj bladi\extracted_images"

if (Test-Path $tmpPath) { Remove-Item -Recurse -Force $tmpPath }
if (Test-Path $outPath) { Remove-Item -Recurse -Force $outPath }
New-Item -ItemType Directory -Force -Path $tmpPath | Out-Null
New-Item -ItemType Directory -Force -Path $outPath | Out-Null

try {
    Write-Host "Extracting main XAPK..."
    [System.IO.Compression.ZipFile]::ExtractToDirectory($sourceXapk, $tmpPath)
} catch {
    Write-Host "Failed to extract XAPK: $($_.Exception.Message)"
    exit
}

$apks = Get-ChildItem -Path $tmpPath -Filter "*.apk" -Recurse
foreach ($apk in $apks) {
    try {
        $apkFolder = Join-Path $tmpPath ($apk.BaseName + "_unzipped")
        New-Item -ItemType Directory -Force -Path $apkFolder | Out-Null
        Write-Host "Extracting internal APK: $($apk.Name)"
        [System.IO.Compression.ZipFile]::ExtractToDirectory($apk.FullName, $apkFolder)
    } catch {
        Write-Host "Skipped or failed extracting $($apk.Name)"
    }
}

Write-Host "Searching for images..."
$images = Get-ChildItem -Path $tmpPath -Include "*.png", "*.jpg", "*.webp", "*.svg" -Recurse

$counter = 1
foreach ($img in $images) {
    if ($img.PSIsContainer) { continue }
    
    # We only care about images inside res/drawable, res/mipmap, or assets folders
    if ($img.FullName -match "\\(res|assets)\\(drawable|mipmap|images)") {
        $destPath = Join-Path $outPath $img.Name
        # Avoid overwriting files with the same name
        if (Test-Path $destPath) {
            $destPath = Join-Path $outPath ($img.BaseName + "_" + $counter + $img.Extension)
            $counter++
        }
        Copy-Item -Path $img.FullName -Destination $destPath -Force
    }
}

Remove-Item -Recurse -Force $tmpPath
$count = (Get-ChildItem $outPath | Measure-Object).Count
Write-Host "Done! Successfully extracted $count images to: $outPath"
