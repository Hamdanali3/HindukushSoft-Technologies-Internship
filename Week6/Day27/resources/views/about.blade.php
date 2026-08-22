<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>About | Laravel Lab</title>

    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f7fb;
            color: #172033;
        }

        .container {
            max-width: 900px;
            margin: 80px auto;
            padding: 50px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,.08);
        }

        a {
            color: #dc2626;
            text-decoration: none;
        }

        h1 {
            font-size: 42px;
        }

        p {
            color: #64748b;
            line-height: 1.8;
        }
    </style>
</head>

<body>

<div class="container">

    <a href="{{ route('home') }}">← Back Home</a>

    <h1>Laravel Architecture</h1>

    <p>
        This Day 27 application focuses on the foundation of Laravel
        development: routing, controllers and Blade views.
    </p>

    <p>
        Instead of putting application logic directly inside routes,
        requests are delegated to a dedicated controller. This keeps the
        application organized and makes it easier to expand later.
    </p>

</div>

</body>
</html>