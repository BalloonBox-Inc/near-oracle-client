import { useCallback, useEffect } from "react";

import { notification } from "antd";
import { NextRouter } from "next/router";

import { useNearContext } from "@nearoracle/src/context";
import { handleCoinbaseCode } from "@nearoracle/src/services";

const Coinbase = ({
  connectionError,
  router,
  setToWaiting,
  setNotWaiting,
}: {
  connectionError: (s: string) => void;
  router: NextRouter;
  setToWaiting: () => void;
  setNotWaiting: () => void;
}) => {
  const { setScoreResponse, setCoinbaseToken, scoreResponse, coinbaseToken } =
    useNearContext();

  // 1. redirect to the SDK
  const getCoinbaseSdkUrl = useCallback(async () => {
    setToWaiting();
    const res = await fetch("/api/coinbase");
    const resJson = await res.json();
    if (resJson.url) {
      window.location.href = resJson.url;
    }
  }, [setToWaiting]);

  // hit the backend to get the score calculated
  const fetchCoinbaseWithToken = useCallback(
    async ({ access_token, refresh_token }: any) => {
      const coinbaseRes = await fetch(
        `/api/coinbase?access_token=${access_token}&refresh_token=${refresh_token}`
      );

      const { coinbaseScore } = await coinbaseRes.json();

      if (coinbaseScore?.status === "success") {
        setScoreResponse(coinbaseScore);
        router.replace("/applicant/generate?type=coinbase&status=success");
      } else if (
        coinbaseScore?.message === "The access token expired" ||
        coinbaseScore?.message === "The access token is invalid"
      ) {
        setScoreResponse(null);
        getCoinbaseSdkUrl();
      } else {
        setScoreResponse(null);
        router.replace("/applicant/generate");
        setNotWaiting();
        notification.error({
          message: "Error connecting to Coinbase, try again later",
        });
      }
    },
    [getCoinbaseSdkUrl, router, setNotWaiting, setScoreResponse]
  );

  const accessTokenExpired = () => {
    if (coinbaseToken?.expires_in) {
      const creationTime = coinbaseToken?.created_at;
      const expirationTime = creationTime + coinbaseToken.expires_in;
      if (Math.floor(Date.now() / 1000) > expirationTime) {
        return true;
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    const handleCoinbaseConnect = async () => {
      // check if access token + refresh token exist in cache
      if (coinbaseToken?.access_token && !accessTokenExpired()) {
        router.replace("/applicant/generate?type=coinbase&status=loading");
        fetchCoinbaseWithToken({
          access_token: coinbaseToken.access_token,
          refresh_token: coinbaseToken.refresh_token,
        });
        return;
      }
      // check if we have a score calculated with CB in storage
      if (scoreResponse?.endpoint?.includes("coinbase")) {
        router.replace("/applicant/generate?type=coinbase&status=success");
      } else {
        // Trigger SDK
        getCoinbaseSdkUrl();
      }
    };
    !router?.query?.code && handleCoinbaseConnect();
  }, []);

  useEffect(() => {
    const getCoinbaseTokens = async (code: string) => {
      try {
        // 2. send the code we got from the SDK to retrieve access_token + refresh_token
        router.replace("/applicant/generate");
        const resJson = await handleCoinbaseCode(code);

        if (resJson.access_token) {
          setCoinbaseToken(resJson);
          router.replace("/applicant/generate?type=coinbase&status=loading");
          fetchCoinbaseWithToken({
            access_token: resJson.access_token,
            refresh_token: resJson.refresh_token,
          });
          return;
        }
        if (resJson.error) {
          connectionError("coinbase");
        }
      } catch (error) {
        router.replace("/applicant/generate");
        connectionError("coinbase");
      }
    };

    if (router?.query?.code) {
      getCoinbaseTokens(router.query.code as string);
    }
  }, [
    connectionError,
    fetchCoinbaseWithToken,
    router,
    setCoinbaseToken,
    setScoreResponse,
    scoreResponse,
  ]);

  return null;
};

export default Coinbase;
