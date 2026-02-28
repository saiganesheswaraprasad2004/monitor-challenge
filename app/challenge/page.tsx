"use client";

import { Suspense } from "react";
import ChallengeContent from "./ChallengeContent";

export default function ChallengePage() {
  return (
    <Suspense fallback={<div className="p-6 text-white bg-black min-h-screen">Loading...</div>}>
      <ChallengeContent />
    </Suspense>
  );
}
