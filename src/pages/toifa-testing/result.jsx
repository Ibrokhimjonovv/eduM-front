import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./toifa.scss";
import { AccessContext } from "../../AccessContext";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";
import CircularProgress from "./circularProgress";

const Results = ({ results, test, selectedAnswers }) => {
  const navigate = useNavigate();
  const [seeAll, setSeeAll] = useState(false);
  const { setStartTest } = useContext(AccessContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle page refresh and cleanup
  useEffect(() => {
    // Check if page was refreshed
    const pageAccessedByReload = (
      (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType("navigation")
        .map((nav) => nav.type)
        .includes("reload")
    );

    if (pageAccessedByReload && !isInitialLoad) {
      // Redirect only after initial load and on refresh
      navigate('/toifa-imtihonlari');
      return;
    }

    // Mark initial load as complete
    setIsInitialLoad(false);

    // Set up beforeunload handler
    const handleBeforeUnload = () => {
      cleanupTestData();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!pageAccessedByReload) {
        cleanupTestData();
      }
    };
  }, [navigate]);

  // Clean up test data from storage
  const cleanupTestData = () => {
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("timePerQuestion");
    localStorage.removeItem("startTime");
    localStorage.removeItem("startTest");
    setStartTest(null);
  };

  // Handle overflow when viewing all results
  useEffect(() => {
    if (seeAll) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [seeAll]);

  // Text formatting functions
  const renderQuestionText = (text) => {
    if (typeof text !== "string") return "";

    // Fix image URLs
    const baseUrl = "https://edumark.uz";
    text = text.replace(
      /<img\s+src=["'](\/media[^"']+)["']/g,
      (match, path) => `<img src="${baseUrl}${path}" />`
    );

    // Render math expressions
    const mathRegex = /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div/g;
    text = text.replace(mathRegex, (match) => {
      try {
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    // Clean up image tags
    text = text.replace(
      /alt=["']?Question Image["']?\s*style=["'][^"']*["']?\s*\/?>/g,
      ""
    );

    return text;
  };

  // Get appropriate result message based on score
  const getResultMessage = (percentage) => {
    if (percentage >= 80) {
      return {
        message: "Ajoyib natija! Siz Prezident maktabiga kirishga juda yaqin! Sinovni yana takrorlab, ishonch hosil qiling.",
        cta: "Yana bir urinish"
      };
    } else if (percentage >= 50) {
      return {
        message: "Siz yaxshi natija qayd etdingiz, ammo hali ozgina mashq qilish kerak! Natijangizni oshirish uchun yana test ishlang.",
        cta: "O'z natijangizni yaxshilang"
      };
    } else {
      return {
        message: "Bu faqat boshlanishi! Tajriba orttirish uchun yana bir test ishlang.",
        cta: "Hozir harakat qilib ko'ring"
      };
    }
  };

  const { message, cta } = getResultMessage(results.percentage_correct);

  return (
    <div className="results-container">
      <h2>Test tugadi. Natijalar:</h2>
      
      <div className="result-inner">
        <div className="text-inner-left">
          <p><span>Jami savollar:</span> {results.total_questions}</p>
          <p><span>To'g'ri javoblar:</span> {results.correct_answers}</p>
          <p><span>Noto'g'ri javoblar:</span> {results.incorrect_answers}</p>
          <p><span>Belgilanmagan savollar:</span> {results.unanswered_questions}</p>
          <p><span>To'g'ri javoblar foizi:</span> {results.percentage_correct}%</p>
          <p><span>Sarflangan vaqt:</span> {results.time_taken}</p>
          <p><span>To'plagan ballaringiz:</span> {results.total_score}</p>
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
              {test.questions.map((question, index) => {
                const userAnswer = selectedAnswers.find(
                  (answer) => answer.questionId === question.id
                );
                
                return (
                  <div key={index} className="question-review">
                    <div className="question-option-line">
                      <p className="question-text">
                        <span className="q-count">{index + 1}.</span>
                        <span>{parse(renderQuestionText(question.text))}</span>
                      </p>
                      
                      <div className="options-container">
                        {question.options.map((option, optionIndex) => {
                          let status = option.is_staff ? "correct" : "";
                          if (userAnswer && userAnswer.id === option.id && !option.is_staff) {
                            status = "incorrect";
                          }

                          return (
                            <div key={option.id} className={`option ${status}`}>
                              <strong className="chart">
                                {String.fromCharCode(65 + optionIndex)})
                              </strong>
                              <span>{parse(renderQuestionText(option.text))}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <CircularProgress
            value={results.correct_answers}
            maxValue={results.total_questions}
          />
        </div>
      </div>

      <div className="result-message">
        <p>{results.ai_text}</p>
        <button onClick={() => navigate('/toifa-imtihonlari')}>
          {cta}
        </button>
      </div>

      <div id="go-back">
        <Link to="/" onClick={cleanupTestData}>
          Asosiy bo'limga qaytish
        </Link>
        <button id="ws" onClick={() => setSeeAll(true)}>
          Batafsil natijalarni ko'rish
        </button>
      </div>
    </div>
  );
};

export default Results;