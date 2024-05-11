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
import { IoIosAddCircleOutline } from "react-icons/io";
import PageTitle from "../components/Typography/PageTitle";
import response from "../utils/demo/tableData";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { Label } from "@windmill/react-ui";

// Make a copy of the data for the second table
const response2 = [
  {
    id: "18CS2013",
    name: "Sathish",
    department: "CSE",
    level: "AP Level 2",
    email: "sathish@bitsathy.ac.in",
    assignedcourse: "DBMS",
  },
  {
    id: "18CS1013",
    name: "Karthick",
    department: "CSE",
    level: "AP Level 1",
    email: "karthick@bitsathy.ac.in",
    assignedcourse: "Computer Architecture",
  },
  {
    id: "20CS1013",
    name: "Karthiga",
    department: "CSE",
    level: "AP Level 3",
    email: "karthiga@bitsathy.ac.in",
    assignedcourse: "DSA",
  },
  {
    id: "20CS1013",
    name: "Karthiga",
    department: "CSE",
    level: "AP Level 3",
    email: "karthiga@bitsathy.ac.in",
    assignedcourse: "DSA",
  },
  {
    id: "20CS20313",
    name: "Rajesh",
    department: "IT",
    level: "AP Level 1",
    email: "rajesh@bitsathy.ac.in",
    assignedcourse: "DSD",
  },
];

function Tables() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({}); // State to track edited data
  const [formData, setFormData] = useState({
    facultyId: "",
    name: "",
    email: "",
    levelOfProficiency: "",
    assignedCourse: "",
  });
  const resultsPerPage = 8;
  const totalResults = response.length;

  const [pageTable2, setPageTable2] = useState(1);
  useEffect(() => {
    setDataTable2(
      response2.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2]);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData); // Set the data of the row being edited
    setIsEditModalOpen(true);
  }
  function addFacultyModalOpen() {
    setAddFacultyModalOpen(true);
  }
  function closeAddFacultyModal() {
    setAddFacultyModalOpen(false);
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
  const handleformsubmit = () => {
    console.log("Form Data:", formData);
    closeAddFacultyModal();
  };
  useEffect(() => {
    setFilteredData(
      dataTable2.filter(
        (user) =>
          (user.id &&
            user.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.level &&
            user.level.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.assignedcourse &&
            user.assignedcourse
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
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
          (user.id &&
            user.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) || // Added ||
          (user.level &&
            user.level.toLowerCase().includes(searchTerm.toLowerCase())) || // Added ||
          (user.assignedcourse &&
            user.assignedcourse
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
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
    let csvContent = "Roll no,Name,Email,Department,Status\n";
    dataTable2.forEach((user) => {
      // Check if user object has all required properties
      if (
        user.id &&
        user.name &&
        user.email &&
        user.department &&
        user.level &&
        user.assignedcourse
      ) {
        csvContent += `${user.id},${user.name},${user.email},${user.department},${user.level},${user.assignedcourse}\n`;
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
  // console.log(dataTable2);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleInputAddChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleUpdate() {
    // Find the index of the row to be updated
    const rowIndex = dataTable2.findIndex((row) => row.id === rowDataToEdit.id); // Use "id" as the key
    if (rowIndex !== -1) {
      // Update the row data with edited values
      const updatedRowData = { ...dataTable2[rowIndex], ...editedData };
      const updatedDataTable = [...dataTable2];
      updatedDataTable[rowIndex] = updatedRowData;
      setDataTable2(updatedDataTable);
      closeEditModal(); // Close the modal after updating
    }
  }

  function handleDelete() {
    // Filter out the row to be deleted
    const updatedDataTable = dataTable2.filter(
      (row) => row.id !== rowDataToEdit.id
    );
    setDataTable2(updatedDataTable);
    closeDeleteModal(); // Close the modal after deletion
  }

  return (
    <>
      <PageTitle>Faculty Master</PageTitle>

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
            <div style={{ width: "15px" }}></div>
            <Button onClick={addFacultyModalOpen}>
              <IoIosAddCircleOutline className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S no</TableCell>
              <TableCell>Faculty Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Level Of Proficiency </TableCell>
              <TableCell>Assignedcourse</TableCell>
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
                      <p className="font-semibold">{user.id}</p>
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
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.level}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.assignedcourse}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
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
        <ModalHeader>Faculty Details</ModalHeader>
        <ModalBody>
          {/* Display the row data in the modal */}
          {rowDataToEdit && (
            <>
              <p>{rowDataToEdit.id}</p>
              <p>{rowDataToEdit.name}</p>
              <p>{rowDataToEdit.email}</p>
              <p>{rowDataToEdit.department}</p>

              <Label className="mt-4">
                <span>Course</span>
                <Input
                  className="mt-1"
                  name="assignedcourse"
                  placeholder="CSE"
                  value={editedData.assignedcourse || ""}
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
      <Modal isOpen={isAddFacultyModalOpen} onClose={closeAddFacultyModal}>
        <ModalHeader>Add Faculty Details</ModalHeader>
        <ModalBody>
          <>
            <Label className="mt-4">
              <span>Faculty ID</span>
              <Input
                name="facultyId"
                className="mt-1"
                placeholder="18CS023"
                value={formData.facultyId}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Name</span>
              <Input
                name="name"
                className="mt-1"
                placeholder="Sharmila G C"
                value={formData.name}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Email</span>
              <Input
                name="email"
                className="mt-1"
                placeholder="abc@bitsathy.ac.in"
                value={formData.email}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Level Of Proficiency</span>
              <Input
                name="levelOfProficiency"
                className="mt-1"
                placeholder="Ap level 1"
                value={formData.levelOfProficiency}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Assigned Course</span>
              <Input
                name="assignedCourse"
                className="mt-1"
                placeholder="DataBase Management"
                value={formData.assignedCourse}
                onChange={handleInputAddChange}
              />
            </Label>{" "}
          </>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeAddFacultyModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleformsubmit}>Add Faculty</Button>
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
        <ModalHeader>Faculty Deletion</ModalHeader>
        <ModalBody>Your Deleting Faculty Data</ModalBody>
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
    </>
  );
}

export default Tables;
