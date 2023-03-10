const mongoose = require("mongoose");
//creation du schema
const eventSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    nbre_participant: Number,
    description: String,
    date_event: Date,
  },
  { timestamps: true } //createdAt et updatedAt
);
//creation du model
const event = mongoose.model("Event", eventSchema);
//exportation
module.exports = event;
