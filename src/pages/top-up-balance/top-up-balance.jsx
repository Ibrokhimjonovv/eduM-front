import React, { useContext, useEffect, useState } from "react";
import "./top-up-balance.scss";
import click from "./click.jpg";
import payme from "./payme.jpg";
import { api } from "../../App";
import { AccessContext } from "../../AccessContext";

const BalanceTopUp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("payme");
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState();
  const [shaxLoading, setShaxloading] = useState(false);
  const { profileData } = useContext(AccessContext);

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
            (e) => Number(e.id) === Number(profileData.province)
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
  }, [profileData.province]);

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
      const userId = profileData.id;
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
        profileData.name,
        regions[0].name_uz
      );
      const orderCreateRes = await fetch(
        `${api}/order/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: profileData.name,
            address: regions[0].name_uz,
            total_cost: parseInt(amount),
            payment_method: paymentMethod,
            customer: userId,
            order_id: orderId,
          }),
        }
      );
      const orderCreateData = await orderCreateRes.json();

      console.log(orderCreateData);
      
      if (orderCreateData.payment_link) {
        window.location.href = orderCreateData.payment_link;
      } else {
        setError("To‘lov linkini olishda xatolik yuz berdi!");
      }
    } catch (error) {
      setError("Xatolik yuz berdi, qayta urinib ko‘ring!", error);
    } finally {
      setShaxloading(false); // Yozib bo‘lgandan keyin loading'ni false qilish
    }
  };

  return (
    <div>
      <div className={`up-form`}>
        <h2>Xisobni to'ldirish</h2>
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
                margin: "7px 0 0 0",
                textAlign: "left",
              }}
            >
              {error}
            </p>
            <div className="modal-btn">
              <button onClick={handlePayment} disabled={shaxLoading} className={`${shaxLoading ? "ac" : ""}`}>
                {shaxLoading ? "To‘lov qilinmoqda..." : "To'lov qilish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;
