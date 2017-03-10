'use strict';

const archiver = require('archiver');
const fs = require('fs');
const globby = require('globby');
const path = require('path');
const Promise = require('bluebird');

const readFile = Promise.promisify(fs.readFile);

const DEFAULT_IGNORE_PATTERNS = [
];

const DEFAULT_INCLUDE_PATTERNS = [
    '**/*',
    '!node_modules/**'
];

let getFiles = ({ cwd }) => ({ include, ignore }) => globby(include, { cwd: cwd || process.cwd(), ignore, nodir: true });

function getPackageInfo({ cwd }) {
    let at = path.resolve.bind(path, cwd || process.cwd());
    return readFile(at('package.json'), 'utf-8')
        .then(content => JSON.parse(content));
}

function getDefaultOuputFilename({ cwd }) {
    return getPackageInfo({ cwd }).then(rootPackage => `${rootPackage.name}.zip`);
}

function getGlobPatterns({ cwd }) {
    let at = path.resolve.bind(path, cwd || process.cwd());

    let includePatterns = getPackageInfo({ cwd })
        .then(rootPackage => Object.keys(rootPackage.dependencies).filter(x => x !== 'aws-sdk').map(x => `node_modules/${x}/**`))
        .then(includePatterns => DEFAULT_INCLUDE_PATTERNS.concat(includePatterns))

    let ignorePatterns = readFile(at('.packignore'), 'utf-8')
        .then(txt => txt.split('\n').map(line => line.trim()).filter(line => line.length > 0))
        .catch(error => error.code === 'ENOENT' ? Promise.resolve([]) : Promise.reject(error))
        .then(ignorePatterns => DEFAULT_IGNORE_PATTERNS.concat(ignorePatterns))

    return Promise.all([includePatterns, ignorePatterns])
        .then(([include, ignore]) => ({ include, ignore }));
}

function zipFiles({ cwd, destination }) {
    let at = path.resolve.bind(path, cwd || process.cwd());

    return files => new Promise((resolve, reject) => {
        let archive = archiver.create('zip');
        archive.on('error', error => reject(error));
        archive.pipe(fs.createWriteStream(destination)).on('end', () => resolve());
        files.forEach(file => archive.file(at(file), { name: file }));
        archive.finalize();
    });
}

function pack({ source, destination }) {
    let files = getGlobPatterns({ cwd: source })
        .then(getFiles({ cwd: source }));

    let outputFilename = destination
        ? Promise.resolve(destination)
        : getDefaultOuputFilename({ cwd: source })

    return Promise.all([outputFilename, files])
        .then(([destination, files]) => zipFiles({ cwd: source, destination })(files));
}

module.exports = {
    getFiles,
    getGlobPatterns,
    pack,
    zipFiles,
}