# AWS TypeScript Lambda Template

This template project is a predefined and pre-configured environment for development of TypeScript-based AWS Lambda functions in a single-artifact nature. There are many tools and helpers set the way I prefer to use to ease the Lambdas development.

**Table of Contents**

- [Project structure](#project-structure)
  - [More on Handlers](#more-on-handlers)
  - [More on Models](#more-on-models)
  - [More on Repositories](#more-on-repositories)
  - [More on Resolvers](#more-on-resolvers)
  - [More on Services](#more-on-services)
- [Tooling](#tooling)
  - [Formatting](#formatting)
  - [Linting](#linting)
  - [Functional local testing](#functional-local-testing)
  - [Packaging](#packaging)
- [Testing](#testing)
  - [Static tests](#static-tests)
  - [Compilation test](#compilation-test)
  - [Functional tests](#functional-tests)
    - [Unit tests](#unit-tests)
    - [Resolver tests](#resolver-tests)
    - [Repository tests](#repository-tests)

## Project structure

Project structure is inspired by rather monolithic organization similar to best practices of Spring-based projects.
All the source code is located within `./src` folder, which is organized as:

- `./src/config` - Contains definitions to access default configurations or configurations taken from external systems.
- `./src/error` - Definition of custom _"business-level"_ errors to enhance the error handling with explicit typing.
- `./src/handler` - Actual handlers of Lambda functions - basically, these are the entrypoints of each function. You can read more about handlers in [More on Handlers](#more-on-handlers) section.
- `./src/model` - Definition of data models used within the application in a schema-oriented pattern. You can read more about models in [More on Models](#more-on-models) section.
- `./src/repository` - Repositories define the ways how to interact with external sources, mostly with databases. You can read more in [More on Repositories](#more-on-repositories) section.
- `./src/resolver` - Resolvers are basically the heavy-lifters of each Lambda function designed to actually satisfy the clients request. You can read more in [More on Resolvers](#more-on-resolvers) section.
- `./src/service` - Services are organizations of operations supporting the business-logic of each Lambda. You can read more in [More on Services](#more-on-services).
- `./src/util` - Utility helper functions used to support minor and potentially reusable use-cases.

### More on Handlers

Handlers are simply entrypoints to the Lambda function. Their only purpose is to predefine the runtime-shared resources (e.g. database connections, pre-configurations, ... - all the stuff that gets initialized during the INIT phase and remains alive between multiple executions), to perform a simple validation of the input (whether all the required values are entered) and to organize them for [resolvers](#more-on-resolvers).

This design gives a strong emphasis on dependency injection pattern.

### More on Models

Specification of schemas for data models used within the application. In this case, I prefer (and honestly recommend to everybody) to use [Zod](https://zod.dev/), which not only gives you rich schema definition options fully compatible with plain JavaScript, but also provides useful type inference for TypeScript type system. And since it's a proper schema lib, it does all the hard work with static typechecking - very useful for simply defined validation of user input.

### More on Repositories

Repository is an interface between application (i.e. Lambda function) and the database. In this case, I combine native DynamoDB with [DynamoDB Toolbox](https://www.dynamodbtoolbox.com/) (almost) ORM. This lets you to easily abstract from DynamoDB specifics with strong type-checking.

Even though this DynamoDB Toolbox project might not be as mature as native AWS libs, it's simple, effective and very clean - at least much easier to use than the native AWS libs.

Keep in mind this framework is set to be used with a Single-table paradigm, which means having multiple various entities (types of instances) in a single NoSQL table.

These components are highly dependent on external systems, in this case on DynamoDB. And from the nature of the DynamoDB Toolbox library, the simplest and cheapest way to test the functionality works as expected is to run your local DynamoDB instance in the background and execute the tests with a DynamoDB Client pointing to your localhost device. See more at [Repository tests](#repository-tests).

### More on Resolvers

Resolvers are actual Lambda function workers resolving the requests for the [handlers](#more-on-handlers). While handlers are more like entrypoints of the function, resolvers are more business-logic oriented; relying on orchestration of a process by delegating operations from one [service](#more-on-services) to another to satisfy the client request passed through higher-order handler.

These resolvers are a good place to perform end-to-end tests on the functions, since all the resources it should be parametrized (i.e. mockable) and they perform most of the business-logic. See more at [Resolver tests](#resolver-tests).

### More on Services

Services are sets of functions handling business-logic operations with high emphasis on data validation. This is a difference from [resolvers](#more-on-resolvers), which are more focused on error handling.

## Tooling

To support the developer experience, I've set this toolset to make the workplace focused, reliable and ensured to follow the industrial standards and common best practices as much as possible.

### Formatting

I've added [Prettier](https://prettier.io/) as a dev dependency to standardize the code formatting through the whole project and to share this standard in between multiple developers, such as to enforce following the defined (and agreed) rules.

To execute automatic code formatting, there is this script `npm run format`. This will deep-scan the whole project from root and overwrite the files to it's formatted form.

You can always modify the rules in `./.prettierrc.json` file; the predefined rules already specified in the file are just my custom, feel free to fiddle with it!

### Linting

To support following best practices of code, I've installed an [ESLint](https://eslint.org/) with a few plugins to uncover various industry standards violations during static code analysis.

The configuration for the code analysis is defined in the `./eslint.config.js` file - and some might find it too strict. Feel free to add/remove some rules or even whole plugins.

To trigger the code analysis, enter `npm run test:lint` command into your terminal.

### Functional local testing

For functional local test definitions and execution, I've decided to use [Jest](https://jestjs.io/) testing framework.

I use it in here in three separate contexts:

- [Unit tests](#unit-tests) - to verify that units (such as utilities or mocked services) work as expected
- [Repository tests](#repository-tests) - to verify the data retrieval (e.g. from DynamoDB) works as expected
- [Resolver tests](#resolver-tests) - to verify the end-to-end business-logic scenarios are handled properly

### Packaging

For packaging, I've decided to use [ESBuild](https://esbuild.github.io/). This supports simple and surprisingly fast builds and optimizations of artifacts from a given TypeScript.

I've decided to use it as a builder/bundler of my implementation with required dependencies focused only on a `./src/handler` folder. As seen in `./compile.js` "configuration" file, it lists all the files in the handlers folder and for each `.ts` file, it creates a brand new `.cjs` minified file with an extensive tree-shaking and containing all the required dependencies with exclusion of default aws-sdk deps, which are already contained in the Lambda runtime.

To trigger compilation, you must enter `npm run compile`. This process will clears the environment, creates a `./dist` folder containing `.cjs` files for each handler in their minified form, which can be then zipped and deployed to AWS.

To make a package (`.zip` archive) of it, you can use `npm run package`. This will once more clears the environment, takes the compiled sources from `./dist` folder, packs them together into a destination `./artifact` folder and creates a `artifact.zip` file of it.

Keep in mind this process works well to have minimalistic yet effective builds with everything they needs in place - packed together. However, in some cases I found myself in, this might not be sufficient for every use-case. One scenario it fails to satisfy is when you are creating a build with specific sources, like using `argon2` library (with added non-JS implementation) the ESBuild does not understand (and simply skips it). In this case, you must include this library in `node_modules` in the final `artifact.zip`. There might be some other scenarios like this.

### Database mock

For development and testing purposes, I've decided to use a mock-up local instance of DynamoDB I can easily start using [Docker Compose](https://docs.docker.com/compose/). This enables me to run all the tests, queries and development half-baked implementation as much as I can with minimal overhead.

#### About the mocker

The database itself is nice, but without the data, it's basically useless. I've created this simple mocking tool that starts with every startup of Docker Compose setup that clears up the tables and recreates them with fresh data - to enable tests rerun with basically the same environment.

It's simple TypeScript dockerized application being built and executed on every startup and it's only purpose is simply to refresh all the data. To find information more, see `./database/mocker/` contents.

#### Setting up the mock data

The mocking itself is performed with two simple ingredients:

- Table definition
- List of documents to be stored

In this example data, you can see these files:

- `./database/mocker/src/mockers/notes/note-data` - Defines note data in a form the items will be stored in the table
- `./database/mocker/src/mockers/notes/all-notes.ts` - Defines "all-notes-index" in a form the items will be stored in the table
- `./database/mocker/src/mockers/notes/index.ts` - Defines and exports
  - Table definition (its name, keys, attributes and indexes)
  - Items the table shall contain

#### Starting up the database

To start everything up, you have two options:

- **Start only the database with the mocker** - This is good for automating tests and simple tests execution. It simply starts up the DB instance and fills it with fresh data. To trigger this, you must enter `docker-compose up --build` (I personally prefer to make sure the previous instance is down with `docker-compose down` before).

- **Start the database, mocker and a [Web Client](#database-web-client)** - This is meant mostly for development purposes, since there is a Web Client UI started up, so on top of the database with fresh data, you get the ability to see and query the data you work with. To trigger this, you need to enter `docker-compose -f docker-compose.local.yml up --build` (with optional `docker-compose -f docker-compose.local.yml down` before).

#### Database Web Client

A minimalistic management visualization console for DynamoDB to access the contents of the tables from your browser. This image is (optionally) started alongside with the database and lets you to see what you are doing with the data in real-time.

When you decide to start the database with a web client, you can enter it from the browser, by default on http://localhost:8001.

## Testing

I've decided for testing the code at multiple levels - not only functional tests, but also static code quality assurance and verification the code can be actually built without errors.

All these testing scenarios are covered in predefined GitHub Actions Workflows (`./.github/workflows/`) and are being triggered on each commit in non-`main` branch. This approach minimizes the risk of putting somewhat invalid or low-quality code to `main` -> to deployable codebase.

### Static tests

Static tests aim on verification of code quality based on static code analysis and searching for code patterns. In this case, I have defined it to verify the code is formatted properly (see [Formatting](#formatting)) and that the code follows all the TypeScript best practices (see [Linting](#linting)).

These tests execution can be both triggered manually (using `npm run test:format` or `npm run test:lint`) and by every push to non-`main` branch (see `./.github/workflows/test-static.yml` workflow).

### Compilation test

This type of test ensure the given codebase is able to be compiled - by trying the dry-run compilation. See more in the section [Packaging](#packaging).

These tests execution can be both triggered manually (using `npm run compile`) and by every push to non-`main` branch (see `./.github/workflows/test-compilation.yml` workflow).

### Functional tests

This type of tests are aiming on functional aspects of the code (i.e. whether the code is doing what it is supposed to do).

All these tests have two separate scripts:

- `npm run test:<tests-type>` - for plain tests execution (e.g. `npm run test:unit`)
- `npm run test:<tests-type>:coverage` for tests execution with coverage statistics (e.g. `npm run test:unit:coverage`)

These tests are also triggered by every push to non-`main` branch (see `./.github/workflows/test-functional.yml` workflow).

#### Unit tests

Unit tests aim on validation of individual, mostly atomic components by providing input values and expecting exact value match.

See their configuration file `./jest.unit.config.js`.

#### Repository tests

These tests are verifying the logic behind interaction between the implementation and database. This obviously requires you to have your database set up (see [Database mock](#database-mock) section).

See their configuration file `./jest.repository.config.js`.

#### Resolver tests

Resolver tests are trying to ensure the end-to-end flow - that everything is internally behaving as expected. These tests have a high emphasis on dependency injection to minimize the needed resources (e.g. to not need a running database instance).

See their configuration file `./jest.resolver.config.js`.
