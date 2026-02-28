"use client";

import { useState } from "react";

const genres = [
  "Cricket",
  "Indian Movies",
  "Hyderabadi Food",
  "Indian General",
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    genre: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.genre) {
      alert("Please fill all fields and select a genre.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-order", {
      method: "POST",
    });

    const data = await res.json();

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,

      handler: async function (response: any) {
        const verify = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            ...form,
          }),
        });

        const result = await verify.json();

        if (result.success) {
          window.location.href = `/challenge?email=${form.email}&genre=${form.genre}`;
        } else {
          alert("Payment verification failed");
        }
      },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl mb-6">Register for Quiz</h1>

      <input
        placeholder="Name"
        className="mb-3 p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        className="mb-3 p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="mb-3 p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <select
        className="mb-4 p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, genre: e.target.value })}
      >
        <option value="">Select Genre</option>
        {genres.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>

      <button
        onClick={handlePayment}
        className="bg-purple-600 px-6 py-3 rounded"
      >
        {loading ? "Processing..." : "Pay ₹49 & Start"}
      </button>
    </div>
  );
}
