"use client";

import { toast } from "@/components/ToastProvider";
import { useEffect, useState } from "react";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");
  const [merchant, setMerchant] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editItem, setEditItem] = useState("");
  const [editMerchant, setEditMerchant] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadExpenses() {
    if (!token) return toast("Not logged in");

    const res = await fetch("/api/expense/list", {
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();
    setExpenses(data.expenses || []);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleAdd(e: any) {
    e.preventDefault();
    if (!token) return;

    const res = await fetch("/api/expense/add", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        item,
        merchant,
        notes,
        date,
      }),
    });

    const data = await res.json();
    if (!res.ok) return toast(data.error);

    setAmount("");
    setItem("");
    setMerchant("");
    setNotes("");
    setDate("");

    loadExpenses();
  }

  async function handleDelete(id: string) {
    if (!token) return;

    const res = await fetch("/api/expense/delete", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expenseId: id }),
    });

    const data = await res.json();
    if (!res.ok) return toast(data.error);

    loadExpenses();
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    if (!token || !editId) return;

    const res = await fetch("/api/expense/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expenseId: editId,
        amount: Number(editAmount),
        item: editItem,
        merchant: editMerchant,
        notes: editNotes,
      }),
    });

    const data = await res.json();
    if (!res.ok) return toast(data.error);

    setEditId(null);
    loadExpenses();
  }

  function startEdit(exp: any) {
    setEditId(exp._id);
    setEditAmount(String(exp.amount));
    setEditItem(exp.item);
    setEditMerchant(exp.merchant);
    setEditNotes(exp.notes);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side */}
      <div className="md:col-span-1 bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Add Expense</h1>

        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <input
            className="border border-gray-300 px-3 py-2 rounded-md"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            className="border border-gray-300 px-3 py-2 rounded-md"
            placeholder="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />

          <input
            className="border border-gray-300 px-3 py-2 rounded-md"
            placeholder="Merchant (optional)"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />

          <input
            className="border border-gray-300 px-3 py-2 rounded-md"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded-md w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Right side */}
      <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-[600px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Your Expenses</h2>

        <div className="flex flex-col gap-2">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-gray-900">₹{exp.amount}</p>

                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border text-[11px]">
                  {exp.category}
                </span>
              </div>

              <div className="flex justify-between items-center mt-1">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">
                    {exp.item}
                  </p>
                  {exp.merchant && (
                    <p className="text-xs text-gray-500">via {exp.merchant}</p>
                  )}
                </div>

                <span className="text-xs text-gray-500">
                  {exp.date?.slice(0, 10)}
                </span>
              </div>

              <div className="flex justify-between items-start mt-2">
                <div className="text-[11px] text-gray-500 max-w-[70%]">
                  {exp.notes && <p>Note: {exp.notes}</p>}
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => startEdit(exp)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Edit form */}
              {editId === exp._id && (
                <form
                  onSubmit={handleUpdate}
                  className="mt-2 flex flex-col gap-2 border-t pt-2"
                >
                  <input
                    className="border border-gray-300 px-2 py-1 rounded"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  <input
                    className="border border-gray-300 px-2 py-1 rounded"
                    value={editItem}
                    onChange={(e) => setEditItem(e.target.value)}
                  />
                  <input
                    className="border border-gray-300 px-2 py-1 rounded"
                    value={editMerchant}
                    onChange={(e) => setEditMerchant(e.target.value)}
                  />
                  <input
                    className="border border-gray-300 px-2 py-1 rounded"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-1 rounded text-sm hover:bg-indigo-700 transition"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
