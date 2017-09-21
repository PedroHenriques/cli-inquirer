'use strict';
process.env.NODE_ENV = 'test';

require('mocha');
const chai = require('chai');
const proxyquire = require('proxyquire');
const assert = chai.assert;

describe('inquirer()', function () {
  it('should call getUserInput() then call parseInput() on the received user input and return a promise that resolves with the complete instruction', function () {
    let actualPrompt = '';
    let actualInput = null;
    let actualOutput = null;
    let actualEncoding = '';
    const expectedUserInput = 'test user input';
    const getUserInputMock = (prompt, input, output, encoding) => {
      actualPrompt = prompt;
      actualInput = input;
      actualOutput = output;
      actualEncoding = encoding;

      return(Promise.resolve(expectedUserInput));
    };

    let parseInputUserInput = '';
    let parseInputInstruction = {};
    let parseInputCommandValidation = {};
    let parseInputFlagValidation = {};
    const parseInputMock = (userInput, instruction, commandValidation, flagValidation) => {
      parseInputUserInput = userInput;
      parseInputInstruction = Object.assign({}, instruction);
      parseInputCommandValidation = commandValidation;
      parseInputFlagValidation = flagValidation;

      instruction.command = 'testCommand';
      instruction.options = ['opt1', 'opt2'];
      instruction.flags = [['-t', 'arg1'], ['-f']];
      return('');
    };
    
    const proxyInquirer = proxyquire('../../lib/inquirer.js', {
      './utils': { getUserInput: getUserInputMock },
      './parser': { parseInput: parseInputMock }
    });

    const expectedPrompt = 'test prompt: ';
    const inquirer = proxyInquirer.inquirer(expectedPrompt);

    const expectedInstruction = {
      command: 'testCommand',
      options: ['opt1', 'opt2'],
      flags: [['-t', 'arg1'], ['-f']]
    };

    assert.typeOf(inquirer, 'Promise');
    return(
      inquirer.
      then((actualInstruction) => {
        assert.deepEqual(actualInstruction, expectedInstruction);
        assert.strictEqual(actualPrompt, expectedPrompt);
        assert.strictEqual(actualInput, process.stdin);
        assert.strictEqual(actualOutput, process.stdout);
        assert.strictEqual(actualEncoding, 'utf8');
        assert.strictEqual(parseInputUserInput, expectedUserInput);
        assert.deepEqual(parseInputInstruction, { command: '', options: [], flags: [] });
        assert.deepEqual(parseInputCommandValidation, {});
        assert.deepEqual(parseInputFlagValidation, {});
      }, () => {
        assert.fail();
      })
    );
  });

  describe('if the user\'s input is an empty string', function () {
    it('should return an "empty" instruction', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.resolve(''));
      };
  
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: {} }
      });
  
      const expectedPrompt = 'test prompt: ';
      const inquirer = proxyInquirer.inquirer(expectedPrompt);
  
      const expectedInstruction = {
        command: '',
        options: [],
        flags: []
      };
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then((actualInstruction) => {
          assert.deepEqual(actualInstruction, expectedInstruction);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
        }, () => {
          assert.fail();
        })
      );
    });
  });

  describe('if parseInput() returns a non-empty string', function () {
    it('should return a promise that rejects with an error msg', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedUserInput = 'test user input';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.resolve(expectedUserInput));
      };
  
      let parseInputUserInput = '';
      let parseInputInstruction = {};
      let parseInputCommandValidation = {};
      let parseInputFlagValidation = {};
      const parseInputMock = (userInput, instruction, commandValidation, flagValidation) => {
        parseInputUserInput = userInput;
        parseInputInstruction = Object.assign({}, instruction);
        parseInputCommandValidation = commandValidation;
        parseInputFlagValidation = flagValidation;
  
        instruction.command = 'testCommand';
        instruction.options = ['opt1', 'opt2'];
        instruction.flags = [['-t', 'arg1'], ['-f']];
        return('unparsed string');
      };
      
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: parseInputMock }
      });
  
      const expectedPrompt = 'test prompt: ';
      const inquirer = proxyInquirer.inquirer(expectedPrompt);;

      const expectedInstruction = {
        command: 'testCommand',
        options: ['opt1', 'opt2'],
        flags: [['-t', 'arg1'], ['-f']]
      };

      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then(() => {
          assert.fail();
        }, (reason) => {
          assert.strictEqual(reason, 'The "unparsed string" components of the provided user input could not be processed.');
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
          assert.strictEqual(parseInputUserInput, expectedUserInput);
          assert.deepEqual(parseInputInstruction, { command: '', options: [], flags: [] });
          assert.deepEqual(parseInputCommandValidation, {});
          assert.deepEqual(parseInputFlagValidation, {});
        })
      );
    });
  });

  describe('if validation data for the commands is provided', function () {
    it('should provide the necessary data to parseInput()', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedUserInput = 'test user input';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.resolve(expectedUserInput));
      };
  
      let parseInputUserInput = '';
      let parseInputInstruction = {};
      let parseInputCommandValidation = {};
      let parseInputFlagValidation = {};
      const parseInputMock = (userInput, instruction, commandValidation, flagValidation) => {
        parseInputUserInput = userInput;
        parseInputInstruction = Object.assign({}, instruction);
        parseInputCommandValidation = commandValidation;
        parseInputFlagValidation = flagValidation;
  
        instruction.command = 'testCommand';
        instruction.options = ['opt1', 'opt2'];
        instruction.flags = [['-t', 'arg1'], ['-f']];
        return('');
      };
      
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: parseInputMock }
      });
  
      const expectedPrompt = 'test prompt: ';
      const expectedCommandValidation = {
        testCommand: [/.+/i, null],
        otherCommand: [/.+/i, /opt2/i],
      };
      const inquirer = proxyInquirer.inquirer(expectedPrompt, expectedCommandValidation);
  
      const expectedInstruction = {
        command: 'testCommand',
        options: ['opt1', 'opt2'],
        flags: [['-t', 'arg1'], ['-f']]
      };
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then((actualInstruction) => {
          assert.deepEqual(actualInstruction, expectedInstruction);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
          assert.strictEqual(parseInputUserInput, expectedUserInput);
          assert.deepEqual(parseInputInstruction, { command: '', options: [], flags: [] });
          assert.deepEqual(parseInputCommandValidation, expectedCommandValidation);
          assert.deepEqual(parseInputFlagValidation, {});
        }, () => {
          assert.fail();
        })
      );
    });
  });

  describe('if validation data for the flags is provided', function () {
    it('should provide the necessary data to parseInput()', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedUserInput = 'test user input';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.resolve(expectedUserInput));
      };
  
      let parseInputUserInput = '';
      let parseInputInstruction = {};
      let parseInputCommandValidation = {};
      let parseInputFlagValidation = {};
      const parseInputMock = (userInput, instruction, commandValidation, flagValidation) => {
        parseInputUserInput = userInput;
        parseInputInstruction = Object.assign({}, instruction);
        parseInputCommandValidation = commandValidation;
        parseInputFlagValidation = flagValidation;
  
        instruction.command = 'testCommand';
        instruction.options = ['opt1', 'opt2'];
        instruction.flags = [['-t', 'arg1'], ['-f']];
        return('');
      };
      
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: parseInputMock }
      });
  
      const expectedPrompt = 'test prompt: ';
      const expectedFlagValidation = {
        '--flag-one': { commands: ['testCommand', 'otherCommand'], arg: /.+/i },
        '-t': { commands: ['otherCommand'], arg: /.+/i },
        '--flag-two': { commands: ['testCommand', 'otherCommand'] }
      };
      const inquirer = proxyInquirer.inquirer(expectedPrompt, {}, expectedFlagValidation);
  
      const expectedInstruction = {
        command: 'testCommand',
        options: ['opt1', 'opt2'],
        flags: [['-t', 'arg1'], ['-f']]
      };
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then((actualInstruction) => {
          assert.deepEqual(actualInstruction, expectedInstruction);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
          assert.strictEqual(parseInputUserInput, expectedUserInput);
          assert.deepEqual(parseInputInstruction, { command: '', options: [], flags: [] });
          assert.deepEqual(parseInputCommandValidation, {});
          assert.deepEqual(parseInputFlagValidation, expectedFlagValidation);
        }, () => {
          assert.fail();
        })
      );
    });
  });

  describe('if validation data for the commands and flags is provided', function () {
    it('should provide the necessary data to parseInput()', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedUserInput = 'test user input';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.resolve(expectedUserInput));
      };
  
      let parseInputUserInput = '';
      let parseInputInstruction = {};
      let parseInputCommandValidation = {};
      let parseInputFlagValidation = {};
      const parseInputMock = (userInput, instruction, commandValidation, flagValidation) => {
        parseInputUserInput = userInput;
        parseInputInstruction = Object.assign({}, instruction);
        parseInputCommandValidation = commandValidation;
        parseInputFlagValidation = flagValidation;
  
        instruction.command = 'testCommand';
        instruction.options = ['opt1', 'opt2'];
        instruction.flags = [['-t', 'arg1'], ['-f']];
        return('');
      };
      
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: parseInputMock }
      });
  
      const expectedPrompt = 'test prompt: ';
      const expectedCommandValidation = {
        testCommand: [/.+/i, null],
        otherCommand: [/.+/i, /opt2/i],
      };
      const expectedFlagValidation = {
        '--flag-one': { commands: ['testCommand', 'otherCommand'], arg: /.+/i },
        '-t': { commands: ['otherCommand'], arg: /.+/i },
        '--flag-two': { commands: ['testCommand', 'otherCommand'] }
      };
      const inquirer = proxyInquirer.inquirer(
        expectedPrompt, expectedCommandValidation, expectedFlagValidation
      );
  
      const expectedInstruction = {
        command: 'testCommand',
        options: ['opt1', 'opt2'],
        flags: [['-t', 'arg1'], ['-f']]
      };
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then((actualInstruction) => {
          assert.deepEqual(actualInstruction, expectedInstruction);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
          assert.strictEqual(parseInputUserInput, expectedUserInput);
          assert.deepEqual(parseInputInstruction, { command: '', options: [], flags: [] });
          assert.deepEqual(parseInputCommandValidation, expectedCommandValidation);
          assert.deepEqual(parseInputFlagValidation, expectedFlagValidation);
        }, () => {
          assert.fail();
        })
      );
    });
  });

  describe('if getUserInput() returns a rejected promise', function () {
    it('should return a promise that rejects with the received reason', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedReason = 'getUserInputMock test error msg';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.reject(expectedReason));
      };
  
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: {} }
      });
  
      const expectedPrompt = 'test prompt: ';
      const inquirer = proxyInquirer.inquirer(expectedPrompt);
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then(() => {
          assert.fail();
        }, (reason) => {
          assert.strictEqual(reason, expectedReason);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
        })
      );
    });
  });

  describe('if getUserInput() throws an Error', function () {
    it('should catch it and return a promise that rejects with the thrown error msg', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedReason = 'getUserInputMock test error msg';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        throw Error(expectedReason);
      };
  
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: {} }
      });
  
      const expectedPrompt = 'test prompt: ';
      const inquirer = proxyInquirer.inquirer(expectedPrompt);
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then(() => {
          assert.fail();
        }, (reason) => {
          assert.strictEqual(reason, expectedReason);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
        })
      );
    });
  });

  describe('if parseInput() throws an Error', function () {
    it('should catch it and return a promise that rejects with the thrown error msg', function () {
      let actualPrompt = '';
      let actualInput = null;
      let actualOutput = null;
      let actualEncoding = '';
      const expectedUserInput = 'test user input';
      const getUserInputMock = (prompt, input, output, encoding) => {
        actualPrompt = prompt;
        actualInput = input;
        actualOutput = output;
        actualEncoding = encoding;
  
        return(Promise.resolve(expectedUserInput));
      };
  
      const expectedReason = 'extractCommand() test error msg.';
      let parseInputUserInput = '';
      let parseInputInstruction = {};
      let parseInputCommandValidation = {};
      let parseInputFlagValidation = {};
      const parseInputMock = (userInput, instruction, commandValidation, flagValidation) => {
        parseInputUserInput = userInput;
        parseInputInstruction = Object.assign({}, instruction);
        parseInputCommandValidation = commandValidation;
        parseInputFlagValidation = flagValidation;
  
        instruction.command = 'testCommand';
        instruction.options = ['opt1', 'opt2'];
        instruction.flags = [['-t', 'arg1'], ['-f']];
        throw Error(expectedReason);
      };
      
      const proxyInquirer = proxyquire('../../lib/inquirer.js', {
        './utils': { getUserInput: getUserInputMock },
        './parser': { parseInput: parseInputMock }
      });
  
      const expectedPrompt = 'test prompt: ';
      const inquirer = proxyInquirer.inquirer(expectedPrompt);
  
      assert.typeOf(inquirer, 'Promise');
      return(
        inquirer.
        then(() => {
          assert.fail();
        }, (reason) => {
          assert.strictEqual(reason, expectedReason);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualInput, process.stdin);
          assert.strictEqual(actualOutput, process.stdout);
          assert.strictEqual(actualEncoding, 'utf8');
          assert.strictEqual(parseInputUserInput, expectedUserInput);
          assert.deepEqual(parseInputInstruction, { command: '', options: [], flags: [] });
          assert.deepEqual(parseInputCommandValidation, {});
          assert.deepEqual(parseInputFlagValidation, {});
        })
      );
    });
  });
});