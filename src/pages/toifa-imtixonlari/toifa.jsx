import React, { useContext, useEffect, useState } from 'react';
import "./toifa.scss";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AccessContext } from '../../AccessContext';
import { api } from '../../App';

const Toifa = () => {
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
    const [selectedFanName, setSelectedFanName] = useState(null);
    const [success, setSuccess] = useState(false);
    // const [toifaFanlari, setToifaFanlari] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [sciencesResponse, testsResponse] = await Promise.all([
                    fetch(`${api}/category/`),
                    fetch(`${api}/tests/`),
                ]);

                if (!sciencesResponse.ok || !testsResponse.ok) {
                    throw new Error("Network error");
                }

                const sciencesData = await sciencesResponse.json();
                const testsData = await testsResponse.json(); // 🆕 Testlar ma’lumotlari

                setSchools(sciencesData);
                setTests(testsData); // 🆕 Testlarni saqlash 
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatLink = (text) => {
        return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
    };

    const matchedSchool = schools.find(
        (school) => formatLink(school.title) === name
    );

    // 🆕 Ushbu kategoriya bilan bog'liq testlarni olish
    const toifaFanlari = tests.filter(
        (test) => test.category === matchedSchool?.id
    );

    return (
        <div className='toifa'>
            <h1>
                O'zingizni toifa imtixoni uchun shu yerda sinang!
            </h1>
            <div className="table-cont">
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Fan nomi</th>
                            {/* <th>Narxi</th> */}
                            <th>Tili</th>
                            <th>Vaqt</th>
                            <th>Boshlash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ? (
                                <tr>
                                    <td colSpan="5">Yuklanmoqda...</td>
                                </tr>
                            ) : (
                                toifaFanlari.length > 0 ? (
                                    toifaFanlari.map((test, testIndex) => (
                                        <tr key={test.id}>
                                            <td>{testIndex + 1}</td>
                                            <td>{test.title}</td>
                                            <td>{test.language}</td>
                                            <td>{test.time}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedTestId(test.id);
                                                        setSelectedTestPrice(test.price);
                                                        setSelectedFanName(test.title)
                                                        setMod(test.id); // alohida modal uchun ID saqlaymiz
                                                    }}
                                                >
                                                    Testni boshlash
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Toifa fanlari topilmadi.</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>


                    {mod && <div className="m-shape"></div>}
                    <div className={`opened-modal ${mod && "active"}`}>
                        <p>
                            Kurs narxi:{" "}
                            {new Intl.NumberFormat("de-DE").format(selectedTestPrice) || 0} so'm
                        </p>
                        {profileData.balance < selectedTestPrice ? (
                            <div className="balance-popup">
                                <p style={{ color: "red" }}>
                                    Sizda yetarli mablag' mavjud emas!
                                </p>
                                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMod(null);
                                            setSelectedTestId(null);
                                            setSelectedTestPrice(null);
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
                                            setMod(null);
                                            setSelectedTestId(null);
                                            setSelectedTestPrice(null);
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
                                                        navigate(`/toifa/${formatLink(selectedFanName)}/fan/${selectedTestId}`);
                                                    } else {
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
                </table>
            </div>
        </div>
    )
}

export default Toifa