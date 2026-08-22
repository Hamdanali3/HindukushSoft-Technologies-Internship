import Tag from "./Tag.jsx";
import StatusDot from "./StatusDot.jsx";

/**
 * UserCard is the component this whole exercise is really about. It takes
 * one person's worth of data as individual props — not the whole team
 * array, just one entry's fields — and has no idea how many other cards
 * exist alongside it or where the data originally came from. That's what
 * makes it possible to render six of these from one array without writing
 * six almost-identical blocks of markup.
 */
function UserCard({ name, role, initials, color, status, bio, skills, featured }) {
  return (
    <article className={`user-card${featured ? " user-card--featured" : ""}`}>
      {featured && <span className="user-card__ribbon">Founding team</span>}

      <div className="user-card__top">
        <span className="user-card__avatar" style={{ backgroundColor: color }}>
          {initials}
        </span>
        <div className="user-card__identity">
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </div>

      <p className="user-card__bio">{bio}</p>

      <div className="user-card__skills">
        {skills.map((skill) => (
          <Tag key={skill} label={skill} />
        ))}
      </div>

      <div className="user-card__footer">
        <StatusDot status={status} />
      </div>
    </article>
  );
}

export default UserCard;
