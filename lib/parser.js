'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function parseInput(userInput, instruction, commandValidationData, flagValidationData) {
    if (userInput === '') {
        return ('');
    }
    const commandData = lowerCaseCommandData(commandValidationData);
    const flagData = lowerCaseFlagData(flagValidationData);
    userInput = extractCommand(userInput, instruction);
    validateCommand(instruction.command, Object.keys(commandData));
    userInput = extractFlags(userInput, instruction, flagData);
    validateFlags(instruction.flags, flagData, instruction.command);
    userInput = extractOptions(userInput, instruction);
    validateOptions(instruction.options, (commandData[instruction.command] ?
        commandData[instruction.command] : []));
    return (userInput.trim());
}
exports.parseInput = parseInput;
function lowerCaseCommandData(data) {
    const commandData = {};
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        Object.defineProperty(commandData, keys[i].toLowerCase(), {
            value: data[keys[i]],
            enumerable: true
        });
    }
    return (commandData);
}
function lowerCaseFlagData(data) {
    const flagData = {};
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const valueObject = Object.assign({}, data[keys[i]]);
        if (valueObject.commands) {
            valueObject.commands = valueObject.commands.map((value) => { return (value.toLowerCase()); });
        }
        if (valueObject.alias) {
            valueObject.alias = valueObject.alias.toLowerCase();
        }
        Object.defineProperty(flagData, keys[i].toLowerCase(), {
            value: valueObject,
            enumerable: true
        });
    }
    return (flagData);
}
function extractCommand(input, instruction) {
    let command = '';
    const whitespaceIndex = input.indexOf(' ');
    if (whitespaceIndex === -1) {
        command = input.substring(0);
        input = '';
    }
    else {
        command = input.substring(0, whitespaceIndex);
        input = input.substring(whitespaceIndex + 1);
    }
    instruction.command = command.toLowerCase();
    return (input.trim());
}
function validateCommand(command, validCommands) {
    if (validCommands.length === 0) {
        return;
    }
    if (validCommands.indexOf(command) === -1) {
        throw Error(`The command "${command}" is not valid.`);
    }
}
function extractFlags(input, instruction, flagData) {
    const flags = [];
    const flagRegEx = /(-{1,2}[^\s]+(?:\s+|$))/i;
    let flagMatchObj = input.match(flagRegEx);
    while (flagMatchObj !== null && flagMatchObj.index !== undefined) {
        const flagObj = [flagMatchObj[1].trim().toLowerCase()];
        let numCharsRemove = flagMatchObj[1].length;
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
                const argMatchObj = input.
                    substring(flagMatchObj.index + numCharsRemove).match(/^([^\s]+(?:\s+|$))/i);
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
    return (input.trim());
}
function validateFlags(flags, flagValidationData, command) {
    const validFlags = Object.keys(flagValidationData);
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
            throw Error(`The command "${command}" does not accept the flag "${flags[i][0]}".`);
        }
        if (flagData.arg && (flags[i][1] === undefined ||
            flags[i][1].search(flagData.arg) === -1)) {
            throw Error(`The argument for the flag "${flags[i][0]}" is not valid.`);
        }
    }
}
function extractOptions(input, instruction) {
    const options = [];
    const optionRegEx = /^([^\s]+(?:\s+|$))/i;
    let optionMatchObj = input.match(optionRegEx);
    while (optionMatchObj !== null && optionMatchObj.index !== undefined) {
        options.push(optionMatchObj[1].trim().toLowerCase());
        input = input.substring(0, optionMatchObj.index) +
            input.substring(optionMatchObj.index + optionMatchObj[1].length);
        optionMatchObj = input.match(optionRegEx);
    }
    instruction.options = options;
    return (input.trim());
}
function validateOptions(options, validOptions) {
    const maxAcceptedOpts = validOptions.length;
    if (maxAcceptedOpts === 0) {
        return;
    }
    const numProvidedOpts = options.length;
    if (maxAcceptedOpts < numProvidedOpts) {
        throw Error(`At maximum ${maxAcceptedOpts} options are expected. ` +
            `${numProvidedOpts} options were provided.`);
    }
    const numRequiredOpts = validOptions.filter(value => value !== null).length;
    if (numRequiredOpts > numProvidedOpts) {
        throw Error(`At least ${numRequiredOpts} options were expected. ` +
            `${numProvidedOpts} were provided.`);
    }
    for (let i = 0; i < numProvidedOpts; i++) {
        const optionRegEx = validOptions[i];
        if (optionRegEx === null) {
            continue;
        }
        if (options[i].search(optionRegEx) === -1) {
            throw Error(`The option #${i + 1} "${options[i]}" is not valid.`);
        }
    }
}
//# sourceMappingURL=parser.js.map