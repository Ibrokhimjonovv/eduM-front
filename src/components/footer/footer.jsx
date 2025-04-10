import React from "react";
import { Link } from "react-router-dom";

// Style
import "./footer.scss";

// Images

const Footer = () => {
  return (
    <footer>
      <div className="line"></div>
      <div className="footer-container">
        <ul>
          <h2>Biz haqimizda</h2>
          <li className="first-child">
            <Link to="#">Kompaniya haqida ma’lumot</Link>
          </li>
          <li>
            <Link to="#">Foydalanuvchi shartnomasi</Link>
          </li>
          <li>
            <Link to="#">Ijtimoiy tarmoqlarimiz</Link>
          </li>
          <li className="social-links">
            <Link to="#">
              <img
                id="instagram"
                src="https://cdn-icons-png.flaticon.com/512/5968/5968776.png"
                alt=""
              />
            </Link>

            <Link to="#">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png"
                alt=""
              />
            </Link>
            <Link to="#">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/480px-2023_Facebook_icon.svg.png"
                alt=""
              />
            </Link>
          </li>
        </ul>
        <ul>
          <h2>Bo'limlar</h2>
          <li className="first-child">
            <Link to="/">Bosh sahifa</Link>
          </li>
          <li>
            <Link to="/school/tests">Testlar</Link>
          </li>
          <li>
            <Link to="/news">Yangiliklar</Link>
          </li>
          <li>
            <Link to="/contact">Bog'lanish</Link>
          </li>
        </ul>
        <ul>
          <h2>Biz bilan aloqa</h2>
          <li>
            Tel: <a href="tel:+998953988198">+998 95 398 81 98</a>
          </li>
          <li>
            Email: <a href="mailto:info@edumark.uz">info@edumark.uz</a>
          </li>
        </ul>
      </div>
      <div className="created-by">
      All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
