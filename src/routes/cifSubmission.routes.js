const express = require("express");
const controller = require("../controllers/cifSubmission.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

const router = express.Router();

// Ensure the directory exists
const uploadDir = path.join(__dirname, "../../assets/resume");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer file filter config
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and PDF files are allowed"), false);
  }
};

// Multer upload config
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: fileFilter
});

// Routes
router.post("/", authMiddleware, requireAnyRole(["hr"]), (req, res, next) => {
  upload.single('resume')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ success: false, message: err.message });
    }
    
    // Everything went fine.
    if (req.file && req.body.personal) {
      try {
        let personal = JSON.parse(req.body.personal);
        personal.resume = req.file.filename;
        req.body.personal = JSON.stringify(personal);
      } catch (e) {
        console.error("Error parsing personal field:", e);
      }
    }
    next();
  });
}, controller.create);

router.get("/", authMiddleware, requireAnyRole(["hr"]), controller.getAllSubmissions);
router.get("/:cifid", authMiddleware, requireAnyRole(["hr"]), controller.getSubmissionById);
router.patch("/:cifid/status", authMiddleware, requireAnyRole(["hr"]), controller.updateSubmissionStatus);

module.exports = router;