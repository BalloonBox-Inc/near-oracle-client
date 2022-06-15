import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const {
  PLAID_CLIENT_ID,
  PLAID_SECRET_KEY_SANDBOX,
  PLAID_URL_SANDBOX,
  COINMARKET_KEY,
} = process.env;

const PLAID_ENDPOINT = `${process.env.BACKEND_BASE_URL}/credit_score/plaid`;

const clientConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET_KEY_SANDBOX,
    },
  },
});

export interface ITokenExchangeProps {
  publicToken: string;
}

const config = {
  client_id: PLAID_CLIENT_ID,
  secret: PLAID_SECRET_KEY_SANDBOX,
  client_name: "NearOracle",
  country_codes: ["US", "CA"],
  user: {
    client_user_id: "unique_per_user",
  },
  products: ["auth","transactions"],
  language: "en",
};

async function get_plaid_score(
  req: NextApiRequest,
  res: NextApiResponse,
  body: any
) {
  try {
    const backend_response = await fetch(PLAID_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseJson = await backend_response.json();
    return responseJson;

  } catch (error) {
    return error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = `https://${PLAID_URL_SANDBOX}/link/token/create`;
  const isExchange = req.query.exchange;

  if (isExchange) {
    try {
      const plaidClient = new PlaidApi(clientConfig);
      const { publicToken } = req.body;
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const access_token = await response.data.access_token;

      const plaidBody = {
        plaid_access_token: access_token,
        plaid_client_id: PLAID_CLIENT_ID,
        plaid_client_secret: PLAID_SECRET_KEY_SANDBOX,
        coinmarketcap_key: COINMARKET_KEY,
        loan_request: 10000
      };

      let plaid_score_res = await get_plaid_score(req, res, plaidBody);

      if (plaid_score_res.status === "error") {
        setTimeout(async () => {
          plaid_score_res = await get_plaid_score(req, res, plaidBody);
          res.send({ plaid_score_res });
        }, 3000);
      } else res.send({ plaid_score_res });
  
      return;
    } catch (error) {
      res.send({ error });
    }
  }


   // create a link token
   try {
    const createTokenRes = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(config),
    });
    const data = await createTokenRes.json();

    res.send({
      ...data,
    });
  } catch (error) {
    res.send({ error });
  }
}
