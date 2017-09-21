'use strict';

const { inquirer } = require('../lib/index.js');

inquirer().
then((instruction) => {
  console.log(instruction);
}).
catch((reason) => {
  console.log(reason);
});