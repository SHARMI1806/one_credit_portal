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
import { IoEyeOutline, EditIcon, TrashIcon } from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import response from "../utils/demo/tableData";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { Label } from "@windmill/react-ui";

// Make a copy of the data for the second table
const response2 = response.concat([]);

function Tables() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({}); // State to track edited data
  const [courseDetails, setCourseDetails] = useState(null); // State to hold course details for the selected student

  const resultsPerPage = 8;
  const totalResults = dataTable2.length;

  const [pageTable2, setPageTable2] = useState(1);
  useEffect(() => {
    setDataTable2(
      response2.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2]);

  useEffect(() => {
    fetchOverallStudentData();
  }, []);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData); // Set the data of the row being edited
    setIsEditModalOpen(true);
  }
  function openViewModal(rowData) {
    setRowDataToEdit(rowData);
    setIsViewModalOpen(true);
    // Fetch course details for the selected student
    fetchCourseDetails(rowData.rollno);
  }
  
  async function fetchCourseDetails(rollno) {
    try {
      const response = await fetch(`http://localhost:5555/getcourse/${rollno}`);
      if (response.ok) {
        const courseDetails = await response.json();
        setCourseDetails(courseDetails);
      } else {
        console.error("Failed to fetch course details");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }
  

  function closeViewModal() {
    setIsViewModalOpen(false);
    setCourseDetails(null); // Reset course details when modal is closed
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openDeleteModal(user) {
    setRowDataToEdit(user); // Set the data of the row being deleted
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }
  async function fetchOverallStudentData() {
    try {
      const response = await fetch("http://localhost:5555/getstudent");
      const data = await response.json();
      const mappedData = data.map((student) => ({
        rollno: student.rollno,
        name: student.name,
        email: student.email,
        department: student.department,
        creditsearned: student.creditsearned,
        batch: student.batch,
        status: student.status,
      }));
      setDataTable2(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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
        `http://localhost:5555/updatestudent/${updatedRowData.rollno}`,
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

  useEffect(() => {
    setFilteredData(
      dataTable2.filter(
        (user) =>
          (user.rollno &&
            user.rollno.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.creditsearned &&
            user.creditsearned
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.batch &&
            user.batch.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

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
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.creditsearned &&
            user.creditsearned
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.batch &&
            user.batch.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

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

  function handleDelete() {
    // Filter out the row to be deleted
    const updatedDataTable = dataTable2.filter(
      (row) => row.rollno !== rowDataToEdit.rollno
    );
    setDataTable2(updatedDataTable);
    closeDeleteModal(); // Close the modal after deletion
  }
  async function handleDelete() {
    try {
      const response = await fetch(
        `http://localhost:5555/deletestudent/${rowDataToEdit.rollno}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Data deleted successfully");
        const updatedDataTable = dataTable2.filter(
          (row) => row.rollno !== rowDataToEdit.rollno
        );
        setDataTable2(updatedDataTable);
        closeDeleteModal();
      } else {
        console.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  function handleExportData() {
    // Logic to export data as a CSV file
    // This depends on the format of your data and how you want to export it
    // Example logic:
    let csvContent =
      "Roll no,Name,Email,Department,Credits Earned,Batch,Status\n";
    dataTable2.forEach((user) => {
      // Check if user object has all required properties
      if (
        user.rollno &&
        user.name &&
        user.email &&
        user.creditsearned &&
        user.department &&
        user.batch
      ) {
        csvContent += `${user.rollno},${user.name},${user.email},${user.department},${user.creditsearned},${user.batch},${user.activestatus}\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_details.csv";
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

  return (
    <>
      <PageTitle>Student Master</PageTitle>

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
              <TableCell>Email</TableCell>
              <TableCell>Credits Earned</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
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
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.creditsearned}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.batch}</span>
                </TableCell>
                <TableCell>
                  {user.status === 1 ? (
                    <Badge type="success">Active</Badge>
                  ) : (
                    <Badge type="danger">Not Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="View"
                      onClick={() => openViewModal(user)} // Pass the row data to the delete modal
                    >
                      <IoEyeOutline className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => openEditModal(user)} // Pass the row data to the edit modal
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(user)} // Pass the row data to the delete modal
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
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
        <ModalHeader>Student Details</ModalHeader>
        <ModalBody>
          {/* Display the row data in the modal */}
          {rowDataToEdit && (
            <>
              <p>{rowDataToEdit.rollno}</p>
              <p>{rowDataToEdit.name}</p>
              <p>{rowDataToEdit.email}</p>
              <p>{rowDataToEdit.department}</p>
              <p>{rowDataToEdit.batch}</p>
              <Label className="mt-4">
                <span>Name</span>
                <Input
                  className="mt-1"
                  name="name"
                  placeholder="Sharmilaa G C"
                  value={editedData.name || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Email</span>
                <Input
                  className="mt-1"
                  name="email"
                  placeholder="sharmilaa.ad21@bitsathy.ac.in"
                  value={editedData.email || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Department</span>
                <Input
                  className="mt-1"
                  name="department"
                  placeholder="AIDS"
                  value={editedData.department || ""}
                  onChange={handleInputChange}
                />
              </Label>

              {/* Add input fields for editing */}
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
            <Button onClick={handleDelete}>Delete</Button>
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
            <Button block size="large" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeViewModal}>
        <ModalHeader>Student Course Details</ModalHeader>
        <ModalBody>
          {courseDetails && (
            <div>
              <div className="flex justify-start">
                <Label className="mr-2">
                  <span className="font-semibold">Roll No:</span>
                </Label>
                <p>{courseDetails.rollno}</p>
              </div>
              <div className="flex justify-start">
                <Label className="mr-2">
                  <span className="font-semibold">Course Name 1:</span>
                </Label>
                <p>{courseDetails.coursename1}</p>
              </div>
              <div className="flex justify-start">
                <Label className="mr-2">
                  <span className="font-semibold">Course Name 2:</span>
                </Label>
                <p>{courseDetails.coursename2}</p>
              </div>
              <div className="flex justify-start">
                <Label className="mr-2">
                  <span className="font-semibold">Course Name 3:</span>
                </Label>
                <p>{courseDetails.coursename3}</p>
              </div>
              
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeViewModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Tables;
