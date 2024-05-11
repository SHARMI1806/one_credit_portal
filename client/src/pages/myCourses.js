import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody } from "@windmill/react-ui";
import RoundIcon from "../components/RoundIcon";
import { SiCoursera } from "react-icons/si";

function Mycourse() {
  const rollno = sessionStorage.getItem("rollno");
  const [assignedCourse, setAssignedCourse] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(
          `http://localhost:5555/getmycourse/${rollno}`
        );
        const data = await response.json();
        setAssignedCourse(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchCourse();
  }, []);

  return (
    <>
      <PageTitle>My One Credit Course History</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {assignedCourse &&
          assignedCourse.map((course, index) => (
            <Card key={index}>
              <CardBody className="flex flex-col items-center">
                <RoundIcon
                  icon={SiCoursera}
                  iconColorClass="text-orange-500 dark:text-orange-100"
                  bgColorClass="bg-orange-100 dark:bg-orange-500"
                  className="mx-auto mb-4"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {course.coursename}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed Semester: {course.completed_semester}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
      </div>
    </>
  );
}

export default Mycourse;
