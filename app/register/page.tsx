"use client";
import Script from "next/script";
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

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.genre) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("/api/create-order", { method: "POST" });
    const data = await res.json();

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,

      handler: async function (response: any) {
  console.log("Payment Success Response:", response);

  const verify = await fetch("/api/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...response,
      ...form,
    }),
  });

  const result = await verify.json();
  console.log("Verify Result:", result);

  if (result.success) {
    window.location.href = `/challenge?email=${form.email}&genre=${form.genre}`;
  } else {
    alert("Verification failed");
  }
},
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="beforeInteractive"
/>
      <h1 className="text-3xl mb-6">Register</h1>

      <input placeholder="Name" className="mb-3 p-2 bg-gray-800" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" className="mb-3 p-2 bg-gray-800" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Phone" className="mb-3 p-2 bg-gray-800" onChange={(e)=>setForm({...form,phone:e.target.value})}/>

      <select className="mb-4 p-2 bg-gray-800" onChange={(e)=>setForm({...form,genre:e.target.value})}>
        <option value="">Select Genre</option>
        {genres.map(g=> <option key={g}>{g}</option>)}
      </select>

      <button onClick={handlePayment} className="bg-purple-600 px-6 py-3">
        Pay ₹49 & Start
      </button>
    </div>
  );
}
