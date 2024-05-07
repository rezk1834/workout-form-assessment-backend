const express = require("express");
const multer = require("multer");
const { videoProcessing } = require("../controllers/video");

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.post("/", upload.single("video"), videoProcessing);

module.exports = router;
