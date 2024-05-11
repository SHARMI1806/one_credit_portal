import express from "express";
import Department from "./model.js";
const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const totaldepartment = await Department.countDocuments();
    response.status(200).json({ totaldepartment });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
