require('dotenv').config();
const path = require('path');
const fileHash = require('md5-file');
const cloudinary = require('cloudinary').v2;
const fetch = require('node-fetch')

module.exports = async ({ imagePath, uploadFolder }) => {
  const { name } = path.parse(imagePath);
  const hash = fileHash.sync(imagePath);
  const public_id = `${name}-${hash}`;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const resp = await fetch(cloudinary.url(`${uploadFolder}/${public_id}`), { method: 'HEAD' })

  if (resp.status !== 200) {
    await cloudinary.uploader.upload(imagePath, {
      public_id,
      folder: uploadFolder,
      overwrite: false,
    });
  }

  return public_id;
};
