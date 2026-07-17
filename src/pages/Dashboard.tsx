import { useMemo, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

type EntryType = "Income" | "Expense" | "Saving" | "Investment";
type Wallet = { name: string; balance: number; accent: string };
type Goal = { name: string; amount: number; target: number };
export type SavingsItem = { id: number; name: string; amount: number };
export type Transaction = {
  id: number;
  remark: string;
  amount: number;
  type: EntryType;
  account: string;
  destination?: string;
  date: string;
};

type Editor =
  | { kind: "wallet"; index: number }
  | { kind: "saving"; index: number }
  | { kind: "investment"; index: number }
  | null;

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const emptyEntry = () => ({
  remark: "",
  amount: "",
  type: "Expense" as EntryType,
  account: "IndusInd Bank",
  destination: "",
  date: today(),
});

type DashboardProps = {
  savings: SavingsItem[];
  setSavings: Dispatch<SetStateAction<SavingsItem[]>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
};

export default function Dashboard({ savings, setSavings, transactions, setTransactions }: DashboardProps) {
  const [wallets, setWallets] = useState<Wallet[]>([
    { name: "IndusInd Bank", balance: 100000, accent: "from-violet-600 to-indigo-600" },
    { name: "TMB Bank", balance: 25000, accent: "from-sky-500 to-cyan-500" },
    { name: "Meal Card", balance: 3000, accent: "from-amber-400 to-orange-500" },
  ]);

  const [investments, setInvestments] = useState<Goal[]>([
    { name: "Mutual Fund", amount: 50000, target: 100000 },
    { name: "Kite", amount: 18000, target: 50000 },
  ]);

  const [selectedAccount, setSelectedAccount] = useState("All");
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
  const [entry, setEntry] = useState(emptyEntry);
  const [editor, setEditor] = useState<Editor>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(`${currentMonth}-01T00:00:00`));
  const monthlyTransactions = transactions.filter((transaction) => transaction.date.startsWith(currentMonth));

  const monthlyTotals = useMemo(() => {
    const total = (type: EntryType) =>
      monthlyTransactions
        .filter((transaction) => transaction.type === type)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income: total("Income"),
      expense: total("Expense"),
      saving: total("Saving"),
      investment: total("Investment"),
    };
  }, [monthlyTransactions]);

  const filteredTransactions =
    selectedAccount === "All"
      ? monthlyTransactions
      : monthlyTransactions.filter((transaction) => transaction.account === selectedAccount);

  const destinationOptions =
    entry.type === "Saving"
      ? savings.map((goal) => goal.name)
      : entry.type === "Investment"
        ? investments.map((investment) => investment.name)
        : [];

  function openAddEntryModal() {
    setEditingTransactionId(null);
    setEntry(emptyEntry());
    setShowEntryModal(true);
  }

  function openTransactionEditor(transaction: Transaction) {
    setEditingTransactionId(transaction.id);
    setEntry({
      remark: transaction.remark,
      amount: String(transaction.amount),
      type: transaction.type,
      account: transaction.account,
      destination: transaction.destination ?? "",
      date: transaction.date,
    });
    setShowEntryModal(true);
  }

  function closeEntryModal() {
    setShowEntryModal(false);
    setEditingTransactionId(null);
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(entry.amount);
    const needsDestination = entry.type === "Saving" || entry.type === "Investment";

    if (!entry.remark.trim() || amount <= 0 || !Number.isFinite(amount) || (needsDestination && !entry.destination)) {
      return;
    }

    const savedTransaction: Transaction = {
      id: editingTransactionId ?? Date.now(),
      remark: entry.remark.trim(),
      amount,
      type: entry.type,
      account: entry.account,
      destination: entry.destination || undefined,
      date: entry.date,
    };

    if (editingTransactionId) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingTransactionId ? savedTransaction : transaction,
        ),
      );
    } else {
      setTransactions((current) => [savedTransaction, ...current]);
      const walletChange = entry.type === "Income" ? amount : -amount;

      setWallets((current) =>
        current.map((wallet) =>
          wallet.name === entry.account
            ? { ...wallet, balance: wallet.balance + walletChange }
            : wallet,
        ),
      );

      if (entry.type === "Saving") {
        setSavings((current) =>
          current.map((goal) =>
            goal.name === entry.destination ? { ...goal, amount: goal.amount + amount } : goal,
          ),
        );
      }

      if (entry.type === "Investment") {
        setInvestments((current) =>
          current.map((investment) =>
            investment.name === entry.destination
              ? { ...investment, amount: investment.amount + amount }
              : investment,
          ),
        );
      }
    }

    closeEntryModal();
  }

  function deleteTransaction(id: number) {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-violet-600">Personal finance</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{currentMonthLabel}</h1>
            <p className="mt-2 text-slate-500">This month’s transactions. Earlier months are saved in Yearbook.</p>
          </div>

          <button
            type="button"
            onClick={openAddEntryModal}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Entry
          </button>
        </header>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Wallets</h2>
            <span className="text-sm text-slate-500">Click Edit to update a balance or name</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {wallets.map((wallet, index) => (
              <article key={wallet.name} className={`rounded-2xl bg-gradient-to-br ${wallet.accent} p-6 text-white shadow-lg shadow-slate-200`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-white/80">{wallet.name}</p>
                  <button type="button" onClick={() => setEditor({ kind: "wallet", index })} className="rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25">Edit</button>
                </div>
                <p className="mt-9 text-3xl font-semibold tracking-tight">{currency(wallet.balance)}</p>
                <p className="mt-2 text-sm text-white/70">Available balance</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          <SavingsSection savings={savings} onEdit={(index) => setEditor({ kind: "saving", index })} />
          <GoalSection title="Investments" subtitle="Build long-term wealth" goals={investments} onEdit={(index) => setEditor({ kind: "investment", index })} color="bg-sky-500" />
        </div>

        <section className="mt-9 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Transactions</h2>
                <p className="mt-1 text-sm text-slate-500">Edit or remove any entry.</p>
              </div>

              <select value={selectedAccount} onChange={(event) => setSelectedAccount(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2">
                <option>All</option>
                {wallets.map((wallet) => <option key={wallet.name}>{wallet.name}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-5 py-3 font-medium">Remark</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Account</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 text-right font-medium">Amount</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4"><p className="font-medium">{transaction.remark}</p>{transaction.destination && <p className="mt-1 text-xs text-slate-500">{transaction.destination}</p>}</td>
                      <td className="px-5 py-4"><TypeBadge type={transaction.type} /></td>
                      <td className="px-5 py-4 text-slate-600">{transaction.account}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(transaction.date)}</td>
                      <td className={`px-5 py-4 text-right font-semibold ${transaction.type === "Income" ? "text-emerald-600" : "text-slate-800"}`}>{transaction.type === "Income" ? "+" : "−"}{currency(transaction.amount)}</td>
                      <td className="px-5 py-4 text-right"><button type="button" onClick={() => openTransactionEditor(transaction)} className="mr-3 font-medium text-violet-600 hover:text-violet-800">Edit</button><button type="button" onClick={() => deleteTransaction(transaction.id)} className="font-medium text-rose-600 hover:text-rose-800">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-200">
            <p className="text-sm font-medium text-slate-400">{currentMonthLabel}</p>
            <h2 className="mt-1 text-xl font-semibold">Monthly summary</h2>
            <div className="mt-7 space-y-5"><SummaryLine label="Income" value={monthlyTotals.income} color="text-emerald-400" /><SummaryLine label="Expenses" value={monthlyTotals.expense} color="text-rose-300" /><SummaryLine label="Savings" value={monthlyTotals.saving} color="text-violet-300" /><SummaryLine label="Investments" value={monthlyTotals.investment} color="text-sky-300" /></div>
            <div className="mt-7 border-t border-white/10 pt-5"><p className="text-sm text-slate-400">Net cash flow</p><p className="mt-1 text-3xl font-semibold">{currency(monthlyTotals.income - monthlyTotals.expense - monthlyTotals.saving - monthlyTotals.investment)}</p></div>
          </aside>
        </section>
      </div>

      {showEntryModal && <EntryModal entry={entry} wallets={wallets} destinations={destinationOptions} isEditing={editingTransactionId !== null} onChange={setEntry} onClose={closeEntryModal} onSubmit={saveEntry} />}
      {editor && <ValueEditor editor={editor} wallets={wallets} savings={savings} investments={investments} onClose={() => setEditor(null)} onSaveWallet={setWallets} onSaveSavings={setSavings} onSaveInvestments={setInvestments} />}
    </main>
  );
}

function SavingsSection({ savings, onEdit }: { savings: SavingsItem[]; onEdit: (index: number) => void }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Savings</h2><p className="mt-1 text-sm text-slate-500">Put money aside without a target.</p><div className="mt-6 space-y-6">{savings.map((saving, index) => <div key={saving.id} className="flex items-center justify-between"><div><p className="font-medium">{saving.name}</p><p className="mt-1 text-sm text-slate-500">{currency(saving.amount)} saved</p></div><button type="button" onClick={() => onEdit(index)} className="text-sm font-medium text-violet-600 hover:text-violet-800">Edit</button></div>)}</div></section>;
}

function GoalSection({ title, subtitle, goals, onEdit, color }: { title: string; subtitle: string; goals: Goal[]; onEdit: (index: number) => void; color: string }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p><div className="mt-6 space-y-6">{goals.map((goal, index) => { const progress = Math.min(100, Math.round((goal.amount / goal.target) * 100)); return <div key={goal.name}><div className="flex items-center justify-between gap-3"><span className="font-medium">{goal.name}</span><button type="button" onClick={() => onEdit(index)} className="text-sm font-medium text-violet-600 hover:text-violet-800">Edit</button></div><div className="mt-2 flex justify-between text-sm text-slate-500"><span>{currency(goal.amount)}</span><span>{currency(goal.target)}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs text-slate-500">{progress}% of goal</p></div>; })}</div></section>;
}

function TypeBadge({ type }: { type: EntryType }) { const style = type === "Income" ? "bg-emerald-100 text-emerald-700" : type === "Expense" ? "bg-rose-100 text-rose-700" : type === "Saving" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{type}</span>; }
function SummaryLine({ label, value, color }: { label: string; value: number; color: string }) { return <div className="flex justify-between"><span className="text-sm text-slate-300">{label}</span><span className={`font-semibold ${color}`}>{currency(value)}</span></div>; }

function EntryModal({ entry, wallets, destinations, isEditing, onChange, onClose, onSubmit }: { entry: ReturnType<typeof emptyEntry>; wallets: Wallet[]; destinations: string[]; isEditing: boolean; onChange: (entry: ReturnType<typeof emptyEntry>) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const label = entry.type === "Income" ? "Add to" : "Paid from";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="entry-title"><form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"><div className="mb-6 flex items-center justify-between"><h2 id="entry-title" className="text-2xl font-bold">{isEditing ? "Edit Transaction" : "Add Transaction"}</h2><button type="button" onClick={onClose} className="text-2xl text-slate-500">×</button></div><div className="space-y-4"><Input label="Remark"><input required value={entry.remark} onChange={(e) => onChange({ ...entry, remark: e.target.value })} placeholder="Salary / Shopping / Fuel" /></Input><Input label="Amount"><input required min="1" type="number" value={entry.amount} onChange={(e) => onChange({ ...entry, amount: e.target.value })} /></Input><Input label="Type"><select value={entry.type} onChange={(e) => onChange({ ...entry, type: e.target.value as EntryType, destination: "" })}>{(["Income", "Expense", "Saving", "Investment"] as EntryType[]).map((type) => <option key={type}>{type}</option>)}</select></Input><Input label={label}><select value={entry.account} onChange={(e) => onChange({ ...entry, account: e.target.value })}>{wallets.map((wallet) => <option key={wallet.name}>{wallet.name}</option>)}</select></Input>{destinations.length > 0 && <Input label={entry.type === "Saving" ? "Savings Goal" : "Investment"}><select required value={entry.destination} onChange={(e) => onChange({ ...entry, destination: e.target.value })}><option value="">Select option</option>{destinations.map((destination) => <option key={destination}>{destination}</option>)}</select></Input>}<Input label="Date"><input required type="date" value={entry.date} onChange={(e) => onChange({ ...entry, date: e.target.value })} /></Input></div><div className="mt-8 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button><button className="rounded-lg bg-black px-6 py-2 text-white">{isEditing ? "Update" : "Save"}</button></div></form></div>;
}

function ValueEditor({ editor, wallets, savings, investments, onClose, onSaveWallet, onSaveSavings, onSaveInvestments }: { editor: Exclude<Editor, null>; wallets: Wallet[]; savings: SavingsItem[]; investments: Goal[]; onClose: () => void; onSaveWallet: (items: Wallet[]) => void; onSaveSavings: Dispatch<SetStateAction<SavingsItem[]>>; onSaveInvestments: (items: Goal[]) => void }) {
  const item = editor.kind === "wallet" ? wallets[editor.index] : editor.kind === "saving" ? savings[editor.index] : investments[editor.index];
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(String(editor.kind === "wallet" ? (item as Wallet).balance : (item as Goal | SavingsItem).amount));
  const [target, setTarget] = useState(String(editor.kind === "investment" ? (item as Goal).target : ""));
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const numberAmount = Number(amount); if (!name.trim() || numberAmount < 0) return; if (editor.kind === "wallet") onSaveWallet(wallets.map((wallet, index) => index === editor.index ? { ...wallet, name: name.trim(), balance: numberAmount } : wallet)); if (editor.kind === "saving") onSaveSavings(savings.map((saving, index) => index === editor.index ? { ...saving, name: name.trim(), amount: numberAmount } : saving)); if (editor.kind === "investment") onSaveInvestments(investments.map((investment, index) => index === editor.index ? { ...investment, name: name.trim(), amount: numberAmount, target: Number(target) } : investment)); onClose(); }
  const title = editor.kind === "wallet" ? "Edit Wallet" : editor.kind === "saving" ? "Edit Saving" : "Edit Investment";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true"><form onSubmit={save} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"><div className="flex justify-between"><h2 className="text-2xl font-bold">{title}</h2><button type="button" onClick={onClose} className="text-2xl text-slate-500">×</button></div><div className="mt-6 space-y-4"><Input label="Name"><input required value={name} onChange={(e) => setName(e.target.value)} /></Input><Input label={editor.kind === "wallet" ? "Balance" : "Current amount"}><input required min="0" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Input>{editor.kind === "investment" && <Input label="Target amount"><input required min="1" type="number" value={target} onChange={(e) => setTarget(e.target.value)} /></Input>}</div><div className="mt-8 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button><button className="rounded-lg bg-black px-6 py-2 text-white">Save changes</button></div></form></div>;
}

function Input({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block font-medium text-slate-700">{label}<span className="mt-2 block [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-300 [&_input]:p-3 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-300 [&_select]:p-3">{children}</span></label>; }
