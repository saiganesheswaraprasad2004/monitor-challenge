export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    phone,
    genre,
  } = body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json({ success: false });
  }

  const client = await clientPromise;
  const db = client.db("quizDB");

  await db.collection("participants").insertOne({
    name,
    email,
    phone,
    genre,
    score: 0,
    time_taken: 0,
    payment_stat: true,
    created_at: new Date(),
  });

  return NextResponse.json({ success: true });
}
