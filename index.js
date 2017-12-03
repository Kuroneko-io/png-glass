const fs = require('fs');
const stream = require('stream');
const { PNG } = require('pngjs');

const isReadableStream = (object) => (object instanceof stream.Readable);

const isWritableStream = (object) => (object instanceof stream.Writable);

const streamOptiPng = (stream) => {
  const OptiPng = require('optipng');
  const optimizer = new OptiPng(['-o7']);

  return stream.pipe(optimizer);
};

const updateTransparencyData = (png) => {
  const length = png.height * png.width * 4;

  for (let counter = 0; counter < length; counter += 4) {
    if (png.data[counter + 3] === 0) {
      png.data[counter] = png.data[counter + 1] = png.data[counter + 2] = 0;
    }
  }

  return png;
};

const transformPng = (png, options = {}) => () => {
  if (png.metadata.alpha) {
    png = updateTransparencyData(png);
  }

  let stream = png.pack();
  if (options.optipng) {
    stream = streamOptiPng(stream);
  }

  stream.pipe(options.out);
};

const pngGlass = (options = {}) => {
  options.in = options.in || 'in.png';
  options.out = options.out || 'out.png';
  options.in = isReadableStream(options.in) ? options.in : fs.createReadStream(options.in);
  options.out = isWritableStream(options.out) ? options.out : fs.createWriteStream(options.out);
  options.optipng = options.optipng !== undefined ? options.optipng : true;

  const png = new PNG({ filterType: -1 });

  png.on('metadata', metadata => { png.metadata = metadata; })
  png.on('parsed', transformPng(png, options));
  options.in.pipe(png);
};

module.exports = pngGlass;
