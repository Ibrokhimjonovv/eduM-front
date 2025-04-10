import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay } from "swiper/modules";

// Global API
import { api } from "../../App";

// Style
import "./high-rating.scss";

// Images
import rating from "./rating.png";
import active_users from "./active-users.png";
import big_boy from "./boy.png";

const High_rating = () => {
  const high_rating_pupils = [
    {
      img: active_users,
      name: "Sardor Qobulov",
      percent: "97",
    },
    {
      img: active_users,
      name: "Ali Shokirov",
      percent: "96",
    },
    {
      img: active_users,
      name: "Akmal G'ayratov",
      percent: "93",
    },
  ];

  return (
    <section id="high-section">
      <div className="for-with">
        <h1 id="heading-1">
          YUQORI REYTINGLI FOYDALANUVCHILAR <img src={rating} alt="" />
        </h1>
        <p id="text-1">
          Bu joyda sayitdagi eng a’lochi va bilimdon foydalanuvchilarning
          profillari turadi. Siz ham shu joylardan birida bo’lishingiz mumkin!
        </p>

        <div className="pupils-container">
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="mySwiper"
            breakpoints={{
              0: { slidesPerView: 1 }, // 0px dan katta bo‘lsa, 1 ta slayd
              400: { slidesPerView: 1 }, // 400px dan katta bo‘lsa, 1 ta slayd
              768: { slidesPerView: 2 }, // 768px dan katta bo‘lsa, 2 ta slayd
              1024: { slidesPerView: 3 }, // 1024px dan katta bo‘lsa, 3 ta slayd
            }}
          >
            {high_rating_pupils.map((data, index) => (
              <SwiperSlide key={index}>
                <div className="pupils-item">
                  <img src={data.img} alt="" />
                  <p className="active-user-name">{data.name}</p>
                  <span className="his-percent">{data.percent}%</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="pupils-news-container">
          <div className="news-inner-1">
            <h1>Bilim va ko'nikma</h1>
            <p>
              Bilim va ko'nikma, odamning insoniyatni o'zlashtirishda, shaxsiy
              rivojlanishda va jamiyatda qatnashishda juda muhim ahamiyatga ega
              mavzular hisoblanadi. Bu jarayonlar hayot bo'yicha doimiy
              rivojlanishni ta'minlaydi va insonni professional va shaxsiy
              yondashuvi bilan ta'minlaydi.
            </p>
            <div className="spans">
              <span className="span">
                <span className="green"></span>
                <p>Qiziqarli va interaktiv darslar</p>
              </span>
              <span className="span">
                <span className="green"></span>
                <p>Tajribali ustozlar</p>
              </span>
              <span className="span">
                <span className="green"></span>
                <p>Individual yondashuv</p>
              </span>
            </div>
            <Link to="#" className="more-btn-link">
              Ko'proq
            </Link>
          </div>
          <div className="news-inner-2">
            <img src={big_boy} alt="" />
          </div>
          <div className="toplam">
            <div className="spans mobile-version">
              <span className="span">
                <span className="green"></span>
                <p>Ma'lumotni qo'llash</p>
              </span>
              <span className="span">
                <span className="green"></span>
                <p>Jismoniy mashqlar</p>
              </span>
              <span className="span">
                <span className="green"></span>
                <p>Sog'lom ovqatlanish</p>
              </span>
            </div>
            <Link to="/schools/prezident-maktablari" className="more-btn-link mobile-version">
              Sinovni boshlash
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default High_rating;
