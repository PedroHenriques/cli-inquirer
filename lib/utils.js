'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const readLine = require('readline');
function getUserInput(prompt, input = process.stdin, output = process.stdout, encoding = 'utf8') {
    input.setEncoding(encoding);
    const stream = readLine.createInterface(input, output);
    return (new Promise((resolve, reject) => {
        try {
            stream.question(prompt, (userInput) => {
                stream.close();
                resolve(userInput);
            });
        }
        catch (error) {
            stream.close();
            reject(error.toString());
        }
    }));
}
exports.getUserInput = getUserInput;
//# sourceMappingURL=utils.js.map