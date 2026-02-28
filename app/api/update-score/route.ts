export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, score, time_taken } = body;

  const client = await clientPromise;
  const db = client.db("quizDB");

  await db.collection("participants").updateOne(
    { email },
    {
      $set: {
        score,
        time_taken,
      },
    }
  );

  return NextResponse.json({ success: true });
}
