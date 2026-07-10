import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen">

      <div className="p-8 text-2xl font-bold border-b border-slate-700">
        💰 Expense Tracker
      </div>

      <nav className="flex flex-col mt-6">

        <Link
          to="/"
          className="px-8 py-4 hover:bg-slate-800 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/savings"
          className="px-8 py-4 hover:bg-slate-800 transition"
        >
          Savings
        </Link>

        <Link
          to="/yearbook"
          className="px-8 py-4 hover:bg-slate-800 transition"
        >
          Yearbook
        </Link>

      </nav>

    </aside>
  );
}