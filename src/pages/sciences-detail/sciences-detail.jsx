import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./sciences-detail.scss";
import { api } from "../../App";
import Loading from "../../components/loading/loading";

const SciencesDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [sciences, setSciences] = useState([]);
  const [allSciences, setAllSciences] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [time, setTime] = useState(5);
  const [questionCount, setQuestionCount] = useState(20);
  const [checkedTopics, setCheckedTopics] = useState([]);
  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sciencesResponse, departmentsResponse] = await Promise.all([
          fetch(`${api}/fan/`),
          fetch(`${api}/test_thema/`),
        ]);
        if (!sciencesResponse.ok || !departmentsResponse.ok) {
          throw new Error("Ma'lumotlarni olishda xatolik yuz berdi.");
        }
        const sciencesData = await sciencesResponse.json();
        const departmentsData = await departmentsResponse.json();
        const formattedName = formatLink(name);
        const fdata = sciencesData.filter(
          (e) => formatLink(e.title) === formattedName
        );
        setSciences(fdata);
        setAllSciences(
          sciencesData.filter((e) => formatLink(e.title) !== formattedName)
        );
        if (fdata.length > 0) {
          const scienceId = Number(fdata[0]?.id);
          const depOfScience = departmentsData.filter(
            (e) => Number(e.fan) === scienceId
          );
          setDepartments(depOfScience);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api, name]);
  const handleTopicChange = (topicId) => {
    setCheckedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkedTopics.length === 0) {
      alert("Iltimos, kamida bitta mavzu tanlang!");
      return;
    }
    localStorage.setItem("checkedTopics", JSON.stringify(checkedTopics));
    navigate(`/sciences/${name}/test/${questionCount}/${time}`);
  };

  const reverseFormatLinkAndCapitalize = (text) => {
    return text
      .replace(/-/g, " ") // "-" belgisini bo'sh joyga almashtiramiz
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) return <Loading />;
  return (
    <div id="science-detail">
      <div className="science-detail-container">
        <h1>{reverseFormatLinkAndCapitalize(name)} testi</h1>
        <div className="detail-inner">
          <h2>Test sozlamalari</h2>
          <div className="linee"></div>
          {sciences.length > 0 ? (
            <>
              {sciences.map((item, index) => (
                <form onSubmit={handleSubmit} key={index}>
                  <div className="input-row">
                    <span>Tanlang</span>
                    <select
                      name=""
                      id=""
                      onChange={(e) => {
                        if (e.target.value) {
                          window.location.href = `/sciences/${formatLink(
                            e.target.value
                          )}`;
                        }
                      }}
                    >
                      <option value={item.title}>{item.title}</option>
                      {allSciences.map((science, index) => (
                        <option key={index} value={science.title}>
                          {science.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-row">
                    <span>Mavzular</span>
                    <div className="themes">
                      {departments.length > 0 ? (
                        departments.map((dep, index) => (
                          <div className="theme-row" key={index}>
                            <input
                              type="checkbox"
                              id={`input-${index}`}
                              checked={checkedTopics.includes(dep.id)}
                              onChange={() => handleTopicChange(dep.id)}
                            />
                            <label htmlFor={`input-${index}`}>
                              {dep.title}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>Mavzular mavjud emas!</p>
                      )}
                    </div>
                  </div>
                  <div className="input-row">
                    <span>Davomiylik (vaqt)</span>
                    <label htmlFor="" className="replaced-input">
                      {time} daqiqa
                      <div className="buttons">
                        <span onClick={() => setTime(Math.max(5, time - 5))}>
                          -
                        </span>
                        <span>5</span>
                        <span onClick={() => setTime(Math.min(60, time + 5))}>
                          +
                        </span>
                      </div>
                    </label>
                    <input
                      className="d-none"
                      type="text"
                      value={time}
                      readOnly
                    />
                  </div>
                  <div className="input-row">
                    <span>Savollar soni</span>
                    <label htmlFor="" className="replaced-input">
                      {questionCount} ta
                      <div className="buttons">
                        <span
                          onClick={() =>
                            setQuestionCount(Math.max(5, questionCount - 5))
                          }
                        >
                          -
                        </span>
                        <span>5</span>
                        <span
                          onClick={() =>
                            setQuestionCount(Math.min(30, questionCount + 5))
                          }
                        >
                          +
                        </span>
                      </div>
                    </label>
                    <input
                      className="d-none"
                      type="text"
                      value={questionCount}
                      readOnly
                    />
                  </div>
                  <div className="input-row">
                    <button type="submit">Boshlash</button>
                  </div>
                </form>
              ))}
            </>
          ) : (
            <div style={{textAlign: 'center'}}>Fanlar mavjud emas!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SciencesDetail;
