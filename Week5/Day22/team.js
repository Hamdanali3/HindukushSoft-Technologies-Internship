/**
 * A plain array of plain objects — no framework magic here. This is the
 * "data" half of the data-and-props split: App.jsx owns this list and
 * hands each entry down to a <UserCard /> as props. UserCard itself never
 * imports this file or knows where a member came from.
 */
const team = [
  {
    id: "amelia-chen",
    name: "Amelia Chen",
    role: "Founding Engineer",
    initials: "AC",
    color: "#6D5EF0",
    status: "online",
    bio: "Leads the platform team and still reviews every pull request personally, on principle.",
    skills: ["React", "Node.js", "PostgreSQL"],
    featured: true,
  },
  {
    id: "marcus-webb",
    name: "Marcus Webb",
    role: "Product Designer",
    initials: "MW",
    color: "#26D0CE",
    status: "online",
    bio: "Designs the interfaces, then argues everyone out of adding one more button to them.",
    skills: ["Figma", "Design Systems", "Motion"],
    featured: false,
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Backend Engineer",
    initials: "PN",
    color: "#E8A33D",
    status: "away",
    bio: "Owns the API layer and has opinions about database indexes that turn out to be correct.",
    skills: ["Go", "PostgreSQL", "Redis"],
    featured: false,
  },
  {
    id: "diego-torres",
    name: "Diego Torres",
    role: "Frontend Engineer",
    initials: "DT",
    color: "#D6455B",
    status: "online",
    bio: "Turns Figma files into components faster than most people can open Figma.",
    skills: ["React", "TypeScript", "CSS"],
    featured: false,
  },
  {
    id: "sara-lindqvist",
    name: "Sara Lindqvist",
    role: "QA Engineer",
    initials: "SL",
    color: "#4E7BA6",
    status: "offline",
    bio: "Finds the edge case in the demo about ninety seconds before it ships.",
    skills: ["Playwright", "CI/CD", "Testing"],
    featured: false,
  },
  {
    id: "kwame-mensah",
    name: "Kwame Mensah",
    role: "Engineering Manager",
    initials: "KM",
    color: "#8B6BD1",
    status: "away",
    bio: "Runs interference with everything so the rest of the team can actually build.",
    skills: ["Roadmapping", "1:1s", "Hiring"],
    featured: false,
  },
];

export default team;
