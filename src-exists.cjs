const fs = require('fs');

if (!fs.existsSync('./src')) {
  throw new Error(
    'src folder not included with published package. To run tests, build ' +
      'the project, etc., fork or clone the repo, install the dependencies, ' +
      'and run the desired command.',
  );
}
