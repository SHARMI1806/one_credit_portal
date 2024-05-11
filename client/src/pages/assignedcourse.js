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

const response2 = [
  {
    course_id: "18XX021",
    course_name: "Node Js",
    department: "Computer Science And Engineering",
    semester: "6",
  },
  {
    course_id: "18XH120",
    course_name: "Amazon Cloud Architecture",
    department: "Computer Scinence And Engineering",
    semester: "5",
  },
  {
    course_id: "19CH203",
    course_name: "GO Lang REST API",
    department: "Computer Scinence And Engineering",
    semester: "6",
  },
  {
    course_id: "20MS208",
    course_name: "Industrial Metaverse",
    department: "Artifical Integlligence And Data Science",
    semester: "6",
  },
  {
    course_id: "20HM355",
    course_name: "Full Stack Development Using Python",
    department: "Computer Science And Engineering",
    semester: "6",
  },
];

function Assignedcourse() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({}); // State to track edited data
  const [addcourseModalOpen, setAddcourseModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    department: "",
    semester: "",
  });
  const resultsPerPage = 8;
  const totalResults = response2.length;

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
          (user.course_id &&
            user.course_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.course_name &&
            user.course_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.semester &&
            user.semester.toLowerCase().includes(searchTerm.toLowerCase()))
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
  const handleformsubmit = () => {
    console.log("Form Data:", formData);
    closeAddcours();
  };
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
      "Roll no,Name,Department,CoreSubject1, CourseSubject2,CoreSubject3,CoreSubject4,ElectiveCourse1,ElectiveCourse2,OpenElective,AddonCourse,HonoursCourse1,HonoursCourse2 \n";
    dataTable2.forEach((user) => {
      // Check if user object has all required properties
      if (
        user.course_id &&
        user.course_name &&
        user.department &&
        user.semester
      ) {
        csvContent += `${user.course_id},${user.course_name},${user.department},${user.semester}\n`;
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
    }
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
            <div style={{ width: "15px" }}></div>
            <Button onClick={addcourseModal}>
              <IoIosAddCircleOutline className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S no</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Action</TableCell>
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
                      <p className="font-semibold">{user.course_id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.course_name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">Semester {user.semester}</span>
                </TableCell>
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
                    {/* <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={openDeleteModal}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button> */}
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
        <ModalHeader>Course Details</ModalHeader>
        <ModalBody className="overflow-y-auto max-h-22">
          {rowDataToEdit && (
            <>
              <p>Course ID : {rowDataToEdit.course_id}</p>

              <Label className="mt-4">
                <span>Course ID</span>
                <Input
                  className="mt-1"
                  name="courseid"
                  placeholder="XML Web Services"
                  value={editedData.course_id || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Course Name</span>
                <Input
                  className="mt-1"
                  name="coursename"
                  placeholder="Modern Cryptography"
                  value={editedData.course_name || ""}
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
              <span>Course ID</span>
              <Input
                name="course_id"
                className="mt-1"
                placeholder="18CS023"
                value={formData.course_id}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Course Name</span>
              <Input
                name="course_name"
                className="mt-1"
                placeholder="Node Ja"
                value={formData.course_name}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Department</span>
              <Input
                name="department"
                className="mt-1"
                placeholder="Computer Science And Engineering"
                value={formData.department}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Semester</span>
              <Input
                name="semester"
                className="mt-1"
                placeholder="6"
                value={formData.semester}
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

export default Assignedcourse;
