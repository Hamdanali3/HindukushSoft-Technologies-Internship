<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Work Items | Workboard</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f7fb;
            color: #1f2937;
        }

        .container {
            width: 92%;
            max-width: 1200px;
            margin: 40px auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        h1 {
            margin: 0;
            font-size: 30px;
        }

        .subtitle {
            margin-top: 6px;
            color: #6b7280;
        }

        .btn {
            display: inline-block;
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-primary {
            background: #111827;
            color: white;
        }

        .btn-edit {
            background: #2563eb;
            color: white;
        }

        .btn-danger {
            background: #dc2626;
            color: white;
        }

        .alert {
            padding: 14px 18px;
            background: #dcfce7;
            color: #166534;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        th {
            background: #f9fafb;
            font-size: 13px;
            text-transform: uppercase;
            color: #6b7280;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            background: #e5e7eb;
        }

        .actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .actions form {
            margin: 0;
        }

        .empty {
            text-align: center;
            padding: 45px;
            color: #6b7280;
        }

        .pagination {
            padding: 20px;
        }

        @media (max-width: 800px) {
            .card {
                overflow-x: auto;
            }

            table {
                min-width: 850px;
            }

            .header {
                align-items: flex-start;
                gap: 15px;
                flex-direction: column;
            }
        }
    </style>
</head>

<body>

<div class="container">

    <div class="header">
        <div>
            <h1>Work Items</h1>
            <div class="subtitle">
                Manage and track your team's work efficiently.
            </div>
        </div>

        <a href="{{ route('work-items.create') }}" class="btn btn-primary">
            + Create Work Item
        </a>
    </div>

    @if(session('success'))
        <div class="alert">
            {{ session('success') }}
        </div>
    @endif

    <div class="card">

        @if($workItems->count())

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($workItems as $workItem)
                        <tr>

                            <td>
                                <strong>{{ $workItem->title }}</strong>

                                @if($workItem->description)
                                    <div style="color:#6b7280; margin-top:5px;">
                                        {{ Str::limit($workItem->description, 60) }}
                                    </div>
                                @endif
                            </td>

                            <td>
                                <span class="badge">
                                    {{ ucfirst($workItem->status) }}
                                </span>
                            </td>

                            <td>
                                <span class="badge">
                                    {{ ucfirst($workItem->priority) }}
                                </span>
                            </td>

                            <td>
                                {{ $workItem->due_date?->format('M d, Y') ?? '—' }}
                            </td>

                            <td>
                                {{ $workItem->created_at->format('M d, Y') }}
                            </td>

                            <td>
                                <div class="actions">

                                    <a
                                        href="{{ route('work-items.show', $workItem) }}"
                                        class="btn btn-primary"
                                    >
                                        View
                                    </a>

                                    <a
                                        href="{{ route('work-items.edit', $workItem) }}"
                                        class="btn btn-edit"
                                    >
                                        Edit
                                    </a>

                                    <form
                                        action="{{ route('work-items.destroy', $workItem) }}"
                                        method="POST"
                                        onsubmit="return confirm('Are you sure you want to delete this work item?');"
                                    >
                                        @csrf
                                        @method('DELETE')

                                        <button type="submit" class="btn btn-danger">
                                            Delete
                                        </button>
                                    </form>

                                </div>
                            </td>

                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="pagination">
                {{ $workItems->links() }}
            </div>

        @else

            <div class="empty">
                <h3>No work items found</h3>
                <p>Create your first work item to get started.</p>

                <a
                    href="{{ route('work-items.create') }}"
                    class="btn btn-primary"
                >
                    Create Work Item
                </a>
            </div>

        @endif

    </div>

</div>

</body>
</html>