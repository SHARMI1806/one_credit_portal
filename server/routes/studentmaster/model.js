import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  rollno: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  creditsearned: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: false,
  },
  role: {
    type: Number,
    required: false,
  },
});

export default mongoose.model("studentmaster", studentSchema);
