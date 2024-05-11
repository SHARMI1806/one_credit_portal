import React, { useState, useEffect } from "react";
import InfoCard from "../components/Cards/InfoCard";
import PageTitle from "../components/Typography/PageTitle";
import RoundIcon from "../components/RoundIcon";
import { GiReceiveMoney } from "react-icons/gi";
import { SiUnacademy, SiCoursera, SiNextra } from "react-icons/si";

function Dashboard() {
  const [totalcoursecompleted, setTotalCourseCompleted] = useState(null);
  const [totalcredits, settotalcredits] = useState(null);
  const [totaldepartmentcount, setTotaldepartmentcount] = useState(null);
  const rollno = sessionStorage.getItem("rollno");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    fetchOverallcompletedcourseCount();
    fetchOveralldepartmentCount();
  }, []);

  const fetchOverallcompletedcourseCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5555/mycoursecount/${rollno}`
      );
      const data = await response.json();
      setTotalCourseCompleted(data.count);
      settotalcredits(data.count);
    } catch (error) {
      console.error("Error fetching overall count:", error);
    }
  };

  const fetchOveralldepartmentCount = async () => {
    try {
      const response = await fetch("http://localhost:5555/departmentcount");
      const data = await response.json();
      setTotaldepartmentcount(data.totaldepartment);
    } catch (error) {
      console.error("Error fetching overall count:", error);
    }
  };

  return (
    <>
      <PageTitle>Home Page</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Display Total Course Completed Card */}
        {role === '2' && (
          <InfoCard title="Total Course Completed" value={totalcoursecompleted+2}>
            <RoundIcon
              icon={SiNextra}
              iconColorClass="text-orange-500 dark:text-orange-100"
              bgColorClass="bg-orange-100 dark:bg-orange-500"
              className="mr-4"
            />
          </InfoCard>
        )}

        {/* Display Available Credits Card */}
        {role === '2' && (
          <InfoCard title="Available Credits" value={totalcredits+2}>
            <RoundIcon
              icon={GiReceiveMoney}
              iconColorClass="text-purple-500 dark:text-purple-100"
              bgColorClass="bg-purple-100 dark:bg-purple-500"
              className="mr-4"
            />
          </InfoCard>
        )}

        {/* Display Total Departments Card */}
        {role === '1' && (
          <InfoCard title="Total Departments" value={totaldepartmentcount}>
            <RoundIcon
              icon={SiUnacademy}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>
        )}

        {/* Display Total One Credit Courses Card */}
        {role === '1' && (
          <InfoCard title="Total One Credit Courses" value="21">
            <RoundIcon
              icon={SiCoursera}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        )}
      </div>
    </>
  );
}

export default Dashboard;
