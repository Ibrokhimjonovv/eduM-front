import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../App";
import "./test-detail.scss";
import getUserFromToken from "../../components/get-user/get-user";
import { AccessContext } from "../../AccessContext";
import TestHeader from "./test-header";
import Question from "./question";
import Results from "./results";
import Loading from "../../components/loading/loading";

const Testing = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    Number(localStorage.getItem("currentQuestionIndex")) || 0
  );
  const [selectedAnswers, setSelectedAnswers] = useState(
    JSON.parse(localStorage.getItem("selectedAnswers")) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(
    Number(localStorage.getItem("timeLeft")) || null
  );
  const user = getUserFromToken();
  const { profileData, access, startTest, setStartTest } =
    useContext(AccessContext);

  const [startTime, setStartTime] = useState(
    localStorage.getItem("startTime")
      ? new Date(localStorage.getItem("startTime"))
      : new Date()
  );

  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [timePerQuestion, setTimePerQuestion] = useState(
    JSON.parse(localStorage.getItem("timePerQuestion")) || {}
  );

  useEffect(() => {
    const savedTestId = localStorage.getItem("startTest");
    if (savedTestId) {
      setStartTest(savedTestId);
    }
  }, []);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`${api}/tests/`);
        if (!response.ok)
          throw new Error("Test tafsilotlarini olishda xato yuz berdi.");
        const testsData = await response.json();
        const filteredTest = testsData.find(
          (test) => Number(test.id) === Number(id)
        );

        if (filteredTest) {
          setTest(filteredTest);
          if (!timeLeft) {
            const totalSeconds = filteredTest.time
              .split(":")
              .reduce((acc, time) => acc * 60 + Number(time), 0);
            setTimeLeft(totalSeconds);
            localStorage.setItem("timeLeft", totalSeconds);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestDetails();
  }, [id]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          localStorage.setItem("timeLeft", prev - 1);
          return prev - 1;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  useEffect(() => {
    localStorage.setItem("timePerQuestion", JSON.stringify(timePerQuestion));
  }, [timePerQuestion]);

  useEffect(() => {
    localStorage.setItem("startTime", startTime.toISOString());
  }, [startTime]);

  const handleNextQuestion = () => {
    const currentTime = new Date();
    const currentQuestion = test.questions[currentQuestionIndex];
    const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);

    setTimePerQuestion((prev) => {
      const updated = { ...prev, [currentQuestion.text]: timeSpent };
      localStorage.setItem("timePerQuestion", JSON.stringify(updated));
      return updated;
    });

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(new Date());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => {
        const newIndex = prev - 1;
        localStorage.setItem("currentQuestionIndex", newIndex);
        return newIndex;
      });
    }
  };

  useEffect(() => {
    setStartTime(new Date());
  }, []);
  const [resLoading, setResLoading] = useState(false)

  const calculateResults = async () => {
    setResLoading(true); // Set loading state to true when starting the process


    const correctAnswersCount = selectedAnswers.filter(
      (answer) => answer.is_staff
    ).length;
    const totalQuestions = test.questions.length;

    const currentTime = new Date();
    const totalTimeTaken = Math.floor((currentTime - startTime) / 1000);
    const totalMinutes = String(Math.floor(totalTimeTaken / 60)).padStart(
      2,
      "0"
    );
    const totalSeconds = String(totalTimeTaken % 60).padStart(2, "0");

    const formattedTime = `${Math.floor(totalTimeTaken / 60)} daqiqa ${totalTimeTaken % 60
      } soniya`;

    const answersData = selectedAnswers.map((answer) => ({
      question_id: answer.questionId,
      selected_option_id: answer.id,
    }));

    const resultData = {
      user: profileData.id,
      test_title: test.title,
      correct_answers: correctAnswersCount,
      incorrect_answers: totalQuestions - correctAnswersCount,
      unanswered_questions: totalQuestions - selectedAnswers.length,
      total_questions: totalQuestions,
      percentage_correct: (
        (correctAnswersCount / totalQuestions) *
        100
      ).toFixed(2),
      total_time_taken: `00:${totalMinutes}:${totalSeconds}`,
      time_per_question:
        JSON.parse(localStorage.getItem("timePerQuestion")) || {},
      time_taken: formattedTime,
    };

    try {
      const response = await fetch(`${api}/statistics/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        throw new Error("Natijalarni saqlashda xato yuz berdi.");
      }

      const finishResponse = await fetch(`${api}/finish/${test.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: answersData }),
      });

      if (!finishResponse.ok) {
        throw new Error("Testing natijalarini saqlashda xato yuz berdi.");
      }

      const finishData = await finishResponse.json();
      const totalScore = finishData.total_score;
      setResults({ ...resultData, total_score: totalScore, ai_text: finishData.result });
    } catch (error) {
      console.error(error.message);
    } finally {
      setResLoading(false); // Set loading state to false after the process is finished
    }

    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("timePerQuestion");
    localStorage.removeItem("startTime");
  };

  const ff = () => {
    window.location.href = "/schools/prezident-maktablari";
  };

  useEffect(() => {
    if (timeLeft === 0) {
      calculateResults(); // Vaqt tugaganda avtomatik natijani chiqaradi
    }
  }, [timeLeft]); // timeLeft o'zgarganda ishlaydi

  if (loading)
    return (
      <p>
        <Loading />
      </p>
    );
  if (error) return <p>Xatolik: {error}</p>;
  if (results)
    return (
      <Results
        results={results}
        test={test}
        selectedAnswers={selectedAnswers}
      />
    );

  return (
    <section id="test-detail">
      {access && startTest ? (
        <>
          <TestHeader
            currentIndex={currentQuestionIndex}
            totalQuestions={test.questions.length}
            timeLeft={timeLeft}
          />
          <Question
            currentIndex={currentQuestionIndex}
            question={test.questions[currentQuestionIndex]}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            currentQuestionIndex={currentQuestionIndex}
            test={test}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
          {test.questions.length ? (
            <div id="flex">
              {/* <p>
            <span>Diqqat!</span> Bu tugmalar orqali savollar orasida harakat
            qilishingiz mumkin.
          </p> */}
              <>
                {currentQuestionIndex > 0 && (
                  <button onClick={handlePreviousQuestion}>Ortga</button>
                )}
                {currentQuestionIndex < test.questions.length - 1 ? (
                  <button className="next" onClick={handleNextQuestion}>
                    Keyingi Savol
                  </button>
                ) : (
                  <button onClick={calculateResults} disabled={resLoading}>
                    {resLoading ? "Taxlil qilinmoqda..." : "Natijani Ko'rish"}
                  </button>

                )}
              </>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>{ff()}</>
      )}
    </section>
  );
};

export default Testing;
