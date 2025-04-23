const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tentukan folder untuk menyimpan gambar
const uploadFolder = "storage/uploads";
const avatarsFolder = "storage/avatars";

// Pastikan folder 'uploads' dan 'avatars' ada di server
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}
if (!fs.existsSync(avatarsFolder)) {
  fs.mkdirSync(avatarsFolder, { recursive: true });
}

// Konfigurasi multer untuk menyimpan gambar di folder tertentu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder berdasarkan jenis file (misalnya gambar avatars atau umum)
    if (file.fieldname === "avatar") {
      cb(null, avatarsFolder); // Menggunakan folder 'avatars' untuk file avatars
    } else {
      cb(null, uploadFolder); // Menggunakan folder 'uploads' untuk file gambar umum
    }
  },
  filename: (req, file, cb) => {
    // Set nama file agar unik menggunakan timestamp dan ekstensi asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter file yang diizinkan untuk diupload (misalnya hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
  }
};

// Export konfigurasi multer
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
