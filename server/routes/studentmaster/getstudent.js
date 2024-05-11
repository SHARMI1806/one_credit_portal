import express from "express";
import StudentMaster from "./model.js";
const router = express.Router();

router.get("/:email", async (request, response) => {
  try {
    const email = request.params.email;
    if (!email) {
      return response
        .status(400)
        .send({ message: "User email required in the URL parameter" });
    }

    const result = await StudentMaster.findOne({ email: email }); // Use findOne instead of find
    if (!result) {
      return response.status(404).send({ message: "User not found" });
    }

    return response.status(200).send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

export default router;
