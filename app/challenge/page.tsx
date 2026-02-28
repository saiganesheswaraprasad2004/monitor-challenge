"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const questionBank: any = {
  Cricket: [
    { q: "God of Cricket?", o: ["Kohli","Dhoni","Sachin","Rohit"], a: "Sachin" },
    { q: "IPL started?", o: ["2008","2010","2005","2012"], a: "2008" },
    { q: "Players in team?", o: ["11","10","9","12"], a: "11" },
    { q: "T20 overs?", o: ["20","50","10","30"], a: "20" },
    { q: "India WC 1983 captain?", o: ["Kapil Dev","Dhoni","Azhar","Gavaskar"], a: "Kapil Dev" },
    { q: "Virat number?", o: ["18","7","10","45"], a: "18" },
    { q: "Cricket pitch length?", o: ["22 yards","18","20","24"], a: "22 yards" },
    { q: "Dhoni nickname?", o: ["Captain Cool","Hitman","King","Boom"], a: "Captain Cool" },
    { q: "ODI overs?", o: ["50","20","40","60"], a: "50" },
    { q: "India WC 2011 won against?", o: ["SL","Pak","Aus","Eng"], a: "SL" },
  ],

  "Indian Movies": [
    { q: "Bollywood city?", o: ["Mumbai","Delhi","Chennai","Kolkata"], a: "Mumbai" },
    { q: "RRR director?", o: ["Rajamouli","Rohit","SLB","Hirani"], a: "Rajamouli" },
    { q: "3 Idiots actor?", o: ["Aamir","SRK","Salman","Ranbir"], a: "Aamir" },
    { q: "Baahubali language?", o: ["Telugu","Hindi","Tamil","Malayalam"], a: "Telugu" },
    { q: "Dangal sport?", o: ["Wrestling","Cricket","Boxing","Hockey"], a: "Wrestling" },
    { q: "Oscar winner song 2023?", o: ["Naatu","Kesariya","Jai Ho","Why"], a: "Naatu" },
    { q: "Pathaan actor?", o: ["SRK","Salman","Aamir","Ajay"], a: "SRK" },
    { q: "Kantara language?", o: ["Kannada","Telugu","Tamil","Hindi"], a: "Kannada" },
    { q: "Lagaan sport?", o: ["Cricket","Football","Hockey","Kabaddi"], a: "Cricket" },
    { q: "KGF hero?", o: ["Yash","Prabhas","Allu","Ram"], a: "Yash" },
  ],

  "Hyderabadi Food": [
    { q: "Famous dish?", o: ["Biryani","Idli","Dosa","Pav"], a: "Biryani" },
    { q: "Sweet of Hyderabad?", o: ["Qubani","Jalebi","Gulab","Rasgulla"], a: "Qubani" },
    { q: "Irani chai origin?", o: ["Iran","India","UK","Arab"], a: "Iran" },
    { q: "Famous biscuit?", o: ["Osmania","Marie","GoodDay","Hide"], a: "Osmania" },
    { q: "Haleem month?", o: ["Ramzan","Diwali","Holi","Eid al Adha"], a: "Ramzan" },
    { q: "Mirchi ka ___?", o: ["Salam","Salaan","Masala","Chutney"], a: "Salaan" },
    { q: "Biryani style?", o: ["Dum","Fry","Boil","Steam"], a: "Dum" },
    { q: "Paradise is famous for?", o: ["Biryani","Pizza","Burger","Pasta"], a: "Biryani" },
    { q: "Charminar city?", o: ["Hyderabad","Delhi","Mumbai","Chennai"], a: "Hyderabad" },
    { q: "Double ka ___?", o: ["Meetha","Halwa","Sweet","Milk"], a: "Meetha" },
  ],

  "Indian General": [
    { q: "Capital of India?", o: ["Delhi","Mumbai","Chennai","Kolkata"], a: "Delhi" },
    { q: "National animal?", o: ["Tiger","Lion","Elephant","Peacock"], a: "Tiger" },
    { q: "Independence year?", o: ["1947","1950","1930","1960"], a: "1947" },
    { q: "ISRO full form?", o: ["Indian Space Research Organisation","Space India","ISRO India","None"], a: "Indian Space Research Organisation" },
    { q: "Currency?", o: ["Rupee","Dollar","Euro","Yen"], a: "Rupee" },
    { q: "Taj Mahal city?", o: ["Agra","Delhi","Jaipur","Lucknow"], a: "Agra" },
    { q: "National sport?", o: ["Hockey","Cricket","Football","Kabaddi"], a: "Hockey" },
    { q: "Longest river?", o: ["Ganga","Yamuna","Godavari","Narmada"], a: "Ganga" },
    { q: "First PM?", o: ["Nehru","Gandhi","Patel","Bose"], a: "Nehru" },
    { q: "Red Fort city?", o: ["Delhi","Agra","Jaipur","Lucknow"], a: "Delhi" },
  ],
};

export default function Challenge() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const genre = searchParams.get("genre");

  const questions = questionBank[genre as string] || [];

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
    questions.forEach((q: any, i: number) => {
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
      <h1>{genre} Quiz</h1>
      <p>Time Left: {timeLeft}s</p>

      {!submitted &&
        questions.map((q: any, i: number) => (
          <div key={i} className="mb-4">
            <h3>{i + 1}. {q.q}</h3>
            {q.o.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() =>
                  setAnswers((prev: any) => ({ ...prev, [i]: opt }))
                }
                className="block bg-gray-800 px-4 py-2 mt-2 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

      {!submitted && (
        <button
          onClick={submitQuiz}
          className="bg-purple-600 px-6 py-2"
        >
          Submit
        </button>
      )}

      {submitted && <h2>Your Score: {score}</h2>}
    </div>
  );
}
