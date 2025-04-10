import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import defaultImage from "../../assets/user.png";

// Style
import "./profile.scss";

// Images
import settings from "./settings.png";
import mathImage from "../../assets/math.jpg";
import englishImage from "../../assets/english.jpg";
import phisicImage from "../../assets/phisic.jpg";
import arrow_image from "../../assets/arrow-image.png";

// Video
import video from "./test-video.mp4";

// Global api
// import { api } from "../../App";
import ProfileStatistics from "../../components/profil-statistics/profile-statistics";
import Rating from "../../components/rating/rating";

const Profile = () => {
  const {
    access,
    setPayedCourses,
    setOlympic,
    logout,
    randomNumber,
    profileData,
    allUsers,
  } = useContext(AccessContext);

  // useEffect(() => {
  //   setPayedCourses(true);
  //   setOlympic(false);
  // }, setPayedCourses);

  const navigate = useNavigate();
  const [mod, setMod] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  window.document.title = "Shaxsiy kabinet - Edu Mark";

  const friends = [
    {
      image: "https://freesvg.org/img/winkboy.png",
      firstName: "Maqsadbek",
      username: "Impulse",
      percent: 96,
    },
    {
      image: "https://freesvg.org/img/winkboy.png",
      firstName: "Jasur",
      username: "NewJasJan",
      percent: 76,
    },
    {
      image: "https://freesvg.org/img/winkboy.png",
      firstName: "Izzatillo",
      username: "Developer  ",
      percent: 82,
    },
    {
      image: "https://freesvg.org/img/winkboy.png",
      firstName: "Izzatillo",
      username: "Developer",
      percent: 52,
    },
  ];

  return (
    <section id="profile-section">
      {access ? (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-header-inner">
              <Link to="/">Bosh sahifa</Link> / Shaxsiy kabinet
            </div>
          </div>
          <div className="profile-content">
            <div className="left">
              <Rating
                userId={profileData}
                allUsers={allUsers}
                balance={profileData.balance}
              />
              <div className="left-inner-1">
                <ProfileStatistics />
              </div>
              <div className="left-inner-2 mob-ver">
                <div className="your-friend">
                  <h1>Reyting</h1>
                  <div className="your-friends">
                    {friends.map((item, index) => (
                      <div key={index} className="friend">
                        <img src={item.image} alt={item.firstName} />
                        <div className="texts">
                          <h2>{item.firstName}</h2>
                          <p>
                            <span className="username">{item.username}</span>
                            <span className="percent">{item.percent}%</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="start-now mob-ver">
                <div className="now-left">
                  Darajangizni ko'taring
                  <img src={arrow_image} alt="" />
                </div>
                <Link to="/schools/prezident-maktablari">Boshlang</Link>
              </div>
            </div>
            <div className="right">
              <div className="user-profile">
                <div>
                  <div className="inner">
                    {/* <img
                      id="setting"
                      onClick={handleToggle}
                      src={settings}
                      alt="setting"
                    /> */}
                    {/* {toggle && (
                      <div className="menu">
                        <Link to="/edit-profile">Profilni taxrirlash</Link>
                        <button id="logout" onClick={handleLogout}>
                          Chiqish
                        </button>
                      </div>
                    )} */}
                    {profileData.image ? (
                      <img
                        id="user-img"
                        src={profileData.image}
                        alt="Rasm yetib kelmadi"
                      />
                    ) : (
                      <img
                        id="user-img"
                        src={defaultImage}
                        alt="Rasm yetib kelmadi"
                      />
                    )}
                    <div className="texts">
                      <h1 className="first-last-name">
                        {profileData.name} {profileData.surname}
                      </h1>
                      <p className="phone">{profileData.phone_number}</p>
                      <p className="username">{profileData.username}</p>
                    </div>
                  </div>
                  <div className="percent">
                    <div className="count">{randomNumber}%</div>
                    <div className="line">
                      <div
                        className="line-inner"
                        style={{ width: `${randomNumber}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="logout-edit">
                    <Link to="/edit-profile">Profilni taxrirlash</Link>
                    <button
                      id="logout"
                      onClick={() => {
                        setMod(true);
                      }}
                    >
                      Chiqish
                    </button>
                    {mod && <div className="m-shape"></div>}
                    <div className={`opened-modal ${mod ? "active" : ""}`}>
                      <p>Haqiqatdan ham hisobingizdan chiqmoqchimisiz?</p>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setMod(false);
                          }}
                        >
                          Bekor qilish
                        </button>
                        <button type="button" onClick={handleLogout}>
                          Chiqish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-inner-2">
                <div className="your-friend">
                  <h1>Reyting</h1>
                  <div className="your-friends">
                    {friends.map((item, index) => (
                      <div key={index} className="friend">
                        <img src={item.image} alt={item.firstName} />
                        <div className="texts">
                          <h2>{item.firstName}</h2>
                          <p>
                            <span className="username">{item.username}</span>
                            <span className="percent">{item.percent}%</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="start-now">
                <div className="now-left">
                  Darajangizni ko'taring
                  <img src={arrow_image} alt="" />
                </div>
                <Link to="/schools/prezident-maktablari">Boshlang</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Iltimos oldin shaxsiy xisobingizga kiring</h1>
      )}
    </section>
  );
};

export default Profile;
