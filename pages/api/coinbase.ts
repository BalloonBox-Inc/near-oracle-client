import { NextApiRequest, NextApiResponse } from "next";

const {
  COINBASE_CLIENT_ID,
  COINBASE_CLIENT_SECRET,
  COINBASE_AUTHORIZE_URL,
  COINBASE_TOKEN_URL,
  COINMARKET_KEY,
} = process.env;
const REDIRECT_URL = `${process.env.NEXT_BASE_URL}/applicant/generate`;
const COINBASE_ENDPOINT = `${process.env.BACKEND_BASE_URL}/credit_score/coinbase`;
const AUTHORIZE_URL = `${COINBASE_AUTHORIZE_URL}?response_type=code&client_id=${COINBASE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=wallet:accounts:read,wallet:accounts:read,wallet:addresses:read,wallet:buys:read,wallet:deposits:read,wallet:payment-methods:read,wallet:transactions:read,wallet:user:read,wallet:withdrawals:read,wallet:user:update`;

export interface ICoinbaseTokenCreateResponse {
  access_token: string;
  created_at: number;
  refresh_token: string;
  token_type: "string";
  expires_in: number;
  scope: string;
}

export interface ICoinbaseTokenError {
  error: string;
  error_description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = AUTHORIZE_URL;
  if (req.query?.access_token) {
    try {
      const body = {
        coinbase_access_token: req.query?.access_token,
        coinbase_refresh_token: req.query?.refresh_token,
        coinmarketcap_key: COINMARKET_KEY,
        loan_request: 10000,
      };

      const backend_response = await fetch(COINBASE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const coinbaseScore = await backend_response.json();

      res.send({ coinbaseScore });

    } catch (error) {
      res.send({ error });
    }
  } else if (req.query?.code) {
    try {
      const tokenRes = await fetch(
        `${COINBASE_TOKEN_URL}?grant_type=authorization_code&code=${req.query.code}&client_id=${COINBASE_CLIENT_ID}&client_secret=${COINBASE_CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const tokenResJson = await tokenRes.json();
      res.send({ ...tokenResJson });
    } catch (error) {
      res.send({ error });
    }
  } else {
    res.send({ url });
  }
}