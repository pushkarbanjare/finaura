"use client";

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
    if (!token) {
      alert("Not logged in");
      return;
    }
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
        "Content-Type": "applications/json",
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
    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Expense added!");
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
        "Content-Type": "applications/json",
      },
      body: JSON.stringify({ expenseId: id }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }
    alert("Expense deleted!");
    loadExpenses();
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    if (!token || !editId) return;

    const res = await fetch("/api/expense/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "applications/json",
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
    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Expense updated!");
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
    <div>
      <h1>Expense Page</h1>
      <h2>Add Expense</h2>
      <form onSubmit={handleAdd}>
        <div>
          <label>Amount: </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item: </label>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Merchant: </label>
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>
        <div>
          <label>Notes: </label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>

      <hr />

      <h2>Your Expenses</h2>
      {expenses.map((exp) => (
        <div key={exp._id} style={{ marginBottom: "15px" }}>
          <p>Amount: {String(exp.amount)}</p>
          <p>Item: {exp.item}</p>
          <p>Merchant: {exp.merchant}</p>
          <p>Notes: {exp.notes}</p>
          <p>Date: {exp.date?.slice(0, 10)}</p>
          <p>Category: {exp.category}</p>
          <button onClick={() => handleDelete(exp._id)}>Delete</button>
          <button onClick={() => startEdit(exp)}>Edit</button>

          {editId === exp._id && (
            <form onSubmit={handleUpdate}>
              <label>Amount: </label>
              <input
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />

              <label>Item: </label>
              <input
                value={editItem}
                onChange={(e) => setEditItem(e.target.value)}
              />

              <label>Merchant: </label>
              <input
                value={editMerchant}
                onChange={(e) => setEditMerchant(e.target.value)}
              />

              <label>Notes: </label>
              <input
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />

              <button type="submit">Save</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
