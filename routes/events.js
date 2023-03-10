const express = require("express");
const router = express.Router();
const eventModel = require("../models/event");
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    let events = search
      ? await eventModel.find({ titre: search })
      : await eventModel.find();
    //vérifier s'il y'a des événements
    if (events.length === 0) {
      throw new Error("events not found!");
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const { titre, nbre_participant, description, date_event } = req.body;
    const checkIfEventExist = await eventModel.find({ titre }); //[]
    //verification sur l'existence du titre
    if (checkIfEventExist && checkIfEventExist.length !== 0) {
      throw new Error("event already exist!");
    }
    //verification sur le nombre de participants
    if (nbre_participant > 30) {
      throw new Error("nombre de participant trop élevé!");
    }
    const event = await eventModel.create({
      titre,
      nbre_participant,
      description,
      date_event: new Date(date_event),
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:eventId", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const checkIfEventExist = await eventModel.findById(eventId);
    if (!checkIfEventExist) {
      throw new Error("event not found!");
    }
    await eventModel.findByIdAndDelete(eventId);
    
    res.json("event deleted successfully!");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:eventId", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { titre, nbre_participant, description, date_event } = req.body;
    let checkIfEventExist = await eventModel.findById(eventId);
    if (!checkIfEventExist) {
      throw new Error("event not found!");
    }
    checkIfEventExist = await eventModel.findOne({ titre });
    //verification sur l'existence du titre
    if (checkIfEventExist) {
      throw new Error("event already exist!");
    }
    //verification sur le nombre de participants
    if (nbre_participant > 30) {
      throw new Error("nombre de participant trop élevé!");
    }
    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      {
        $set: { titre, nbre_participant, description, date_event },
      },
      { new: true }
    );
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
module.exports = router;
