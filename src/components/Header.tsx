export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500">
          July 2026
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button>🔔</button>

        <img
          src="https://i.pravatar.cc/45"
          className="rounded-full"
        />
      </div>
    </header>
  );
}