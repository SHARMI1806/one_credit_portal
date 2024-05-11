import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label, Select } from "@windmill/react-ui";
import { Button } from "@windmill/react-ui";


function Forms() {
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedCourse1, setSelectedCourse1] = useState("");
  const [selectedCourse2, setSelectedCourse2] = useState("");
  const [honoursMinors, setHonoursMinors] = useState(""); // New state for honours/minors registration
  const [courses, setCourses] = useState([]);
  const [openElective, setopenElective] = useState("");
  const [addonCourse, setAddonCourse] = useState("");
  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const handleAcademicSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepartment(selectedDepartment);
    // Find the selected department object
    const departmentObj = Department.find(
      (dep) => dep.department === selectedDepartment
    );
    // Set courses for the selected department
    setCourses(departmentObj ? departmentObj.courses : []);
  };

  const handleCourseChange = (courseIndex, courseValue) => {
    if (courseIndex === 1) {
      setSelectedCourse1(courseValue);
    } else if (courseIndex === 2) {
      setSelectedCourse2(courseValue);
    }
  };

  const handleHonoursMinorsChange = (e) => {
    setHonoursMinors(e.target.value);
  };
  const handleopenElectiveChange = (e) => {
    setopenElective(e.target.value);
  };
  const handleAddonCourseChange = (e) => {
    setAddonCourse(e.target.value);
  };


  const handleSubmit = () => {
    // Logging all the input data
    console.log("Academic Year:", academicYear);
    console.log("Semester:", semester);
    console.log("Department:", department);
    console.log("Selected Course 1:", selectedCourse1);
    console.log("Selected Course 2:", selectedCourse2);
    console.log("Honours/Minors:", honoursMinors);
    console.log("Open Elective:", openElective);
    console.log("Addon Course:", addonCourse);
  };

  return (
    <>
      <PageTitle>Course Registration</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Roll No</span>
          <Input className="mt-1" placeholder="7376212AD197" />
        </Label>
        <Label className="mt-4">
          <span>Name</span>
          <Input className="mt-1" placeholder="Sharmilaa G C" />
        </Label>
    
          <div className="mt-4">
            <Label>Department</Label>
            <div className="mt-2">
              <Select
                className="mt-1"
                onChange={handleDepartmentChange}
                value={department}
              >
                <option value="">Select Department</option>
                {Department.map((dept, index) => (
                  <option key={index} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </Select>
            </div>
          </div>
  
          <div className="mt-4">
            <Label>Semester</Label>
            <div className="mt-2">
              {getSemesterOptions().map((semester, index) => (
                <Label key={index} radio className="mr-6">
                  <Input
                    type="radio"
                    value={semester}
                    name="semester"
                    onChange={handleAcademicSemesterChange}
                  />
                  <span className="ml-2">{semester}</span>
                </Label>
              ))}
            </div>
          </div>


        <div className="mt-5">
          <Button onClick={handleSubmit}>Register</Button>
        </div>
      </div>
    </>
  );
}

export default Forms;
