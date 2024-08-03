# create-ts-node

[![npm version](https://badge.fury.io/js/create-ts-node.svg)](https://badge.fury.io/js/create-ts-node)
[![CI status](https://github.com/hilzu/create-ts-node/actions/workflows/ci.yml/badge.svg)](https://github.com/Hilzu/create-ts-node/actions/workflows/ci.yml)

Create a new Node.js application using this template.
The template includes [TypeScript][typescript] for type-safety, [esbuild][esbuild] for fast builds, [ESLint][eslint] and [typescript-eslint][ts-eslint] for linting and [Prettier][prettier] for code formatting.
Tests written with [Node.js test runner][node-test] are also included.
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

You can see the available options by running `npx create-ts-node --help`.

```
Usage: create-ts-node [options] [project-name]

Create a new TypeScript Node.js project.

Positionals:
  project-name  The name of the created project and its directory
                Can be a scoped package name (e.g. "@scope/project-name")
                (default: the current directory)

Options:
  --package-manager <name>  Force the specified package manager
  -h, --help                Display this help message
  -v, --version             Display the version number
```

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

## Dockerfile in project

A `Dockerfile` is included in the project to build a Docker image.
It is based on the official Node.js image and follows the [best practices][docker-node-best-practices] for Node.js Docker images.
You can build the image with `npm run docker:build` and run it with `npm run docker:run`.
These scripts provide a quick way to test the application in a container.

## Having issues?

If there are any issues with the template, please [open an issue][new-issue].
To debug issues you can set the environment variable `NODE_DEBUG=create-ts-node` to get more detailed logs.
Output with the variable set should be included in any bug reports.

[new-issue]: https://github.com/Hilzu/create-ts-node/issues/new/choose
[typescript]: https://www.typescriptlang.org
[esbuild]: https://esbuild.github.io
[eslint]: https://eslint.org
[ts-eslint]: https://typescript-eslint.io
[prettier]: https://prettier.io
[node-test]: https://nodejs.org/api/test.html#test-runner
[docker-node-best-practices]: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
