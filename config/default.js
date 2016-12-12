const path = require('path');
const rootPath = path.normalize(`${__dirname}/..`);

const Controllers = (filePath) => {
  // return path.normalize(rootPath + '/api/controllers/' + filePath);
  return path.normalize(`${rootPath}/api/controllers/${filePath}`);
};

const Models = (filePath) => {
  // return path.normalize(rootPath + '/api/models/' + filePath);
  return path.normalize(`${rootPath}/api/models/${filePath}`);
};

module.exports = {
  // database
  mongo: 'mongodb://localhost/dengue-iot',

  // path
  Controllers: Controllers,
  Models: Models
};
