import { IInstruction, IValidCommands, IValidFlags } from './config';
export declare function parseInput(userInput: string, instruction: IInstruction, commandValidationData: IValidCommands, flagValidationData: IValidFlags): string;
