const fs = require("fs");
const axios = require("axios");

// Video processing
const videoProcessing = async (req, res) => {
  try {
    // Check if req.file exists and has the necessary properties
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    console.log(req.file.originalname, req.body.exercise_name);
    // Send the file to the FastAPI server
    const response = await axios.post("http://localhost:7000/get-feedback", {
      video_path: req.file.originalname,
      exercise_name: req.body.excercise_name,
    });

    // Process the response from the FastAPI server
    const new_res = [];
    for (const [cycle, { feedback, base64_encoding }] of Object.entries(
      response.data
    )) {
      const filteredFeedback = {};
      for (const [criteria, value] of Object.entries(feedback)) {
        filteredFeedback[criteria] = value > 0.5 ? 1 : 0;
      }
      new_res.push({
        cycle,
        feedback: filteredFeedback,
        video: base64_encoding,
      });
    }

    console.log(new_res);
    res
      .status(200)
      .send({new_res, video_path: "../Workout-Form-Assessment/" + req.file.originalname});

    // Optionally delete the uploaded file after processing
    // fs.unlinkSync("../Workout-Form-Assessment/" + req.file.originalname);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  videoProcessing,
};
