"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Crack The Tech Challenge 🚀 <br />
          <span className="text-purple-400">
            Win a 24” Curved Monitor
          </span>
        </h1>

        <p className="mt-6 text-gray-300 max-w-2xl text-lg">
          Prove your General Knowledge skills in a 20-question timed challenge.
          Highest score wins the prize.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg shadow-purple-500/30"
          >
            Register Now – ₹50
          </Link>

          <Link
            href="/leaderboard"
            className="border border-purple-500 px-8 py-3 rounded-xl text-lg hover:bg-purple-500/10 transition duration-300"
          >
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* PRIZE SECTION */}
      <section className="px-6 py-20 bg-gray-950 text-center">
        <h2 className="text-3xl font-bold text-purple-400">
          The Prize 🎯
        </h2>

        <div className="mt-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
            <img
              src="public/monitor.jpeg"
              alt="Samsung 24 inch Curved Monitor"
              className="rounded-xl"
            />
          </div>

          <div className="text-left">
            <h3 className="text-2xl font-semibold mb-4">
              Samsung 24” Curved Monitor
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>✔ 24-inch Curved Display</li>
              <li>✔ Full HD Resolution</li>
              <li>✔ Eye Saver Mode</li>
              <li>✔ Perfect for Coding & Gaming</li>
              <li>✔ Approx Market Value ₹8,000</li>
            </ul>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-purple-400">
          How It Works ⚡
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-gray-900 p-8 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">1️⃣ Register</h3>
            <p className="text-gray-400">
              Pay ₹49 participation fee securely via UPI.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">2️⃣ Take Challenge</h3>
            <p className="text-gray-400">
              Attempt 20 technical MCQs within 15 minutes.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">3️⃣ Win</h3>
            <p className="text-gray-400">
              Highest score (fastest time tie-breaker) wins.
            </p>
          </div>

        </div>
      </section>

      {/* RULES SECTION */}
      <section className="px-6 py-20 bg-gray-950 text-center">
        <h2 className="text-3xl font-bold text-purple-400">
          Contest Rules 📜
        </h2>

        <div className="mt-8 max-w-3xl mx-auto text-gray-400 text-left space-y-4">
          <p>• This is a skill-based competitive challenge.</p>
          <p>• Total 20 multiple choice questions.</p>
          <p>• Duration: 15 minutes.</p>
          <p>• Highest score wins.</p>
          <p>• Tie-breaker: Lowest completion time.</p>
          <p>• Winner announced on leaderboard page.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-10 text-center text-gray-500 text-sm">
        <p>© 2026 Tech Challenge. All rights reserved.</p>
        <p className="mt-2">
          This is a skill-based competitive challenge. No element of chance is involved.
        </p>
      </footer>

    </main>
  );
}
