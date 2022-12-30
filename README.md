# Chadburn Signaling Server

## Getting Started

1. Install the `pnpm` package manager following [these instructions](https://pnpm.io/installation).

2. Install all dependencies:

```bash
pnpm install
```

3. Start the server in watch mode:

```bash
pnpm run start
```

## Development Setup

1. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for Visual Studio Code.

2. Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

3. Set up Husky's Git hooks:

```bash
pnpm run prepare
```

## Working with the Docker Image

Build the image with the following command:

```bash
pnpm run docker:build
```

Run it with this command:

```bash
pnpm run docker:start
```
