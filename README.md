This package creates a .zip file containing your package and its dependencies.

It is designed to help you deploy NPM packages to AWS Lambda.

The .zip file will contain
- All files not in `node_modules`
- All files in `node_modules` that are part of a package listed in the `dependencies` field of your `package.json`
- Files may be excluded by adding glob patterns to `.packignore`

## Installation

`npm install --save-dev pack-zip`

## Example

_my-lambda_ is an npm package I want to run as an AWS Lambda Function.

Install _pack-zip_ locally in _my-lambda_
```
npm install --save-dev pack-zip
```

Install any runtime dependencies of _my-lambda_.
```
npm install
```

Modify _my-lambda/package.json_:
```
"scripts": {
    "build-aws-resource": "pack-zip"
    ...
}
```

Create the .zip file containing _my-lambda_ and its dependencies, ready to upload to AWS Lambda
```
npm run build-aws-resource
```
