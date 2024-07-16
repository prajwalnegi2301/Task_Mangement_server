import mongoose from "mongoose";


const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerName: {
      type: String,
    }
  },
  { timestamps: true }
);

const task = mongoose.model("Task", taskSchema);
export default task;
