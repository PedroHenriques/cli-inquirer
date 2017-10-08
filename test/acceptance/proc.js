'use strict';

const { inquirer } = require("../../lib/inquirer");

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
    commands: ['help'],
    arg: /^[^\s]+$/i
  },
  '--target': {
    alias: '-t'
  }
};

inquirer('type an instruction: ', commandData, flagData).
then((value) => {
  console.log(JSON.stringify(value));
}).
catch((reason) => {
  console.log(reason);
});