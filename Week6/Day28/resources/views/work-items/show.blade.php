<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $workItem->title }} - Work Item</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f9;
            margin: 0;
            padding: 40px;
            color: #172033;
        }

        .container {
            max-width: 850px;
            margin: auto;
        }

        .card {
            background: white;
            border-radius: 14px;
            padding: 30px;
            box-shadow: 0 8px 25px rgba(0,0,0,.08);
        }

        h1 {
            margin-top: 0;
        }

        .description {
            color: #555;
            line-height: 1.7;
            margin: 25px 0;
        }

        .meta {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 25px;
        }

        .meta-box {
            background: #f7f8fa;
            padding: 15px;
            border-radius: 8px;
        }

        .label {
            font-size: 12px;
            color: #777;
            text-transform: uppercase;
        }

        .value {
            margin-top: 5px;
            font-weight: bold;
        }

        .actions {
            margin-top: 30px;
            display: flex;
            gap: 10px;
        }

        a {
            text-decoration: none;
            color: white;
            padding: 10px 16px;
            border-radius: 7px;
            background: #172033;
        }

        .edit {
            background: #2563eb;
        }

        .back {
            background: #64748b;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="card">

        <h1>{{ $workItem->title }}</h1>

        <div class="description">
            {{ $workItem->description ?: 'No description provided.' }}
        </div>

        <div class="meta">

            <div class="meta-box">
                <div class="label">Status</div>
                <div class="value">
                    {{ ucfirst(str_replace('_', ' ', $workItem->status)) }}
                </div>
            </div>

            <div class="meta-box">
                <div class="label">Priority</div>
                <div class="value">
                    {{ ucfirst($workItem->priority) }}
                </div>
            </div>

            <div class="meta-box">
                <div class="label">Due Date</div>
                <div class="value">
                    {{ $workItem->due_date ? $workItem->due_date->format('M d, Y') : 'No due date' }}
                </div>
            </div>

            <div class="meta-box">
                <div class="label">Created</div>
                <div class="value">
                    {{ $workItem->created_at->format('M d, Y') }}
                </div>
            </div>

        </div>

        <div class="actions">
            <a href="{{ route('work-items.index') }}" class="back">
                Back
            </a>

            <a href="{{ route('work-items.edit', $workItem) }}" class="edit">
                Edit Work Item
            </a>
        </div>

    </div>

</div>

</body>
</html>