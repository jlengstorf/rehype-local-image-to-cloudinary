const path = require('path');
const visit = require('unist-util-visit');
const upload = require('./upload');
const getImageUrl = require('./build-url');

module.exports = ({
  baseDir,
  uploadFolder = 'netlify',
  transformations = 'f_auto,q_auto',
}) => tree =>
  new Promise(async (resolve, reject) => {
    const convertToCloudinary = async node => {
      const imagePath = path.join(baseDir, node.properties.src);

      try {
        // upload the local image to Cloudinary
        const cloudinaryName = await upload({
          imagePath,
          uploadFolder,
        });

        // replace the local image path with the Cloudinary asset URL
        node.properties.src = getImageUrl({
          fileName: cloudinaryName,
          uploadFolder,
          transformations,
        });

        // add a srcSet for better perf on smaller viewports
        node.properties.srcSet = [1800, 1200, 600, 300]
          .map(width => {
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

        resolve();
      } catch (err) {
        reject(err);
      }
    };

    visit(tree, node => node.tagName === 'img', convertToCloudinary);
  });
