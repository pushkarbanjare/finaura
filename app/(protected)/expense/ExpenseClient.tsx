"use client";

import { useState } from "react";

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

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    item: "",
    merchant: "",
    notes: "",
    date: "",
  });

  async function reload() {
    const res = await fetch("/api/expense/list");
    const data = await res.json();
    setExpenses(data.expenses ?? []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/expense/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        item,
        merchant: merchant || undefined,
        notes: notes || undefined,
        date: date || undefined,
      }),
    });

    if (res.ok) {
      setAmount("");
      setItem("");
      setMerchant("");
      setNotes("");
      setDate("");
      reload();
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

    if (editForm.amount !== "") payload.amount = Number(editForm.amount);
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Add Expense */}
      <div className="rounded-lg border border-foreground/20 p-4">
        <h2 className="font-semibold mb-3">Add Expense</h2>

        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="bg-gray-800 rounded-lg p-2 text-sm"
          />
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Item"
            className="bg-gray-800 rounded-lg p-2 text-sm"
          />
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Merchant"
            className="bg-gray-800 rounded-lg p-2 text-sm"
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            className="bg-gray-800 rounded-lg p-2 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 rounded-lg p-2 text-sm cursor-pointer"
          />

          <button className="border border-foreground/50 rounded-lg text-sm p-2 hover:bg-foreground/20">
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="md:col-span-2 space-y-2">
        {expenses.map((exp) => (
          <div
            key={exp._id}
            className="border border-foreground/40 p-3 rounded-md px-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  ₹{exp.amount} — {exp.item}
                </p>
                <p className="text-xs text-foreground/60">{exp.category}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(exp)}
                  className="text-sm bg-blue-700 rounded-sm px-2 py-1 hover:bg-blue-900 cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-sm bg-red-700 rounded-sm px-2 py-1 hover:bg-red-900 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Edit form */}
            {editingId === exp._id && (
              <form
                onSubmit={handleUpdate}
                className="mt-3 flex flex-col gap-2 border-t pt-3"
              >
                <input
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                  placeholder="Amount"
                />
                <input
                  value={editForm.item}
                  onChange={(e) =>
                    setEditForm({ ...editForm, item: e.target.value })
                  }
                  placeholder="Item"
                />
                <input
                  value={editForm.merchant}
                  onChange={(e) =>
                    setEditForm({ ...editForm, merchant: e.target.value })
                  }
                  placeholder="Merchant"
                />
                <input
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Notes"
                />
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                />

                <button className="border rounded-md py-1 hover:bg-foreground/20">
                  Save Changes
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
