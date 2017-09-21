'use strict';
process.env.NODE_ENV = 'test';

require('mocha');
const chai = require('chai');
const proxyquire = require('proxyquire');
const assert = chai.assert;

describe('getUserInput()', function () {
  it('should set the encoding of the input, create a duplex stream, ask the user for an input, then close the stream and return a promise that resolves with the user\'s input', function () {
    let actualPrompt = '';
    const expectedUserInput = 'test user input';
    let streamClosed = false;
    const streamMock = {
      question: (prompt, cb) => {
        actualPrompt = prompt;
        cb(expectedUserInput);
      },

      close: () => {
        streamClosed = true;
      }
    };

    let actualInput = null;
    let actualOutput = null;
    let streamCreated = false;
    const readlineMock = {
      createInterface: (input, output) => {
        actualInput = input;
        actualOutput = output;
        streamCreated = true;
        return(streamMock);
      }
    };

    let actualEncoding = '';
    const inputMock = {
      setEncoding: (encoding) => {
        actualEncoding = encoding;
      }
    };

    const outputMock = {};

    const proxyUtils = proxyquire('../../lib/utils.js', {
      'readline': readlineMock
    });
    
    const expectedPrompt = 'test prompt: ';
    const expectedEncoding = 'test encoding';
    const getUserInput = proxyUtils.getUserInput(
      expectedPrompt, inputMock, outputMock, expectedEncoding
    );

    assert.typeOf(getUserInput, 'Promise');
    return(
      getUserInput.
      then((actualUserInput) => {
        assert.strictEqual(actualUserInput, expectedUserInput);
        assert.strictEqual(actualPrompt, expectedPrompt);
        assert.strictEqual(actualEncoding, expectedEncoding);
        assert.strictEqual(actualInput, inputMock);
        assert.strictEqual(actualOutput, outputMock);
        assert.strictEqual(streamCreated, true);
        assert.strictEqual(streamClosed, true);
      }, () => {
        assert.fail();
      })
    );
  });

  describe('if no encoding is passed as an argument', function () {
    it('should set the encoding to the default utf8', function () {
      let actualPrompt = '';
      const expectedUserInput = 'test user input';
      let streamClosed = false;
      const streamMock = {
        question: (prompt, cb) => {
          actualPrompt = prompt;
          cb(expectedUserInput);
        },
  
        close: () => {
          streamClosed = true;
        }
      };
  
      let actualInput = null;
      let actualOutput = null;
      let streamCreated = false;
      const readlineMock = {
        createInterface: (input, output) => {
          actualInput = input;
          actualOutput = output;
          streamCreated = true;
          return(streamMock);
        }
      };
  
      let actualEncoding = '';
      const inputMock = {
        setEncoding: (encoding) => {
          actualEncoding = encoding;
        }
      };
  
      const outputMock = {};
  
      const proxyUtils = proxyquire('../../lib/utils.js', {
        'readline': readlineMock
      });
      
      const expectedPrompt = 'test prompt: ';
      const getUserInput = proxyUtils.getUserInput(
        expectedPrompt, inputMock, outputMock
      );
  
      assert.typeOf(getUserInput, 'Promise');
      return(
        getUserInput.
        then((actualUserInput) => {
          assert.strictEqual(actualUserInput, expectedUserInput);
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualEncoding, 'utf8');
          assert.strictEqual(actualInput, inputMock);
          assert.strictEqual(actualOutput, outputMock);
          assert.strictEqual(streamCreated, true);
          assert.strictEqual(streamClosed, true);
        }, () => {
          assert.fail();
        })
      );
    });
  });

  describe('if setEncoding() throws an Error', function () {
    it('should let it bubble up', function () {
      const streamMock = {};
  
      const readlineMock = {};
  
      let actualEncoding = '';
      const inputMock = {
        setEncoding: (encoding) => {
          actualEncoding = encoding;
          throw new Error('input setEncoding() error msg.');
        }
      };
  
      const outputMock = {};
  
      const proxyUtils = proxyquire('../../lib/utils.js', {
        'readline': readlineMock
      });
      
      const expectedPrompt = 'test prompt: ';
      const expectedEncoding = 'test encoding';
      assert.throws(
        () => { proxyUtils.getUserInput(expectedPrompt, inputMock, outputMock, expectedEncoding); },
        'input setEncoding() error msg.'
      );
      assert.strictEqual(actualEncoding, expectedEncoding);
    });
  });

  describe('if createInterface() throws an Error', function () {
    it('should let it bubble up', function () {
      const streamMock = {};
  
      let actualInput = null;
      let actualOutput = null;
      const readlineMock = {
        createInterface: (input, output) => {
          actualInput = input;
          actualOutput = output;
          throw new Error('readline createInterface() error msg.');
        }
      };
  
      let actualEncoding = '';
      const inputMock = {
        setEncoding: (encoding) => {
          actualEncoding = encoding;
        }
      };
  
      const outputMock = {};
  
      const proxyUtils = proxyquire('../../lib/utils.js', {
        'readline': readlineMock
      });
      
      const expectedPrompt = 'test prompt: ';
      const expectedEncoding = 'test encoding';
      assert.throws(
        () => { proxyUtils.getUserInput(expectedPrompt, inputMock, outputMock, expectedEncoding); },
        'readline createInterface() error msg.'
      );
      assert.strictEqual(actualEncoding, expectedEncoding);
      assert.strictEqual(actualInput, inputMock);
      assert.strictEqual(actualOutput, outputMock);
    });
  });

  describe('if question() throws an Error', function () {
    it('should catch it, close the stream and return a promise that rejects with the error message', function () {
      let actualPrompt = '';
      let streamClosed = false;
      const streamMock = {
        question: (prompt, cb) => {
          actualPrompt = prompt;
          throw new Error('stream question() error msg.');
        },
  
        close: () => {
          streamClosed = true;
        }
      };
  
      let actualInput = null;
      let actualOutput = null;
      let streamCreated = false;
      const readlineMock = {
        createInterface: (input, output) => {
          actualInput = input;
          actualOutput = output;
          streamCreated = true;
          return(streamMock);
        }
      };
  
      let actualEncoding = '';
      const inputMock = {
        setEncoding: (encoding) => {
          actualEncoding = encoding;
        }
      };
  
      const outputMock = {};
  
      const proxyUtils = proxyquire('../../lib/utils.js', {
        'readline': readlineMock
      });
      
      const expectedPrompt = 'test prompt: ';
      const expectedEncoding = 'test encoding';
      const getUserInput = proxyUtils.getUserInput(
        expectedPrompt, inputMock, outputMock, expectedEncoding
      );
  
      assert.typeOf(getUserInput, 'Promise');
      return(
        getUserInput.
        then(() => {
          assert.fail();
        }, (reason) => {
          assert.strictEqual(reason, 'Error: stream question() error msg.');
          assert.strictEqual(actualPrompt, expectedPrompt);
          assert.strictEqual(actualEncoding, expectedEncoding);
          assert.strictEqual(actualInput, inputMock);
          assert.strictEqual(actualOutput, outputMock);
          assert.strictEqual(streamCreated, true);
          assert.strictEqual(streamClosed, true);
        })
      );
    });
  });
});