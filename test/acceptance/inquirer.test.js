'use strict';
process.env.NODE_ENV = 'test';

const { spawn } = require('child_process');
const path = require('path');
require('mocha');
const chai = require('chai');
const assert = chai.assert;

describe('inquirer()', function () {
  it('should return a promise that resolves with an instance with the command, options and flags correctly separated', function () {
    const expectedValue = {
      command: 'help',
      options: ['file', 'dir'],
      flags: [['-t', '../test/path']]
    };

    const asyncProc = new Promise((resolve, reject) => {
      const proc = spawn('node', [path.join(__dirname, 'proc.js')], { stdio: 'pipe' });
      
      proc.stdout.on('data', (output) => {
        proc.stdin.write('help file dir -t ../test/path\r');
        proc.stdout.once('data', (output) => {
          let actualValue = '';
          try {
            actualValue = JSON.parse(output.toString('utf8').trim());
          } catch (e) {
            actualValue = output.toString('utf8').trim();
          }
          proc.kill('SIGINT');

          try {
            resolve(actualValue);
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    return(
      asyncProc.then((actualValue) => {
        assert.deepEqual(actualValue, expectedValue);
      }, () => {
        assert.fail();
      })
    );
  });
});