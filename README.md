<p align="center">
  <a href="https://near.org/">
    <img alt="Near" src="https://github.com/BalloonBox-Inc/near-oracle-client/blob/develop/public/images/planets/inverted-primary-logo.png" width="700" />
  </a>
</p>

## NearOracle dApp frontend :eyes: :genie: :zap:

### In this Repo 

This is the client side repo for NearOracle, made with the developer experience in mind: Next.js, TypeScript, ESLint, Prettier, Lint-Staged, VSCode, PostCSS, Tailwind CSS. The dApp fetches the user's financial history, passes it to the algorithm, (see the codebase of the NearOracle credit score algorithm at [`near-oracle-algorithm`](https://github.com/BalloonBox-Inc/near-oracle-algorithm)),which executes and returns a score via a Rust smart contract (see codebase at [`near-oracle-contract`](https://github.com/BalloonBox-Inc/near-oracle-contract)).

Continue to read these docs to clone this project and spin it up in your local machine.

---

### Features

Developer experience first:

- 🔥 [Next.js](https://nextjs.org) for a Server Side Rendered Static Site
- 🎨 Integrated with [Tailwind CSS](https://tailwindcss.com) & [Ant Design](https://ant.design/)
- 🎉 Type checking [TypeScript](https://www.typescriptlang.org)
- ✏️ Linter with [ESLint](https://eslint.org) (default NextJS, NextJS Core Web Vitals and Airbnb configuration)
- 💡 Absolute Imports
- 🛠 Code Formatter with [Prettier](https://prettier.io)
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

You will need the credentials & accounts listed below to get started:

1. NEAR Wallet account ([testnet](https://wallet.testnet.near.org/) or [mainnet](https://wallet.near.org/))
2. API keys and credentials from data providers

  - CoinMarketCap API key &#8594; follow the Developers guide [here](https://coinmarketcap.com/api/documentation/v1/#section/Introduction)
  - Plaid client_id and secret_key &#8594; create a Plaid account [here](https://dashboard.plaid.com/signin), then retrieve your Plaid [keys] (https://dashboard.plaid.com/team/keys)
  - Coinbase API Key &#8594; create a Coinbase account [here](https://www.coinbase.com/signup), then retrieve your Coinbase [keys](https://www.coinbase.com/settings/api) </br>
  To generate a new set of API keys follow this flow: `Coinbase` -> `settings` -> `API` -> `New API Key`.
  - Covalent API key &#8594; register [here](https://www.covalenthq.com/platform/#/auth/register/)
  
3. NFT.Storage API key where you can upload off-chain NFT data for free. → register [here](https://nft.storage/)
4. NEAR wallet account id where your contracts have been deployed




Create a .env.local file in your root folder:

```bash

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

COVALENT_KEY=your_covalent_api_key

NFT_STORAGE_KEY=your_nft_storage_key

CONTRACT_OWNER_PRIVATE_KEY=private_key_of_the_contract_owner
SCORE_CONTRACT_NAME=name_of_the_contract_for_storing_a_score
NFT_CONTRACT_NAME=name_of_the_contract_for_minting_an_NFT

ENV_CONFIG=testnet | mainnet


```

Then, you can run locally in development mode with live reload. Ensure you run this command after `cd` into the local folder where you cloned the repo.
