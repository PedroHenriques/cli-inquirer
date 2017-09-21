[![Build Status](https://travis-ci.org/PedroHenriques/cli-inquirer.svg?branch=master)](https://travis-ci.org/PedroHenriques/cli-inquirer)

# cli-inquirer

A NodeJS package for CLI parsing.
It will ask the user for an instruction and then parse it into a command, options and flags.

## Setup

The easiest way to start using this package is to install it using **npm**.

In you application run **`npm i cli-inquirer`** and then require it in your code with **`const { inquirer } = require('cli-inquirer');`**.

## Summary of what this package does

When the exported function is called, it will prompt the user (via the command line) for an instruction.
Once the user's input has been received it will be parsed and split into three components:

- **Command:** the first "word" in the user's input.
- **Options:** all "words" that are not the command or a flag.
- **Flags:** all the "words" that start with a **-** or **--**, plus any associated arguments.

A Promise is returned that will resolve with an Object (containg the 3 properties listed above) or rejects with an error message.

**NOTE**: the options and flags can be provided by the user in any order.

## Examples

The best way to check this package is to test it.
Check the folder `examples/` for example code.

```
node examples/no-validation.js
node examples/with-validation.js
```

## Using this package

The package exposes one function named `inquirer` that receives 3 optional arguments:

- **prompt:** The string that will be printed to the console when asking the user for an input. Defaults to `Please type a command? `.
- **commandValidationData:** An object used to validate the command and the options. Defaults to `{}`.
- **flagValidationData:** An object used to validate the flags. Defaults to `{}`.

and returns a **promise** that resolves with an object with syntax

```js
{
  command: string,
  options: string[],
  flags: string[][]
}
```

or rejects with an error string.

### commandValidationData

If an empty object is provided, no validation of the commands or options will be done.

The syntax for this object is

```js
{
  [key: string]: (RegExp | null)[]
}
```

where the **keys** are the valid commands and the **values** are arrays of regexp objects or null, defining the valid options for each command.
The order of the array will be the order the options are expected to be given.
A `null` value defined that option as being non-required.

### flagValidationData

If an empty object is provided, no validation of the flags will be done.

The syntax for this object is

```js
{
  [key: string]: {
    commands?: string[],
    arg?: RegExp,
    alias?: string
  }
}
```

where the **keys** are the valid flags and the **values** are objects defining each flag's valid data.

- **commands:** Optional array of strings with the commands a flag is valid.
- **arg:** Optional regexp object to match a flag's expected argument. It defines the flag as having an argument that must match the provided regexp.
If any argument is accepted, providing the regexp `/.+/` is enough.
A flag's argument will be stored with the flag under the `flags` property of the returned object.
- **alias:** Optional string with the name of the flag to copy the validation data from. Both flags will share the same validation data.

## Example

Consider the following code

```js
'use strict';

const { inquirer } = require("cli-inquirer");

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
  // continue your code
}).
catch((reason) => {
  // handle the error
});
```

For a user input of `create file -f --target ./src/newfile.js` the promise would resolve with
```js
{
  command: "create",
  options: ["file"],
  flags: [["-f"], ["--target", "./src/newfile.js"]]
}
```

## Testing this package

1. `cd` into the package directory
2. run `npm install`
3. run `npm run test:all`
