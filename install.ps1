$nodeVersion = node -v
if ($nodeVersion) {
    # Nodejs already installed
    Write-Host "Node.js is installed. Version: $nodeVersion"
} else {
    # Nodejs need to be installed
    # Create nodejs directory
    $nodeDir = "$env:USERPROFILE/nodejs"
    # New-Item -ItemType Directory -Path $nodeDir
    Write-Host "Node.js directory will be: $nodeDir"

    # Download nodejs zip file from nodejs website
    $url = "https://nodejs.org/download/release/v19.9.0/node-v19.9.0-win-x64.zip"
    $zipFile = "$env:USERPROFILE/node-v19.9.0-win-x64.zip"
    Invoke-WebRequest -UseBasicParsing $url -OutFile $zipFile
    Write-Host "Node.js ZIP path: $zipFile"

    # Unzip nodejs archive in the directory previously created
    Expand-Archive $zipFile -DestinationPath $env:USERPROFILE
    $unzippingFile = "$env:USERPROFILE/node-v19.9.0-win-x64"
    Write-Host "Node.js unzipping path: $unzippingFile"

    # Renaming noejs folder
    Rename-Item $unzippingFile "nodejs"
    Write-Host "Node.js renaming node.js folder"

    # Removing zip file
    Remove-Item $zipFile
    Write-Host "Node.js removing zip file"

    # Setup nodejs environment variable
    # Verify if nodejs directory is already in PATH variable
    $userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    $existingPath = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";$userPath"
    if ($existingPath -notlike "*$nodeDir*") {
        # nodejs directory isn't in PATH variable 
        [Environment]::SetEnvironmentVariable("PATH", "$userPath;$nodeDir", "User")
        Write-Host "Node.js added to PATH variable of the current User"
    } else {
        # nodejs directory is in PATH variable
        Write-Host "Node.js already exists in PATH variable (Machine or User context)"
    }
}
