const fs = require("fs");
const path = require("path");

function deleteFile(filePath) {
  // Cek dulu apakah filePath valid dan file-nya ada
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Gagal menghapus file:", err);
      } else {
        console.log("File berhasil dihapus:", filePath);
      }
    });
  } else {
    console.warn("File tidak ditemukan:", filePath);
  }
}

module.exports = deleteFile;
