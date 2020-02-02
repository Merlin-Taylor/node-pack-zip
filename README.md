This package creates a .zip file containing your package and its dependencies, including
transitive dependencies.

The code was forked from [node-pack-zip](https://github.com/Merlin-Taylor/node-pack-zip)
which did not support transitive dependencies (see [issue#2](https://github.com/Merlin-Taylor/node-pack-zip/issues/2)).

It was mainly designed to help deploy nodejs packages in AWS lambdas.

The .zip file will contain
- All files not in `node_modules`
- All files in `node_modules` that are part of a package listed in the `dependencies` field of your `package.json` and
all their transitives dependencies
- Files may be excluded by adding glob patterns to `.packignore`

## Installation

`npm install --save-dev repack-zip`

## Example

_my-lambda_ is an npm package I want to run as an AWS Lambda Function.

Install _repack-zip_ locally in _my-lambda_
```
npm install --save-dev repack-zip
```

Install any runtime dependencies of _my-lambda_.
```
npm install
```

Modify _my-lambda/package.json_:
```
"scripts": {
    "build-aws-lambda": "repack-zip"
    ...
}
```

Create the .zip file containing _my-lambda_ and all its dependencies, ready to be uploaded to AWS Lambda
```
npm run build-aws-lambda
```

## Release notes
0.2.6 - Do not stop on missing package.json in dependency and support scoped modules.
(contributions from [Enalmada](https://github.com/Enalmada) and [g00dnatur3](https://github.com/g00dnatur3)).

0.2.5 - Added support for root module _phantomChildren dependencies 
(contribution from [jasonfagan](https://github.com/jasonfagan)).

0.2.4 - Initial published release

