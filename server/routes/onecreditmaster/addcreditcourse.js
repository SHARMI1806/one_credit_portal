import express, { request, response } from "express";
import Onecreditmaster from "./model.js";
const router = express.Router();

router.post("/", async (request, response) => {
  try {
    if (
      !request.body.rollno ||
      !request.body.name ||
      !request.body.department ||
      !request.body.currentsemester ||
      !request.body.completedsemester ||
      !request.body.courseid ||
      !request.body.coursename
    ) {
      return response
        .status(400)
        .send({ message: "send all the required feilds" });
    }
    const newCourse = {
      rollno: request.body.rollno,
      name: request.body.name,
      department: request.body.department,
      currentsemester: request.body.currentsemester,
      completedsemester: request.body.completedsemester,
      courseid: request.body.courseid,
      coursename: request.body.coursename,
    };
    const newcreditcourse = await Onecreditmaster.create(newCourse);
    return response.status(201).send(newcreditcourse);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
export default router;
