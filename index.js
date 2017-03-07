'use strict';

const fs = require('fs');
const path = require('path');
const tar2zip = require('tar-to-zip');


function changeExtension(extension, filename) {
    let t = path.parse(filename);
    delete t.base;
    t.ext = extension;
    let outputFileName = path.format(t);
    return outputFileName;
}

function convertToZip(filename, callback) {
    let packFileName = filename;

    let outFileName = changeExtension('.zip', packFileName);
    let outfile = fs.createWriteStream(outFileName);

    let options = {
        map: ({ name }) => ({
            name: name.replace(/^package\//,'')
        })
    };

    tar2zip(packFileName, options)
        .on('error', error => callback(error))
        .getStream()
        .pipe(outfile)
        .on('finish', () => callback(null, outFileName));
}

module.exports = {
    changeExtension,
    convertToZip
};
