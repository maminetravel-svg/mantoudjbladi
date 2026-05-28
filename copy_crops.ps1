$src = "C:\mantoudj bladi\المنتجات الفلاحية"
$dest = "C:\mantoudj bladi\public\images\crops"

if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
}

try {
    Copy-Item "$src\apricots-*.jpg" "$dest\apricot.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\banana-*.jpg" "$dest\banana.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\cherries-*.jpg" "$dest\cherry.jpg" -Force -ErrorAction SilentlyContinue 
    Copy-Item "$src\eggplant-*.jpg" "$dest\eggplant.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\kiwi-*.jpg" "$dest\kiwi.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\oranges-*.jpg" "$dest\citrus.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\peach-2632182_*.jpg" "$dest\peach.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\raspberries-1465988*.jpg" "$dest\raspberry.jpg" -Force -ErrorAction SilentlyContinue
    Copy-Item "$src\strawberry-*.jpg" "$dest\strawberry.jpg" -Force -ErrorAction SilentlyContinue
    
    # Handling the Arabic filename with wildcards
    $fennel = Get-ChildItem -Path $src -Filter "*FENOUIL*" -ErrorAction SilentlyContinue
    if ($fennel) {
        Copy-Item $fennel[0].FullName "$dest\fennel.jpg" -Force
    }

    Write-Host "Success! Images have been copied to: $dest"
} catch {
    Write-Host "An error occurred: $($_.Exception.Message)"
}
