This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


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



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
