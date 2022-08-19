# 🚀 NEAROracle
![primary-logo](https://user-images.githubusercontent.com/82831286/174408312-d30520fb-c77a-4f2c-aa3e-b754ac7a797a.png)

⚡️ This is the client side for NEAROracle, made with the developer experience in mind: Next.js, TypeScript, ESLint, Prettier, Husky, Lint-Staged, VSCode, PostCSS, Tailwind CSS.

### Features

Developer experience first:

- 🔥 [Next.js](https://nextjs.org) for a Server Side Rendered Static Site
- 🎨 Integrated with [Tailwind CSS](https://tailwindcss.com) & [Ant Design](https://ant.design/)
- 🎉 Type checking [TypeScript](https://www.typescriptlang.org)
- ✏️ Linter with [ESLint](https://eslint.org) (default NextJS, NextJS Core Web Vitals and Airbnb configuration)
- 💡 Absolute Imports
- 🛠 Code Formatter with [Prettier](https://prettier.io)
- 🦊 Husky for Git Hooks
- 🚫 Lint-staged for running linters on Git staged files
- 🗂 VSCode configuration: Debug, Settings, Tasks and extension for PostCSS, ESLint, Prettier, TypeScript
- 🤖 SEO metadata, JSON-LD and Open Graph tags with Next SEO

### Requirements

- Node.js and npm or yarn

### Getting started

Run the following command on your local environment:

```
git clone  ... my-project-name
cd my-project-name
git checkout develop
yarn install
```

### Credentials Required

The dApp requires eitehr a NEAR [testnet](https://wallet.testnet.near.org/) or [mainnet](https://wallet.near.org/) wallet.

You will also need to create an account on [Plaid](https://dashboard.plaid.com/) OR [Coinbase](https://developers.coinbase.com/) in order to receive client ids and client secrets for your api. 

Create a .env.local file in your root folder:

```
NEXT_BASE_URL=http://localhost:3000

COINBASE_CLIENT_ID=your_client_Id
COINBASE_CLIENT_SECRET=your_client_secret
COINBASE_AUTHORIZE_URL=https://www.coinbase.com/oauth/authorize
COINBASE_TOKEN_URL=https://api.coinbase.com/oauth/token

PLAID_CLIENT_ID=your_client_id
PLAID_URL_SANDBOX=sandbox.plaid.com
PLAID_SECRET_KEY_SANDBOX=your_sandbox_key

BACKEND_BASE_URL=https://dev-near-oracle-backend.herokuapp.com
COINMARKET_KEY=your_coinmarketcapapikey
```

Then, you can run locally in development mode with live reload. Ensure you run this command after `cd` into the local folder where you cloned the repo.
