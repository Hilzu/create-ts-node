# create-ts-node

[![npm version](https://badge.fury.io/js/create-ts-node.svg)](https://badge.fury.io/js/create-ts-node)
[![CI status](https://github.com/hilzu/create-ts-node/actions/workflows/ci.yml/badge.svg)](https://github.com/Hilzu/create-ts-node/actions/workflows/ci.yml)

Create a new Node.js application using this template.
The template includes TypeScript for type-safety, ESLint for linting and Prettier for code formatting.
Everything is configured to work together out of the box and using modern conventions.

EcmaScript modules are used instead of CommonJS to align with the future of JavaScript and Node.js.
This allows to natively use `import` and `export` statements and top-level `await`.

This is a good starting point for all Node.js TypeScript applications.
For libraries some adjustments might be needed after creating the project.

## Create a new project

Create a new project by running any of the following commands.

```bash
# Using npm
npm init ts-node@latest new-app

# Using npx
npx create-ts-node@latest new-app

# Using yarn
yarn create ts-node new-app

# Using pnpm
pnpm create ts-node new-app
```

The command will create a new project in the `new-app` directory with the template files.
After the project is created, you can navigate to the project directory and start developing.

You can also leave out the project name or specify `.` to create the project in the current directory.
For safety creation is not allowed in an existing directory unless it is empty.

Scoped project names are supported, for example `@my-scope/new-app`.
The directory name will be the same as the project name without the scope.

## Compatability and supported Node.js versions

Windows, Linux and macOS are supported.

npm, yarn and pnpm are the supported package managers.
The template is automatically adjusted based on the package manager used.

The latest version targets the active LTS and current version of Node.js.
To create a project for an older version of Node.js, use an older version of this package.

| Node.js version | Package version |
| --------------- | --------------- |
| 20.x or greater | latest          |
| 18.x            | ^0.4.0          |
| 10.x            | ^0.2.0          |
| 8.x             | ^0.1.0          |

You can use an older version easily with npx: `npx create-ts-node@^0.4.0 new-app`.

Project creation is tested with the combination (matrix) of supported Node.js versions, package managers and operating systems.

## Having issues?

If there are any issues with the template, please [open an issue](https://github.com/Hilzu/create-ts-node/issues/new/choose).
To debug issues you can set the environment variable `NODE_DEBUG=create-ts-node` to get more detailed logs.
Output with the variable set should be included in any bug reports.
