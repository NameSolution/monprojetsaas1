// Express already imported in index.cjs, but we need it here for the router
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'storage'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename, url: '/storage/' + req.file.filename });
});

module.exports = router;
