import "./proccessTracker.scss";

const ProgressTracker = ({
  test,
  selectedAnswers,
  currentQuestionIndex,
  isTestFinished,
  setCurrentQuestionIndex, 
}) => {
  return (
    <div className="progress-tracker">
      {test.questions.map((question, index) => {
        let status = "neutral";
        const answer = selectedAnswers.find(
          (ans) => ans.questionId === question.id
        );
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

        return (
          <div
            key={index}
            className={`circle ${status}`}
            onClick={() => setCurrentQuestionIndex(index)} 
            style={{ cursor: "pointer" }}
          >
            {index + 1}
            {answerText && `-${answerText}`}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;
