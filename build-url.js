module.exports = ({
  fileName,
  uploadFolder,
  transformations = 'q_auto,f_auto',
}) => {
  const urlBase = 'https://res.cloudinary.com';
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  return `${urlBase}/${cloudName}/image/upload/${transformations}/${uploadFolder}/${fileName}`;
};
