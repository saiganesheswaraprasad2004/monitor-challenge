"use client";

export const dynamic = "force-dynamic";  // ✅ prevents static prerender

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questionBank: Record<string, Question[]> = {
  Cricket: [
    { question: "God of Cricket?", options: ["Sachin","Kohli","Dhoni","Rohit"], answer: "Sachin" },
    { question: "IPL started?", options: ["2008","2010","2005","2012"], answer: "2008" },
    { question: "Players in team?", options: ["11","10","12","9"], answer: "11" },
    { question: "T20 overs?", options: ["20","50","10","30"], answer: "20" },
    { question: "1983 captain?", options: ["Kapil Dev","Dhoni","Azhar","Gavaskar"], answer: "Kapil Dev" },
    { question: "Virat number?", options: ["18","7","10","45"], answer: "18" },
    { question: "ODI overs?", options: ["50","20","40","60"], answer: "50" },
    { question: "Dhoni nickname?", options: ["Captain Cool","King","Hitman","Boom"], answer: "Captain Cool" },
    { question: "Pitch length?", options: ["22 yards","20","18","24"], answer: "22 yards" },
    { question: "2011 WC vs?", options: ["Sri Lanka","Australia","Pakistan","England"], answer: "Sri Lanka" },
  ],

  "Indian Movies": [
    { question: "Bollywood city?", options: ["Mumbai","Delhi","Chennai","Kolkata"], answer: "Mumbai" },
    { question: "RRR director?", options: ["Rajamouli","Hirani","Rohit","SLB"], answer: "Rajamouli" },
    { question: "3 Idiots actor?", options: ["Aamir","SRK","Salman","Ranbir"], answer: "Aamir" },
    { question: "Baahubali language?", options: ["Telugu","Hindi","Tamil","Malayalam"], answer: "Telugu" },
    { question: "KGF hero?", options: ["Yash","Prabhas","Allu","Ram"], answer: "Yash" },
    { question: "Dangal sport?", options: ["Wrestling","Cricket","Boxing","Hockey"], answer: "Wrestling" },
    { question: "Pathaan actor?", options: ["SRK","Salman","Aamir","Ajay"], answer: "SRK" },
    { question: "Lagaan sport?", options: ["Cricket","Football","Hockey","Kabaddi"], answer: "Cricket" },
    { question: "Oscar song 2023?", options: ["Naatu","Kesariya","Jai Ho","Why"], answer: "Naatu" },
    { question: "Kantara language?", options: ["Kannada","Telugu","Tamil","Hindi"], answer: "Kannada" },
  ],

  "Hyderabadi Food": [
    { question: "Famous dish?", options: ["Biryani","Idli","Dosa","Pav"], answer: "Biryani" },
    { question: "Sweet from apricot?", options: ["Qubani","Jalebi","Rasgulla","Halwa"], answer: "Qubani" },
    { question: "Irani chai origin?", options: ["Iran","India","UK","Arab"], answer: "Iran" },
    { question: "Osmania is?", options: ["Biscuit","Rice","Sweet","Drink"], answer: "Biscuit" },
    { question: "Haleem month?", options: ["Ramzan","Diwali","Holi","Christmas"], answer: "Ramzan" },
    { question: "Mirchi ka ___?", options: ["Salaan","Masala","Salam","Chutney"], answer: "Salaan" },
    { question: "Biryani style?", options: ["Dum","Fry","Steam","Boil"], answer: "Dum" },
    { question: "Charminar city?", options: ["Hyderabad","Delhi","Mumbai","Chennai"], answer: "Hyderabad" },
    { question: "Double ka ___?", options: ["Meetha","Milk","Halwa","Sweet"], answer: "Meetha" },
    { question: "Paradise famous for?", options: ["Biryani","Pizza","Burger","Pasta"], answer: "Biryani" },
  ],

  "Indian General": [
    { question: "Capital of India?", options: ["New Delhi","Mumbai","Kolkata","Chennai"], answer: "New Delhi" },
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
  }, []);

  const submitQuiz = async () => {
    if (submitted) return;

    let finalScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) finalScore++;
    });

    setScore(finalScore);
    setSubmitted(true);

    await fetch("/api/update-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        score: finalScore,
        time_taken: 120 - timeLeft,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1>{genre} Quiz</h1>
      <p>Time Left: {timeLeft}s</p>

      {!submitted &&
        questions.map((q, index) => (
          <div key={index}>
            <h3>{index + 1}. {q.question}</h3>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [index]: opt }))
                }
                className="block bg-gray-800 px-4 py-2 mt-2"
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

      {!submitted && (
        <button
          onClick={submitQuiz}
          className="bg-purple-600 mt-4 px-6 py-2"
        >
          Submit
        </button>
      )}

      {submitted && <h2>Your Score: {score}/10</h2>}
    </div>
  );
}
