export interface IInstruction {
    command: string;
    options: string[];
    flags: string[][];
}
export interface IValidCommands {
    [key: string]: (RegExp | null)[];
}
export interface IValidFlags {
    [key: string]: {
        commands?: string[];
        arg?: RegExp;
        alias?: string;
    };
}
