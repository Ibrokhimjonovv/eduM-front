import React, { useContext, useEffect, useState } from 'react';
import TestHeader from './toifa-header';
import { useParams } from 'react-router-dom';
import { AccessContext } from '../../AccessContext';
import { api } from '../../App';
import Loading from '../../components/loading/loading';
import "./toifa.scss";
import UserData from './user-data';
import ProgressTracker from './progressTracker';
import Question from './questions';
import Results from './result';

const ToifaDetail = () => {
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
    const { profileData, access, startTest, setStartTest } =
        useContext(AccessContext);

    const [startTime, setStartTime] = useState(
        localStorage.getItem("startTime")
            ? new Date(localStorage.getItem("startTime"))
            : new Date()
    );

    const [questionStartTime, setQuestionStartTime] = useState(
        localStorage.getItem("questionStartTime")
            ? new Date(localStorage.getItem("questionStartTime"))
            : new Date()
    );

    const [timePerQuestion, setTimePerQuestion] = useState(
        JSON.parse(localStorage.getItem("timePerQuestion")) || {}
    );

    const [sciences, setSciences] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState([]);
    const [resLoading, setResLoading] = useState(false);

    // Cleanup function for test data
    const cleanupTestData = () => {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("selectedAnswers");
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("timePerQuestion");
        localStorage.removeItem("startTime");
        localStorage.removeItem("questionStartTime");
        localStorage.removeItem("startTest");
    };

    useEffect(() => {
        const savedTestId = localStorage.getItem("startTest");
        if (savedTestId) {
            setStartTest(savedTestId);
        }

        return () => {
            if (!results) {
                cleanupTestData();
            }
        };
    }, [results]);

    // Save timings to localStorage
    useEffect(() => {
        localStorage.setItem("startTime", startTime.toISOString());
    }, [startTime]);

    useEffect(() => {
        localStorage.setItem("questionStartTime", questionStartTime.toISOString());
    }, [questionStartTime]);

    // Update question start time when question changes
    useEffect(() => {
        if (groupedQuestions.length > 0 || test?.questions?.length > 0) {
            setQuestionStartTime(new Date());
        }
    }, [currentQuestionIndex, groupedQuestions, test]);

    // Fetch sciences data
    useEffect(() => {
        const fetchSciences = async () => {
            try {
                const response = await fetch(`${api}/sciences/`);
                if (!response.ok) throw new Error("Fanlarni olishda xato yuz berdi");
                const data = await response.json();
                const filteredSciences = data.filter(science =>
                    test?.science?.includes(science.id)
                );
                setSciences(filteredSciences);
            } catch (error) {
                console.error(error);
            }
        };

        if (test) {
            fetchSciences();
        }
    }, [test]);

    // Group questions by science
    useEffect(() => {
        if (test && test.questions && sciences.length > 0) {
            const grouped = {};
            let questionIndex = 0;

            sciences.forEach(science => {
                grouped[science.id] = {
                    name: science.name,
                    questions: [],
                    startIndex: questionIndex,
                    count: 0
                };
            });

            test.questions.forEach((question, index) => {
                const scienceId = question.science_id || test.science[index % test.science.length];
                if (grouped[scienceId]) {
                    grouped[scienceId].questions.push(question);
                    grouped[scienceId].count++;
                    questionIndex++;
                }
            });

            const sortedQuestions = [];
            Object.values(grouped).forEach(subject => {
                sortedQuestions.push(...subject.questions);
            });

            setGroupedQuestions(sortedQuestions);
        } else if (test && test.questions) {
            setGroupedQuestions(test.questions);
        }
    }, [test, sciences]);

    // Fetch test details
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

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    // Timer logic
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

    // Save current state to localStorage
    useEffect(() => {
        localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    }, [currentQuestionIndex]);

    useEffect(() => {
        localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    }, [selectedAnswers]);

    useEffect(() => {
        localStorage.setItem("timePerQuestion", JSON.stringify(timePerQuestion));
    }, [timePerQuestion]);

    // Navigation functions
    const handleNextQuestion = () => {
        const currentTime = new Date();
        const currentQuestion = groupedQuestions[currentQuestionIndex] || test?.questions[currentQuestionIndex];
        const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);
    
        setTimePerQuestion((prev) => {
            const updated = { ...prev, [currentQuestion.text]: timeSpent };
            localStorage.setItem("timePerQuestion", JSON.stringify(updated));
            return updated;
        });
    
        if (currentQuestionIndex < (groupedQuestions.length || test?.questions.length) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
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

    // Calculate results function
    const calculateResults = async () => {
        setResLoading(true);

        // Get saved timings from localStorage
        const savedStartTime = localStorage.getItem("startTime") 
            ? new Date(localStorage.getItem("startTime")) 
            : startTime;
        const savedQuestionStartTime = localStorage.getItem("questionStartTime") 
            ? new Date(localStorage.getItem("questionStartTime")) 
            : questionStartTime;

        const currentTime = new Date();
        const totalTimeTaken = Math.floor((currentTime - savedStartTime) / 1000);
        const timeSpent = Math.floor((currentTime - savedQuestionStartTime) / 1000);

        const correctAnswersCount = selectedAnswers.filter(
            (answer) => answer.is_staff
        ).length;
        const totalQuestions = groupedQuestions.length || test?.questions.length;

        const totalMinutes = String(Math.floor(totalTimeTaken / 60)).padStart(2, "0");
        const totalSeconds = String(totalTimeTaken % 60).padStart(2, "0");

        const formattedTime = `${Math.floor(totalTimeTaken / 60)} daqiqa ${totalTimeTaken % 60} soniya`;

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
            percentage_correct: ((correctAnswersCount / totalQuestions) * 100).toFixed(2),
            total_time_taken: `00:${totalMinutes}:${totalSeconds}`,
            time_per_question: JSON.parse(localStorage.getItem("timePerQuestion")) || {},
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
            setResLoading(false);
            cleanupTestData();
        }
    };

    // Auto-calculate results when time is up
    useEffect(() => {
        if (timeLeft === 0) {
            calculateResults();
        }
    }, [timeLeft]);

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
        <div id='toifa-testing'>
            <TestHeader
                currentIndex={currentQuestionIndex}
                totalQuestions={groupedQuestions.length || test?.questions.length}
                timeLeft={timeLeft}
            />
            <div className="test-container">
                <div className="toifa-left">
                    <UserData />
                    <ProgressTracker
                        test={test}
                        selectedAnswers={selectedAnswers}
                        currentQuestionIndex={currentQuestionIndex}
                        isTestFinished={false}
                        setCurrentQuestionIndex={setCurrentQuestionIndex}
                        sciences={sciences}
                        groupedQuestions={groupedQuestions}
                    />
                </div>
                <div className="toifa-right">
                    <Question
                        currentIndex={currentQuestionIndex}
                        question={groupedQuestions[currentQuestionIndex] || test?.questions[currentQuestionIndex]}
                        selectedAnswers={selectedAnswers}
                        setSelectedAnswers={setSelectedAnswers}
                        currentQuestionIndex={currentQuestionIndex}
                        test={test}
                        setCurrentQuestionIndex={setCurrentQuestionIndex}
                        res={resLoading}
                        handleNextQuestion={handleNextQuestion}
                        handlePreviousQuestion={handlePreviousQuestion}
                        calculateResults={calculateResults}
                        timeLeft={timeLeft}
                    />
                </div>
            </div>
        </div>
    );
};

export default ToifaDetail;