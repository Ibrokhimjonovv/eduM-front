import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./schools-tests.scss";
import { api } from "../../App";
import Loading from "../loading/loading";

const SchoolsTests = () => {
  const [schools, setSchools] = useState([]);
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, testsResponse] = await Promise.all([
          fetch(`/category-test-count/`),
          fetch(`/tests_title/`),
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
      } catch (error) {
        setError(error.message);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLink = (text) => {
    return text
      .replace(/'/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  return (
    <div className="schools-tests" id="schools-tests">
      <h1>“<span>Rasmiy</span> Tayyorlov Testi”</h1>
      <h2>Prezident Maktablariga Eng Sifatli Tayyorlov Testlari</h2>
      {loading && <div className="test-loading"> <div className="test-spinner"></div> Maktablar yuklanmoqda... </div>}
      {errors && <p>Xatolik: {errors}</p>}
      <div className="schools-cards">
        {schools.map((school, index) => (
          <Link to={`schools/${formatLink(school.category_title)}`} key={index}>
            <div className="school-card">
              <img src={`${school?.category_img}`}
                alt={school.category_title} />
              <p>{school.category_title}</p>
              <span>{school.test_count} ta</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SchoolsTests;
