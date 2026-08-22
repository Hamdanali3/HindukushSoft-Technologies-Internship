<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Work Item</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f9;
            margin: 0;
            padding: 40px;
            color: #172033;
        }

        .container {
            max-width: 750px;
            margin: auto;
        }

        .card {
            background: white;
            padding: 30px;
            border-radius: 14px;
            box-shadow: 0 8px 25px rgba(0,0,0,.08);
        }

        h1 {
            margin-top: 0;
        }

        label {
            display: block;
            margin: 18px 0 7px;
            font-weight: bold;
        }

        input,
        textarea,
        select {
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 7px;
            font-size: 15px;
        }

        textarea {
            min-height: 130px;
            resize: vertical;
        }

        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .actions {
            margin-top: 25px;
            display: flex;
            gap: 10px;
        }

        button,
        a {
            border: 0;
            text-decoration: none;
            padding: 11px 18px;
            border-radius: 7px;
            cursor: pointer;
            font-size: 15px;
        }

        button {
            background: #2563eb;
            color: white;
        }

        a {
            background: #64748b;
            color: white;
        }

        .errors {
            background: #fee2e2;
            color: #991b1b;
            padding: 15px;
            border-radius: 7px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="card">

        <h1>Edit Work Item</h1>

        @if ($errors->any())
            <div class="errors">
                <strong>Please fix the following errors:</strong>

                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('work-items.update', $workItem) }}">

            @csrf
            @method('PUT')

            <label for="title">Title</label>

            <input
                type="text"
                id="title"
                name="title"
                value="{{ old('title', $workItem->title) }}"
                required
            >

            <label for="description">Description</label>

            <textarea
                id="description"
                name="description"
            >{{ old('description', $workItem->description) }}</textarea>

            <div class="row">

                <div>
                    <label for="status">Status</label>

                    <select name="status" id="status" required>

                        <option value="pending"
                            {{ old('status', $workItem->status) === 'pending' ? 'selected' : '' }}>
                            Pending
                        </option>

                        <option value="in_progress"
                            {{ old('status', $workItem->status) === 'in_progress' ? 'selected' : '' }}>
                            In Progress
                        </option>

                        <option value="completed"
                            {{ old('status', $workItem->status) === 'completed' ? 'selected' : '' }}>
                            Completed
                        </option>

                    </select>
                </div>

                <div>
                    <label for="priority">Priority</label>

                    <select name="priority" id="priority" required>

                        <option value="low"
                            {{ old('priority', $workItem->priority) === 'low' ? 'selected' : '' }}>
                            Low
                        </option>

                        <option value="medium"
                            {{ old('priority', $workItem->priority) === 'medium' ? 'selected' : '' }}>
                            Medium
                        </option>

                        <option value="high"
                            {{ old('priority', $workItem->priority) === 'high' ? 'selected' : '' }}>
                            High
                        </option>

                    </select>
                </div>

            </div>

            <label for="due_date">Due Date</label>

            <input
                type="date"
                id="due_date"
                name="due_date"
                value="{{ old('due_date', $workItem->due_date?->format('Y-m-d')) }}"
            >

            <div class="actions">

                <button type="submit">
                    Update Work Item
                </button>

                <a href="{{ route('work-items.index') }}">
                    Cancel
                </a>

            </div>

        </form>

    </div>

</div>

</body>
</html>