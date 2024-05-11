import mongoose from "mongoose";

const department = mongoose.Schema({
  department_id: {
    type: String,
    required: true,
  },
  department_name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("department", department);
