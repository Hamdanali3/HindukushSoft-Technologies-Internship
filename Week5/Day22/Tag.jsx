/**
 * The smallest reusable piece in this project — a single prop in, a single
 * pill out. UserCard renders one of these per skill by mapping over an
 * array, which is the other half of the props story: not just passing
 * data down, but passing down a different value on every iteration of a
 * loop.
 */
function Tag({ label }) {
  return <span className="tag">{label}</span>;
}

export default Tag;
