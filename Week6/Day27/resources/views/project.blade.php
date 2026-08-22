<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ $project }} | Laravel Lab</title>

    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #111827;
            color: white;
        }

        .container {
            max-width: 900px;
            margin: 100px auto;
            padding: 50px;
        }

        .label {
            color: #fca5a5;
            font-weight: bold;
            letter-spacing: 2px;
        }

        h1 {
            font-size: 56px;
        }

        p {
            color: #cbd5e1;
            line-height: 1.8;
        }

        a {
            color: white;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="label">PROJECT ROUTE</div>

    <h1>{{ $project }}</h1>

    <p>
        This page demonstrates Laravel route parameters.
        The project name is captured from the URL and passed from
        the route to the controller and finally into this Blade view.
    </p>

    <a href="{{ route('home') }}">← Return to Home</a>

</div>

</body>
</html>