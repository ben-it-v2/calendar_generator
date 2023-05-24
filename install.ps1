# Install git
$gitCommand = Get-Command git -ErrorAction SilentlyContinue
if ($gitCommand) {
    # Git already installed
    Write-Host "Git is installed. Version:"
    git -v
} else {
    # Git need to be installed
    Write-Host "Git isn't installed."

    # Create Git folder
    New-Item -Path $env:USERPROFILE -Name "Git" -ItemType "directory"
    $gitDir = "$env:USERPROFILE/Git"

    # Download git zip file from official github repository
    $url = "https://github.com/git-for-windows/git/releases/download/v2.40.1.windows.1/MinGit-2.40.1-64-bit.zip"
    $zipFile =  "$gitDir/MinGit-2.40.1-64-bit.zip"
    Invoke-WebRequest -UseBasicParsing $url -OutFile $zipFile
    Write-Host "Git ZIP path: $zipFile"

    # Unzip Git archive
    Expand-Archive $zipFile -DestinationPath $gitDir
    Write-Host "Git unzipping path: $gitDir"

    # Removing zip file
    Remove-Item $zipFile
    Write-Host "Git removing zip file"

    # Setup Git environment variable
    # Verify if Git directory is already in PATH variable
    $userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    $existingPath = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";$userPath"
    if ($existingPath -notlike "*$gitDir\cmd*") {
        # Git directory isn't in PATH variable 
        [Environment]::SetEnvironmentVariable("PATH", "$userPath;$gitDir\cmd", "User")
        Write-Host "Git added to PATH variable of the current User"
    } else {
        # Git directory is in PATH variable
        Write-Host "Git already exists in PATH variable (Machine or User context)"
    }
}

# Install Nodejs
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    # Nodejs already installed
    Write-Host "Node.js is installed. Version:"
    node -v
} else {
    # Nodejs need to be installed
    Write-Host "Node.js isn't installed."

    $nodeDir = "$env:USERPROFILE/nodejs"
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

# Starts a new instance of powershell to load new PATH variables and install package dependencies
Invoke-Expression 'cmd /c start powershell -Command { npm install; sleep 3 }'
