"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("participants")
      .select("*")
      .order("score", { ascending: false })
      .order("time_taken", { ascending: true })
      .limit(10);

    setUsers(data || []);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">Leaderboard 🏆</h1>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.score}</td>
              <td>{user.time_taken}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}