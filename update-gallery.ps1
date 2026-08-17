$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PhotosFolder = Join-Path $ProjectRoot "photos"
$OutputFile = Join-Path $ProjectRoot "photos.json"

if (-not (Test-Path $PhotosFolder)) {
    New-Item -Path $PhotosFolder -ItemType Directory | Out-Null
}

$extensions = @(
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif"
)

$photos = @(
    Get-ChildItem -Path $PhotosFolder -File -Recurse |
        Where-Object {
            $extensions -contains $_.Extension.ToLowerInvariant()
        } |
        Sort-Object FullName |
        ForEach-Object {

            $relativePath =
                $_.FullName.Substring($ProjectRoot.Length + 1)

            # Convert Windows paths to browser-friendly URLs
            $relativePath = $relativePath.Replace('\', '/')

            [PSCustomObject]@{
                src   = $relativePath
                title = $_.BaseName.Replace("_", " ").Replace("-", " ")
            }
        }
)

$photos |
    ConvertTo-Json -Depth 3 |
    Set-Content -Path $OutputFile -Encoding UTF8

Write-Host ""
Write-Host "Gallery updated successfully."
Write-Host "$($photos.Count) photo(s) found."
Write-Host "Saved to: $OutputFile"
Write-Host ""