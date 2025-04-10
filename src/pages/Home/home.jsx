import React, { useContext } from "react";
import ForStudents from "../../components/for-students/for-students";
import High_rating from "../../components/high-rating/high-rating";
// Style
import "./home.scss";

// Images
import Data from "../../components/datas/data";
import TestAbout from "../../components/test-section/test-about";
import TestsList from "../testing/test-list";
import SciencesPage from "../sciences/sciences-page";
import AboutTestSchool from "../about-test-school/about-test-school";
import SchoolsTests from "../../components/schools-tests/schools-tests";
import PaidCourses from "../../components/paid-courses/paid_courses";
import Contact from "../contact/contact";
import TeachersTest from "../../components/teachers-test/teachers-test";

const Home = () => {
  window.document.title = "Bosh sahifa";
  return (
    <div>
      <ForStudents />
      <SchoolsTests />
      <TeachersTest />
      <High_rating />
      {/* <TestsList /> */}
      <Data />
      <PaidCourses/>
      {/* <TestAbout /> */}
      {/* <SciencesPage /> */}
      <Contact />
    </div>
  );
};

export default Home;
