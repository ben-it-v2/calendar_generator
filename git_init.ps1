# Checks of current folder is link to a git repository
$isGitRepo = git rev-parse --is-inside-work-tree
if ($isGitRepo -eq "true") {
    Write-Host "Folder already linked to a Git repository"
} else {
    Write-Host "Folder isn't linked to a Git repository"
    # Setup Git Repository to give access to software updates
    git init
    git remote add origin https://github.com/ben-it-v2/calendar_generator.git
    git clean -df
    git checkout master
    git pull origin master
}
sleep 3
