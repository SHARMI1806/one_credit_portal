import express from "express";
import Addcourseproof from "./model.js";
const router = express.Router();

router.put("/:id", async (request, response) => {
  try {
    const { id: rollno } = request.params;
    if (!rollno) {
      return response
        .status(404)
        .send({ message: "Roll number is required in the URL parameter" });
    }
    const result = await Addcourseproof.findOneAndUpdate(
      { rollno: rollno },
      { $set: request.body },
      { new: true }
    );
    if (!result) {
      return response.status(404).send({ message: "Student not found" });
    }
    return response.status(200).send({
      message: "Student details updated successfully",
      student: result,
    });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});

export default router;
