'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const parser_1 = require("./parser");
function inquirer(prompt = 'Please type a command? ', commandValidationData = {}, flagValidationData = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let userInput = '';
        const instruction = {
            command: '',
            options: [],
            flags: []
        };
        try {
            userInput = yield utils_1.getUserInput(prompt, process.stdin, process.stdout, 'utf8');
            if (userInput !== '') {
                const unparsedInput = parser_1.parseInput(userInput, instruction, commandValidationData, flagValidationData);
                if (unparsedInput !== '') {
                    throw Error(`The "${unparsedInput}" components of the provided user ` +
                        `input could not be processed.`);
                }
            }
        }
        catch (e) {
            return (Promise.reject(e.message ? e.message : e));
        }
        return (Promise.resolve(instruction));
    });
}
exports.inquirer = inquirer;
//# sourceMappingURL=inquirer.js.map