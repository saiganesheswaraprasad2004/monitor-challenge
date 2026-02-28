"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const questions = [
  { q: "India capital?", o: ["Delhi","Mumbai","Chennai","Kolkata"], a: "Delhi" },
  { q: "IPL started?", o: ["2008","2010","2005","2012"], a: "2008" },
  { q: "Biryani famous city?", o: ["Hyderabad","Delhi","Pune","Goa"], a: "Hyderabad" },
  { q: "National animal?", o: ["Tiger","Lion","Elephant","Peacock"], a: "Tiger" },
  { q: "Taj Mahal located?", o: ["Agra","Delhi","Jaipur","Lucknow"], a: "Agra" },
  { q: "India currency?", o: ["Rupee","Dollar","Euro","Yen"], a: "Rupee" },
  { q: "ISRO full form?", o: ["Indian Space Research Organisation","Space India","ISRO India","None"], a: "Indian Space Research Organisation" },
  { q: "Virat jersey no?", o: ["18","7","10","45"], a: "18" },
  { q: "Bollywood city?", o: ["Mumbai","Delhi","Chennai","Kolkata"], a: "Mumbai" },
  { q: "India independence year?", o: ["1947","1950","1930","1960"], a: "1947" },
];

export default function Challenge() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) submitQuiz();
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const submitQuiz = async () => {
    if (submitted) return;

    let finalScore = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.a) finalScore++;
    });

    setScore(finalScore);
    setSubmitted(true);

    await supabase
      .from("participants")
      .update({
        score: finalScore,
        time_taken: 120 - timeLeft,
      })
      .eq("email", email);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1>Quiz</h1>
      <p>Time: {timeLeft}s</p>

      {!submitted &&
        questions.map((q, i) => (
          <div key={i}>
            <h3>{q.q}</h3>
            {q.o.map((opt, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setAnswers((prev: any) => ({ ...prev, [i]: opt }))
                }
                className="block bg-gray-800 px-3 py-2 mt-2"
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

      {!submitted && (
        <button onClick={submitQuiz} className="bg-purple-600 px-4 py-2">
          Submit
        </button>
      )}

      {submitted && <h2>Your Score: {score}</h2>}
    </div>
  );
}
