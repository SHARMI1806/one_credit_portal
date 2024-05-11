import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { FaDownload } from "react-icons/fa6";
import { EditIcon, TrashIcon } from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import response from "../utils/demo/tableData";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { Label } from "@windmill/react-ui";

function ApproveCertifications() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [userRole, setUserRole] = useState(""); // Assuming user role is stored as a state

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

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

  function openEditModal(rowData) {
    setRowDataToEdit(rowData);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  const showpdf = (file) => {
    window.open(`http://localhost:5555/${file}`);
  };
const rollno = sessionStorage.getItem("rollno");


useEffect(() => {
  if (userRole === "2") {
    fetchOvermyregisteredcourseData();
  } else {
    fetchOverallregisteredcourseData();
  }
}, [userRole]);

console.log(dataTable2)

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
        course1completedsemester:student.course1completedsemester,
        coursename2: student.coursename2,
        course2completedsemester:student.course2completedsemester,
        coursename3: student.coursename3,
        course3completedsemester:student.course3completedsemester,
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
      const response = await fetch(`http://localhost:5555/getmyapprovestatus/${rollno}`);
      const data = await response.json();
      // Check if data is an array before mapping
      if (Array.isArray(data)) {
        const mappedData = data.map((student) => ({
          rollno: student.rollno,
          name: student.name,
          department: student.department,
          semester: student.semester,
          coursename1: student.coursename1,
          course1completedsemester:student.course1completedsemester,
          coursename2: student.coursename2,
          course2completedsemester:student.course2completedsemester,
          coursename3: student.coursename3,
          course3completedsemester:student.course3completedsemester,
          file: student.file,
          approvalstatus: student.approvalstatus,
          eligiblitystatus: student.eligiblitystatus,
        }));
        setDataTable2(mappedData);
      } else {
        console.error("Data received from the server is not in the expected format:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
          (user.semester &&
            user.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.coursename1 &&
            user.coursename1
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.coursename2 &&
            user.coursename2
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.coursename3 &&
            user.coursename3
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.semester &&
            user.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.proof &&
            user.proof.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  const fileInputRef = useRef(null);

  function handleImportButtonClick() {
    fileInputRef.current.click();
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
          setDataTable2(importedData);
        } catch (error) {
          console.error("Error parsing Excel data:", error);
        }
      } else if (fileExtension === "csv") {
        try {
          const importedData = parseCSVData(event.target.result);
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
          (user.semester &&
            user.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.coursename1 &&
            user.coursename1
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.coursename2 &&
            user.coursename2
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.coursename3 &&
            user.coursename3
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.semester &&
            user.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.proof &&
            user.proof.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

  function parseExcelData(excelData) {
    const workbook = XLSX.read(excelData, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = data[0];
    const parsedData = data.slice(1).map((row) => {
      const rowData = {};
      row.forEach((value, index) => {
        rowData[headers[index]] = value;
      });
      return rowData;
    });
    return parsedData;
  }

  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    const headers = rows[0].split(",");
    const parsedData = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      const values = rows[i].split(",");
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
      parsedData.push(rowData);
    }
    return parsedData;
  }

  function handleExportData() {
    let csvContent =
      "Roll no,Name,Department,CourseName 1,CourseName 2,CourseName 3,Proof,Completed Semester,Status\n";
    dataTable2.forEach((user) => {
      csvContent += `${user.rollno},${user.name},${user.department},${
        user.coursename1
      },${user.coursename2},${user.coursename3},${user.proof},${
        user.semester
      },${
        user.approvalstatus === 1
          ? "Pending"
          : user.approvalstatus === 2
          ? "Approved"
          : "Rejected"
      }\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_details.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleapprovalstatus(rollno) {
    if (rowDataToEdit) {
      const updatedData = {
        ...rowDataToEdit,
        approvalstatus: '2',
        eligiblitystatus: '2',
      };
  
      fetch(`http://localhost:5555/updatestatus/${rollno}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Updated data:", data);
          setDataTable2((prevData) =>
            prevData.map((item) =>
              item.rollno === updatedData.rollno ? updatedData : item
            )
          );
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
    closeEditModal();
  }
 
  function handleapprovalrejectstatus(rollno) {
    if (rowDataToEdit) {
      const updatedData = {
        ...rowDataToEdit,
        approvalstatus: '3',
        eligiblitystatus: '1',
      };
  
      fetch(`http://localhost:5555/updatestatus/${rollno}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Updated data:", data);
          setDataTable2((prevData) =>
            prevData.map((item) =>
              item.rollno === updatedData.rollno ? updatedData : item
            )
          );
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
    closeEditModal();
  }
 
  return (
    <>
      <PageTitle>One Credits Request Master</PageTitle>
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
              ref={fileInputRef}
            />
            <div style={{ width: "15px" }}></div>
            <Button onClick={handleExportData}>
              <FaDownload className="w-5 h-5" />
            </Button>
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
              <TableCell>Course Name 1</TableCell>
              <TableCell>Course 1 Completed Semester</TableCell>
              <TableCell>Course Name 2</TableCell>
              <TableCell>Course 2 Completed Semester</TableCell>
              <TableCell>Course Name 3</TableCell>
              <TableCell>Course 3 Completed Semester</TableCell>
              <TableCell>Current Semester</TableCell>
              <TableCell>Proof</TableCell>
              <TableCell>Approval Status</TableCell>
              <TableCell>Eligibility Status</TableCell>
              {userRole === "1" && <TableCell>Actions</TableCell>}
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">
                    {(pageTable2 - 1) * resultsPerPage + i + 1}
                  </span>
                </TableCell>
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
                  <span className="text-sm">{user.coursename1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.course1completedsemester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coursename2}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.course2completedsemester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coursename3}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.course3completedsemester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.semester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.file}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    type={
                      user.approvalstatus === '1'
                        ? "warning"
                        : user.approvalstatus === '2'
                        ? "success"
                        : "danger"
                    }
                  >
                    {user.approvalstatus === '1'
                      ? "Pending"
                      : user.approvalstatus === '2'
                      ? "Approved"
                      : "Rejected"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    type={user.eligiblitystatus === '1' ? "warning" : "success"}
                  >
                    {user.eligiblitystatus === '1' ? "Not Eligible" : "Eligible"}
                  </Badge>
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
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Course Details</ModalHeader>
        <ModalBody>
          {rowDataToEdit && (
            <>
              <div className="flex flex-col">
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Roll No:</span>
                  </Label>
                  <p>{rowDataToEdit.rollno}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Name:</span>
                  </Label>
                  <p>{rowDataToEdit.name}</p>
                </div>

                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Department:</span>
                  </Label>
                  <p>{rowDataToEdit.department}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Course Name 1:</span>
                  </Label>
                  <p>{rowDataToEdit.coursename1}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Course 1 Completed Semester:</span>
                  </Label>
                  <p>{rowDataToEdit.course1completedsemester}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Course Name 2:</span>
                  </Label>
                  <p>{rowDataToEdit.coursename2}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Course 2 Completed Semester:</span>
                  </Label>
                  <p>{rowDataToEdit.course2completedsemester}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Course Name 3:</span>
                  </Label>
                  <p>{rowDataToEdit.coursename3}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Course 3 Completed Semester:</span>
                  </Label>
                  <p>{rowDataToEdit.course3completedsemester}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Current Semester:</span>
                  </Label>
                  <p>{rowDataToEdit.semester}</p>
                </div>
                <div className="flex justify-start mb-2">
                  <Label className="mr-2">
                    <span className="font-semibold">Proof:</span>
                  </Label>
                  <div className="flex items-center">
                    <Button
                      onClick={() => showpdf(rowDataToEdit.file)}
                      size="small"
                    >
                      Show Proof
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {userRole === "1" && (
            <>
              <div className="hidden sm:block">
                <Button onClick={() => handleapprovalstatus(rowDataToEdit.rollno)}>Approve</Button>
              </div>
              <div className="hidden sm:block">
                <Button onClick={() => handleapprovalrejectstatus(rowDataToEdit.rollno)}>Reject</Button>
              </div>
            </>
          )}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
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
          {userRole === "1" && (
            <div className="block w-full sm:hidden">
              <Button block size="large" onClick={handleapprovalstatus}>
                Update
              </Button>
            </div>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ApproveCertifications;
