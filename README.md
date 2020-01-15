# React, TypeScript, Babel & Webpack Project Boilerplate

## Overview

A starting point for TypeScript React projects, with Babel to transpile 
TypeScript/ES6 JavaScript to ES5 JavaScript for better browser compatibility, 
including ESLint, Prettier, SCSS support & Stylelint, bundled with webpack.

## What it includes

### Webpack
The boilerplate includes webpack-dev-server for development, alongside a pre-configured 
webpack.config.js file which includes loaders for files such as SCSS/CSS, images, media 
files - with different loadersfor development and production where necessary.

### Babel
Babel-loader is set in the webpack.config.js file to transpile all of the TSX/TS files to
ES5 JavaScript via the .babelrc config in the root directory. Additional plugins or presets 
can be added or removed where needed in this file.

### Prettier/ESLint
Prettier is installed to keep a consistent codebase for the project, with ESLint added to
compliment this as the prettier/eslint plugin allows developers to visibly see formatting
errors while writing code. This functionality can be turned off in the .eslintrc.json file 
in the root directory. All prettier rules can be changed in the .prettierrc config file.

### TypeScript
The latest version of TypeScript is included, with a config file (tsconfig.json) in the root 
directory. It currently only has the bare-bones to get started with TypeScript and React so it 
has many options to change.

## Usage
- Navigate to the directory you want to save the clone into.
- Initialise git repository by running `git init`.
- Run `git clone https://github.com/jamesgower/typescript-react-boilerplate` in the CLI.
- Navigate to the file by running `cd typescript-react-boilerplate`.