import React, { useEffect, useState } from "react";
import "./top-up-balance.scss";
import click from "./click.jpg";
import payme from "./payme.jpg";
import { api } from "../../App";

const BalanceTopUp = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("payme");
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState();
  const [shaxLoading, setShaxloading] = useState(false);

  const regionsURL =
    "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";

  const formatAmount = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleChange = (e) => {
    setAmount(e.target.value.replace(/\D/g, ""));
  };

  useEffect(() => {
    const fetchRegions = async () => {
      setShaxloading(true); // Yozib bo‘lgandan keyin loading'ni false qilish

      try {
        const response = await fetch(regionsURL);
        if (response.ok) {
          const data = await response.json();
          const fdata = data.filter(
            (e) => Number(e.id) === Number(user.province)
          );
          setRegions(fdata);
        } else {
          console.error("Viloyatlar ma'lumotini olishda xatolik yuz berdi.");
        }
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setShaxloading(false); // Yozib bo‘lgandan keyin loading'ni false qilish
      }
    };

    fetchRegions();
  }, [user.province]);

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Iltimos, to‘g‘ri summa kiriting!");
      return;
    } else if (amount < 1000) {
      setError("Minimal 1000 so'm kiriting!");
      return;
    }
    setShaxloading(true);

    try {
      const userId = user.id;
      const orderRes = await fetch(`${api}/get_order_id/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const orderData = await orderRes.json();
      const orderId = orderData.order_id;

      console.log(
        parseInt(amount),
        paymentMethod,
        orderId,
        user.name,
        regions[0].name_uz
      );

      // API yo‘nalishini paymentMethod'ga qarab tanlaymiz
      const paymentAPI =
        paymentMethod === "payme"
          ? `${api}/order/create/`
          : "https://api.edumark.uz/pyclick/process/click/transaction/create/";

      // Payme yoki Click uchun ma'lumotlarni to‘g‘ri formatda yuborish
      const requestBody =
        paymentMethod === "payme"
          ? {
              customer_name: user.name,
              address: regions[0].name_uz,
              total_cost: parseInt(amount),
              payment_method: paymentMethod,
              customer: userId,
              order_id: orderId,
            }
          : {
              click_trans_id: 1,
              service_id: 1,
              merchant_trans_id: 1,
              merchant_prepare_id: 1,
              amount: parseInt(amount),
              action: 1,
              error: 1,
              error_note: 1,
              sign_time: 1,
              sign_string: 1,
              click_pydoc_id: 1,
              user: userId,
            };

      const orderCreateRes = await fetch(paymentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const orderCreateData = await orderCreateRes.json();
      if (orderCreateData.payment_link) {
        window.location.href = orderCreateData.payment_link;
      } else {
        setError("To‘lov linkini olishda xatolik yuz berdi!");
      }
    } catch (error) {
      setError("Xatolik yuz berdi, qayta urinib ko‘ring!");
      console.error("To‘lov xatosi:", error);
    } finally {
      setShaxloading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Balansni oshirish +</button>
      <div className={`modal ${isOpen ? "active" : ""}`}>
        <div className="modal-content">
          <h3>
            To‘lov usulini tanlang:{" "}
            <span>{paymentMethod === "payme" ? "Payme" : "Click"}</span> orqali
          </h3>
          <div className="payment-method">
            <button
              onClick={() => setPaymentMethod("payme")}
              className={`${paymentMethod === "payme" ? "active" : ""}`}
              style={{ backgroundImage: `url(${payme})` }}
            ></button>
            {/* <button
              onClick={() => setPaymentMethod("click")}
              className={`${paymentMethod === "click" ? "active" : ""}`}
              style={{ backgroundImage: `url(${click})` }}
            ></button> */}
          </div>
          <div className="top-up-modal">
            <div id="inp-w-s">
              <input
                type="text"
                placeholder="Summani kiriting (so‘m)"
                name="total_cost"
                value={formatAmount(amount)}
                onChange={handleChange}
              />
              <span>so'm</span>
            </div>
            <p
              style={{
                fontSize: "15px",
                color: "red",
                margin: 0,
                textAlign: "left",
              }}
            >
              {error}
            </p>
            <div className="modal-btn">
              <button onClick={handlePayment} disabled={shaxLoading}>
                {shaxLoading ? "To‘lov qilinmoqda..." : "To'lov qilish"}
              </button>
              <button onClick={() => setIsOpen(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;
