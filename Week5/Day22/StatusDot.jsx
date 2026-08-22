const STATUS_COPY = {
  online: "Online now",
  away: "Away",
  offline: "Offline",
};

/**
 * A status prop drives both the color and the label here — there's no
 * separate "color" prop to keep in sync with "status" by hand, which is
 * the kind of thing that quietly drifts out of sync in a real codebase if
 * you let it be two props instead of one.
 */
function StatusDot({ status }) {
  return (
    <span className={`status-dot status-dot--${status}`}>
      <span className="status-dot__pip" aria-hidden="true" />
      {STATUS_COPY[status] ?? "Unknown"}
    </span>
  );
}

export default StatusDot;
