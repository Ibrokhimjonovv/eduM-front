import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./toifa.scss";
import { AccessContext } from "../../AccessContext";

const TestHeader = ({ currentIndex, totalQuestions, timeLeft }) => {
    const { setStartTest } = useContext(AccessContext);

    const overTest = () => {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("selectedAnswers");
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("startTest");
        // setStartTest(null);
    };

    const overTest2 = () => {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("selectedAnswers");
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("startTest");
        setStartTest(null);
    };

    // Vaqt 00:00:00 bo'lsa overTest() ni ishga tushiramiz
    useEffect(() => {
        if (timeLeft === 0) {
            overTest();
        }
    }, [timeLeft]); // timeLeft o'zgarsa, useEffect qayta ishlaydi

    return (
        <div className="testing-header">
            <Link
                to="/toifa-imtihonlari"
                className="exit"
                onClick={() => {
                    overTest2();
                }}
            >
                Chiqish
            </Link>
            {/* <p className="count">
                Siz <span>{totalQuestions}</span> ta savoldan{" "}
                <span>{totalQuestions !== 0 ? currentIndex + 1 : 0}</span> - savolga
                javob bermoqdasiz
            </p> */}
            <div className="time">
                {totalQuestions === 0 || timeLeft === null ? (
                    "00:00:00"
                ) : (
                    <>
                        <span className="time-hh">
                            {String(Math.floor(timeLeft / 3600)).padStart(2, "0")}
                            <p>Soat</p>
                        </span>
                        :
                        <span className="time-mm">
                            {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0")}
                            <p>Daqiqa</p>
                        </span>
                        :
                        <span className="time-ss">
                            {String(timeLeft % 60).padStart(2, "0")}
                            <p>Soniya</p>
                        </span>
                    </>
                )}
            </div>


            <div className="count-time">
                <p>{totalQuestions !== 0 ? currentIndex + 1 : 0}.</p>
                <div className="time-mob">
                    {totalQuestions === 0 || timeLeft === null ? (
                        "00:00:00"
                    ) : (
                        <>
                            <span className="time-hh">
                                {String(Math.floor(timeLeft / 3600)).padStart(2, "0")}
                            </span>
                            :
                            <span className="time-mm">
                                {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0")}
                            </span>
                            :
                            <span className="time-ss">
                                {String(timeLeft % 60).padStart(2, "0")}
                            </span>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TestHeader;
