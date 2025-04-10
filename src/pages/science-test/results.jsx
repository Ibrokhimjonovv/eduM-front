import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../testing/test-detail.scss";
import CircularProgress from "./circularProgress";

const Results = ({ results, questions, selectedAnswers }) => {
  const navigate = useNavigate();
  const [seeAll, setSeeAll] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("timePerQuestion");
      localStorage.removeItem("startTime");
      navigate("/school/tests");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  const deleteTestDetail = () => {
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("timeLeft");
  };

  useEffect(() => {
    if (seeAll) {
      document.body.style.overflowY = "hidden";
      document.documentElement.style.overflowX = "unset";
    } else {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowX = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [seeAll]);

  return (
    <div className="results-container">
      <h2>Test tugadi. Natijalar:</h2>
      <div className="result-inner">
        <div className="text-inner-left">
          <p>
            <span>Jami savollar:</span> {results.total_questions}
          </p>
          <p>
            <span>To'g'ri javoblar:</span> {results.correct_answers}
          </p>
          <p>
            <span>Noto'g'ri javoblar:</span> {results.incorrect_answers}
          </p>
          <p>
            <span>Belgilanmagan savollar:</span> {results.unanswered_questions}
          </p>
          <p>
            <span>To'g'ri javoblar foizi:</span> {results.percentage_correct}%
          </p>
          <p>
            <span>Sarflangan vaqt:</span> {results.time_taken}
          </p>
        </div>
        <div id="go-back">
          <button id="mobile-ver" onClick={() => setSeeAll(true)}>
            Aniq tafsilot
          </button>
        </div>
        <div className="text-inner-right">
          <div className={`all-results-shape ${seeAll ? "active" : ""}`}></div>
          <div className={`all-results ${seeAll ? "active" : ""}`}>
            <div className="to-back">
              <button onClick={() => setSeeAll(false)}>Ortga</button>
              <p>Umumiy natijalar bilan tanishing!</p>
            </div>
            <div className="circles">
              {questions && questions.length > 0 ? ( 
                questions.map((question, index) => {
                  const userAnswer = selectedAnswers.find(
                    (answer) => answer.questionId === question.id
                  );
                  return (
                    <div key={index} className="question-review">
                      <div className="question-option-line">
                        <p className="question-text">
                          <span className="q-count">{index + 1})</span>{" "}
                          <span
                            dangerouslySetInnerHTML={{ __html: question.question_text }}
                          />
                        </p>
                        <div className="options-container">
                          {question.options &&
                            question.options.map((option, optionIndex) => {
                              let status = option.is_staff ? "correct" : "";
                              if (
                                userAnswer &&
                                userAnswer.id === option.id &&
                                !option.is_staff
                              ) {
                                status = "incorrect";
                              }

                              return (
                                <div
                                  key={option.id}
                                  className={`option ${status}`}
                                >
                                  <strong className="chart">
                                    {String.fromCharCode(65 + optionIndex)})
                                  </strong>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: option.option_text,
                                    }}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Test ma'lumotlari mavjud emas</p>
              )}
            </div>
          </div>
          <CircularProgress
            value={results.correct_answers}
            maxValue={results.total_questions}
          />
        </div>
      </div>
      <div id="go-back">
        <Link to="/" onClick={deleteTestDetail}>
          Asosiy sahifaga qaytish
        </Link>
        <button id="ws" onClick={() => setSeeAll(true)}>
          Batafsil natijalarni ko'rish
        </button>
      </div>
    </div>
  );
};

export default Results;
