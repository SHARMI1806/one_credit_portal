import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

import { PORT, monogoDBURL } from "./config.js";
import StudentMaster from "./routes/studentmaster/index.js";
import Addstudent from "./routes/studentmaster/addstudent.js";
import UpdateStudent from "./routes/studentmaster/updatestudent.js";
import getOneCreditmaster from "./routes/onecreditmaster/index.js";
import Updatecourse from "./routes/onecreditmaster/updatecourse.js";
import AddCourse from "./routes/onecreditmaster/addcreditcourse.js";
import Addcourseproof from "./routes/registercourse/model.js";
import updateapprovalstatus from "./routes/registercourse/updatecourse.js";
import Departmentcount from "./routes/home/department/index.js";
import Coursecount from "./routes/home/course/index.js";
import getStudent from "./routes/studentmaster/getstudent.js";
import getmycoursecount from "./routes/home/myregistercourse/index.js";
import studentdelete from "./routes/studentmaster/delete.js";
import Individualcourse from "./routes/onecreditmaster/getindividualcourse.js";
import Individualapprove from "./routes/registercourse/individualcourse.js";

const app = express();
app.use(cors()); // Use cors middleware
app.use(express.json());
app.use("/uploads",express.static("uploads"));
app.use("/addstudent", Addstudent);
app.use("/getstudent", StudentMaster);
app.use("/updatestudent", UpdateStudent);
app.use("/deletestudent", studentdelete);
app.use("/getOneCreditdetails", getOneCreditmaster);
app.use("/updatecoursedetails", Updatecourse);
app.use("/updatestatus", updateapprovalstatus);
app.use("/departmentcount", Departmentcount);
app.use("/coursecount", Coursecount);
app.use("/getstudentdetails", getStudent);
app.use("/mycoursecount", getmycoursecount);
app.use("/addoneCourse",AddCourse);
app.use("/getmycourse",Individualcourse);
app.use("/getmyapprovestatus",Individualapprove);
// File upload and add registration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/addcourse", upload.single("file"), async (request, response) => {
  console.log(request.file);

  try {
    if (
      !request.body.rollno ||
      !request.body.name ||
      !request.body.department ||
      !request.body.semester ||
      !request.body.coursename1 ||
      !request.body.coursename2 ||
      !request.body.coursename3 
    ) {
      return response
        .status(400)
        .send({ message: "Send all the required fields and the file" });
    }
    const newCourse = {
      rollno: request.body.rollno,
      name: request.body.name,
      department: request.body.department,
      semester: request.body.semester,
      coursename1:request.body.coursename1,
      course1completedsemester:request.body.course1completedsemester,
      coursename2:request.body.coursename2,
      course2completedsemester:request.body.course2completedsemester,
      coursename3:request.body.coursename3,
      course3completedsemester:request.body.course3completedsemester,
      file: request.file.path,
      approvalstatus: "1",
      eligiblitystatus: "1",
    };

    const newCreditCourse = await Addcourseproof.create(newCourse);
    return response.status(201).send(newCreditCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    response.status(500).send({ message: "Error adding course" });
  }
});

app.get("/getcourse", async (req, res) => {
  try {

    const coursemaster = await Addcourseproof.find({});
    return res.status(200).json(coursemaster);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send({ message: "Error fetching courses" });
  }
}); 
app.get("/getcourse/:rollno", async (req, res) => {
  const rollno = req.params.rollno; 
  try {
    const courseDetails = await Addcourseproof.find({ rollno: rollno }); 
    if (!courseDetails || courseDetails.length === 0) {
      return res
        .status(404)
        .json({
          message: "Course details not found for the provided roll number",
        });
    }
    return res.status(200).json(courseDetails); 
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Error fetching course details" });
  }
});

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Welcome");
});

mongoose
  .connect(monogoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is running on Port:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
