"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    answer: "New Delhi",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "Who wrote the Indian National Anthem?",
    options: [
      "Mahatma Gandhi",
      "Rabindranath Tagore",
      "Subhash Chandra Bose",
      "Jawaharlal Nehru",
    ],
    answer: "Rabindranath Tagore",
  },
  {
    question: "How many continents are there in the world?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: [
      "Indian Ocean",
      "Pacific Ocean",
      "Atlantic Ocean",
      "Arctic Ocean",
    ],
    answer: "Pacific Ocean",
  },
];

export default function Challenge() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    let finalScore = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        finalScore += 1;
      }
    });

    setScore(finalScore);
    setSubmitted(true);

    // Save result in Supabase
    await supabase.from("participants").insert([
      {
        score: finalScore,
        time_taken: 300 - timeLeft,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-4 text-center">
        General Knowledge Challenge
      </h1>

      <p className="text-center text-purple-400 mb-6">
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>

      {!submitted ? (
        <>
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-xl mb-6 shadow-md"
            >
              <h2 className="text-lg font-semibold mb-4">
                {index + 1}. {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleOptionSelect(index, option)
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg transition 
                      ${
                        answers[index] === option
                          ? "bg-purple-600"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-purple-700"
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold">
            🎉 Your Score: {score} / {questions.length}
          </h2>
          <p className="text-gray-400 mt-4">
            Results have been recorded.
          </p>
        </div>
      )}
    </div>
  );
}