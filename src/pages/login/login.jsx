import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../App";
import { AccessContext } from "../../AccessContext";
import "./login.scss";
import Success from "../../components/success-message/success";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAccess, setSuccess, success, setToken, successM } = useContext(AccessContext);
  const navigate = useNavigate();
  window.document.title = "Kirish - Edu Mark";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username: username,
      password: password,
      last_login: new Date().toISOString(),
    };
    setLoading(true);
    try {
      const response = await fetch(`${api}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error("Foydalanuvchi nomi yoki parol xato kiritildi!");
      }
      const accessToken = result.access || result.refresh;
      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      setSuccess("Muvaffaqiyatli kirildi");
      setError(null);
      setAccess(true);
      navigate("/", { state: { success: "Muvaffaqiyatli kirildi" } });
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <section id="login-section">
      <div className="section-header">
        <h1>
        Prezident Maktablariga Qabul – Yangi Avlod Iqtidorlari Uchun Ilk <span>Qadam</span>
        </h1>
        <p>Biz bilan birga o'rganing va muvaffaqiyatga erishing.</p>
      </div>
      {successM && <Success text="Muvaffaqiyatli ro'yxatdan o'tdingiz!"/>}
      <div className="login-container">
        <h1>Kirish</h1>
        <div className="line"></div>
        <form onSubmit={handleSubmit}>
          <div className="content">
            <div className="left">
              <input
                type="text"
                placeholder="Foydalanuvchi nomi"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Parol"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div class="alert" role="alert">
              {error}
            </div>
          )}

          {success && <div className="success-message">{success}</div>}
          <div className="forgot-pass">
            <p>
              Agar siz ro'yxatdan o'tmagan bo'lsangiz: <Link to="/signup">Ro'yxatdan o'tish</Link>
            </p>
            {/* <Link to="#">Parolni unutdim?</Link> */}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
