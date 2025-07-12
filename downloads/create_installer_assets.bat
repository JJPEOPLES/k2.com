@echo off
echo Creating K2 installer assets...

:: Create a simple icon file using PowerShell
echo Creating icon file...
powershell -Command "$iconPath = 'k2_icon.ico'; Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap 32, 32; $g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::FromArgb(0, 76, 110, 245)); $font = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Bold); $brush = [System.Drawing.Brushes]::White; $g.DrawString('K2', $font, $brush, 2, 4); $bmp.Save('temp.png', [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose(); $converter = New-Object System.Drawing.Icon.IconConverter; $converter.ConvertToIcon('temp.png', $iconPath); Remove-Item 'temp.png'"

:: Create welcome bitmap
echo Creating welcome bitmap...
powershell -Command "$welcomePath = 'k2_welcome.bmp'; Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap 164, 314; $g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::White); $font = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Bold); $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 110, 245)); $g.DrawString('K2', $font, $brush, 60, 50); $font2 = New-Object System.Drawing.Font('Arial', 12); $g.DrawString('Programming', $font2, $brush, 40, 100); $g.DrawString('Language', $font2, $brush, 45, 120); $g.DrawString('v2.0.0', $font2, $brush, 60, 160); $bmp.Save($welcomePath, [System.Drawing.Imaging.ImageFormat]::Bmp); $g.Dispose(); $bmp.Dispose()"

:: Create header bitmap
echo Creating header bitmap...
powershell -Command "$headerPath = 'k2_header.bmp'; Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap 150, 57; $g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::White); $font = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Bold); $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 110, 245)); $g.DrawString('K2', $font, $brush, 60, 15); $bmp.Save($headerPath, [System.Drawing.Imaging.ImageFormat]::Bmp); $g.Dispose(); $bmp.Dispose()"

echo Done! Installer assets created.