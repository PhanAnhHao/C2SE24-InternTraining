// Backend/src/routes/upload.route.js
const express = require("express");
const multer = require("multer");
const { bucket } = require("../configs/firebase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const blob = bucket.file(`images/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", err => res.status(500).send({ error: err.message }));

    blobStream.on("finish", async () => {
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      res.send({ imageUrl: url });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    res.status(500).send({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;