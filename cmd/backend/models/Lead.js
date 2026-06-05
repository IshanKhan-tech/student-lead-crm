const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  contact: {
    type: String,
    required: true,
  },

  location: {
    type: String,
  },

  school: {
    type: String,
  },

  status: {
    type: String,
    default: "Pending",
  },

  assignedTo: {
    type: String,
    default: "",
  },
  priority: {
    type: String,
    default: "Warm",
  },

  source: {
    type: String,
    default: "Manual",
  },
});

module.exports = mongoose.model("Lead", leadSchema);
