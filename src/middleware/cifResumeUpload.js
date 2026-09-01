const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../assets/resume");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDir),
    filename: (_req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (_req, file, callback) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, allowedExtensions.includes(extension));
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});

module.exports = (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        if (req.file && req.body.personal) {
            try {
                const personal = JSON.parse(req.body.personal);
                personal.resume = req.file.filename;
                const backendUrl = (process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
                personal.resumeUrl = `${backendUrl}/assets/resume/${req.file.filename}`;
                req.body.personal = JSON.stringify(personal);
            } catch (_parseError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid JSON data in personal form field.",
                });
            }
        }

        return next();
    });
};
