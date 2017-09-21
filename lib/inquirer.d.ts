import { IInstruction, IValidCommands, IValidFlags } from './config';
export declare function inquirer(prompt?: string, commandValidationData?: IValidCommands, flagValidationData?: IValidFlags): Promise<IInstruction>;
