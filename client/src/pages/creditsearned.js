import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
  Label,
} from "@windmill/react-ui";
import { FaDownload } from "react-icons/fa6";
import { EditIcon } from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { IoIosAddCircleOutline } from "react-icons/io";

function Creditearned() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({}); // State to track edited data
  const [addcourseModalOpen, setAddcourseModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    rollno: "",
    name: "",
    department: "",
    currentsemester: "",
    completedsemester: "",
    courseid: "",
    coursename: "",
  });
  const resultsPerPage = 8;
  const totalResults = dataTable2.length;

  const [pageTable2, setPageTable2] = useState(1);
  useEffect(() => {
    setDataTable2(
      dataTable2.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2]);

  const userRole = sessionStorage.getItem("role");
  useEffect(() => {
    if (userRole === "2") {
      fetchOvermyregisteredcourseData();
    } else {
      fetchOverallregisteredcourseData();
    }
  }, [userRole]);
  const rollno = sessionStorage.getItem("rollno");
  async function fetchOverallregisteredcourseData() {
    try {
      const response = await fetch("http://localhost:5555/getcourse");
      const data = await response.json();
      const mappedData = data.map((student) => ({
        rollno: student.rollno,
        name: student.name,
        department: student.department,
        semester: student.semester,
        coursename1: student.coursename1,
        course1completedsemester: student.course1completedsemester,
        coursename2: student.coursename2,
        course2completedsemester: student.course2completedsemester,
        coursename3: student.coursename3,
        course3completedsemester: student.course3completedsemester,
        file: student.file,
        approvalstatus: student.approvalstatus,
        eligiblitystatus: student.eligiblitystatus,
      }));
      setDataTable2(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchOvermyregisteredcourseData() {
    try {
      const response = await fetch(
        `http://localhost:5555/getmyapprovestatus/${rollno}`
      );
      const data = await response.json();
      // Check if data is an array before mapping
      if (Array.isArray(data)) {
        const mappedData = data.map((student) => ({
          rollno: student.rollno,
          name: student.name,
          department: student.department,
          semester: student.semester,
          coursename1: student.coursename1,
          course1completedsemester: student.course1completedsemester,
          coursename2: student.coursename2,
          course2completedsemester: student.course2completedsemester,
          coursename3: student.coursename3,
          course3completedsemester: student.course3completedsemester,
          file: student.file,
          approvalstatus: student.approvalstatus,
          eligiblitystatus: student.eligiblitystatus,
        }));
        setDataTable2(mappedData);
      } else {
        console.error(
          "Data received from the server is not in the expected format:",
          data
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function openEditModal(rowData) {
    setRowDataToEdit(rowData); // Set the data of the row being edited
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }
  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }
  function closeAddcours() {
    setAddcourseModalOpen(false);
  }
  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  const fileInputRef = useRef(null); // Ref for file input element

  function handleImportButtonClick() {
    fileInputRef.current.click(); // Simulate click on file input
  }
  function handleImportFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      if (fileExtension === "xlsx" || fileExtension === "xls") {
        try {
          const importedData = parseExcelData(event.target.result);
          console.log("Imported Excel data:", importedData);
          setDataTable2(importedData);
        } catch (error) {
          console.error("Error parsing Excel data:", error);
        }
      } else if (fileExtension === "csv") {
        try {
          const importedData = parseCSVData(event.target.result);
          console.log("Imported CSV data:", importedData);
          setDataTable2(importedData);
        } catch (error) {
          console.error("Error parsing CSV data:", error);
        }
      } else {
        console.error("Unsupported file format");
      }
    };
    reader.readAsBinaryString(file);
  }

  useEffect(() => {
    setFilteredData(
      dataTable2.filter(
        (user) =>
          (user.rollno &&
            user.rollno.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.currentsemester &&
            user.currentsemester
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.coursecompletedsem &&
            user.coursecompletedsem
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.courseid &&
            user.courseid.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.coursename &&
            user.coursename.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.creditseligible &&
            user.creditseligible
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

  function handleInputAddChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  const handleformsubmit = async () => {
    console.log(formData);
    try {
      const response = await fetch("http://localhost:5555/addoneCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form Data sent successfully");
        closeAddcours();
      } else {
        console.error("Failed to send form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };

  //update course
  function handleUpdate() {
    // Find the index of the row to be updated
    const rowIndex = dataTable2.findIndex(
      (row) => row.rollno === rowDataToEdit.rollno
    );
    if (rowIndex !== -1) {
      // Update the row data with edited values
      const updatedRowData = { ...dataTable2[rowIndex], ...editedData };
      const updatedDataTable = [...dataTable2];
      updatedDataTable[rowIndex] = updatedRowData;
      setDataTable2(updatedDataTable);
      closeEditModal(); // Close the modal after updating
      updateDataInBackend(updatedRowData);
    }
  }

  async function updateDataInBackend(updatedRowData) {
    try {
      const response = await fetch(
        `http://localhost:5555/updatecoursedetails/${updatedRowData.rollno}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRowData),
        }
      );
      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  function parseExcelData(excelData) {
    const workbook = XLSX.read(excelData, { type: "binary" });
    const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
    const sheet = workbook.Sheets[sheetName];
    // Convert the sheet data into an array of objects
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Assuming the first row contains headers
    const headers = data[0];
    // Start from the second row to parse data
    const parsedData = data.slice(1).map((row) => {
      const rowData = {};
      row.forEach((value, index) => {
        rowData[headers[index]] = value;
      });
      return rowData;
    });
    console.log(parsedData);
    return parsedData;
  }
  function parseCSVData(csvData) {
    const rows = csvData.split("\n"); // Split CSV data by newline to get rows
    const headers = rows[0].split(","); // Assuming the first row contains headers
    const parsedData = [];
    // Start from the second row to parse data
    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      const values = rows[i].split(",");
      // Assign each value to its corresponding header
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
      parsedData.push(rowData);
    }
    return parsedData;
  }

  function handleExportData() {
    // Logic to export data as a CSV file
    // This depends on the format of your data and how you want to export it
    // Example logic:
    let csvContent =
      "Roll no,Name,Department,Current Semester, Course Completed Semester,Course ID,Course Name,Credits Eligible \n";
    dataTable2.forEach((user) => {
      // Check if user object has all required properties
      if (
        user.rollno &&
        user.name &&
        user.department &&
        user.currentsemester &&
        user.coursecompletedsem &&
        user.courseid &&
        user.coursename &&
        user.creditseligible
      ) {
        csvContent += `${user.rollno},${user.name},${user.department},${user.currentsemester},${user.coursecompletedsem},${user.courseid},${user.coursename},${user.creditseligible}\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course_master.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  console.log(dataTable2);
  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function addcourseModal() {
    setAddcourseModalOpen(true);
  }

 

  return (
    <>
      <PageTitle>One Credit Course Master</PageTitle>

      <TableContainer className="mb-8">
        <div className="m-4 flex justify-between items-center">
          <div className="flex justify-start items-center">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <div className="flex justify-end items-center">
            <Button onClick={handleImportButtonClick}>Import</Button>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleImportFile}
              id="import-file"
              style={{ display: "none" }}
              ref={fileInputRef} // Associate ref with file input
            />

            {/* Add a gap between import and download button */}
            <div style={{ width: "15px" }}></div>
            <Button onClick={handleExportData}>
              <FaDownload className="w-5 h-5" />
            </Button>
            {/* <div style={{ width: "15px" }}></div>
            <Button onClick={addcourseModal}>
              <IoIosAddCircleOutline className="w-5 h-5" />
            </Button> */}
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S no</TableCell>
              <TableCell>Roll no</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Current Semester</TableCell>
              <TableCell>Course 1 Name</TableCell>
              <TableCell>Course 1 Completed Semester</TableCell>
              <TableCell>Course 2 Name</TableCell>
              <TableCell>Course 2 Completed Semester</TableCell>
              <TableCell>Course 3 Name</TableCell>
              <TableCell>Course 3 Completed Semester</TableCell>
              <TableCell>Eligible Credits</TableCell>
              <TableCell>No of Subject Eligible</TableCell>
              {userRole === "1" && <TableCell>Actions</TableCell>}{" "}
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  {" "}
                  <span className="text-sm">
                    {(pageTable2 - 1) * resultsPerPage + i + 1}
                  </span>
                </TableCell>{" "}
                {/* Calculate S.no */}
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.rollno}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.semester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coursename1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.course1completedsemester}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coursename2}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.course2completedsemester}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coursename3}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.course3completedsemester}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">3</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">1</span>
                </TableCell>
                {userRole === "1" && (
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button
                        layout="link"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
      <div></div>
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Course Details</ModalHeader>
        <ModalBody className="overflow-y-auto max-h-22">
          {rowDataToEdit && (
            <>
              <p>Course ID : {rowDataToEdit.courseid}</p>

              <Label className="mt-4">
                <span>Course ID</span>
                <Input
                  className="mt-1"
                  name="courseid"
                  placeholder="18Ad12"
                  value={editedData.courseid || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Course Name</span>
                <Input
                  className="mt-1"
                  name="coursename"
                  placeholder="Modern Cryptography"
                  value={editedData.coursename || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Department</span>
                <Input
                  className="mt-1"
                  name="department"
                  placeholder="Java Fundamentals"
                  value={editedData.department || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Semester</span>
                <Input
                  className="mt-1"
                  name="semester"
                  placeholder="6"
                  value={editedData.semester || ""}
                  onChange={handleInputChange}
                />
              </Label>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleUpdate}>Accept</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={closeEditModal}
            >
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Student Deletion</ModalHeader>
        <ModalBody>Your Deleting student Data</ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button>Delete</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={addcourseModalOpen} onClose={closeAddcours}>
        <ModalHeader>Add Course Details</ModalHeader>
        <ModalBody>
          <>
            <Label className="mt-4">
              <span>Roll no</span>
              <Input
                name="rollno"
                className="mt-1"
                placeholder="18CS023"
                value={formData.rollno}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Name</span>
              <Input
                name="name"
                className="mt-1"
                placeholder="Sharmilaa G C"
                value={formData.name}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Department</span>
              <Input
                name="department"
                className="mt-1"
                placeholder="AIDS"
                value={formData.department}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Current Semester</span>
              <Input
                name="currentsemester"
                className="mt-1"
                placeholder="Semester 6"
                value={formData.currentsemester}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Completed Semester</span>
              <Input
                name="completedsemester"
                className="mt-1"
                placeholder="Computer Science And Engineering"
                value={formData.completedsemester}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Course Id</span>
              <Input
                name="courseid"
                className="mt-1"
                placeholder="18AD12"
                value={formData.courseid}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Course Name</span>
              <Input
                name="coursename"
                className="mt-1"
                placeholder="Node JS"
                value={formData.coursename}
                onChange={handleInputAddChange}
              />
            </Label>{" "}
          </>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeAddcours}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleformsubmit}>Add Course</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={closeEditModal}
            >
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Creditearned;
