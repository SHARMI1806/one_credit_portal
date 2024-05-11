import express from "express";
import Coursemaster from "../registercourse/model.js";
const router = express.Router();

router.get("/:rollno", async (request, response) => {
  try {
    const rollno = request.params.rollno;
    if (!rollno) {
      return response
        .status(400)
        .send({ message: "Roll number required in the URL parameter" });
    }

    const results = await Coursemaster.find({ rollno: rollno });
    if (!results || results.length === 0) {
      return response.status(404).send({ message: "User not found" });
    }

    // Extracting course details from all matching documents
    const courses = [];
    results.forEach(result => {
      if (result.coursename1 && result.course1completedsemester) {
        courses.push({
          coursename: result.coursename1,
          completed_semester: result.course1completedsemester
        });
      }
      if (result.coursename2 && result.course2completedsemester) {
        courses.push({
          coursename: result.coursename2,
          completed_semester: result.course2completedsemester
        });
      }
      if (result.coursename3 && result.course3completedsemester) {
        courses.push({
          coursename: result.coursename3,
          completed_semester: result.course3completedsemester
        });
      }
    });

    return response.status(200).json(courses);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

export default router;
