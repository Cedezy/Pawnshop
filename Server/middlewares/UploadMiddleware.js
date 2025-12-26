const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./CloudinaryConfig");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "your-folder-name", // optional, e.g., 'customers'
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
        cb(null, true);
        } else {
        cb(new Error("Only image files are allowed!"), false);
        }
    },
    limits: {} // optional size limit
});

module.exports = upload;
