"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questionBank: Record<string, Question[]> = {
  Cricket: [
    { question: "Who is called the God of Cricket?", options: ["Sachin Tendulkar", "Virat Kohli", "MS Dhoni", "Rohit Sharma"], answer: "Sachin Tendulkar" },
    { question: "IPL started in which year?", options: ["2008", "2010", "2005", "2012"], answer: "2008" },
    { question: "How many players in a cricket team?", options: ["11", "10", "9", "12"], answer: "11" },
    { question: "How many overs in T20?", options: ["20", "50", "10", "30"], answer: "20" },
    { question: "India won 1983 WC under?", options: ["Kapil Dev", "Dhoni", "Gavaskar", "Azharuddin"], answer: "Kapil Dev" },
    { question: "Virat Kohli jersey number?", options: ["18", "7", "10", "45"], answer: "18" },
    { question: "ODI has how many overs?", options: ["50", "40", "60", "20"], answer: "50" },
    { question: "MS Dhoni nickname?", options: ["Captain Cool", "Hitman", "King", "Boom Boom"], answer: "Captain Cool" },
    { question: "Cricket pitch length?", options: ["22 yards", "20 yards", "18 yards", "24 yards"], answer: "22 yards" },
    { question: "India won 2011 WC against?", options: ["Sri Lanka", "Australia", "Pakistan", "England"], answer: "Sri Lanka" },
  ],

  "Indian Movies": [
    { question: "Bollywood is based in?", options: ["Mumbai", "Delhi", "Chennai", "Kolkata"], answer: "Mumbai" },
    { question: "RRR director?", options: ["S. S. Rajamouli", "Hirani", "Rohit Shetty", "SLB"], answer: "S. S. Rajamouli" },
    { question: "3 Idiots lead actor?", options: ["Aamir Khan", "SRK", "Salman Khan", "Ranbir Kapoor"], answer: "Aamir Khan" },
    { question: "Baahubali language?", options: ["Telugu", "Hindi", "Tamil", "Malayalam"], answer: "Telugu" },
    { question: "KGF hero?", options: ["Yash", "Prabhas", "Allu Arjun", "Ram Charan"], answer: "Yash" },
    { question: "Dangal sport?", options: ["Wrestling", "Cricket", "Boxing", "Hockey"], answer: "Wrestling" },
    { question: "Pathaan actor?", options: ["Shah Rukh Khan", "Salman Khan", "Aamir Khan", "Ajay Devgn"], answer: "Shah Rukh Khan" },
    { question: "Lagaan sport?", options: ["Cricket", "Football", "Hockey", "Kabaddi"], answer: "Cricket" },
    { question: "Oscar-winning song 2023?", options: ["Naatu Naatu", "Kesariya", "Jai Ho", "Why This Kolaveri"], answer: "Naatu Naatu" },
    { question: "Kantara language?", options: ["Kannada", "Telugu", "Tamil", "Hindi"], answer: "Kannada" },
  ],

  "Hyderabadi Food": [
    { question: "Hyderabad famous dish?", options: ["Biryani", "Idli", "Dosa", "Pav Bhaji"], answer: "Biryani" },
    { question: "Sweet from apricot?", options: ["Qubani ka Meetha", "Jalebi", "Rasgulla", "Halwa"], answer: "Qubani ka Meetha" },
    { question: "Irani chai origin?", options: ["Iran", "India", "UK", "Arab"], answer: "Iran" },
    { question: "Osmania is?", options: ["Biscuit", "Rice", "Sweet", "Drink"], answer: "Biscuit" },
    { question: "Haleem popular during?", options: ["Ramzan", "Diwali", "Holi", "Christmas"], answer: "Ramzan" },
    { question: "Mirchi ka ___?", options: ["Salaan", "Masala", "Salam", "Chutney"], answer: "Salaan" },
    { question: "Biryani style?", options: ["Dum", "Fry", "Steam", "Boil"], answer: "Dum" },
    { question: "Charminar located in?", options: ["Hyderabad", "Delhi", "Mumbai", "Chennai"], answer: "Hyderabad" },
    { question: "Double ka ___?", options: ["Meetha", "Milk", "Halwa", "Sweet"], answer: "Meetha" },
    { question: "Paradise restaurant famous for?", options: ["Biryani", "Pizza", "Burger", "Pasta"], answer: "Biryani" },
  ],

  "Indian General": [
    { question: "Capital of India?", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], answer: "New Delhi" },
    { question: "National animal?", options: ["Tiger", "Lion", "Elephant", "Peacock"], answer: "Tiger" },
    { question: "Independence year?", options: ["1947", "1950", "1930", "1960"], answer: "1947" },
    { question: "ISRO full form?", options: ["Indian Space Research Organisation", "ISRO India", "Space India", "None"], answer: "Indian Space Research Organisation" },
    { question: "Indian currency?", options: ["Rupee", "Dollar", "Euro", "Yen"], answer: "Rupee" },
    { question: "Taj Mahal city?", options: ["Agra", "Delhi", "Jaipur", "Lucknow"], answer: "Agra" },
    { question: "National sport of India?", options: ["Hockey", "Cricket", "Football", "Kabaddi"], answer: "Hockey" },
    { question: "Longest river in India?", options: ["Ganga", "Yamuna", "Godavari", "Narmada"], answer: "Ganga" },
    { question: "First Prime Minister of India?", options: ["Jawaharlal Nehru", "Gandhi", "Patel", "Bose"], answer: "Jawaharlal Nehru" },
    { question: "Red Fort located in?", options: ["Delhi", "Agra", "Jaipur", "Lucknow"], answer: "Delhi" },
  ],
};

export default function ChallengeContent() {
  const params = useSearchParams();
  const email = params.get("email");
  const genre = params.get("genre");

  const questions = genre ? questionBank[genre] : [];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const handleSubmit = async () => {
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
      <p className="mb-4">Time Left: {timeLeft}s</p>

      {!submitted &&
        questions.map((q, index) => (
          <div key={index} className="mb-6">
            <h3>{index + 1}. {q.question}</h3>

            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [index]: opt }))
                }
                className={`block w-64 text-left px-4 py-2 mt-2 rounded ${
                  answers[index] === opt
                    ? "bg-purple-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 px-6 py-3 rounded"
        >
          Submit Quiz
        </button>
      )}

      {submitted && <h2>Your Score: {score}/10</h2>}
    </div>
  );
}
