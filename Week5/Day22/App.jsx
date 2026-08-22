import Header from "./components/Header.jsx";
import UserCard from "./components/UserCard.jsx";
import team from "./data/team.js";
import "./App.css";

function App() {
  return (
    <div className="page">
      <Header
        title="The people behind Northlight"
        subtitle="A small team, built on purpose to stay small."
        memberCount={team.length}
      />

      {/*
        Every card below is the same component, the same JSX, rendered
        once per entry in the team array. The only thing that changes
        between them is which object from `team` gets spread onto the
        props — UserCard itself has no idea it's being reused six times.
      */}
      <main className="roster">
        {team.map((member) => (
          <UserCard key={member.id} {...member} />
        ))}
      </main>
    </div>
  );
}

export default App;
