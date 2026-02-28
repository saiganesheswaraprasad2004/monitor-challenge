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
      // 1️⃣ Create Razorpay order
      const res = await fetch("/api/create-order", {
        method: "POST",
      });

      const data = await res.json();

      if (!data.order || !data.key) {
        alert("Order creation failed");
        return;
      }

      // 2️⃣ Razorpay Options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        handler: async function (response: any) {
          console.log("Payment Success Response:", response);

          try {
            const verifyRes = await fetch("/api/verify-payment", {
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
            });

            let result;

            try {
              result = await verifyRes.json();
            } catch (err) {
              console.error("Invalid JSON from verify API");
              result = { success: false };
            }

            console.log("Verify Result:", result);

            // 🔥 Redirect if payment ID exists
            if (response.razorpay_payment_id) {
              window.location.href = `/challenge?email=${form.email}&genre=${form.genre}`;
            } else {
              alert("Payment verification failed");
            }

          } catch (error) {
            console.error("Verify API error:", error);
            alert("Verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      // 3️⃣ Open Razorpay
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">

      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      <h1 className="text-3xl mb-6">Register for Quiz</h1>

      <input
        type="text"
        placeholder="Name"
        className="mb-3 p-2 bg-gray-800 w-64"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="mb-3 p-2 bg-gray-800 w-64"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="text"
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
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <button
        onClick={handlePayment}
        className="bg-purple-600 px-6 py-3 rounded"
      >
        Pay ₹49 & Start Quiz
      </button>
    </div>
  );
}
