$files = git status --short | Select-String "^ M" | ForEach-Object { $_.ToString().Substring(3) }
$total = $files.Count
$count = 1

foreach ($file in $files) {
    git add $file
    git commit -m "chore: format $file ($count/$total)"
    $count++
}
