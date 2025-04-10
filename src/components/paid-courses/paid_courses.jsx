import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Global Api
import { api } from "../../App";

// Style
import "./paid_courses.scss";

const PaidCourses = () => {
  const [sciences, setSciences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sciencesResponse = await fetch(`${api}/fan/`);
        if (!sciencesResponse.ok) {
          throw new Error("Network error");
        }
        const sciencesData = await sciencesResponse.json();
        setSciences(sciencesData);

        console.log(sciences);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [api]);

  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };

  const data = [
    {
      image:
        "https://www.figma.com/file/4YhRxQJ08I87UzgBVKolGq/image/e9f6f914ff96905cfa66f84d9884c3f30c15423a",
      fan_name: "Randomizatsiya testlar",
      fan_description: "Eng sara saralangan testlar",
      amenities: [
        "Barcha fanlar",
        "Real muhit",
        "O’zingizni sinash uchun zo’r imkoniyat bepul",
      ],
      link: "#",
    },
    {
      image:
        "https://www.figma.com/file/4YhRxQJ08I87UzgBVKolGq/image/e9f6f914ff96905cfa66f84d9884c3f30c15423a",
      fan_name: "Sara testlar",
      fan_description: "30 ta test savolidan iborat blokli testlar",
      amenities: [
        "DTM standartlari ",
        "Professional tomonidan tuzilgan",
        "Blokli test topshirish bepul",
      ],
      link: sciences.length > 0 ? `/sciences/${formatLink(sciences[0].title)}` : "#",
    },
  ];

  return (
    <section id="paid-courses-section">
      <h1>
        <span>Bepul</span> testlar
      </h1>
      <div className="paid-courses-container">
        {data.map((item, index) => (
          <div className="container-item" key={index}>
            <div className="item-header">
              <img src={item.image} alt="" />
              <div className="item-text">
                <h2>{item.fan_name}</h2>
                <p>{item.fan_description}</p>
              </div>
            </div>
            <ul>
              {item.amenities.map((amenity, i) => (
                <li key={i}>
                  <img
                    src="https://www.figma.com/file/4YhRxQJ08I87UzgBVKolGq/image/3e1e7bd21622434cb4da159751b4b4d97e89fae6"
                    alt=""
                  />
                  <p>{amenity}</p>
                </li>
              ))}
            </ul>
            <Link to={item.link}>
              Boshlash
              <img
                src="https://s3-alpha-sig.figma.com/img/d96c/a1f9/b15517b4737ade14ffba3adf5bc826ec?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tu0hJEHVpFQ5i30zyol9bWi8WFj7O-6qqE0kP~8DyUYcdksEqlZRsMba6kRssm7bayZSXSKF5j84PeJqN2~Q9uiC9txBq1bs0mMOd4r36vfN8A659shnyKosEYHOkS-sqs~dW0m-eZQFsuCpgL~wOoAyMPKZIxypBTEGTym8fxrXRc~uZ-dAK1v9QgYTGaqwU~JGM-Onc3Yd1~0gLDCdM6qKGGK5EK1xCGCNf964CzpNtDEeapenzLx8aPt0Cxteyzo-u1bNualb6HMb~hpVo0SkhK~Ydy6nbyK5sOwrXYJJpGPIpncsa2DSh21NYPGvDi4TpIgOAjfNRpHQcD0A6w__"
                alt=""
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaidCourses;
