var path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    lifeForm: path.join(__dirname, "/templates/insurance/life/life-form-component/index.js"),
    disability: path.join(__dirname, "/templates/insurance/disability/disability-form-component/index.js")
  },
  output: {
    publicPath: "/html/",
    path: path.join(__dirname, "/html/assets/bundles"),
    filename: "[name]-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }
        ]
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  plugins: []
};
