const path = require('path');
const visit = require('unist-util-visit');
const upload = require('./upload');
const getImageUrl = require('./build-url');

module.exports = ({
  baseDir,
  uploadFolder = 'netlify',
  transformations = 'f_auto,q_auto',
}) => async (tree) => {
  let promises = [];

  const convertToCloudinary = (node) => {
    if (node.properties.src.match(/^http/)) {
      return;
    }

    const imagePath = path.join(baseDir, node.properties.src);

    // upload the local image to Cloudinary
    const promise = upload({
      imagePath,
      uploadFolder,
    }).then((cloudinaryName) => {
      // replace the local image path with the Cloudinary asset URL
      node.properties.src = getImageUrl({
        fileName: cloudinaryName,
        uploadFolder,
        transformations,
      });

      // add a srcSet for better perf on smaller viewports
      node.properties.srcSet = [1800, 1200, 600, 300]
        .map((width) => {
          const srcSetTransformations = `${transformations},w_${width}`;
          const url = getImageUrl({
            fileName: cloudinaryName,
            transformations: srcSetTransformations,
            uploadFolder,
          });

          return `${url} ${width}w`;
        })
        .join();

      // for browsers that support native lazy loading, add it
      node.properties.loading = 'lazy';
    });

    promises.push(promise);
  };

  visit(tree, (node) => node.tagName === 'img', convertToCloudinary);
  await Promise.all(promises);

  return;
};
