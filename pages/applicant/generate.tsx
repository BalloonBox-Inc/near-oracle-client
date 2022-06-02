import { useRouter } from "next/router";
import { useContext } from "react";
import { notification } from "antd";

import Coinbase from "@nearoracle/src/components/Coinbase";
import MainContainer from "@nearoracle/src/components/generate/MainContainer";
import {
  useHandleAwaitingScoreResponse,
  useHandleSdk,
  useManageQuery,
} from "@nearoracle/src/components/generate/hooks";
import { LoadingContainer } from "@nearoracle/src/components/LoadingContainer";

import { NearContext } from "@nearoracle/src/context";
import PlaidLink from "@nearoracle/src/components/plaid";
import ScoreResponseModal from "@nearoracle/src/components/generate/ScoreResponseModal";

export const GenerateScore = () => {
  const router = useRouter();
  const queryType = router?.query?.type;
  const queryStatus = router?.query?.status;

  const [awaitingScoreResponse, { setToWaiting, setNotWaiting }] =
    useHandleAwaitingScoreResponse();
  const [
    startPlaidLink,
    startCoinbase,
    { setStartPlaidLink, setStartCoinbase, setSdkUndefined },
  ] = useHandleSdk();

  const { plaidPublicToken, setPlaidPublicToken, setScoreResponse } =
    useContext(NearContext);

  useManageQuery({ router, setStartCoinbase, setToWaiting });

  const connectionError = (client: "coinbase" | "plaid" | string) =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  const startOver = () => {
    setSdkUndefined();
    setNotWaiting();
    setScoreResponse(null);
    setPlaidPublicToken(null);
    router.replace("/applicant/generate");
  };

  const handlePlaidConnect = async () => {
    if (plaidPublicToken) {
      setStartPlaidLink();
      router.replace("/applicant/generate?type=plaid&status=success");
    } else {
      router.replace("/applicant/generate?type=plaid&status=loading");
      try {
        setToWaiting();
        const plaidRes = await fetch("/api/plaid");
        const plaidResJson = await plaidRes.json();
        if (plaidResJson?.link_token) {
          setStartPlaidLink();
          setPlaidPublicToken({ publicToken: plaidResJson.link_token });
        }
      } catch (error) {
        connectionError("plaid");
      }
    }
  };

  return (
    <div className="text-white">
      {queryStatus === "success" && (
        <ScoreResponseModal
          queryStatus={queryStatus}
          queryType={queryType}
          pushToScore={() => router.push("/applicant/score")}
          startOver={startOver}
        />
      )}
      {awaitingScoreResponse && <LoadingContainer text="Loading.." />}
      {!awaitingScoreResponse && (
        <MainContainer
          setStartCoinbase={setStartCoinbase}
          handlePlaidConnect={handlePlaidConnect}
        />
      )}
      {startCoinbase && (
        <Coinbase
          router={router}
          setNotWaiting={setNotWaiting}
          setToWaiting={setToWaiting}
          connectionError={connectionError}
        />
      )}
      {startPlaidLink && plaidPublicToken?.publicToken && (
        <PlaidLink
          token={plaidPublicToken?.publicToken}
          router={router}
          setNotWaiting={setNotWaiting}
          setStartPlaidLink={setStartPlaidLink}
        />
      )}
    </div>
  );
};

export const GenerateScorePage = () => {
  return <GenerateScore />;
};

export default GenerateScorePage;
