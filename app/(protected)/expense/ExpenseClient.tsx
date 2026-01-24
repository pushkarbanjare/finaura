"use client";

import { useState, useEffect } from "react";

type Expense = {
  _id: string;
  amount: number;
  item: string;
  merchant?: string;
  notes?: string;
  date?: string;
  category: string;
};

export default function ExpenseClient({
  initialExpenses,
}: {
  initialExpenses: Expense[];
}) {
  const [expenses, setExpenses] = useState(initialExpenses);

  // add form
  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");
  const [merchant, setMerchant] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    item: "",
    merchant: "",
    notes: "",
    date: "",
  });

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [message, error]);

  async function reload() {
    const res = await fetch("/api/expense/list");
    const data = await res.json();
    setExpenses(data.expenses ?? []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    // reset messages
    setError(null);
    setMessage(null);

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!item.trim()) {
      setError("Please enter an item name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/expense/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          item: item.trim(),
          merchant: merchant || undefined,
          notes: notes || undefined,
          date: date || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add expense");
        return;
      }

      setAmount("");
      setItem("");
      setMerchant("");
      setNotes("");
      setDate("");

      setMessage("Expense added successfully");
      reload();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/expense/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: id }),
    });
    reload();
  }

  function startEdit(exp: Expense) {
    setEditingId(exp._id);
    setEditForm({
      amount: exp.amount.toString(),
      item: exp.item,
      merchant: exp.merchant ?? "",
      notes: exp.notes ?? "",
      date: exp.date?.slice(0, 10) ?? "",
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    const payload: any = { expenseId: editingId };

    if (editForm.amount) payload.amount = Number(editForm.amount);
    if (editForm.item.trim()) payload.item = editForm.item.trim();
    if (editForm.merchant.trim()) payload.merchant = editForm.merchant.trim();
    if (editForm.notes.trim()) payload.notes = editForm.notes.trim();
    if (editForm.date) payload.date = editForm.date;

    const res = await fetch("/api/expense/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditingId(null);
      reload();
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
        {/* ADD EXPENSE FORM */}
        <div className="rounded-xl border border-foreground/20 bg-background p-5">
          <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

          {message && (
            <p className="rounded-md bg-green-900/30 text-green-400 px-3 py-2 text-sm">
              {message}
            </p>
          )}

          {error && (
            <div className="rounded-md bg-red-900/30 text-red-400 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleAdd}
            className="flex flex-col gap-3 text-sm pt-3"
          >
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
            />
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Item"
              className="rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
            />
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Merchant (optional)"
              className="rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
            />

            <button
              disabled={loading}
              className="border border-foreground/50 rounded-lg text-sm p-2 hover:bg-foreground/20 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>

        {/* EXPENSE LIST */}
        <div className="md:col-span-2 rounded-xl border border-foreground/20 bg-background p-5 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Your Expenses</h2>

          <div className="flex-1 max-h-[520px] overflow-y-auto pr-2 space-y-3">
            {expenses.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-foreground/50 text-center px-6">
                No expenses found yet. <br />
                Add your first expense to see it here.
              </div>
            ) : (
              expenses.map((exp) => (
                <div
                  key={exp._id}
                  className="rounded-lg border border-foreground/15 p-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-base font-medium">
                        ₹{exp.amount} · {exp.item}
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">
                        {exp.category}
                        {exp.date && ` · ${exp.date.slice(0, 10)}`}
                      </p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => startEdit(exp)}
                        className="rounded-md border border-foreground/20 px-2 py-1 hover:bg-foreground/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="rounded-md border border-red-500/30 px-2 py-1 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingId === exp._id && (
                    <form
                      onSubmit={handleUpdate}
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                    >
                      <input
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                        placeholder="Amount"
                        className="rounded-md border border-foreground/20 bg-background px-2 py-1"
                      />
                      <input
                        value={editForm.item}
                        onChange={(e) =>
                          setEditForm({ ...editForm, item: e.target.value })
                        }
                        placeholder="Item"
                        className="rounded-md border border-foreground/20 bg-background px-2 py-1"
                      />
                      <input
                        value={editForm.merchant}
                        onChange={(e) =>
                          setEditForm({ ...editForm, merchant: e.target.value })
                        }
                        placeholder="Merchant"
                        className="rounded-md border border-foreground/20 bg-background px-2 py-1"
                      />
                      <input
                        value={editForm.notes}
                        onChange={(e) =>
                          setEditForm({ ...editForm, notes: e.target.value })
                        }
                        placeholder="Notes"
                        className="rounded-md border border-foreground/20 bg-background px-2 py-1"
                      />
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        className="rounded-md border border-foreground/20 bg-background px-2 py-1"
                      />

                      <button className="sm:col-span-2 mt-1 rounded-md border border-foreground/30 py-1 hover:bg-foreground/10">
                        Save Changes
                      </button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
