'use strict';

const readLine = require('readline');

export function getUserInput(
  prompt: string,
  input: NodeJS.ReadableStream = process.stdin,
  output: NodeJS.WritableStream = process.stdout,
  encoding: string = 'utf8'
): Promise<string> {
  input.setEncoding(encoding);
  const stream = readLine.createInterface(input, output);

  return(new Promise<string>((resolve, reject) => {
    try {
      stream.question(prompt, (userInput: string) => {
        stream.close();
        resolve(userInput);
      });
    } catch (error) {
      stream.close();
      reject(error.toString());
    }
  }));
}