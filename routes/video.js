const express = require("express");
const multer = require("multer");
const { videoProcessing } = require("../controllers/video");
const path = require("path");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for uploaded files
    cb(null, path.join(__dirname, "..", "..", "Workout-Form-Assessment"));
  },
  filename: function (req, file, cb) {
    // Set the filename for uploaded files
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("video"), videoProcessing);

module.exports = router;
