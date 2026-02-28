"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("participants")
        .select("*")
        .eq("payment_stat", true)
        .order("score", { ascending: false })
        .order("time_taken", { ascending: true });

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1>Leaderboard</h1>
      {users.map((u, i) => (
        <div key={i}>
          {i + 1}. {u.name} - {u.score} marks - {u.time_taken}s
        </div>
      ))}
    </div>
  );
}
