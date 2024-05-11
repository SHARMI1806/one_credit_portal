import express, { request, response } from "express";
import StudentDetails from "./model.js";

const router = express.Router();
router.get("/", async (request, response) => {
  try {
    const studentMaster = await StudentDetails.find({});
    return response.status(200).json(studentMaster);
  } catch (error) {
    console.error("Error getting data:", error);
    return response.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
