param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

function New-RoundedRectanglePath {
    param(
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $diameter = $Radius * 2

    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()

    return $path
}

function Fill-RoundedRectangle {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Brush]$Brush,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = New-RoundedRectanglePath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
    $Graphics.FillPath($Brush, $path)
    $path.Dispose()
}

$iconsDir = Join-Path $Root "icons"
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null

$sizes = @(16, 32, 48, 128)

foreach ($size in $sizes) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $scale = $size / 128

    $bgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(15, 118, 110))
    $paperBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(248, 250, 252))
    $tabBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(204, 251, 241))
    $lineBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(91, 107, 124))
    $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(15, 118, 110))
    $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)

    Fill-RoundedRectangle $graphics $bgBrush 0 0 $size $size (24 * $scale)
    Fill-RoundedRectangle $graphics $paperBrush (20 * $scale) (18 * $scale) (88 * $scale) (92 * $scale) (12 * $scale)
    Fill-RoundedRectangle $graphics $tabBrush (20 * $scale) (18 * $scale) (88 * $scale) (22 * $scale) (12 * $scale)

    Fill-RoundedRectangle $graphics $accentBrush (32 * $scale) (28 * $scale) (18 * $scale) (4 * $scale) (2 * $scale)
    Fill-RoundedRectangle $graphics $lineBrush (56 * $scale) (28 * $scale) (18 * $scale) (4 * $scale) (2 * $scale)
    Fill-RoundedRectangle $graphics $lineBrush (80 * $scale) (28 * $scale) (16 * $scale) (4 * $scale) (2 * $scale)
    Fill-RoundedRectangle $graphics $accentBrush (34 * $scale) (54 * $scale) (48 * $scale) (6 * $scale) (3 * $scale)
    Fill-RoundedRectangle $graphics $lineBrush (34 * $scale) (68 * $scale) (60 * $scale) (6 * $scale) (3 * $scale)
    Fill-RoundedRectangle $graphics $lineBrush (34 * $scale) (82 * $scale) (38 * $scale) (6 * $scale) (3 * $scale)

    Fill-RoundedRectangle $graphics $accentBrush (78 * $scale) (76 * $scale) (26 * $scale) (26 * $scale) (6 * $scale)
    Fill-RoundedRectangle $graphics $whiteBrush (84 * $scale) (82 * $scale) (5 * $scale) (5 * $scale) (1 * $scale)
    Fill-RoundedRectangle $graphics $whiteBrush (93 * $scale) (82 * $scale) (5 * $scale) (5 * $scale) (1 * $scale)
    Fill-RoundedRectangle $graphics $whiteBrush (84 * $scale) (91 * $scale) (5 * $scale) (5 * $scale) (1 * $scale)
    Fill-RoundedRectangle $graphics $whiteBrush (93 * $scale) (91 * $scale) (5 * $scale) (5 * $scale) (1 * $scale)

    $outputPath = Join-Path $iconsDir "icon$size.png"
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $bitmap.Dispose()
    $bgBrush.Dispose()
    $paperBrush.Dispose()
    $tabBrush.Dispose()
    $lineBrush.Dispose()
    $accentBrush.Dispose()
    $whiteBrush.Dispose()
}

Write-Host "Generated Chrome extension icons in $iconsDir"