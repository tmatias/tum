const fs = require('fs'),
  path = require('path'),
  webpack = require('webpack'),
  project = JSON.parse(fs.readFileSync('./project.json', 'utf8'));

function toPath(action, location){
  return path[action](__dirname, location);
}

module.exports = {
  devtool: 'eval',
  entry: {
    abxtracted: path.resolve(__dirname, project.scripts.src.entry)
  },
  output: {
    filename: project.scripts.dist.filename
  },
  resolve: {
    alias: {
      resources: toPath('resolve', './src/scripts/resources/'),
      components: toPath('resolve', './src/scripts/components/')
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
