const fs = require("fs");
const axios = require("axios");

// Video processing
const videoProcessing = async (req, res) => {
  let new_res = []; // Array to store the new response
  try {
    // Check if req.file exists and has the necessary properties
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    console.log(req.body.excercise_name);
    // Function to filter the video based on the feedback if any of the criterias equal to 0
    const videofilteration = (video, feedback) => {
      let values = [];
      Object.values(feedback).map((value) => {
        values.push(value);
      });
      if (values.includes(0)) {
        return video;
      } else {
        return { video: "All criterias are met. No need to show any videos." };
      }
    };

    // Send the file to the FastAPI server [...] = [1, 2, 3] ,{...feedback} = {criteria 1, criteria 2, criteria 3}
    await axios
      .post("http://localhost:7000/get-feedback", {
        video_path: req.file.originalname,
        exercise_name: req.body.excercise_name,
      })
      .then((response) => {
        // Process the response from the FastAPI server
        Object.entries(response.data).map(
          ([cycle, { feedback, base64_encoding }]) => {
            Object.entries(feedback).map(([criteria, value]) => {
              feedback = {
                ...feedback,
                [criteria]: value > 0.5 ? 1 : 0,
              };
            }),
              new_res.push({
                cycle: cycle,
                feedback: feedback,
                video: videofilteration(base64_encoding, feedback),
              });
          }
        );
        res.status(200).send(new_res);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  videoProcessing,
};
