import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import { api } from "../../App";
import InputMask from "react-input-mask";
import "./edit-profile.scss";
import Success from "../../components/success-message/success";
const regionsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";
const districtsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/districts.json";
const EditProfile = () => {
  const { access } = useContext(AccessContext);
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [profileData, setProfileData] = useState({});
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone_number: "",
    surname: "",
    email: "",
    password: "",
    age: "",
});
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(regionsURL);
        if (!response.ok)
          throw new Error("Viloyatlar ma'lumotini olishda xatolik yuz berdi.");
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };
    fetchRegions();
  }, []);
  useEffect(() => {
    const userProfile = async () => {
      try {
        const response = await fetch(`${api}/user-profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok)
          throw new Error("Foydalanuvchi ma'lumotlarini olishda xatolik.");
        const data = await response.json();
        setFormData({
          name: data.name || "",
          username: data.username || "",
          phone_number: data.phone_number || "",
          surname: data.surname || "",
          email: data.email || "",
          password: "",
          age: data.age || "",
          gender: data.gender || "",
        });
        setSelectedRegion(data.province || "");
        setSelectedDistrict(data.district || "");
        if (data.province) {
          fetchDistricts(data.province);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error.message);
      }
    };
    userProfile();
  }, [api]);
  const fetchDistricts = async (regionId) => {
    try {
      const response = await fetch(districtsURL);
      if (!response.ok)
        throw new Error("Tumanlar ma'lumotini olishda xatolik yuz berdi.");
      const data = await response.json();
      const regionDistricts = data.filter(
        (district) => district.region_id === regionId
      );
      setDistricts(regionDistricts);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  const handleRegionChange = (event) => {
    const selectedRegionId = event.target.value;
    setSelectedRegion(selectedRegionId);
    fetchDistricts(selectedRegionId);
    setSelectedDistrict("");
  };
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
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
    if (!formData.phone_number.trim() || formData.phone_number.includes("_"))
      errors.phone_number = "To'liq telefon raqamini kiriting!";
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
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      alert("Avval tizimga kiring!");
      navigate("/login");
      return;
    }
    try {
      let updatedData = {
        ...formData,
        province: selectedRegion,
        district: selectedDistrict,
      };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      const response = await fetch(`${api}/user-update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Xatolik yuz berdi: " + (errorData.message || "Noma’lum xato"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Tarmoq xatosi yuz berdi.");
    }
  };
  return (
    <section id="profile-section">
      {access ? (
        <div className="profile-container">
          {success && <Success text="Muvaffaqiyatli yangilandi!"/>}
          <h1 id="edit-profile-heading">Profilni taxrirlash</h1>
          <div className="edit-profile-content">
            <div className="left">
              <div className="edit-profile-container">
                <form onSubmit={handleSubmit}>
                  <div className="edit-content">
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
                      <input
                        type="text"
                        placeholder="Ism"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <span className="error">{errors.name}</span>
                      )}
                    </div>
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
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
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
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
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
                      <InputMask
                        mask="+\9\9\8 (99) 999-99-99"
                        placeholder="Telefon raqami"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                      >
                        {(inputProps) => <input {...inputProps} type="text" />}
                      </InputMask>
                      {errors.phone_number && (
                        <span className="error">{errors.phone_number}</span>
                      )}
                    </div>
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
                      <InputMask
                        mask="99.99.9999"
                        placeholder="DD.MM.YYYY"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      >
                        {(inputProps) => <input {...inputProps} type="text" />}
                      </InputMask>
                      {errors.age && (
                        <span className="error">{errors.age}</span>
                      )}
                    </div>

                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <span className="error">{errors.email}</span>
                      )}
                    </div>
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
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
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="male">Erkak</option>
                        <option value="female">Ayol</option>
                      </select>
                      {errors.region && (
                        <span className="error">{errors.region}</span>
                      )}
                    </div>
                    <div
                      className={`input-row ${errors.age ? "err-border" : ""}`}
                    >
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
                        errors.age && errors.age ? "err-border" : ""
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
                  <button type="submit">Saqlash</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Ba shou na xoii</h1>
      )}
    </section>
  );
};

export default EditProfile;
