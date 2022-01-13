import mongoose from "mongoose";
import { PROJECT_VISIBILITY } from "../types/constants";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  visibility: {
    type: String,
    enum: Object.values(PROJECT_VISIBILITY),
    default: PROJECT_VISIBILITY.PRIVATE,
  },
  icon: {
    type: String,
    required: false,
  },
  boards: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
      },
    ],
    default: [],
  },
  members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    default: [],
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
