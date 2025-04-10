import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./test-detail.scss";
import CircularProgress from "./circularProgres";
import { AccessContext } from "../../AccessContext";

import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";

const Results = ({ results, test, selectedAnswers, pageId }) => {
  const navigate = useNavigate();
  const [seeAll, setSeeAll] = useState(false);
  const {  setStartTest } = useContext(AccessContext);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("timePerQuestion");
      localStorage.removeItem("startTime");
      localStorage.removeItem("startTest");
      setStartTest(null);
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
    localStorage.removeItem("startTest");
    setStartTest(null);
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

  const cleanText = (text) => {
    if (typeof text !== "string") return "";
    const mathRegex = /\$[^$]*\$|\\\([^\)]*\\\)|\\\[[^\]]*\\\]/g;
    let formulas = [];
    let index = 0;
    text = text.replace(mathRegex, (match) => {
      formulas.push(match);
      return `__FORMULA_${index++}__`;
    });
    text = text
      .replace(/<span(?![^>]*katex)[^>]*>/g, "")
      .replace(/<\/span>/g, "");
    formulas.forEach((formula, i) => {
      text = text.replace(`__FORMULA_${i}__`, formula);
    });
    return text;
  };
  const fixImageTags = (text) => {
    return text.replace(/<img([^>]+)>/g, (match, attributes) => {
      // 'alt' va 'style' atributlarini olib tashlash
      attributes = attributes.replace(/\s*alt=["'][^"']*["']/g, "");
      attributes = attributes.replace(/\s*style=["'][^"']*["']/g, "");
      return `<img ${attributes} />`;
    });
  };

  const fixImageUrl = (text) => {
    if (typeof text !== "string") return "";
    const baseUrl = "https://edumark.uz";
    return text.replace(
      /<img\s+([^>]*?)src=["'](\/media[^"']+)["']([^>]*)>/g,
      (match, before, path, after) => {
        // `alt="QuestionImage"` va `style="..."` atributlarini olib tashlash
        const cleanedBefore = before
          .replace(/\balt=["'][^"']*["']/g, "") // alt atributini olib tashlash
          .replace(/\bstyle=["'][^"']*["']/g, "") // style atributini olib tashlash
          .trim(); // Bo‘sh joylarni tozalash

        return `<img ${cleanedBefore} src="${baseUrl}${path}" ${after}>`;
      }
    );
  };

  const renderMath = (text) => {
    if (typeof text !== "string") return "";
    if (text.includes("<img")) {
      return text;
    }
    try {
      return katex.renderToString(text, { throwOnError: false });
    } catch (error) {
      console.error("KaTeX render error:", error);
      return text;
    }
  };

  const fixBrokenImageTags = (text) => {
    return text.replace(
      /alt=["']?Question Image["']?\s*style=["'][^"']*["']?\s*\/?>/g,
      ""
    );
  };

  const renderQuestionText = (text) => {
    if (typeof text !== "string") return "";

    const baseUrl = "https://edumark.uz";

    // Rasmlar uchun URL'ni to'g'irlash
    text = text.replace(
      /<img\s+src=["'](\/media[^"']+)["']/g,
      (match, path) => `<img src="${baseUrl}${path}" />`
    );

    // Matematik formulalarni aniqlash va to'g'ri ko'rsatish
    const mathRegex = /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div/g;
    text = text.replace(mathRegex, (match) => {
      try {
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    // Noto‘g‘ri img taglarini to‘g‘rilash
    text = fixBrokenImageTags(text);

    return text;
  };

  const getResultMessage = (percentage) => {
    if (percentage >= 80) {
      return {
        message:
          "Ajoyib natija! Siz Prezident maktabiga kirishga juda yaqin! Sinovni yana takrorlab, ishonch hosil qiling.",
        cta: "Yana bir urinish",
      };
    } else if (percentage >= 50) {
      return {
        message:
          "Siz yaxshi natija qayd etdingiz, ammo hali ozgina mashq qilish kerak! Natijangizni oshirish uchun yana test ishlang.",
        cta: "O'z natijangizni yaxshilang",
      };
    } else {
      return {
        message:
          "Bu faqat boshlanishi! Tajriba orttirish uchun yana bir test ishlang.",
        cta: "Hozir harakat qilib ko'ring",
      };
    }
  };

  const { message, cta } = getResultMessage(results.percentage_correct);

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
          <p>
            <span>To'plagan ballaringiz:</span> {results.total_score}
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
              {test.questions.map((question, index) => {
                const userAnswer = selectedAnswers.find(
                  (answer) => answer.questionId === question.id
                );
                return (
                  <div key={index} className="question-review">
                    <div className="question-option-line">
                      <p className="question-text">
                        <span className="q-count">{index + 1}.</span>{" "}
                        {/* <span
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        /> */}
                        <span>
                        {parse(renderQuestionText(question.text))}
                        </span>
                      </p>
                      <div className="options-container">
                        {question.options.map((option, optionIndex) => {
                          let status = option.is_staff ? "correct" : "";
                          if (
                            userAnswer &&
                            userAnswer.id === option.id &&
                            !option.is_staff
                          ) {
                            status = "incorrect";
                          }

                          return (
                            <div key={option.id} className={`option ${status}`}>
                              <strong className="chart">
                                {String.fromCharCode(65 + optionIndex)})
                              </strong>
                              {/* <span
                                dangerouslySetInnerHTML={{
                                  __html: option.text,
                                }}
                              /> */}
                              <span>
                              {parse(renderQuestionText(option.text))}
                              </span>
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

      {/* 🆕 Test natijalariga qarab CTA chiqarish */}
      <div className="result-message">
        <p>{results.ai_text}</p>
        <button onClick={() => navigate(`/schools/prezident-maktablari`)}>
          {cta}
        </button>
      </div>

      <div id="go-back">
        <Link to="/" onClick={deleteTestDetail}>
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
