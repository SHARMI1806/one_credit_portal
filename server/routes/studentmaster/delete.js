import express, { request, response } from "express";
import StudentDetails from "./model.js";
const router = express.Router();

router.delete("/:id", async (request, response) => {
  try {
    const { id: rollno } = request.params;
    if (!rollno) {
      return response.status(404).send({ Message: "Roll no is required in the URL parameter" });
    }
    const result = await StudentDetails.findOneAndDelete({ rollno: rollno });
    if (!result) {
      return response.status(404).send({ message: "Student not found" });
    }
    return response
      .status(200)
      .send({ message: "Student deleted Successfully" });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});

export default router;
