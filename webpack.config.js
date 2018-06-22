var path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'html'),
    compress: true,
    port: 9000
  }
  entry: {
    "life_form": __dirname + "/templates/insurance/life/life-form-component/index.js",
    disability: __dirname + "/templates/insurance/disability/disability-form-component/index.js"
  },
  output: {
    path: __dirname + "/html/assets/bundles",
    filename: "[name]-bundle.js"
  }
};
