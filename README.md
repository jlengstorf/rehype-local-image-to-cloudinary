# rehype-local-image-to-cloudinary

This [**rehype**](https://github.com/rehypejs/rehype) plugin examines all local images in your markup and uploads them to Cloudinary and replaces the `src` attribute with the generated Cloudinary URL.

## Install

[npm](https://docs.npmjs.com/cli/install):

```sh
npm install rehype-local-image-to-cloudinary
```

## Environment Variables

Open the [Cloudinary Dashboard](https://cloudinary.com/console/) and grab your Cloudinary cloud name, API Key, and API Secret and store them in environment variables or a `.env` file:

```
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
```

## Use

```js
var path = require("path");
var unified = require("unified");
var report = require("vfile-reporter");
var parse = require("rehype-parse");
var stringify = require("rehype-stringify");
var cloudinary = require("rehype-local-image-to-cloudinary");

unified()
  .use(parse, { fragment: true })
  .use(cloudinary, {
    baseDir: path.join(__dirname, "img"),
    uploadFolder: "corgi-pics",
    transformations: "q_auto,f_auto",
  })
  .use(stringify)
  .process('<img src="cute-corgi.jpg">', function (err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
```

Yields:

```html
no issues found
<img
  src="https://res.cloudinary.com/myCloudName/image/upload/f_auto,q_auto/corig-pics/cute-corgi-f93d593472435fd2705086a6986f52cc"
  srcset="..."
  loading="lazy"
/>
```

## API

### `rehype().use(cloudinary[, options])`

Options is an object used to customize various settings:

- baseDir (**Required**): The base directory on your filesystem to find images to upload.
- uploadFolder (_optional_): The folder that will be generated on Cloudinary that will contain all images generated from this plugin.
- transformations (_optional_): A comma separated list of [Cloudinary Transforms](https://cloudinary.com/documentation/image_transformations) that will be applied on all images.
