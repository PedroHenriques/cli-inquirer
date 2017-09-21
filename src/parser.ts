'use strict';

import { IInstruction, IValidCommands, IValidFlags } from './config';

export function parseInput(
  userInput: string,
  instruction: IInstruction,
  commandValidationData: IValidCommands,
  flagValidationData: IValidFlags
): string {
  if (userInput === '') {
    return('');
  }

  const commandData: IValidCommands = lowerCaseCommandData(
    commandValidationData);
  const flagData: IValidFlags = lowerCaseFlagData(flagValidationData);

  userInput = extractCommand(userInput, instruction);
  validateCommand(instruction.command, Object.keys(commandData));

  userInput = extractFlags(userInput, instruction, flagData);
  validateFlags(instruction.flags, flagData, instruction.command);

  userInput = extractOptions(userInput, instruction);
  validateOptions(instruction.options, (commandData[instruction.command] ?
    commandData[instruction.command] : []));

  return(userInput.trim());
}

function lowerCaseCommandData(data: IValidCommands): IValidCommands {
  const commandData: IValidCommands = {};
  const keys: string[] = Object.keys(data);
  for (let i = 0; i< keys.length; i++) {
    Object.defineProperty(commandData, keys[i].toLowerCase(), {
      value: data[keys[i]],
      enumerable: true
    });
  }

  return(commandData);
}

function lowerCaseFlagData(data: IValidFlags): IValidFlags {
  const flagData: IValidFlags = {};
  const keys: string[] = Object.keys(data);
  for (let i = 0; i< keys.length; i++) {
    const valueObject = Object.assign({}, data[keys[i]]);
    if (valueObject.commands) {
      valueObject.commands = valueObject.commands.map(
        (value) => { return(value.toLowerCase()); }
      );
    }
    if (valueObject.alias) {
      valueObject.alias = valueObject.alias.toLowerCase();
    }

    Object.defineProperty(flagData, keys[i].toLowerCase(), {
      value: valueObject,
      enumerable: true
    });
  }

  return(flagData);
}

function extractCommand(input: string, instruction: IInstruction): string {
  let command: string = '';
  const whitespaceIndex: number = input.indexOf(' ');
  if (whitespaceIndex === -1) {
    command = input.substring(0);
    input = '';
  } else {
    command = input.substring(0, whitespaceIndex);
    input = input.substring(whitespaceIndex + 1);
  }
  instruction.command = command.toLowerCase();

  return(input.trim());
}

function validateCommand(
  command: string,
  validCommands: string[]
): void {
  if (validCommands.length === 0) {
    return;
  }
  if (validCommands.indexOf(command) === -1) {
    throw Error(`The command "${command}" is not valid.`);
  }
}

function extractFlags(
  input: string,
  instruction: IInstruction,
  flagData: IValidFlags
): string {
  const flags: string[][] = [];
  const flagRegEx: RegExp = /(-{1,2}[^\s]+(?:\s+|$))/i;

  let flagMatchObj: RegExpMatchArray | null = input.match(flagRegEx);
  while (flagMatchObj !== null && flagMatchObj.index !== undefined) {
    const flagObj: string[] = [flagMatchObj[1].trim().toLowerCase()];
    let numCharsRemove: number = flagMatchObj[1].length;

    let validationData = flagData[flagObj[0]];
    if (validationData) {
      if (validationData.alias) {
        const aliasFlag = validationData.alias;
        validationData = flagData[aliasFlag];

        if (validationData === undefined) {
          throw Error(`The flag "${flagObj[0]}" is aliasing a non existent ` +
            `"${aliasFlag}" flag.`);
        }
      }

      if (validationData.arg) {
        const argMatchObj: RegExpMatchArray | null = input.
          substring(flagMatchObj.index + numCharsRemove).match(
            /^([^\s]+(?:\s+|$))/i);

        if (argMatchObj !== null) {
          flagObj.push(argMatchObj[1].trim().toLowerCase());
          numCharsRemove += argMatchObj[1].length;
        }
      }
    }

    flags.push(flagObj);

    input = input.substring(0, flagMatchObj.index) +
      input.substring(flagMatchObj.index + numCharsRemove);

    flagMatchObj = input.match(flagRegEx);
  }
  instruction.flags = flags;

  return(input.trim());
}

function validateFlags(
  flags: string[][],
  flagValidationData: IValidFlags,
  command: string
): void {
  const validFlags: string[] = Object.keys(flagValidationData);
  if (validFlags.length === 0) {
    return;
  }

  for (let i = 0; i < flags.length; i++) {
    if (validFlags.indexOf(flags[i][0]) === -1) {
      throw Error(`The flag "${flags[i][0]}" is not valid.`);
    }

    let flagData = flagValidationData[flags[i][0]];
    if (flagData.alias) {
      flagData = flagValidationData[flagData.alias];
    }

    if (flagData.commands && flagData.commands.indexOf(command) === -1) {
      throw Error(
        `The command "${command}" does not accept the flag "${flags[i][0]}".`
      );
    }

    if (flagData.arg && (flags[i][1] === undefined ||
      flags[i][1].search(flagData.arg) === -1)
    ) {
      throw Error(`The argument for the flag "${flags[i][0]}" is not valid.`);
    }
  }
}

function extractOptions(input: string, instruction: IInstruction): string {
  const options: string[] = [];
  const optionRegEx: RegExp = /^([^\s]+(?:\s+|$))/i;

  let optionMatchObj: RegExpMatchArray | null = input.match(optionRegEx);
  while (optionMatchObj !== null && optionMatchObj.index !== undefined) {
    options.push(optionMatchObj[1].trim().toLowerCase());

    input = input.substring(0, optionMatchObj.index) +
      input.substring(optionMatchObj.index + optionMatchObj[1].length);

    optionMatchObj = input.match(optionRegEx);
  }
  instruction.options = options;

  return(input.trim());
}

function validateOptions(
  options: string[],
  validOptions: (RegExp | null)[]
): void {
  const maxAcceptedOpts: number = validOptions.length;
  if (maxAcceptedOpts === 0) {
    return;
  }

  const numProvidedOpts: number = options.length;
  if (maxAcceptedOpts < numProvidedOpts) {
    throw Error(`At maximum ${maxAcceptedOpts} options are expected. ` +
      `${numProvidedOpts} options were provided.`);
  }

  const numRequiredOpts: number = validOptions.filter(
    value => value !== null).length;
  if (numRequiredOpts > numProvidedOpts) {
    throw Error(`At least ${numRequiredOpts} options were expected. ` +
      `${numProvidedOpts} were provided.`);
  }

  for (let i = 0; i < numProvidedOpts; i++) {
    const optionRegEx: RegExp | null = validOptions[i];
    if (optionRegEx === null) {
      continue;
    }

    if (options[i].search(optionRegEx) === -1) {
      throw Error(`The option #${i + 1} "${options[i]}" is not valid.`);
    }
  }
}