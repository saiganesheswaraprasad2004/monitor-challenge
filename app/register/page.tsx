"use client";

import { useState } from "react";
import Script from "next/script";

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

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.genre) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
      });

      const data = await res.json();

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        handler: function (response: any) {
          console.log("Payment Success:", response);

          // 🔥 FIRE VERIFY API BUT DO NOT WAIT
          fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: form.name,
              email: form.email,
              phone: form.phone,
              genre: form.genre,
            }),
          }).catch((err) => {
            console.error("Verify API failed:", err);
          });

          // ✅ IMMEDIATE REDIRECT (NO WAITING)
          window.location.href = `/challenge?email=${form.email}&genre=${form.genre}`;
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      <h1 className="text-3xl mb-6">Register for Quiz</h1>

      <input
        placeholder="Name"
        className="mb-3 p-2 bg-gray-800 w-64"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        className="mb-3 p-2 bg-gray-800 w-64"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="mb-3 p-2 bg-gray-800 w-64"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <select
        className="mb-4 p-2 bg-gray-800 w-64"
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
        Pay ₹69 & Start Quiz
      </button>
    </div>
  );
}
