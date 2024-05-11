import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label, Select } from "@windmill/react-ui";
import { Button } from "@windmill/react-ui";

const Department = [
  {
    department: "CSE",
  },
  {
    department: "ISE",
  },
  {
    department: "CE",
  },
  {
    department: "AIDS",
  },
  {
    department: "CT",
  },
  {
    department: "CSBS",
  },
];

const Semester = [
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

function ApplyForms() {
  const rollno = sessionStorage.getItem("rollno");
  const name = sessionStorage.getItem("name");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [coursename1, setCourseName1] = useState("");
  const [coursen1completedsemester, setCoursen1completedsemester] = useState("");
  const [coursename2, setCourseName2] = useState("");
  const [coursen2completedsemester, setCoursen2completedsemester] = useState("");
  const [coursename3, setCourseName3] = useState("");
  const [coursen3completedsemester, setCoursen3completedsemester] = useState("");

  const [file, setFile] = useState(null);

  const handleAcademicSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleCourseName1Change = (e) => {
    setCourseName1(e.target.value);
  };
  const handleCourseName2Change = (e) => {
    setCourseName2(e.target.value);
  };
  const handleCourseName3Change = (e) => {
    setCourseName3(e.target.value);
  };
  const handleCourse1semesterChange = (e) => {
    setCoursen1completedsemester(e.target.value);
  };
  const handleCourse2semesterChange = (e) => {
    setCoursen2completedsemester(e.target.value);
  };
  const handleCourse3semesterChange = (e) => {
    setCoursen3completedsemester(e.target.value);
  };
  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepartment(selectedDepartment);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    // Create FormData object
    const formData = new FormData();
    formData.append("rollno", rollno);
    formData.append("name", name);
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("coursename1", coursename1);
    formData.append("course1completedsemester", coursen1completedsemester);
    formData.append("coursename2", coursename2);
    formData.append("course2completedsemester", coursen2completedsemester);
    formData.append("coursename3", coursename3);
    formData.append("course3completedsemester", coursen3completedsemester);
    if (file) {
      formData.append("file", file);
    }
  
    try {
      const response = await fetch("http://localhost:5555/addcourse", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        // Handle success
        console.log("Form data submitted successfully!");
        setDepartment("");
        setFile("");
        setSemester("");
        setCourseName1("");
        setCoursen1completedsemester("");
        setCourseName2("");
        setCoursen2completedsemester("");
        setCourseName3("");
        setCoursen3completedsemester("");
        setFile(null);
      } else {
        // Handle error
        console.error("Failed to submit form data");
      }
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };
  

  return (
    <>
      <PageTitle>Apply Course Exemption</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="mt-4">
          <Label>Semester</Label>
          <div className="mt-2">
            <Select
              className="mt-1"
              onChange={handleAcademicSemesterChange}
              value={semester}
            >
              <option value="">Select Semester</option>
              {Semester.map((Semester, index) => (
                <option key={index} value={Semester}>
                  {Semester}
                </option>
              ))}
            </Select>
          </div>
        </div>

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
        <Label className="mt-4">
          <span>Course Name 1</span>
          <Input
            className="mt-1"
            placeholder="XML Web Services"
            value={coursename1}
            onChange={handleCourseName1Change}
          />
        </Label>
        <Label className="mt-4">
          <span>Course 1 Completed Semester</span>
          <Input
            className="mt-1"
            placeholder="Semester 6"
            value={coursen1completedsemester}
            onChange={handleCourse1semesterChange}
          />
        </Label>
        <Label className="mt-4">
          <span>Course Name 2</span>
          <Input
            className="mt-1"
            placeholder="Web Technology"
            value={coursename2}
            onChange={handleCourseName2Change}
          />
        </Label>
        <Label className="mt-4">
          <span>Course 2 Completed Semester</span>
          <Input
            className="mt-1"
            placeholder="Semester 5"
            value={coursen2completedsemester}
            onChange={handleCourse2semesterChange}
          />
        </Label>
        <Label className="mt-4">
          <span>Course Name 3</span>
          <Input
            className="mt-1"
            placeholder="Node JS"
            value={coursename3}
            onChange={handleCourseName3Change}
          />
        </Label>
        <Label className="mt-4">
          <span>Course 3 Completed Semester</span>
          <Input
            className="mt-1"
            placeholder="Semester 4"
            value={coursen3completedsemester}
            onChange={handleCourse3semesterChange}
          />
        </Label>
        {/* File Upload Field */}
        <div className="mt-4">
          <Label className="mt-4">
            <span>Upload PDF File</span>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="mt-1"
              placeholder="Sem 1"
            />
          </Label>
        </div>

        <div className="mt-5">
          <Button onClick={handleSubmit}>Register</Button>
        </div>
      </div>
    </>
  );
}

export default ApplyForms;
