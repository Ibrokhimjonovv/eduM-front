import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AccessContext } from "../../AccessContext";

// Styles
import "./for-students.scss";

// Images
import arrow from "./arrow.png";
import duble_arrow from "./duble-arrow.png";
import bg from "./Rectangle 4.png";
import boy from "./Download_premium_png_of_PNG_Reading_holding_student_book_by_Ketsarin_about_student_png__student__document__student_kid_png__and_boy_12086883-removebg-preview 1.png";
import qiyshiq_arrow from "./arr.png";
import arr2 from "./arr2.png";
import green_point from "./green_point.png";
import active_user from "./active-users.png";

const ForStudents = () => {
  const isDisabled = true;
  const { access, allUsers } = useContext(AccessContext);
  const texts = [
    {
      title: "Qulay va tushunarli testlar barcha uchun",
    },
    {
      title:
        "1-4-sinf yoshidagi bolalar uchun",
    },
    {
      title: "Bilimingni oshir, mustaxkamla, do’stlaringa ulash",
    },
  ];
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount >= allUsers.user_count) {
          clearInterval(interval);
          return allUsers.user_count;
        }
        return prevCount + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  });

  return (
    <section className="firstSection">
      <div className="big-container">
        <h1>
        <span>Prezident maktablariga</span> kirish uchun bilim va ishonchingizni sinang!
        </h1>
        <p id="text-1">Biz bilan birga o'rganing va muvaffaqiyatga erishing</p>
        <div className="container">
          <div className="container-item container-item-first">
            <p id="text-2">
              1-4-sinf yoshidagi bolalarni qabul qilish uchun innovatsion
              platforma. Ariza topshirish, test sinovlari va natijalarni bilish
              uchun yagona tizim.
              <img src={arrow} alt="" />
            </p>

            <div className="container-item-links">
              {access ? (
                <>
                  <a href="#data-section">Batafsil</a>
                  <a href="#schools-tests">Testni boshlash</a>
                </>
              ) : (
                <>
                  <Link to="/login">Kirish</Link>
                  <Link
                    to={isDisabled ? null : ""}
                    style={{
                      cursor: isDisabled ? "not-allowed" : "auto",
                      color: isDisabled ? "gray" : "blue",
                    }}
                  >
                    Testni boshlash
                  </Link>
                </>
              )}
            </div>
            <img id="duble-arrow" src={duble_arrow} alt="" />
          </div>
          <div className="container-item container-item-second">
            <img src={bg} alt="" />
            <img src={boy} alt="" />
          </div>
          <div className="container-item container-item-third">
            <img id="arr" src={qiyshiq_arrow} alt="" />
            <img id="arr2" src={arr2} alt="" />
            <div className="green-texts">
              {texts.map((data, index) => (
                <span key={index}>
                  <img src={green_point} alt="" />
                  {data.title}
                </span>
              ))}
            </div>
            <div className="active-users">
              <div className="users-image">
                <img src={active_user} alt="" />
                <img src={active_user} alt="" />
                <img src={active_user} alt="" />
              </div>
              <div className="users-count">
                <h2>{count > 10 ? `${count}+` : count}</h2>
                <p>Foydalanuvchilar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForStudents;
