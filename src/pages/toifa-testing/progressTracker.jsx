import "./toifa.scss";
import { useEffect, useState } from 'react';
import { api } from '../../App';

const ProgressTracker = ({
  test,
  selectedAnswers,
  currentQuestionIndex,
  isTestFinished,
  setCurrentQuestionIndex,
}) => {
  const [sciences, setSciences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fanlar ma'lumotlarini olish
  useEffect(() => {
    const fetchSciences = async () => {
      try {
        // const response = await fetch(`${api}/sciences/`);
        const response = await fetch(`${api}/sciences/`);
        if (!response.ok) throw new Error("Fanlarni olishda xato yuz berdi");
        const data = await response.json();
        // Faqat testda mavjud fanlarni filter qilamiz
        const filteredSciences = data.filter(science => 
          test.science.includes(science.id)
        );
        setSciences(filteredSciences);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSciences();
  }, [test.science]);

  // Savollarni fanlar bo'yicha guruhlash
  const groupQuestionsByScience = () => {
    const grouped = {};
  
    // Fanlar uchun bo'sh arraylar yaratamiz
    sciences.forEach(science => {
      grouped[science.id] = {
        name: science.title,
        questions: [],
        startIndex: 0,
        count: 0
      };
    });
  
    // Savollarni ajratamiz
    test.questions.forEach((question, index) => {
      const scienceId = question.science_id || test.science[index % test.science.length];
      if (grouped[scienceId]) {
        grouped[scienceId].questions.push(question);
        grouped[scienceId].count++;
      }
    });
  
    // Tartib raqamini to‘g‘rilash uchun startIndex'larni hisoblaymiz
    let currentIndex = 0;
    test.science.forEach(scienceId => {
      if (grouped[scienceId]) {
        grouped[scienceId].startIndex = currentIndex;
        currentIndex += grouped[scienceId].questions.length;
      }
    });
  
    return grouped;
  };
  

  const scienceGroups = groupQuestionsByScience();

  // Savol holatini aniqlash
  const getQuestionStatus = (question, index) => {
    let status = "neutral";
    const answer = selectedAnswers.find((ans) => ans.questionId === question.id);
    const isAnswered = !!answer;
    let answerText = "";

    if (isAnswered && answer.id) {
      const selectedOptionIndex = question.options.findIndex(
        (opt) => opt.id === answer.id
      );
      if (selectedOptionIndex !== -1) {
        answerText = String.fromCharCode(65 + selectedOptionIndex);
      }
    }

    if (isTestFinished) {
      if (isAnswered) {
        status = answer.is_staff ? "correct" : "incorrect";
      } else {
        status = "unanswered";
      }
    } else {
      if (isAnswered) {
        status += " bel";
      }
    }

    return { status, answerText };
  };

  console.log('====================================');
  console.log(scienceGroups);
  console.log('====================================');

  if (loading) return <div>Fanlar yuklanmoqda...</div>;

  return (
    <div className="progress-trackerr">
      {/* Fanlar bo'yicha bo'limlar */}
      {Object.values(scienceGroups).map((science, scienceIndex) => (
        <div key={scienceIndex} className="subject-section">
          <div className="subject-header">
            <h3>{science.name}</h3>
            <span className="question-count">{science.count} ta savol</span>
          </div>
          <div className="subject-questions">
            {science.questions.map((question, index) => {
              const globalIndex = science.startIndex + index;
              const { status, answerText } = getQuestionStatus(question, globalIndex);
              
              return (
                <div
                  key={globalIndex}
                  className={`circle ${status}`}
                  onClick={() => setCurrentQuestionIndex(globalIndex)}
                  style={{ cursor: "pointer" }}
                >
                  {globalIndex + 1}
                  {answerText && `-${answerText}`}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;