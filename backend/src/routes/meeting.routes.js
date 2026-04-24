const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { isAlumni } = require("../middlewares/role.middleware");
const {
  notifyStudentsForMeeting
} = require("../controllers/meeting.controller");

router.post("/notify-students", auth, isAlumni, notifyStudentsForMeeting);

module.exports = router;
