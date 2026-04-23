param(
    [string]$Source = 'C:\Users\nisha\Downloads\files\Nishant_ATS_Resume_SDE.md',
    [string]$Target = 'C:\Users\nisha\Downloads\files\Nishant_ATS_Resume_SDE.docx'
)

$ErrorActionPreference = 'Stop'

$zipTarget = [System.IO.Path]::ChangeExtension($Target, '.zip')
$tempRoot = 'C:\Users\nisha\Downloads\files\temp_resume_docx'

if (Test-Path -LiteralPath $tempRoot) {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $tempRoot | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot '_rels') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot 'word') | Out-Null

$markdownLines = Get-Content -LiteralPath $Source

function Escape-XmlText {
    param([string]$Text)
    if ($null -eq $Text) { return '' }
    return $Text.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;')
}

function New-ParagraphXml {
    param(
        [string]$Text,
        [switch]$Bold,
        [switch]$Center,
        [switch]$SpacingAfterSmall,
        [switch]$SpacingAfterLarge
    )

    $escaped = Escape-XmlText $Text
    $jc = ''
    if ($Center) { $jc = '<w:jc w:val="center"/>' }

    $spacing = '<w:spacing w:after="80"/>'
    if ($SpacingAfterSmall) { $spacing = '<w:spacing w:after="40"/>' }
    if ($SpacingAfterLarge) { $spacing = '<w:spacing w:after="160"/>' }

    $runProps = '<w:sz w:val="22"/>'
    if ($Bold) { $runProps = '<w:b/>' + $runProps }

    return "<w:p><w:pPr>$jc$spacing</w:pPr><w:r><w:rPr>$runProps</w:rPr><w:t xml:space=`"preserve`">$escaped</w:t></w:r></w:p>"
}

$paragraphs = New-Object System.Collections.Generic.List[string]

foreach ($line in $markdownLines) {
    $trimmed = $line.Trim()

    if ($trimmed.Length -eq 0) {
        $paragraphs.Add('<w:p><w:pPr><w:spacing w:after="60"/></w:pPr></w:p>')
        continue
    }

    if ($trimmed.StartsWith('# ')) {
        $text = $trimmed.Substring(2)
        $paragraphs.Add((New-ParagraphXml -Text $text -Bold -Center -SpacingAfterSmall))
        continue
    }

    if ($trimmed.StartsWith('## ')) {
        $text = $trimmed.Substring(3)
        $paragraphs.Add((New-ParagraphXml -Text $text -Bold -SpacingAfterSmall))
        continue
    }

    if ($trimmed.StartsWith('### ')) {
        $text = $trimmed.Substring(4)
        $paragraphs.Add((New-ParagraphXml -Text $text -Bold -SpacingAfterSmall))
        continue
    }

    if ($trimmed.StartsWith('#### ')) {
        $text = $trimmed.Substring(5)
        $paragraphs.Add((New-ParagraphXml -Text $text -Bold -SpacingAfterSmall))
        continue
    }

    if ($trimmed.StartsWith('- ')) {
        $text = [char]0x2022 + ' ' + $trimmed.Substring(2)
        $paragraphs.Add((New-ParagraphXml -Text $text -SpacingAfterSmall))
        continue
    }

    $paragraphs.Add((New-ParagraphXml -Text $trimmed -SpacingAfterSmall))
}

$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
 xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
 xmlns:v="urn:schemas-microsoft-com:vml"
 xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
 xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
 xmlns:w10="urn:schemas-microsoft-com:office:word"
 xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
 xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
 xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
 xmlns:wne="http://schemas.microsoft.com/office/2006/wordml"
 xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
 mc:Ignorable="w14 wp14">
  <w:body>
    $($paragraphs -join "`r`n    ")
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$contentTypesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
"@

$relsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"@

Set-Content -LiteralPath (Join-Path $tempRoot '[Content_Types].xml') -Value $contentTypesXml -Encoding UTF8
Set-Content -LiteralPath (Join-Path $tempRoot '_rels\.rels') -Value $relsXml -Encoding UTF8
Set-Content -LiteralPath (Join-Path $tempRoot 'word\document.xml') -Value $documentXml -Encoding UTF8

if (Test-Path -LiteralPath $target) {
    Remove-Item -LiteralPath $target -Force
}

if (Test-Path -LiteralPath $zipTarget) {
    Remove-Item -LiteralPath $zipTarget -Force
}

Compress-Archive -Path (Join-Path $tempRoot '*') -DestinationPath $zipTarget -Force
Move-Item -LiteralPath $zipTarget -Destination $target
