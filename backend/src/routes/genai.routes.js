const express = require("express");
const multer = require("multer");
const {
  recommendFromResume,
  getPredictionPrerequisites
} = require("../controllers/genai.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get("/prerequisites", getPredictionPrerequisites);
router.post("/resume-match", upload.single("resume"), recommendFromResume);

module.exports = router;
