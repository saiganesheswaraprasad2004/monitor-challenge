"use client";

import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [users,setUsers]=useState<any[]>([]);

  useEffect(()=>{
    fetch("/api/leaderboard")
      .then(res=>res.json())
      .then(data=>setUsers(data));
  },[]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1>Leaderboard</h1>

      {users.map((u,i)=>(
        <div key={i}>
          {i+1}. {u.name} - {u.score} - {u.time_taken}s
        </div>
      ))}
    </div>
  );
}
