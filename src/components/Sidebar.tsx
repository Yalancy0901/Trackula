import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white">

      <div className="p-8 text-2xl font-bold">
        💰 Expense Tracker
      </div>

      <nav className="flex flex-col gap-2 px-4">

        <Link to="/">Dashboard</Link>

        <Link to="/expenses">Expenses</Link>

        <Link to="/income">Income</Link>

        <Link to="/savings">Savings</Link>

        <Link to="/analytics">Analytics</Link>

        <Link to="/yearbook">Yearbook</Link>

        <Link to="/settings">Settings</Link>

      </nav>

    </aside>
  );
}