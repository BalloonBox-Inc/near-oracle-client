import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { notification } from "antd";
import Modal from "antd/lib/modal/Modal";

import ScoreSpeedometer from "@nearoracle/src/components/score";
import { NearContext } from "@nearoracle/src/context";
import Button, { BUTTON_STYLES } from "@nearoracle/src/components/Button";
import { storageHelper } from "@nearoracle/src/context";
import ScoreSaved from "@nearoracle/src/components/score/scoreSaved";
import {
  IScoreResponseCoinbase,
  IScoreResponsePlaid,
} from "@nearoracle/src/types/types";
import { useSetStatus } from "@nearoracle/src/components/score/hooks";

const ApplicantScorePage = () => {
  const {
    scoreResponse,
    loading,
    contract,
    chainActivity,
    handleSetChainActivity,
  } = useContext(NearContext);

  const [
    { statusLoading, statusSuccess },
    { setLoadingStatus, setErrorStatus, setSuccessStatus },
  ] = useSetStatus();

  const [showScore, setShowScore] = useState<boolean>(false);
  const [showScoreDescription, setShowScoreDescription] = useState(false);
  const router = useRouter();

  const queryTransactionHash = router?.query?.transactionHashes;
  const queryErrorCode = router?.query?.errorCode;
  const queryScoreSubmitted = router?.query?.scoreSubmitted;

  const renderProvider = (
    scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
  ) => {
    if (scoreResponse?.endpoint.includes("coinbase")) {
      return "Coinbase";
    }
    return "Plaid";
  };

  // Store the score to the NEAR blockchain
  const handleSetScore = async (
    scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
  ) => {
    if (scoreResponse) {
      // This redirects to the Wallet SDK, and once approved, redirect back to the app with a transactionHashes query parameter.
      await contract?.store_score({
        callbackUrl: `${process.env.NEXT_BASE_URL}/applicant/score`,
        args: {
          score: scoreResponse?.score,
          description: scoreResponse?.message,
        },
      });
    }
  };

  useEffect(() => {
    queryTransactionHash &&
      handleSetChainActivity({
        scoreAmount: scoreResponse?.score,
        scoreMessage: scoreResponse?.message,
        scoreSubmitted: true,
        dataProvider: scoreResponse?.endpoint.includes("plaid")
          ? "plaid"
          : "coinbase",
      });
  }, [queryTransactionHash]);

  useEffect(() => {
    if (chainActivity?.scoreSubmitted) {
      setSuccessStatus();
    }
  }, [chainActivity, setSuccessStatus]);

  // When the user close the NEAR Wallet SDK, throw an error
  useEffect(() => {
    if (queryErrorCode) {
      queryErrorCode?.includes("userRejected") &&
        notification.error({
          message: "Near wallet window was closed. Please try again",
        });
      router.replace("/applicant/score");
    }
  }, [queryErrorCode, router]);

  useEffect(() => {
    if (!scoreResponse && !loading) {
      router.push("/applicant/generate");
    }
  }, [loading, scoreResponse, router]);

  useEffect(() => {
    const scoreAnimated = storageHelper.get("scoreAnimationViewed");

    setTimeout(
      () => {
        setShowScore(true);
        storageHelper.persist("scoreAnimationViewed", true);
      },
      scoreAnimated ? 0 : 3800
    );
  }, []);

  return (
    <div className="px-14 py-10 w-full text-center">
      {queryTransactionHash ? (
        <ScoreSaved />
      ) : (
        <>
          <h2 className="z-40 font-semibold text-xl sm:text-4xl mb-1">
            Your NearOracle score
          </h2>
          <p className="text-lg">
            Calculated with {renderProvider(scoreResponse)}
          </p>

          {scoreResponse?.score && (
            <div className="flex w-full justify-center z-0">
              <ScoreSpeedometer
                score={scoreResponse?.score}
                quality={scoreResponse?.feedback?.score.quality}
                showScore={showScore}
              />
            </div>
          )}

          <Button
            onClick={() => setShowScoreDescription(true)}
            style={BUTTON_STYLES.LINK}
            text="Explain my score"
            classes={{
              button: "text-xs text-white mb-3 hover:text-blue",
            }}
          />

          {queryScoreSubmitted ? (
            <p className="text-lg mt-3 font-semibold">
              {" "}
              Score has already been saved to the blockchain.
            </p>
          ) : (
            <Button
              text="Save score to blockchain"
              onClick={() => handleSetScore(scoreResponse)}
            />
          )}
          <Modal
            visible={showScoreDescription}
            footer={null}
            onCancel={() => setShowScoreDescription(false)}
            bodyStyle={{ background: "#18181B" }}
            style={{ top: "20%" }}
          >
            <div
              className={`sm:px-8 flex py-5 justify-center rounded-md z-50 duration-500 font-sans  ${
                !showScore ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="p-8 rounded-lg z-50 max-w-xl w-full">
                <h3 className="text-lg uppercase font-semibold mb-4">
                  Summary
                </h3>
                <p className="sm:text-base leading-7 mb-3 text-white">
                  {scoreResponse?.message || scoreResponse?.message}
                </p>
                <Link href="/learn">
                  <p className="underline cursor-pointer hover:text-gray-500">
                    Learn more
                  </p>
                </Link>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ApplicantScorePage;
