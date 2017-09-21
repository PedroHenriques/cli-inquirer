'use strict';
process.env.NODE_ENV = 'test';

require('mocha');
const chai = require('chai');
const proxyquire = require('proxyquire');
const assert = chai.assert;

describe('parseInput()', function () {
  it('should add the first word in the provided string to instruction.command, all the flags and their args to instruction.flags and the options to instruction.options and return an empty string', function () {
    const proxyParser = proxyquire('../../lib/parser.js', {});

    const expectedInstruction = {
      command: 'help',
      options: ['file', 'dir', '../test/path'],
      flags: [['-f'], ['--target']]
    };
    const actualInstruction = {
      command: '',
      options: [],
      flags: []
    };
    const unparsedInput = proxyParser.parseInput(
      'help file -f dir --target ../test/path', actualInstruction, {}, {}
    );

    assert.strictEqual(unparsedInput, '');
    assert.deepEqual(actualInstruction, expectedInstruction);
  });

  describe('if an empty userInput is provided', function () {
    it('should leave the instruction unchanged and return an empty string', function () {
      const proxyParser = proxyquire('../../lib/parser.js', {});
      
      const expectedInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const actualInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const unparsedInput = proxyParser.parseInput(
        '', actualInstruction, {}, {}
      );
  
      assert.strictEqual(unparsedInput, '');
      assert.deepEqual(actualInstruction, expectedInstruction);
    });
  });

  describe('if only a command is provided', function () {
    it('should add the command to instruction.command and return an empty string', function () {
      const proxyParser = proxyquire('../../lib/parser.js', {});
      
      const expectedInstruction = {
        command: 'firstword',
        options: [],
        flags: []
      };
      const actualInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const unparsedInput = proxyParser.parseInput(
        'firstWord', actualInstruction, {}, {}
      );
  
      assert.strictEqual(unparsedInput, '');
      assert.deepEqual(actualInstruction, expectedInstruction);
    });
  });
  
  describe('if only a command and options are provided', function () {
    it('should add the command to instruction.command, the options to instruction.options and return an empty string', function () {
      const proxyParser = proxyquire('../../lib/parser.js', {});
      
      const expectedInstruction = {
        command: 'help',
        options: ['file', 'direcção'],
        flags: []
      };
      const actualInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const unparsedInput = proxyParser.parseInput(
        'help file direcção', actualInstruction, {}, {}
      );
  
      assert.strictEqual(unparsedInput, '');
      assert.deepEqual(actualInstruction, expectedInstruction);
    });
  });
  
  describe('if only a command and flags are provided', function () {
    it('should add the command to instruction.command, the flags to instruction.flags and return an empty string', function () {
      const proxyParser = proxyquire('../../lib/parser.js', {});
      
      const expectedInstruction = {
        command: 'firstword',
        options: [],
        flags: [['-t'], ['--flag-one']]
      };
      const actualInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const unparsedInput = proxyParser.parseInput(
        'firstWord -t --flag-one', actualInstruction, {}, {}
      );
  
      assert.strictEqual(unparsedInput, '');
      assert.deepEqual(actualInstruction, expectedInstruction);
    });
  });

  describe('if validation data for the command is provided', function () {
    it('should check if the extracted command and options are valid', function () {
      const proxyParser = proxyquire('../../lib/parser.js', {});
      
      const expectedInstruction = {
        command: 'help',
        options: ['file', '../test/path'],
        flags: [['-f'], ['--target']]
      };
      const actualInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const commandValidationData = {
        'help': [/.+/i, null],
        'firstWord': [/opt1/i, /opt2/i]
      };
      const unparsedInput = proxyParser.parseInput(
        'help file -f --target ../test/path', actualInstruction, commandValidationData, {}
      );
  
      assert.strictEqual(unparsedInput, '');
      assert.deepEqual(actualInstruction, expectedInstruction);
    });

    describe('if an empty userInput is provided', function () {
      it('should leave the instruction unchanged and return an empty string', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };
        const unparsedInput = proxyParser.parseInput(
          '', actualInstruction, commandValidationData, {}
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });
    });

    describe('if the extracted command is valid, but has a different case structure', function () {
      it('should consider it a valid command', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'firstword',
          options: ['opt1', 'opt2'],
          flags: [['-t'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };
        const unparsedInput = proxyParser.parseInput(
          'FIrSTworD opt1 -t opt2 --flag-one', actualInstruction, commandValidationData, {}
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });
    });

    describe('if a non-required option is not provided', function () {
      it('should consider the situation as valid', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'testcommand',
          options: ['opt1'],
          flags: [['-t'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };
        const unparsedInput = proxyParser.parseInput(
          'testCommand opt1 -t --flag-one', actualInstruction, commandValidationData, {}
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });
    });

    describe('if the extracted command is not valid', function () {
      it('should throw an Error with an error msg', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };

        assert.throws(
          () => {
            proxyParser.parseInput(
              'invalidCommand opt1 -t opt2 --flag-one', actualInstruction, commandValidationData, {}
            );
          },
          'The command "invalidcommand" is not valid.'
        );
      });
    });

    describe('if an option does not match its respective regex', function () {
      it('should throw an Error with an error msg', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };

        assert.throws(
          () => {
            proxyParser.parseInput(
              'firstWord opt1 -t invalidOpt --flag-one', actualInstruction, commandValidationData, {}
            );
          },
          'The option #2 "invalidopt" is not valid.'
        );
      });
    });

    describe('if too many options are provided', function () {
      it('should throw an Error with an error msg', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };

        assert.throws(
          () => {
            proxyParser.parseInput(
              'testCommand opt1 -t opt2 opt3 --flag-one', actualInstruction, commandValidationData, {}
            );
          },
          'At maximum 2 options are expected. 3 options were provided.'
        );
      });
    });

    describe('if too few required options are provided', function () {
      it('should throw an Error with an error msg', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const commandValidationData = {
          'testCommand': [/.+/i, null],
          'firstWord': [/opt1/i, /opt2/i]
        };

        assert.throws(
          () => {
            proxyParser.parseInput(
              'testCommand -t --flag-one', actualInstruction, commandValidationData, {}
            );
          },
          'At least 1 options were expected. 0 were provided.'
        );
      });
    });
  });

  describe('if validation data for the flags is provided', function () {
    it('should check if the extracted flags are valid', function () {
      const proxyParser = proxyquire('../../lib/parser.js', {});
      
      const expectedInstruction = {
        command: 'firstword',
        options: ['opt1', 'opt2'],
        flags: [['-t', 'arg'], ['--flag-one']]
      };
      const actualInstruction = {
        command: '',
        options: [],
        flags: []
      };
      const flagValidationData = {
        '-t': {
          commands: ['testCommand', 'firstWord'],
          arg: /.+/i
        },
        '--target': {
          alias: '-t'
        },
        '--flag-one': {
          commands: ['firstWord']
        }
      };
      const unparsedInput = proxyParser.parseInput(
        'firstWord opt1 -t arg opt2 --flag-one', actualInstruction, {}, flagValidationData
      );
  
      assert.strictEqual(unparsedInput, '');
      assert.deepEqual(actualInstruction, expectedInstruction);
    });

    describe('if an empty userInput is provided', function () {
      it('should leave the instruction unchanged and return an empty string', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const flagValidationData = {
          '-t': {
            commands: ['testCommand', 'firstWord'],
            arg: /.+/i
          },
          '--target': {
            alias: '-t'
          },
          '--flag-one': {
            commands: ['firstWord']
          }
        };
        const unparsedInput = proxyParser.parseInput(
          '', actualInstruction, {}, flagValidationData
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });
    });

    describe('if an extracted flag does not exist in the validation object', function () {
      it('should throw an Error with an error msg', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'firstword',
          options: [],
          flags: [['-t', 'arg'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const flagValidationData = {
          '-t': {
            commands: ['testCommand', 'firstWord'],
            arg: /.+/i
          },
          '--target': {
            alias: '-t'
          }
        };

        assert. throws(
          () => {
            proxyParser.parseInput(
              'firstWord opt1 -t arg opt2 --flag-one', actualInstruction, {}, flagValidationData
            );
          },
          'The flag "--flag-one" is not valid.'
        );
        assert.deepEqual(actualInstruction, expectedInstruction);
      });
    });

    describe('if a flag does not have a "commands" property', function () {
      it('should be considered valid for all commands', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'firstword',
          options: ['opt1', 'opt2'],
          flags: [['-t', 'arg'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const flagValidationData = {
          '-t': {
            commands: ['testCommand', 'firstWord'],
            arg: /.+/i
          },
          '--target': {
            alias: '-t'
          },
          '--flag-one': {}
        };
        const unparsedInput = proxyParser.parseInput(
          'firstWord opt1 -t arg opt2 --flag-one', actualInstruction, {}, flagValidationData
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });
    });

    describe('if a flag has a "commands" property', function () {
      it('should check if the extracted flag-command pair is valid', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'firstword',
          options: ['opt1', 'opt2'],
          flags: [['-t', 'arg'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const flagValidationData = {
          '-t': {
            commands: ['testCommand', 'firstWord'],
            arg: /.+/i
          },
          '--target': {
            alias: '-t'
          },
          '--flag-one': {
            commands: ['firstWord']
          }
        };
        const unparsedInput = proxyParser.parseInput(
          'firstWord opt1 -t arg opt2 --flag-one', actualInstruction, {}, flagValidationData
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });

      describe('if an extracted flag is not valid for the extracted command', function () {
        it('should throw an Error with an error msg', function () {
          const proxyParser = proxyquire('../../lib/parser.js', {});
          
          const expectedInstruction = {
            command: 'firstword',
            options: [],
            flags: [['-t', 'arg'], ['--flag-one']]
          };
          const actualInstruction = {
            command: '',
            options: [],
            flags: []
          };
          const flagValidationData = {
            '-t': {
              commands: ['testCommand'],
              arg: /.+/i
            },
            '--target': {
              alias: '-t'
            },
            '--flag-one': {
              commands: ['firstWord']
            }
          };

          assert.throws(
            () => {
              proxyParser.parseInput(
                'firstWord opt1 -t arg opt2 --flag-one', actualInstruction, {}, flagValidationData
              );
            },
            'The command "firstword" does not accept the flag "-t".'
          );
          assert.deepEqual(actualInstruction, expectedInstruction);
        });
      });
    });

    describe('if a flag has an "arg" property', function () {
      it('should check if the first word after the flag matches the provided regex', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'firstword',
          options: ['opt1', 'opt2'],
          flags: [['-t', 'arg'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const flagValidationData = {
          '-t': {
            commands: ['testCommand', 'firstWord'],
            arg: /ar\w/i
          },
          '--target': {
            alias: '-t'
          },
          '--flag-one': {
            commands: ['firstWord']
          }
        };
        const unparsedInput = proxyParser.parseInput(
          'firstWord opt1 -t arg opt2 --flag-one', actualInstruction, {}, flagValidationData
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });

      describe('if the first word after the flag does not match the regex', function () {
        it('should throw an Error with an error msg', function () {
          const proxyParser = proxyquire('../../lib/parser.js', {});
          
          const expectedInstruction = {
            command: 'firstword',
            options: [],
            flags: [['-t', 'invalidarg'], ['--flag-one']]
          };
          const actualInstruction = {
            command: '',
            options: [],
            flags: []
          };
          const flagValidationData = {
            '-t': {
              commands: ['testCommand', 'firstWord'],
              arg: /^ar\w/i
            },
            '--target': {
              alias: '-t'
            },
            '--flag-one': {
              commands: ['firstWord']
            }
          };

          assert.throws(
            () => {
              proxyParser.parseInput(
                'firstWord opt1 -t invalidArg opt2 --flag-one', actualInstruction, {}, flagValidationData
              );
            },
            'The argument for the flag "-t" is not valid.'
          );
          assert.deepEqual(actualInstruction, expectedInstruction);
        });
      });

      describe('if there is no word after the flag', function () {
        it('should throw an Error with an error msg', function () {
          const proxyParser = proxyquire('../../lib/parser.js', {});
          
          const expectedInstruction = {
            command: 'firstword',
            options: [],
            flags: [['-t'], ['--flag-one']]
          };
          const actualInstruction = {
            command: '',
            options: [],
            flags: []
          };
          const flagValidationData = {
            '-t': {
              commands: ['testCommand', 'firstWord']
            },
            '--target': {
              alias: '-t'
            },
            '--flag-one': {
              commands: ['firstWord'],
              arg: /^arg\w/i
            }
          };

          assert.throws(
            () => {
              proxyParser.parseInput(
                'firstWord opt1 -t invalidArg opt2 --flag-one', actualInstruction, {}, flagValidationData
              );
            },
            'The argument for the flag "--flag-one" is not valid.'
          );
          assert.deepEqual(actualInstruction, expectedInstruction);
        });
      });
    });

    describe('if a flag has an "alias" property', function () {
      it('should use the same configuration of the flag its pointing to', function () {
        const proxyParser = proxyquire('../../lib/parser.js', {});
        
        const expectedInstruction = {
          command: 'firstword',
          options: ['opt1', 'opt2'],
          flags: [['--target', 'arg'], ['--flag-one']]
        };
        const actualInstruction = {
          command: '',
          options: [],
          flags: []
        };
        const flagValidationData = {
          '-t': {
            commands: ['testCommand', 'firstWord'],
            arg: /ar\w/i
          },
          '--target': {
            alias: '-t'
          },
          '--flag-one': {
            commands: ['firstWord']
          }
        };
        const unparsedInput = proxyParser.parseInput(
          'firstWord opt1 --target arg opt2 --flag-one', actualInstruction, {}, flagValidationData
        );
    
        assert.strictEqual(unparsedInput, '');
        assert.deepEqual(actualInstruction, expectedInstruction);
      });

      describe('if the flag being pointed to does not exist', function () {
        it('should throw an Error with an error msg', function () {
          const proxyParser = proxyquire('../../lib/parser.js', {});
          
          const expectedInstruction = {
            command: 'firstword',
            options: [],
            flags: []
          };
          const actualInstruction = {
            command: '',
            options: [],
            flags: []
          };
          const flagValidationData = {
            '--target': {
              alias: '-t'
            },
            '--flag-one': {
              commands: ['firstWord']
            }
          };

          assert.throws(
            () => {
              proxyParser.parseInput(
                'firstWord opt1 --target arg opt2 --flag-one', actualInstruction, {}, flagValidationData
              );
            },
            'The flag "--target" is aliasing a non existent "-t" flag.'
          );
          assert.deepEqual(actualInstruction, expectedInstruction);
        });
      });
    });
  });
});