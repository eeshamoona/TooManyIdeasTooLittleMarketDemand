"use client";

import { useState, useEffect } from "react";
import Quiz from "./components/quiz";
import LandingPage from "./components/landing";

export default function Home() {
  const [hasQuizAnswers, setHasQuizAnswers] = useState(null);

  useEffect(() => {
    // Check if quiz answers exist in localStorage
    const answers = localStorage.getItem("quizAnswers");
    if (answers) {
      setHasQuizAnswers(true);
    } else {
      setHasQuizAnswers(false);
    }
  }, []);

  if (hasQuizAnswers === null) {
    // While loading
    return <div>Loading...</div>;
  } else if (hasQuizAnswers) {
    // Render LandingPage with quiz answers
    return <LandingPage />;
  } else {
    // Render Quiz component
    return <Quiz onQuizCompleted={() => setHasQuizAnswers(true)} />;
  }
}
