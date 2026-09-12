/**
 * parseApiError
 *
 * A single, shared function that turns ANY Axios error — a Laravel
 * 422 validation failure, a 401/403, a 404, a 500, or even a network
 * failure where the server was never reached at all — into one
 * predictable shape:
 *
 *   { message: string, fieldErrors: Record<string, string[]> }
 *
 * Every component in the app (forms, lists, auth pages) calls this
 * instead of re-implementing the same `err.response?.data?...`
 * chain over and over, which is both repetitive and error-prone.
 */
export function parseApiError(err) {
  // The request never reached the server (offline, CORS, DNS, timeout…)
  if (!err.response) {
    return {
      message: "Unable to reach the server. Please check your internet connection.",
      fieldErrors: {},
    };
  }

  const { status, data } = err.response;

  if (status === 422) {
    return {
      message: data?.message || "Please correct the highlighted fields.",
      fieldErrors: data?.errors || {},
    };
  }

  if (status === 401) {
    return { message: "Your session has expired. Please log in again.", fieldErrors: {} };
  }

  if (status === 403) {
    return {
      message: data?.message || "You don't have permission to do that.",
      fieldErrors: {},
    };
  }

  if (status === 404) {
    return { message: data?.message || "The item you're looking for no longer exists.", fieldErrors: {} };
  }

  if (status >= 500) {
    return {
      message: data?.message || "Something went wrong on our end. Please try again shortly.",
      fieldErrors: {},
    };
  }

  return { message: data?.message || "An unexpected error occurred.", fieldErrors: {} };
}
