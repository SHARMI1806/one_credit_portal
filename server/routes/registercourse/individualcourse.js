import express from "express";
import Coursemaster from "./model.js";
const router = express.Router();

router.get("/:rollno", async (request, response) => {
  try {
    const rollno = request.params.rollno;
    if (!rollno) {
      return response
        .status(400)
        .send({ message: "Roll number required in the URL parameter" });
    }

    const result = await Coursemaster.find({ rollno: rollno });
    if (!result) {
      return response.status(404).send({ message: "User not found" });
    }

    // Wrap the result in an array before sending
    return response.status(200).json(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

export default router;
