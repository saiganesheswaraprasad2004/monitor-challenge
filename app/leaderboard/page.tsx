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

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.score}</td>
              <td>{u.time_taken}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
