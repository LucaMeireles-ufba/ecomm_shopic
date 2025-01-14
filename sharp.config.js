/** @type {import('file-loader').Config} */
module.exports = {
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'public/upload', 
            },
          },
        },
      ],
    }
  };
  