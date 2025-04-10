import React, { useState, useEffect, useContext } from "react";
import "./about-test-school.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../App";
import Loading from "../../components/loading/loading";
import Success from "../../components/success-message/success";
import { AccessContext } from "../../AccessContext";

const AboutTestSchool = () => {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [tests, setTests] = useState([]); // 🆕 Testlar uchun state
  const [errors, setError] = useState(null);
  const { name } = useParams();
  const [mod, setMod] = useState(false);
  const navigate = useNavigate();
  const { access, startTest, setStartTest, profileData, setProfileData } =
    useContext(AccessContext);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedTestPrice, setSelectedTestPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, testsResponse] = await Promise.all([
          fetch(`${api}/category-test-count/`),
          fetch(`${api}/tests_title/`),
        ]);
  
        if (!categoriesResponse.ok || !testsResponse.ok) {
          throw new Error("Network error");
        }
  
        const categoriesData = await categoriesResponse.json();
        const testsData = await testsResponse.json();
  
        // Agar testsData.tests mavjud bo'lsa, undan foydalanamiz, aks holda bo'sh massiv
        const testsArray = testsData.tests || [];
  
        // Har bir category uchun unga tegishli testlarni ajratib olish
        const enrichedCategories = categoriesData.slice(0, 4).map(category => {
          const categoryTests = testsArray.filter(
            test => test.category === category.id
          );
          
          return {
            ...category,
            tests: categoryTests,
            testsCount: categoryTests.length
          };
        });
  
        setSchools(enrichedCategories);
        setTests(testsArray);
      } catch (error) {
        setError(error.message);
        setSchools([]);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };

  const reverseFormatLinkAndCapitalize = (text) => {
    return text
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const matchedSchool = schools.find(
    (school) => formatLink(school.category_title) === name
  );

  // 🆕 Ushbu kategoriya bilan bog'liq testlarni olish
  const relatedTests = tests.filter(
    (test) => test.category === matchedSchool?.id
  );

  const [success, setSuccess] = useState(false);

  if (loading) return <Loading />;

  return (
    <div className="about-test-school">
      {success && <Success text={errors} />}
      <h1>
        Siz hozir testni boshlayapsiz. Tayyormisiz? Urinishlar tugashidan oldin
        harakat qiling!
      </h1>
      <div className="schools-cards">
        {schools.map((school, index) => (
          <Link to={`/schools/${formatLink(school.category_title)}`} key={index}>
            <div
              className={`school-card ${name === formatLink(school.category_title) ? "active" : ""
                } `}
            >
              <img src={`${school?.category_img}`} alt={school.category_title} />
              <p>{school.category_title}</p>
              <span>{school.test_count} ta</span>
            </div>
          </Link>
        ))}
      </div>
      {matchedSchool ? (
        <>
          <h2>{reverseFormatLinkAndCapitalize(name)} uchun test sinovi</h2>
          <p>
            {reverseFormatLinkAndCapitalize(name)} imtihon topshirish uchun
            ajratilgan kvotalar, talablar va qabul jarayoni haqida batafsil
            ma’lumotni shu yerda topishingiz mumkin. Maktablar ro‘yxati va
            ularga ajratilgan o‘rinlar bilan tanishing hamda sinov testlarini
            yechib, o‘z bilimingizni tekshirib ko‘ring!
          </p>
          <div className="table-cont">
            <table>
              <thead>
                <tr>
                  <th>Test nomi</th>
                  {/* <th>Narxi</th> */}
                  <th>Ball</th>
                  <th>Vaqt</th>
                  <th>Boshlash</th>
                </tr>
              </thead>
              <tbody>
                {relatedTests.length > 0 ? (
                  relatedTests.map((test, testIndex) => (
                    <tr key={testIndex}>
                      <td>{test.title}</td>
                      <td>{test.score}</td>
                      <td>{test.time}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTestId(test.id);
                            setSelectedTestPrice(test.price);
                            setMod(true);
                          }}
                        >
                          Testni boshlash
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Bu maktab uchun test topilmadi.</td>
                  </tr>
                )}
              </tbody>

              {/* Modal va boshqa <div> lar tbody tashqarisida bo'lishi kerak */}
              {/* {mod && (
                <> */}
              {
                mod && <div className="m-shape"></div>
              }
              <div className={`opened-modal ${mod ? "active" : ""}`}>
                <p>
                  Kurs narxi:{" "}
                  {new Intl.NumberFormat("de-DE").format(selectedTestPrice) || 0} so'm
                </p>
                {profileData.balance < selectedTestPrice ? (
                  <div className="balance-popup">
                    <p style={{ color: "red" }}>Sizda yetarli mablag' mavjud emas!</p>
                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTestId(null);
                          setSelectedTestPrice(null);
                          setMod(false);
                        }}
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/top-up-balance")}
                      >
                        Balansni oshirish
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>Haqiqatdan ham kursni boshlamoqchimisiz?</p>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTestId(null);
                          setSelectedTestPrice(null);
                          setMod(false);
                        }}
                      >
                        Bekor qilish
                      </button>
                      {access ? (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("accessToken");
                              if (!token) {
                                alert("Iltimos, tizimga kiring.");
                                return;
                              }

                              setProfileData(prev => ({
                                ...prev,
                                balance: prev.balance - selectedTestPrice
                              }));

                              const response = await fetch(`${api}/start-test/`, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  test_id: selectedTestId,
                                }),
                              });

                              if (response.ok) {
                                localStorage.setItem("startTest", selectedTestId);
                                setStartTest(selectedTestId);
                                navigate(`/school/${name}/test/${selectedTestId}`);
                              } else {
                                // Revert balance if request fails
                                setProfileData(prev => ({
                                  ...prev,
                                  balance: prev.balance + selectedTestPrice
                                }));
                                const errorData = await response.json();
                                setError(errorData.detail);
                                setSuccess(true);
                                setTimeout(() => {
                                  setSuccess(false);
                                }, 5000);
                              }
                            } catch (error) {
                              setError("Tarmoq xatosi yuz berdi");
                              setSuccess(true);
                            }
                          }}
                        >
                          Testni boshlash
                        </button>
                      ) : (
                        <Link to="/login">Kirish</Link>
                      )}
                    </div>
                  </>
                )}
              </div>
              {/* </> */}
              {/* )} */}

            </table>
          </div>
        </>
      ) : (
        <h2>Bunday maktab topilmadi: {reverseFormatLinkAndCapitalize(name)}</h2>
      )}
    </div>
  );
};

export default AboutTestSchool;
