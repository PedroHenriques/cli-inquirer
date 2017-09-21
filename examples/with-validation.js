'use strict';

const { inquirer } = require('../lib/index.js');

const commandData = {
  'help': [/^files?$/i, /^\w+$/i],
  'create': [null],
  'generate': []
};
const flagData = {
  '-f': {
    commands: ['create', 'generate']
  },
  '--force': {
    alias: '-f'
  },
  '-t': {
    commands: ['help', 'create'],
    arg: /^[^\s]+$/i
  },
  '--target': {
    alias: '-t'
  }
};

inquirer('type an instruction: ', commandData, flagData).
then((instruction) => {
  console.log(instruction);
}).
catch((reason) => {
  console.log(reason);
});