import { useState } from "react";

export default function Dashboard() {
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [savingGoals] = useState([
  "Mutual Fund",
  "Kite",
  "Europe Trip",
  "Coach Bag",
]);

const [newTransaction, setNewTransaction] = useState({
  remark: "",
  amount: "",
  type: "Expense",
  account: "IndusInd Bank",
  savingGoal: "",
  date: "",
});
  const accounts = [
    { name: "IndusInd Bank", balance: 100000 },
    { name: "TMB Bank", balance: 25000 },
    // { name: "Mutual Fund", balance: 50000 },
    // { name: "Kite", balance: 18000 },
  ];

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      remark: "Salary",
      amount: 100000,
      type: "Income",
      account: "IndusInd Bank",
      date: "01 Jul 2026",
    },
    {
      id: 2,
      remark: "Mutual Fund Investment",
      amount: 20000,
      type: "Transfer",
      account: "Mutual Fund",
      date: "05 Jul 2026",
    },
    {
      id: 3,
      remark: "Shopping",
      amount: 2500,
      type: "Expense",
      account: "IndusInd Bank",
      date: "06 Jul 2026",
    },
  ]);

  const filteredTransactions =
    selectedAccount === "All"
      ? transactions
      : transactions.filter(
          (item) => item.account === selectedAccount
        );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Account Cards */}

      <div className="grid grid-cols-4 gap-5">

        {accounts.map((account) => (
          <div
            key={account.name}
            className="bg-white rounded-2xl shadow p-5"
          >
            <h3 className="text-gray-500 text-sm">
              {account.name}
            </h3>

            <h1 className="text-3xl font-bold mt-3">
              ₹{account.balance.toLocaleString()}
            </h1>
          </div>
        ))}

      </div>

      {/* Month + Button */}

      <div className="flex justify-between items-center mt-10">

        <h1 className="text-4xl font-bold">
          July 2026
        </h1>

        <button
        onClick={() => setShowModal(true)}
        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
      >
        + Add Entry
      </button>

      </div>

      {/* Filter */}

      <div className="mt-5 flex gap-3 items-center">

        <label className="font-semibold">
          Account :
        </label>

        <select
          className="border rounded-lg px-4 py-2"
          value={selectedAccount}
          onChange={(e) =>
            setSelectedAccount(e.target.value)
          }
        >
          <option>All</option>

          {accounts.map((account) => (
            <option key={account.name}>
              {account.name}
            </option>
          ))}

        </select>

      </div>

      {/* Table + Summary */}

      <div className="grid grid-cols-12 gap-6 mt-8">

        {/* Transactions */}

        <div className="col-span-9 bg-white rounded-2xl shadow p-5">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Remark</th>

                <th>Amount</th>

                <th>Type</th>

                <th>Account</th>

                <th>Date</th>

                <th>Edit</th>

              </tr>

            </thead>

            <tbody>

              {filteredTransactions.map((item) => (

                <tr key={item.id} className="border-b">

                  <td className="py-4">
                    {item.remark}
                  </td>

                  <td className="text-center">
                    ₹{item.amount.toLocaleString()}
                  </td>

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.type === "Income"
                          ? "bg-green-100 text-green-700"
                          : item.type === "Expense"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type}
                    </span>

                  </td>

                  <td className="text-center">
                    {item.account}
                  </td>

                  <td className="text-center">
                    {item.date}
                  </td>

                  <td className="text-center">

                    <button>
                      ✏️
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Summary */}

        <div className="col-span-3 bg-white rounded-2xl shadow p-5">

          <h2 className="text-xl font-bold">
            July Summary
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex justify-between">

              <span>Total Income</span>

              <span className="text-green-600 font-semibold">
                ₹1,00,000
              </span>

            </div>

            <div className="flex justify-between">

              <span>Total Expense</span>

              <span className="text-red-600 font-semibold">
                ₹2,500
              </span>

            </div>

            <div className="flex justify-between">

              <span>Transfer</span>

              <span className="text-blue-600 font-semibold">
                ₹20,000
              </span>

            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">

              <span>Balance</span>

              <span>
                ₹77,500
              </span>

            </div>

          </div>

        </div>

      </div>
    {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-[500px] p-8 shadow-xl">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Add Transaction
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-2xl"
        >
          ✕
        </button>

      </div>

      <div className="space-y-4">

        {/* Remark */}

        <div>
          <label className="font-medium">Remark</label>

          <input
            type="text"
            placeholder="Salary / Shopping / Fuel"
            className="w-full border rounded-lg p-3 mt-2"
            value={newTransaction.remark}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                remark: e.target.value,
              })
            }
          />
        </div>

        {/* Amount */}

        <div>
          <label className="font-medium">Amount</label>

          <input
            type="number"
            className="w-full border rounded-lg p-3 mt-2"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                amount: e.target.value,
              })
            }
          />
        </div>

        {/* Type */}

        <div>
          <label className="font-medium">Type</label>

          <select
            className="w-full border rounded-lg p-3 mt-2"
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                type: e.target.value,
              })
            }
          >
            <option>Income</option>
            <option>Expense</option>
            <option>Savings</option>
          </select>
        </div>

        {/* Income */}

{newTransaction.type === "Income" && (

<div>

<label className="font-medium">
Add To
</label>

<select
className="w-full border rounded-lg p-3 mt-2"
value={newTransaction.account}
onChange={(e)=>
setNewTransaction({
...newTransaction,
account:e.target.value
})
}
>

{accounts.map((acc)=>(
<option
key={acc.name}
value={acc.name}
>
{acc.name}
</option>
))}

</select>

</div>

)}
{/* Expense */}

{newTransaction.type === "Expense" && (

<div>

<label className="font-medium">
Paid From
</label>

<select
className="w-full border rounded-lg p-3 mt-2"
value={newTransaction.account}
onChange={(e)=>
setNewTransaction({
...newTransaction,
account:e.target.value
})
}
>

{accounts.map((acc)=>(
<option
key={acc.name}
value={acc.name}
>
{acc.name}
</option>
))}

</select>

</div>

)}
{/* Savings */}

{newTransaction.type === "Savings" && (

<>

<div>

<label className="font-medium">
Paid From
</label>

<select
className="w-full border rounded-lg p-3 mt-2"
value={newTransaction.account}
onChange={(e)=>
setNewTransaction({
...newTransaction,
account:e.target.value
})
}
>

<option>IndusInd Bank</option>
<option>TMB Bank</option>

</select>

</div>

<div>

<label className="font-medium">
Savings Goal
</label>

<select
className="w-full border rounded-lg p-3 mt-2"
value={newTransaction.savingGoal}
onChange={(e)=>
setNewTransaction({
...newTransaction,
savingGoal:e.target.value
})
}
>

<option value="">Select Goal</option>

{savingGoals.map(goal=>(
<option
key={goal}
value={goal}
>
{goal}
</option>
))}

</select>

</div>

</>

)}

        {/* Date */}
        <div>
          <label className="font-medium">Date</label>

          <input
            type="date"
            className="w-full border rounded-lg p-3 mt-2"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                date: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          className="bg-black text-white px-6 py-2 rounded-lg"
          onClick={() => {

    const transaction = {
        id: Date.now(),
        remark: newTransaction.remark,
        amount: Number(newTransaction.amount),
        type: newTransaction.type,

        account:
            newTransaction.type === "Savings"
                ? newTransaction.savingGoal
                : newTransaction.account,

        date: newTransaction.date,
    };

    setTransactions([...transactions, transaction]);

    setNewTransaction({
        remark: "",
        amount: "",
        type: "Expense",
        account: "IndusInd Bank",
        savingGoal: "",
        date: "",
    });

    setShowModal(false);
}}
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}