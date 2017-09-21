'use strict';

import { IInstruction, IValidCommands, IValidFlags } from './config';
import { getUserInput } from './utils';
import { parseInput } from './parser';

export async function inquirer(
  prompt: string = 'Please type a command? ',
  commandValidationData: IValidCommands = {},
  flagValidationData: IValidFlags = {}
): Promise<IInstruction> {
  let userInput: string = '';
  const instruction: IInstruction = {
    command: '',
    options: [],
    flags: []
  };

  try {
    userInput = await getUserInput(
      prompt, process.stdin, process.stdout, 'utf8'
    );

    if (userInput !== '') {
      const unparsedInput: string = parseInput(userInput, instruction,
        commandValidationData, flagValidationData);

      if (unparsedInput !== '') {
        throw Error(`The "${unparsedInput}" components of the provided user ` +
          `input could not be processed.`);
      }
    }
  } catch (e) {
    return(Promise.reject(e.message ? e.message : e));
  }

  return(Promise.resolve(instruction));
}
