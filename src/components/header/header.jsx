import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import Logo from "./Logo.png";
import profileImage from "../../assets/user.png";
import "./header.scss";
import SearchBtn from "../search-btn/searchBtn";
import "boxicons";

const datas = [
  {
    name: "Bosh sahifa",
    link: "/",
  },
  {
    name: "Testlar",
    link: "/schools/prezident-maktablari",
  },
  {
    name: "Fanlar",
    link: "sciences/matematika",
  },
  // {
  //   name: "Yangiliklar",
  //   link: "paid-courses-section",
  // },
];

const Header = () => {
  const { access, success, setSuccess, profileData } =
    useContext(AccessContext);
  const [offcanvas, setOffCanvas] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);
  const location = useLocation();
  const isTestsPage = location.pathname === "/signup";
  return (
    <>
      <marquee className="header-top" behavior="" direction="">
        Plarforma sinov tariqasida ishga tushirilgan
      </marquee>
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="nav-menu">
            <ul>
              {datas.map((data, index) => (
                <li key={index}>
                  <NavLink
                    to={data.link}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                  >
                    {data.name}
                  </NavLink>
                </li>
              ))}
              <li>
                <a href="/#contact">Bog'lanish</a>
              </li>
            </ul>
          </div>
          <div className="search-signup">
            {access ? (
              <div className="align-items">
                {success && (
                  <div
                    className="header-success-message"
                    style={{ zIndex: 999999 }}
                  >
                    {success}
                  </div>
                )}
                <Link to="/top-up-balance" className="user-balance profile">
                  {new Intl.NumberFormat('de-DE').format(profileData.balance ? profileData.balance : 0)} so'm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="ionicon"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      fill="none"
                      stroke="currentColor"
                      stroke-miterlimit="10"
                      stroke-width="32"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                      d="M256 176v160M336 256H176"
                    />
                  </svg>
                </Link>
                <Link
                  className="profile"
                  to={profileData.is_superuser ? "/admin/sciences/" : "profile"}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.23438 19.5C4.55979 17.2892 7.46466 15.7762 11.9967 15.7762C16.5286 15.7762 19.4335 17.2892 20.7589 19.5M15.5967 8.1C15.5967 10.0882 13.9849 11.7 11.9967 11.7C10.0084 11.7 8.39665 10.0882 8.39665 8.1C8.39665 6.11177 10.0084 4.5 11.9967 4.5C13.9849 4.5 15.5967 6.11177 15.5967 8.1Z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {profileData.is_superuser ? "Admin panel" : "Shaxsiy kabinet"}
                </Link>
              </div>
            ) : (
              <>
                {isTestsPage || location.pathname === "/login" ? (
                  ""
                ) : (
                  <Link id="login" to="/login">
                    Kirish
                  </Link>
                )}
                <Link id="signup" to={isTestsPage ? "/login" : "/signup"}>
                  {isTestsPage ? "Kirish" : "Ro'yxatdan o'tish"}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="menu-icon" onClick={() => setOffCanvas(true)}>
          <svg
            width="53"
            height="36"
            viewBox="0 0 53 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H49"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M4 18H49"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M4 32H49"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className={`menu-container ${offcanvas ? "active" : ""}`}>
          <ul>
            <li onClick={() => setOffCanvas(false)}>
              <box-icon name="plus" color="#fff"></box-icon>
            </li>
            {datas.map((data, index) => (
              <li key={index} onClick={() => setOffCanvas(false)}>
                <NavLink
                  to={data.link}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  {data.name}
                </NavLink>
              </li>
            ))}
            <li onClick={() => setOffCanvas(false)}>
              <a href="/#contact">Bog'lanish</a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
