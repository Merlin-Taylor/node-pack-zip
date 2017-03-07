#!/usr/bin/env node

'use strict';

const childProcess = require('child_process');
const console = require('console');
const fs = require('fs');
const process = require('process');
const { convertToZip } = require('../index');

const NPM_PACK = 'npm pack --production';

childProcess.exec(NPM_PACK, {
    cwd: process.cwd(),
    env: process.env,
    timeout: 10000
}, (error, stdout, stderr) => {
    console.warn(stderr);
    if (error) {
        console.error(error);
    } else {
        let packFileName = stdout.trim();
        convertToZip(packFileName, (error, data) => {
            if (error) {
                console.error(error);
            } else {
                console.log(data);
                fs.unlink(packFileName, error => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        });
    }
});
