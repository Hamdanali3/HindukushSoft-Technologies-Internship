<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards platform-admin-only routes (not used heavily in TaskFlow today,
 * since most authorization is per-project via Policies, but kept for any
 * future admin panel — e.g. a route to list/deactivate all users).
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->isAdmin(), 403, 'Admin access required.');

        return $next($request);
    }
}
