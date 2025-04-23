<!DOCTYPE html>
<html>
<head>
    <style>
        html,body {
            margin: 0;
            padding: 0;
        }
        .page {
            page-break-after: always;
            width: 210mm;
            height: 297mm;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .page img {
            max-width: 190mm;
            max-height: 277mm;
            margin: 10mm !important;
            margin-top: 20mm !important;
            width: auto;
            height: auto;
        }
        .page:last-child {
            page-break-after: auto;
        }
        .page:first-child {
            page-break-before: avoid;
        }
    </style>
</head>
<body>
    @foreach ($cv_pages as $page)
        <div class="page">
            <img src="{{ $page->getPath() }}" alt="Image">
        </div>
    @endforeach
</body>
</html>