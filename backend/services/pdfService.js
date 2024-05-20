const libre = require('libreoffice-convert');

exports.convertToPdf = (wordBuffer) => {
  return new Promise((resolve, reject) => {
    libre.convert(
      wordBuffer,
      '.pdf',
      undefined,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
      {
        convertTo: 'pdf',
        output: undefined,
        encoding: 'utf8',
      }
    );
  });
};
