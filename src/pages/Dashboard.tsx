export default function Dashboard() {
  return (
    <div>

      <div className="grid grid-cols-4 gap-6">

        <div className="rounded-xl bg-white p-6 shadow">
          <h3>Total Balance</h3>

          <p className="mt-3 text-3xl font-bold">
            ₹1,20,000
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3>Income</h3>

          <p className="mt-3 text-3xl font-bold">
            ₹50,000
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3>Expenses</h3>

          <p className="mt-3 text-3xl font-bold">
            ₹23,000
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3>Savings</h3>

          <p className="mt-3 text-3xl font-bold">
            ₹18,000
          </p>
        </div>

      </div>

    </div>
  );
}