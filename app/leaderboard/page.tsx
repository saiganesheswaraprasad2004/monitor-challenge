"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("participants")
        .select("name, score, time_taken, genre")
        .eq("payment_stat", true)
        .order("score", { ascending: false })
        .order("time_taken", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl mb-6">Leaderboard 🏆</h1>

      {users.length === 0 && <p>No participants yet.</p>}

      {users.map((u, i) => (
        <div key={i} className="mb-2">
          {i + 1}. {u.name} ({u.genre}) - {u.score} marks - {u.time_taken}s
        </div>
      ))}
    </div>
  );
}
