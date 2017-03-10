This package runs `npm pack --production` and then converts the output to a .zip file.

It is designed to help you deploy NPM packages to AWS Lambda.

The content of the .zip file will be as documented at https://docs.npmjs.com/cli/pack

## Installation

`npm install --save-dev pack-zip`

## Example

_my-lambda_ is an npm package I want to run as an AWS Lambda Function.

Install _pack-zip_ locally in _my-lambda_
```
npm install --save-dev pack-zip
```

Install any runtime dependencies of _my-lambda_ as [bundled dependencies](https://docs.npmjs.com/files/package.json#bundleddependencies) so that they will be included in the package.

Modify _my-lambda/package.json_:
```
"scripts": {
    "pack-zip": "pack-zip"
    ...
}
```

Create the .zip file containing _my-lambda_ and its dependencies, ready to upload to AWS Lambda
```
npm run pack-zip
```
