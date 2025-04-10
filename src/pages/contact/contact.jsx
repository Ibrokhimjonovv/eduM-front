import React from "react";
import "./contact.scss";
import { Link } from "react-router-dom";
import tg from "../../assets/tg.png";

const Contact = () => {
  return (
    <div id="contact">
      <h1>Bog'lanish</h1>
      <div className="contact-inner">
        <div className="contact-inner-left">
          <form action="">
            <div className="input-row w-50">
              <input type="text" placeholder="Ism" required />
            </div>
            <div className="input-row w-50">
              <input type="text" placeholder="Familiya" required />
            </div>
            <div className="input-row">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-row">
              <textarea name="" id="" placeholder="Savol:"></textarea>
            </div>
            <div className="input-row btn">
            <button>Jo'natish</button>
            </div>
          </form>
        </div>
        <div className="contact-inner-right">
          <p>
            <span>Manzil:</span> O‘zbekiston, Toshkent shahri, Mustaqillik
            ko‘chasi, 12-uy
          </p>
          <p>
            <span>Telefon:</span> +998 95 398 81 98
          </p>
          <p>
            <span>Email:</span> info@edumark.uz
          </p>
          <p>
            Biz bilan bog‘laning – har qanday savollaringizga mamnuniyat bilan
            javob beramiz! 😊
          </p>
          <Link to="https://t.me/"><img src={tg} alt="" /> Telegram orqali bog’lanish</Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
