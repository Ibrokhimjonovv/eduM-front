import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./science-test.scss";
import Loading from "../../components/loading/loading";
import TestHeader from "../testing/test-header";
import Question from "./question";
import Results from "./results";
import { api } from "../../App";

const ScienceTest = () => {
  const { name, question, time } = useParams();
  const questionCount = Number(question);
  const testTime = Number(time) * 60;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(testTime);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      try {
        const questionsResponse = await fetch(
          `${api}/test_questions/`
        );
        const optionsResponse = await fetch(
          `${api}/test_options/`
        );

        if (!questionsResponse.ok || !optionsResponse.ok)
          throw new Error("Savollar yoki variantlarni yuklashda xatolik!");

        const questionsData = await questionsResponse.json();
        const optionsData = await optionsResponse.json();

        const checkedTopics =
          JSON.parse(localStorage.getItem("checkedTopics")) || [];
        const filteredQuestions = questionsData.filter((q) =>
          checkedTopics.includes(q.test_sinov)
        );
        let shuffledQuestions = [...filteredQuestions];
        shuffledQuestions.sort(() => 0.5 - Math.random());
        shuffledQuestions = shuffledQuestions.slice(0, questionCount);

        const questionsWithOptions = shuffledQuestions.map((q) => ({
          ...q,
          options: optionsData.filter((opt) => opt.question === q.id),
        }));

        setQuestions(questionsWithOptions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndOptions();
  }, [name, questionCount]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const [startTime, setStartTime] = useState(new Date()); 

  useEffect(() => {
    setStartTime(new Date()); 
  }, []);

  const calculateResults = () => {
    const endTime = new Date(); 
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = `${minutes} daqiqa ${seconds} soniya`; 
    const correctAnswersCount = selectedAnswers.filter(
      (answer) => answer.is_correct
    ).length;
    const totalQuestions = questions.length;

    setResults({
      correct_answers: correctAnswersCount,
      incorrect_answers: totalQuestions - correctAnswersCount,
      total_questions: totalQuestions,
      unanswered_questions: totalQuestions - selectedAnswers.length,
      percentage_correct: (
        (correctAnswersCount / totalQuestions) *
        100
      ).toFixed(2),
      time_taken: formattedTime, 
    });
  };

  if (loading) return <Loading />;
  if (error) return <p>Xatolik: {error}</p>;
  if (results)
    return (
      <Results
        results={results}
        questions={questions}
        selectedAnswers={selectedAnswers}
      />
    );

  return (
    <section id="test-detail">
      <TestHeader
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
      />
      <Question
        currentIndex={currentQuestionIndex}
        question={questions[currentQuestionIndex]}
        selectedAnswers={selectedAnswers}
        setSelectedAnswers={setSelectedAnswers}
        test={questions}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
      <div id="flex">
        {/* <p>
          <span>Diqqat!</span> Bu tugmalar orqali savollar orasida harakat
          qilishingiz mumkin.
        </p> */}
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion}>Ortga</button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNextQuestion}>Keyingi Savol</button>
        ) : (
          <button onClick={calculateResults}>Natijani Ko'rish</button>
        )}
      </div>
    </section>
  );
};

export default ScienceTest;