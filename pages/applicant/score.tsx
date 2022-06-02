import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import ScoreSpeedometer from "@nearoracle/src/components/score";
import { NearContext } from "@nearoracle/src/context";
import Button, { BUTTON_STYLES } from "@nearoracle/src/components/Button";
import Modal from "antd/lib/modal/Modal";
import { storageHelper } from "@nearoracle/src/context";

const ApplicantScorePage = () => {
  const { scoreResponse, loading } = useContext(NearContext);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [showScoreDescription, setShowScoreDescription] = useState(false);
  const router = useRouter();

  const renderProvider = (scoreResponse) => {
    if (scoreResponse?.endpoint.includes("coinbase")) {
      return "Coinbase";
    }
    return "Plaid";
  };

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
      <h2 className="z-50 font-semibold text-xl sm:text-4xl mb-1">
        Your NearOracle score
      </h2>
      <p className="text-lg">Calculated with {renderProvider(scoreResponse)}</p>

      {scoreResponse?.score && (
        <ScoreSpeedometer
          score={scoreResponse?.score}
          quality={scoreResponse?.feedback?.score.quality}
          showScore={showScore}
        />
      )}

      <Button
        onClick={() => setShowScoreDescription(true)}
        style={BUTTON_STYLES.LINK}
        text="Explain my score"
        classes={{ button: "text-xs text-white hover:text-blue" }}
      />

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
            <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
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
    </div>
  );
};

export default ApplicantScorePage;
