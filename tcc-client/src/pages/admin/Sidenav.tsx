import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function Sidenav() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  if (!isAdmin) return null; // hide completely if not admin

  return (
    <aside className="sidenav">
      <div className="sidenav-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/73/Commission_on_Elections_%28COMELEC%29.svg"
          alt="COMELEC Logo"
        />
        <h2>Admin Dashboard</h2>
      </div>
      <nav className="sidenav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/votersRecord">Add Voter Record</Link>
        <Link to="/admin">Manage Users</Link>
        <Link to="/adminNews">Reports</Link>
        <Link to="#">Settings</Link>
      </nav>
    </aside>
  );
}
