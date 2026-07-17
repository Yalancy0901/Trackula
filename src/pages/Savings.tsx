import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { SavingsItem } from "./Dashboard";

type SavingsProps = {
  savings: SavingsItem[];
  setSavings: Dispatch<SetStateAction<SavingsItem[]>>;
};

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Savings({ savings, setSavings }: SavingsProps) {
  const [showModal, setShowModal] = useState(false);
  const [newSavingName, setNewSavingName] = useState("");

  function addSaving(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = newSavingName.trim();
    const alreadyExists = savings.some(
      (saving) => saving.name.toLowerCase() === name.toLowerCase(),
    );

    if (!name || alreadyExists) {
      return;
    }

    setSavings((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        amount: 0,
      },
    ]);

    setNewSavingName("");
    setShowModal(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Savings</h1>
          <p className="mt-2 text-gray-500">
            Create savings buckets and add money whenever you want. No target required.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
        >
          + Add Saving
        </button>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {savings.map((saving) => (
          <article key={saving.id} className="rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-violet-600">Saving</p>
            <h2 className="mt-2 text-2xl font-bold">{saving.name}</h2>
            <p className="mt-8 text-sm text-gray-500">Saved so far</p>
            <p className="mt-1 text-3xl font-bold">{currency(saving.amount)}</p>
          </article>
        ))}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="saving-title">
          <form onSubmit={addSaving} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="saving-title" className="text-2xl font-bold">Create Saving</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-2xl text-gray-600">×</button>
            </div>

            <div className="mt-6">
              <label className="font-medium">Saving name</label>
              <input
                required
                autoFocus
                type="text"
                placeholder="Example: New phone"
                className="mt-2 w-full rounded-lg border p-3"
                value={newSavingName}
                onChange={(event) => setNewSavingName(event.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500">You can add money to it later from the dashboard.</p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100">Cancel</button>
              <button className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800">Create Saving</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
