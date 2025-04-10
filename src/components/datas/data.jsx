import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Style
import "./data.scss";

// Images
import bubbles from "./Bubbles.png";
import book from "./Book.png";
import threInOne from "./3in1.png";
import teacher from "./teacher.png";

const Data = () => {
  const [access, setAccess] = useState(false);

  useEffect(() => {
    const skeleton = document.querySelectorAll(".skeleton");
    window.addEventListener("load", () => {
      skeleton.forEach((item) => {
        item.classList.remove("skeleton");
      });
    });
  });

  return (
    <section id="data-section">
      <h1 id="text">Ma'lumot</h1>
      <div className="data-container">
        <div className="data-item-1">
          <div className="texts">
            <h1 id="text-1">
              <span>Edu</span> Mark sayti haqida batafsil ma'lumot
            </h1>
            <p>
              Farzandingizning kelajagini biz bilan mustahkamlang! Maktabga
              tayyorgarlikning muhim bosqichi – sifatli ta'limdan boshlanadi.
              Bizning tayyorlov kurslarimiz bolangizning bilim va
              qobiliyatlarini rivojlantirishga, o‘qish, yozish, mantiqiy
              fikrlash va mustaqil o‘rganish ko‘nikmalarini shakllantirishga
              yordam beradi.
            </p>
          </div>
          <div className="flex">
            <div className="data-item-1-inner-1">
              <h2>Sayt foydalanuvchilar ro'yxati</h2>
              <p>
                <span>
                  Bu ro'yxatni ko’rish uchun admin bilan bog’lanishingiz zarur
                </span>
                <Link to="#">Batafsil</Link>
              </p>
              <div className="skeleton-loading">
                {access ? (
                  <>
                    <div className="card-image">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
                        alt=""
                      />
                    </div>
                    <div className="texts">
                      <h3>Admin</h3>
                      <span>
                        Admin bilan bo'g'lanish uchun <Link to="#">bosing</Link>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="card-image skeleton">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
                        alt=""
                      />
                    </div>
                    <div className="texts">
                      <h3 className="skeleton">Admin</h3>
                      <span className="skeleton">
                        Admin bilan bo'g'lanish uchun <Link to="#">bosing</Link>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="data-item-1-inner-2">
              <h2>Kitoblar</h2>
              <div className="line"></div>
              <img id="book" src={book} alt="" />
              <img id="bubbles" src={bubbles} alt="" />
            </div>
          </div>
        </div>
        <div className="data-item-2">
          <div className="data-item-2-inner-1">
            <div className="images-container">
              <img src={threInOne} alt="" />
            </div>
            <h1>Qulay va tushunarli</h1>
            <p>
              Samarali va eco tizim barcha uchun tushunarli va qulay 24/7
              ishlashingiz mumkin
            </p>
          </div>
          <div className="data-item-2-inner-2">
            <div className="inner-left">
              <h1>Ustoz va adminlarga savollar bolimi</h1>
              <p>
                Samarali va eco tizim barcha uchun tushunarli va qulay Samarali
                va eco tizim barcha uchun tushunarli va qulay
              </p>
            </div>
            <div className="inner-right">
              <img src={teacher} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Data;
