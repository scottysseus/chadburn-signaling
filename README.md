# Chadburn Signaling Server

## Development Setup

1. Install the `pnpm` package manager following [these instructions](https://pnpm.io/installation).

2. Install all dependencies:

```bash
pnpm install
```

3. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for Visual Studio Code.

4. Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

5. Set up Husky's Git hooks:

```bash
pnpm run prepare
```

6. Start the server in watch mode:

```bash
pnpm run start
```
