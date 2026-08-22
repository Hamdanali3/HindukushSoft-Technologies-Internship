<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Day 27 | Laravel</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background: #f5f7fb;
            color: #172033;
        }

        nav {
            background: #111827;
            padding: 18px 8%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        nav a {
            color: white;
            text-decoration: none;
            margin-left: 24px;
        }

        .brand {
            font-size: 20px;
            font-weight: 700;
        }

        .hero {
            max-width: 1100px;
            margin: 80px auto;
            padding: 60px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,.08);
        }

        .badge {
            display: inline-block;
            padding: 8px 14px;
            background: #fee2e2;
            color: #dc2626;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
        }

        h1 {
            font-size: 52px;
            margin: 20px 0;
        }

        p {
            color: #64748b;
            line-height: 1.7;
            max-width: 700px;
        }

        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 13px 20px;
            background: #111827;
            color: white;
            text-decoration: none;
            border-radius: 10px;
        }
    </style>
</head>

<body>

<nav>
    <div class="brand">Laravel Lab</div>

    <div>
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('about') }}">About</a>
        <a href="{{ route('project', ['project' => 'Task Manager']) }}">
            Project
        </a>
    </div>
</nav>

<section class="hero">
    <span class="badge">DAY 27 · LARAVEL</span>

    <h1>Building with Laravel Routes & Controllers.</h1>

    <p>
        This application demonstrates how Laravel handles incoming requests
        through routes, controllers, and Blade views. The structure is kept
        clean so that new features can be added without making the application
        difficult to maintain.
    </p>

    <a class="button" href="{{ route('about') }}">
        Explore the Architecture →
    </a>
</section>

</body>
</html>