"use client";

import { useState } from "react";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const res = await fetch("/api/create-order", { method: "POST" });
const data = await res.json();

const options = {
  key: data.key,
  amount: data.order.amount,
  currency: data.order.currency,
  order_id: data.order.id,
  handler: async function (response) {
    const verify = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    });

    const result = await verify.json();

    if (result.success) {
      window.location.href = "/challenge";
    } else {
      alert("Payment verification failed");
    }
  },
  theme: { color: "#7c3aed" },
};

const razor = new (window as any).Razorpay(options);
razor.open();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Register for Challenge</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-purple-600 px-8 py-3 rounded-xl"
      >
        {loading ? "Processing..." : "Pay ₹49 & Start"}
      </button>
    </div>
  );
}

