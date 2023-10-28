const cloudinary = require("../config/cloudinary.config");

// Upload multiple files to Cloudinary
async function uploadFiles(files, folder) {
  const uploadPromises = files.map((file) => {
    return cloudinary.uploader.upload(file.path, { folder: folder });
  });
  return Promise.all(uploadPromises);
}

// Upload a single file to Cloudinary

async function uploadFile(file, folder) {
  return cloudinary.uploader.upload(file.path, { folder: folder });
}

module.exports = {
  uploadFiles,
  uploadFile,
};
