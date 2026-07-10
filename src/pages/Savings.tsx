import { useState } from "react";

interface SavingGoal {
  id: number;
  name: string;
  target: number;
  saved: number;
}

export default function Savings() {
  const [showModal, setShowModal] = useState(false);

  const [goals, setGoals] = useState<SavingGoal[]>([
    {
      id: 1,
      name: "Europe Trip",
      target: 300000,
      saved: 45000,
    },
    {
      id: 2,
      name: "Coach Bag",
      target: 50000,
      saved: 12000,
    },
    {
      id: 3,
      name: "Mutual Fund",
      target: 100000,
      saved: 35000,
    },
    {
      id: 4,
      name: "Kite",
      target: 75000,
      saved: 10000,
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
  });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;

    const goal: SavingGoal = {
      id: Date.now(),
      name: newGoal.name,
      target: Number(newGoal.target),
      saved: 0,
    };

    setGoals([...goals, goal]);

    setNewGoal({
      name: "",
      target: "",
    });

    setShowModal(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Savings
          </h1>

          <p className="text-gray-500 mt-2">
            Track all your savings goals in one place.
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
        >
          + Add Goal
        </button>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-2 gap-6">

        {goals.map((goal) => {

          const progress =
            (goal.saved / goal.target) * 100;

          return (

            <div
              key={goal.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">
                    {goal.name}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Savings Goal
                  </p>

                </div>

                <button className="text-xl">
                  ✏️
                </button>

              </div>

              <div className="mt-8 space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Saved
                  </span>

                  <span className="font-semibold">
                    ₹{goal.saved.toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Target
                  </span>

                  <span className="font-semibold">
                    ₹{goal.target.toLocaleString()}
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                    }}
                  />

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Progress
                  </span>

                  <span className="font-medium">
                    {progress.toFixed(1)}%
                  </span>

                </div>

              </div>

            </div>

          );

        })}

      </div>
      {/* Add Goal Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[500px] p-8 shadow-xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Add Saving Goal
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5">

              <div>

                <label className="font-medium">
                  Goal Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Europe Trip"
                  className="w-full border rounded-lg p-3 mt-2"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="font-medium">
                  Target Amount
                </label>

                <input
                  type="number"
                  placeholder="300000"
                  className="w-full border rounded-lg p-3 mt-2"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      target: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={addGoal}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
              >
                Save Goal
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}