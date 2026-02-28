"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questionBank: Record<string, Question[]> = {
  Cricket: [
    { question: "God of Cricket?", options: ["Kohli","Dhoni","Sachin","Rohit"], answer: "Sachin" },
    { question: "IPL started?", options: ["2008","2010","2005","2012"], answer: "2008" },
    { question: "Players in team?", options: ["11","10","9","12"], answer: "11" },
    { question: "T20 overs?", options: ["20","50","10","30"], answer: "20" },
    { question: "India WC 1983 captain?", options: ["Kapil Dev","Dhoni","Azhar","Gavaskar"], answer: "Kapil Dev" },
    { question: "Virat jersey no?", options: ["18","7","10","45"], answer: "18" },
    { question: "Pitch length?", options: ["22 yards","18","20","24"], answer: "22 yards" },
    { question: "ODI overs?", options: ["50","20","40","60"], answer: "50" },
    { question: "Dhoni nickname?", options: ["Captain Cool","King","Hitman","Boom"], answer: "Captain Cool" },
    { question: "India WC 2011 won against?", options: ["SL","Pak","Aus","Eng"], answer: "SL" },
  ],

  "Indian Movies": [
    { question: "Bollywood city?", options: ["Mumbai","Delhi","Chennai","Kolkata"], answer: "Mumbai" },
    { question: "RRR director?", options: ["Rajamouli","Rohit","Hirani","SLB"], answer: "Rajamouli" },
    { question: "3 Idiots actor?", options: ["Aamir","SRK","Salman","Ranbir"], answer: "Aamir" },
    { question: "Baahubali language?", options: ["Telugu","Hindi","Tamil","Malayalam"], answer: "Telugu" },
    { question: "Dangal sport?", options: ["Wrestling","Cricket","Boxing","Hockey"], answer: "Wrestling" },
    { question: "Pathaan actor?", options: ["SRK","Salman","Aamir","Ajay"], answer: "SRK" },
    { question: "KGF hero?", options: ["Yash","Prabhas","Allu","Ram"], answer: "Yash" },
    { question: "Lagaan sport?", options: ["Cricket","Football","Hockey","Kabaddi"], answer: "Cricket" },
    { question: "Oscar winner song 2023?", options: ["Naatu","Kesariya","Jai Ho","Why"], answer: "Naatu" },
    { question: "Kantara language?", options: ["Kannada","Telugu","Tamil","Hindi"], answer: "Kannada" },
  ],

  "Hyderabadi Food": [
    { question: "Famous dish?", options: ["Biryani","Idli","Dosa","Pav"], answer: "Biryani" },
    { question: "Sweet of Hyderabad?", options: ["Qubani","Jalebi","Gulab","Rasgulla"], answer: "Qubani" },
    { question: "Irani chai origin?", options: ["Iran","India","UK","Arab"], answer: "Iran" },
    { question: "Famous biscuit?", options: ["Osmania","Marie","Hide","GoodDay"], answer: "Osmania" },
    { question: "Haleem month?", options: ["Ramzan","Diwali","Holi","Eid"], answer: "Ramzan" },
    { question: "Mirchi ka ___?", options: ["Salaan","Masala","Salam","Chutney"], answer: "Salaan" },
    { question: "Biryani style?", options: ["Dum","Fry","Boil","Steam"], answer: "Dum" },
    { question: "Paradise famous for?", options: ["Biryani","Pizza","Burger","Pasta"], answer: "Biryani" },
    { question: "Charminar city?", options: ["Hyderabad","Delhi","Mumbai","Chennai"], answer: "Hyderabad" },
    { question: "Double ka ___?", options: ["Meetha","Halwa","Sweet","Milk"], answer: "Meetha" },
  ],

  "Indian General": [
    { question: "Capital of India?", options: ["Delhi","Mumbai","Chennai","Kolkata"], answer: "Delhi" },
    { question: "National animal?", options: ["Tiger","Lion","Elephant","Peacock"], answer: "Tiger" },
    { question: "Independence year?", options: ["1947","1950","1930","1960"], answer: "1947" },
    { question: "ISRO full form?", options: ["Indian Space Research Organisation","ISRO India","Space India","None"], answer: "Indian Space Research Organisation" },
    { question: "Currency?", options: ["Rupee","Dollar","Euro","Yen"], answer: "Rupee" },
    { question: "Taj Mahal city?", options: ["Agra","Delhi","Jaipur","Lucknow"], answer: "Agra" },
    { question: "National sport?", options: ["Hockey","Cricket","Football","Kabaddi"], answer: "Hockey" },
    { question: "Longest river?", options: ["Ganga","Yamuna","Godavari","Narmada"], answer: "Ganga" },
    { question: "First PM?", options: ["Nehru","Gandhi","Patel","Bose"], answer: "Nehru" },
    { question: "Red Fort city?", options: ["Delhi","Agra","Jaipur","Lucknow"], answer: "Delhi" },
  ],
};

export default function Challenge() {
  const params = useSearchParams();
  const email = params.get("email");
  const genre = params.get("genre");

  const questions = genre ? questionBank[genre] : [];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submitted]);

  const submitQuiz = async () => {
    if (submitted) return;

    let finalScore = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        finalScore++;
      }
    });

    setScore(finalScore);
    setSubmitted(true);

    if (email) {
      await supabase
        .from("participants")
        .update({
          score: finalScore,
          time_taken: 120 - timeLeft,
        })
        .eq("email", email);
    }
  };

  if (!genre || !questions) {
    return <div className="p-6 text-white bg-black min-h-screen">Invalid Genre</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">{genre} Quiz</h1>
      <p>Time Left: {timeLeft}s</p>

      {!submitted &&
        questions.map((q, index) => (
          <div key={index} className="mb-4">
            <h3>{index + 1}. {q.question}</h3>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [index]: opt }))
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
          className="bg-purple-600 px-6 py-2 mt-4 rounded"
        >
          Submit
        </button>
      )}

      {submitted && <h2>Your Score: {score} / 10</h2>}
    </div>
  );
}
