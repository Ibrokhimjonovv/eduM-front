import React from "react";
import "./test-detail.scss";
import ProgressTracker from "./proccessTracker";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";

const Question = ({
  question,
  selectedAnswers,
  setSelectedAnswers,
  currentIndex,
  currentQuestionIndex,
  test,
  setCurrentQuestionIndex,
}) => {
  if (!question) {
    return (
      <div className="testing-container">
        <div className="testing-container-inner">
          <div className="question-container">
            <p>Savollar mavjud emas!</p>
          </div>
        </div>
      </div>
    );
  }

  const cleanText = (text) => {
    if (typeof text !== "string") return "";

    // Matematik formulalarni aniqlash
    const mathRegex = /\$[^$]*\$|\\\([^\)]*\\\)|\\\[[^\]]*\\\]/g;
    let formulas = [];
    let index = 0;

    // Formulalarni vaqtincha almashtirish
    text = text.replace(mathRegex, (match) => {
      formulas.push(match);
      return `__FORMULA_${index++}__`;
    });

    // Formulalarni qayta joylashtirish
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

    // <img> teglarini vaqtincha saqlash uchun joy
    const imgPlaceholders = [];
    let imgIndex = 0;

    // <img> teglarini vaqtincha almashtirish
    text = text.replace(/<img\s+[^>]*>/g, (match) => {
      imgPlaceholders.push(match); // Tegni saqlash
      return `@@IMG${imgIndex++}@@`; // Tegni vaqtincha almashtirish
    });

    // Matematik formulalarni aniqlash
    const mathRegex =
      /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div|a\d|⍟/g;

    // Formulalarni ajratib, ularni KaTeX orqali ko'rsatish
    text = text.replace(mathRegex, (match) => {
      try {
        // a2, a3 kabi ifodalarni a^2, a^3 ga o'zgartirish
        if (match.startsWith('a')) {
          return katex.renderToString(match.replace('a', 'a^'), { throwOnError: false });
        }
        // ⍟ belgisini KaTeXda to'g'ri ko'rsatish
        if (match === '⍟') {
          return katex.renderToString('\\star', { throwOnError: false });
        }
        // Boshqa matematik formulalarni render qilish
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    // <img> teglarini qayta joylashtirish
    text = text.replace(/@@IMG(\d+)@@/g, (match, index) => {
      return imgPlaceholders[Number(index)]; // Tegni qaytarish
    });

    return text;
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

    // <img> teglarini vaqtincha saqlash uchun joy
    const imgPlaceholders = [];
    let imgIndex = 0;

    // <img> teglarini vaqtincha almashtirish
    text = text.replace(/<img\s+[^>]*>/g, (match) => {
      imgPlaceholders.push(match); // Tegni saqlash
      return `@@IMG${imgIndex++}@@`; // Tegni vaqtincha almashtirish
    });

    // Matematik formulalarni aniqlash va to'g'ri ko'rsatish
    const mathRegex =
      /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div|a\d|⍟/g;
    text = text.replace(mathRegex, (match) => {
      try {
        // a2, a3 kabi ifodalarni a^2, a^3 ga o'zgartirish
        if (match.startsWith("a")) {
          return katex.renderToString(match.replace("a", "a^"), {
            throwOnError: false,
          });
        }
        // ⍟ belgisini KaTeXda to'g'ri ko'rsatish
        // if (match === '⍟') {
        //   return katex.renderToString('\\star', { throwOnError: false });
        // }
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    // <img> teglarini qayta joylashtirish
    text = text.replace(/@@IMG(\d+)@@/g, (match, index) => {
      const imgTag = imgPlaceholders[Number(index)]; // Tegni olish
      // Rasm manzilini to'g'rilash
      return imgTag.replace(
        /<img\s+src=["'](\/media[^"']+)["']/g,
        (match, path) => `<img src="${baseUrl}${path}" />`
      );
    });

    // Noto'g'ri img taglarini to'g'rilash
    text = fixBrokenImageTags(text);

    return text;
  };

  const handleOptionSelect = (option) => {
    const updatedAnswers = selectedAnswers.filter(
      (answer) => answer.questionId !== question.id
    );
    updatedAnswers.push({ questionId: question.id, ...option });
    setSelectedAnswers(updatedAnswers);
  };

  return (
    <div className="testing-container">
      <div className="testing-container-inner">
        <div className="question-container">
          <p id="current-question-count">{currentIndex + 1}.</p>
          <div className="question-container-inner-1">
            <div className="question-text">
              {parse(renderQuestionText(question.text))}
            </div>
          </div>
        </div>
        <div className="options">
          {question.options.map((option, index) => (
            <div key={option.id} className="options-1">
              <div className="option">
                <input
                  className="option"
                  type="radio"
                  id={`option-${option.id}`}
                  name={`option-${question.id}`}
                  onChange={() => handleOptionSelect(option)}
                  checked={
                    selectedAnswers.find(
                      (answer) =>
                        answer.questionId === question.id &&
                        answer.id === option.id
                    )
                      ? true
                      : false
                  }
                />
                <label
                  htmlFor={`option-${option.id}`}
                  dangerouslySetInnerHTML={{
                    __html: `<strong class="chart">${String.fromCharCode(
                      65 + index
                    )}.</strong> ${fixImageTags(
                      fixImageUrl(renderMath(cleanText(option.text)))
                    )}`,
                  }}
                ></label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProgressTracker
        test={test}
        selectedAnswers={selectedAnswers}
        currentQuestionIndex={currentQuestionIndex}
        isTestFinished={false}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default Question;
