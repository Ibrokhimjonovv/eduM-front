import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import { api } from "../../App";
import InputMask from "react-input-mask";
import { AccessContext } from "../../AccessContext";

const regionsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";
const districtsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/districts.json";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [smsErr, setSmsErr] = useState("");
  const [phone, setPhone] = useState("");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone_number: phone,
    surname: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
  });

  const [code, setCode] = useState(Array(4).fill(""));
  const inputRefs = useRef([]);

  const { successM, setSuccessM } = useContext(AccessContext);

  const navigate = useNavigate();
  useEffect(() => {
    setFormData((prev) => ({ ...prev, phone_number: phone }));
  }, [phone]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(regionsURL);
        if (response.ok) {
          const data = await response.json();
          setRegions(data);
        } else {
          console.error("Viloyatlar ma'lumotini olishda xatolik yuz berdi.");
        }
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };
    fetchRegions();
  }, []);
  const handleRegionChange = async (event) => {
    const selectedRegionId = event.target.value;
    setSelectedRegion(selectedRegionId);
    try {
      const response = await fetch(districtsURL);
      if (response.ok) {
        const data = await response.json();
        console.log(data, "asd");
        
        const regionDistricts = data.filter(
          (district) => district.region_id === Number(selectedRegionId)
        );
        setDistricts(regionDistricts);
        console.log(regionDistricts);
      } else {
        console.error("Tumanlar ma'lumotini olishda xatolik yuz berdi.");
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
    setSelectedDistrict("");
  };
  console.log(districts, selectedRegion)
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    if (name === "age") {
      let parts = value.split(".");
      if (parts.length === 3) {
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parts[2].replace(/\D/g, "");
        const currentYear = new Date().getFullYear();
        if (day > 31) parts[0] = "31";
        if (day < 1) parts[0] = "01";
        if (month > 12) parts[1] = "12";
        if (month < 1) parts[1] = "01";
        if (year.length === 4) {
          let fullYear = parseInt(year, 10);
          if (fullYear < 1900) {
            parts[2] = "1900";
          } else if (fullYear > currentYear) {
            parts[2] = currentYear.toString();
          } else {
            parts[2] = year;
          }
        } else {
          parts[2] = year;
        }

        newValue = parts.join(".");
      }
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const validateDate = (date) => {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = date.match(regex);
    if (!match) return "Sana formati noto‘g‘ri! DD.MM.YYYY kiriting.";
    let [_, day, month, year] = match;
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    if (day < 1 || day > 31)
      return "Kun faqat 01-31 oralig‘ida bo‘lishi kerak!";
    if (month < 1 || month > 12)
      return "Oy faqat 01-12 oralig‘ida bo‘lishi kerak!";
    if (year < 1900 || year > currentYear)
      return `Yil 1900 va ${currentYear} oralig‘ida bo‘lishi kerak!`;

    return "";
  };
  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Ism kiritish shart!";
    if (!formData.surname.trim()) errors.surname = "Familiya kiritish shart!";
    if (!formData.username.trim())
      errors.username = "Foydalanuvchi nomi kiritish shart!";
    // if (!formData.phone_number.trim() || formData.phone_number.includes("_"))
    //   errors.phone_number = "To'liq telefon raqamini kiriting!";
    // if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
    //   errors.email = "Yaroqli email kiriting!";
    if (!formData.age.trim() || formData.age.includes("_")) {
      errors.age = "Tug'ilgan sanani to'liq kiriting!";
    } else {
      let ageError = validateDate(formData.age);
      if (ageError) errors.age = ageError;
    }
    if (!selectedRegion) errors.region = "Viloyatni tanlang!";
    if (!selectedDistrict) errors.district = "Tuman tanlash shart!";
    if (formData.password.length < 6)
      errors.password = "Parol kamida 6 ta belgi bo'lishi kerak!";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${api}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          province: selectedRegion,
          district: selectedDistrict,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/login");
        setSuccessM(true);
        setTimeout(() => {
          setSuccessM(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        alert("Xatolik yuz berdi: " + (errorData.message || "Noma'lum xato"));
      }
    } catch (error) {
      alert("Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async () => {
    setLoading(true);
    const res = await fetch(`${api}/send-sms/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (res.ok) setStep(2);
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setSmsErr(""); // Oldingi xatolikni tozalash

    try {
      const res = await fetch(`${api}/verify-sms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: code.join("") }), // Massivni stringga aylantirish
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setSmsErr(data.message || "Sms kodi xato!");
      }
    } catch (error) {
      setSmsErr("Tarmoq xatosi! Qayta urinib ko‘ring.");
    }

    setLoading(false);
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  window.document.title = "Ro'yxatdan o'tish - Edu Mark";

  return (
    <section id="signup-section">
      <div className="section-header">
        <h1>
          <span>Prezident Maktablariga</span> Qabul – Yangi Avlod Iqtidorlari
          Uchun Ilk Qadam
        </h1>
        <p>Biz bilan birga o'rganing va muvaffaqiyatga erishing.</p>
      </div>
      <div className="signup-container">
        <h1>Ro'yxatdan o'tish</h1>
        <div className="line"></div>
        {step === 1 && (
          <div className="steps">
            <h2>Telefon raqamingizni kiriting</h2>
            <InputMask
              mask="+\9\9\8 (99) 999-99-99"
              placeholder="Telefon raqami"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            >
              {(inputProps) => <input {...inputProps} type="text" />}
            </InputMask>
            <div className="forgot-pass">
              <p>
                Agar siz ro'yxatdan o’tgan bolsangiz{" "}
                <Link to="/login">shu yerni bosing</Link>
              </p>
              {/* <Link to="#">Parolni unutdim?</Link> */}
            </div>
            <div className="to-right">
              <button
                disabled={loading}
                className="bg-blue-500 text-white p-2 mt-2 w-full"
                onClick={sendSMS}
              >
                {loading ? "Kod yuborilmoqda..." : "Kod yuborish"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="steps">
            <h2>SMS kodni kiriting</h2>
            <div className="code-field">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className=""
                  value={digit}
                  placeholder="*"
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
            <div className="to-right mt-4">
              <button type="button" id="back" onClick={() => setStep(1)}>
                Ortga
              </button>
              <button
                disabled={loading}
                className=""
                onClick={verifyCode}
              >
                {loading ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
              </button>
            </div>
            {smsErr && <p id="sms-err">{smsErr}</p>}
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="content">
              <div className={`input-row ${errors.name ? "err-border" : ""}`}>
                <input
                  type="text"
                  placeholder="Ism"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className={`input-row ${errors.surname ? "err-border" : ""}`}>
                <input
                  type="text"
                  placeholder="Familiya"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                />
                {errors.surname && (
                  <span className="error">{errors.surname}</span>
                )}
              </div>
              <div className={`input-row ${errors.username ? "err-border" : ""}`}>
                <input
                  type="text"
                  placeholder="Foydalanuvchi nomi"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <span className="error">{errors.username}</span>
                )}
              </div>
              {/* <div className={`input-row ${errors.age ? "err-border" : ""}`}>
                <InputMask
                  mask="+\9\9\8 (99) 999-99-99"
                  placeholder="Telefon raqami"
                  name="phone_number"
                  defaultValue={phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone_number: e.target.value }))
                  }
                >
                  {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
                {errors.phone_number && (
                  <span className="error">{errors.phone_number}</span>
                )}
              </div> */}
              <div className={`input-row ${errors.age ? "err-border" : ""}`}>
                <InputMask
                  mask="99.99.9999"
                  placeholder="DD.MM.YYYY"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                >
                  {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
                {errors.age && <span className="error">{errors.age}</span>}
              </div>

              <div className={`input-row ${errors.email ? "err-border" : ""}`}>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className={`input-row ${errors.password ? "err-border" : ""}`}>
                <input
                  type="password"
                  placeholder="Parol"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <span className="error">{errors.password}</span>
                )}
              </div>
              <div className={`input-row ${errors.gender ? "err-border" : ""}`}>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Erkak</option>
                  <option value="female">Ayol</option>
                </select>
                {errors.gender && (
                  <span className="error">{errors.gender}</span>
                )}
              </div>
              <div className={`input-row ${errors.region ? "err-border" : ""}`}>
                <select
                  id="regionSelect"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                >
                  <option value="" disabled>
                    Viloyatni tanlang
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name_uz.replace(/�/g, "'")}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <span className="error">{errors.region}</span>
                )}
              </div>
              <div
                className={`input-row ${
                  errors.district ? "err-border" : ""
                }`}
              >
                <select
                  id="districtSelect"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                >
                  <option value="" disabled>
                    Tumanni tanlang
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name_uz}>
                      {district.name_uz.replace(/�/g, "'")}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <span className="error">{errors.district}</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Ro’yxatdan o’tilmoqda..." : "Ro’yxatdan o’tish"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Signup;
