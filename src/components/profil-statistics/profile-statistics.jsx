import React, { useEffect, useState, useContext } from "react";
import { Line } from "react-chartjs-2";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { api } from "../../App";
import { AccessContext } from "../../AccessContext";
import "./profile-statistics.scss";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ProfileStatistics = () => {
  const { profileData } = useContext(AccessContext);
  const [sciences, setSciences] = useState([]);
  const [tests, setTests] = useState([]);
  const [testActivityLog, setTestActivityLog] = useState([]);
  const [loginActivityLog, setLoginActivityLog] = useState([]);
  const [selectedScience, setSelectedScience] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

  useEffect(() => {
    const fetchSciences = async () => {
      try {
        const response = await fetch(`${api}/sciences/`);
        if (!response.ok) throw new Error("Fanlar ro'yxatini olishda xatolik!");
        const data = await response.json();
        setSciences(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchSciences();
  }, []);
  useEffect(() => {
    const fetchLoginActivity = async () => {
      try {
        const response = await fetch(`${api}/users/`);
        if (!response.ok) throw new Error("Login faolligini olishda xatolik!");
        const data = await response.json();
        const currentUser = data.find(
          (user) => Number(user.id) === Number(profileData.id)
        );
        if (!currentUser) {
          console.error("Foydalanuvchi topilmadi.");
          return;
        }
        const loginDate = currentUser.last_login.split("T")[0];
        const formattedLoginActivityLog = [
          {
            date: loginDate,
            count: 1,
          },
        ];
        const year = new Date(loginDate).getFullYear();
        setLoginActivityLog(formattedLoginActivityLog);
        setAvailableYears((prevYears) =>
          prevYears.includes(year) ? prevYears : [...prevYears, year]
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchLoginActivity();
  }, [profileData.id]);

  useEffect(() => {
    if (selectedScience) {
      const fetchTests = async () => {
        try {
          const response = await fetch(
            `${api}/tests/?science=${selectedScience}`
          );
          if (!response.ok) throw new Error("Testlarni olishda xatolik!");
          const data = await response.json();
          setTests(data);
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchTests();
    } else {
      setTests([]);
    }
  }, [selectedScience]);

  useEffect(() => {
    const fetchTestStats = async () => {
      try {
        const response = await fetch(
          `${api}/statistics/?user=${profileData.id}`
        );
        if (!response.ok) throw new Error("Statistikani olishda xatolik!");
        const data = await response.json();
        const userTests = data.filter(
          (test) => Number(test.user) === Number(profileData.id)
        );
        const formattedTestActivityLog = userTests.map((test, index) => {
          const timeOffset =
            parseFloat(test.total_time_taken.split(":")[2]) || 0; // Use seconds as offset
          return {
            date: test.created_at.split("T")[0],
            scorePercentage: test.percentage_correct + timeOffset * 0.01, // Offset based on seconds
            testName: test.test_title,
            totalTime: test.total_time_taken,
            totalQuestions: test.total_questions,
            correctAnswers: test.correct_answers,
            incorrectAnswers: test.incorrect_answers,
            unansweredQuestions: test.unanswered_questions,
          };
        });
        setTestActivityLog(formattedTestActivityLog);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTestStats();
  }, [profileData.id]);
  const groupedData = testActivityLog.reduce((acc, log) => {
    if (!acc[log.testName]) {
      acc[log.testName] = [];
    }
    acc[log.testName].push(log);
    return acc;
  }, {});
  const lineChartData = {
    labels: testActivityLog.map((log) => log.date),
    datasets: Object.keys(groupedData).map((testName, index) => {
      const testLogs = groupedData[testName];
      return {
        label: testName,
        data: testLogs.map((log) => ({
          x: log.date,
          y: log.scorePercentage,
          additionalInfo: log,
        })),
        borderColor: `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "black",
        pointHoverBorderWidth: 2,
        spanGaps: false,
      };
    }),
  };
  return (
    <div className="profile-statistics">
      <div className="line-chart">
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: "Foiz (%)",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const pointData = tooltipItem.raw.additionalInfo;
                    return `${
                      pointData.testName
                    }: ${pointData.scorePercentage.toFixed(2)}%`;
                  },
                  afterBody: function (tooltipItem) {
                    const pointData = tooltipItem[0].raw.additionalInfo;
                    return [
                      `To‘g‘ri: ${pointData.correctAnswers} / ${pointData.totalQuestions}`,
                      `Vaqt: ${pointData.totalTime}`,
                    ];
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className="for-width">
        <div className="calendar-heatmap">
          <div className="year-filter">
            <label htmlFor="year-select">Faollik yili: </label>
            <select
              id="year-select"
              value={calendarYear}
              onChange={(e) => setCalendarYear(e.target.value)}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div style={{ position: "relative" }}>
            <CalendarHeatmap
              startDate={new Date(`${calendarYear}-01-01`)}
              endDate={new Date(`${calendarYear}-12-31`)}
              values={loginActivityLog.filter(
                (log) =>
                  new Date(log.date).getFullYear() === Number(calendarYear)
              )}
              classForValue={(value) => {
                if (!value) return "color-empty";
                if (value.count > 5) return "color-scale-4";
                if (value.count > 3) return "color-scale-3";
                if (value.count > 1) return "color-scale-2";
                return "color-scale-1";
              }}
              gutterSize={1}
              onMouseOver={(event, value) => {
                if (value && value.date) {
                  const rect = event.target.getBoundingClientRect();
                  setTooltip({
                    show: true,
                    x: rect.left + window.scrollX + rect.width / 2,
                    y: rect.top + window.scrollY - 30,
                    text: `Sana: ${value.date}, Urinishlar: ${value.count}`,
                  });
                }
              }}
              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
            />

            {/* {tooltip.show && (
              <div
                style={{
                  // position: "absolute",
                  // top: tooltip.y,
                  // left: tooltip.x,
                  background: "#0b0e1f",
                  display: 'flex',
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  pointerEvents: "none",
                  zIndex: 1000,
                  // transform: "translate(-50%, -100%)",
                }}
              >
                {tooltip.text}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatistics;
