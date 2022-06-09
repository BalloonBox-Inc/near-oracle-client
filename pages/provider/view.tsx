import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { notification } from "antd";

import NavigationButtons from "@nearoracle/src/components/NavigationButtons";
import { NearContext } from "@nearoracle/src/context";
import ScoreSpeedometer from "@nearoracle/src/components/score";
import { storageHelper } from "@nearoracle/src/context";

const ViewScore = () => {
  const router = useRouter();
  const [accountId, setAccountId] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const { contract } = useContext(NearContext);

  const queryAccountId = router.query.accountId;

  useEffect(() => {
    !accountInfo && router.push("/provider/view");
  }, [router, accountInfo]);

  const handleViewScore = async (id: string) => {
    try {
      const response = await contract?.query_score_history({ account_id: id });

      // Todo: store appplicant's information in the local storage and get it to display - but when it's not there i need to track
      // Todo: add a loading state
      console.log(response.scores);
      setAccountInfo(response.scores[0]);
      storageHelper.persist("viewScoreInfo", accountInfo);
      router.push(`/provider/view?accountId=${id}`);
    } catch (err) {
      notification.error({
        message:
          "This account has no score history. Please try with a different account.",
      });
    }
  };

  return (
    <>
      {queryAccountId && accountInfo ? (
        <div className="text-center sm:p-10">
          <h2 className="z-30 font-semibold text-xl sm:text-3xl p-0">
            {accountId}'s credit score
          </h2>
          <ScoreSpeedometer
            score={accountInfo?.score}
            timestamp={accountInfo?.timestamp}
            showScore
          />
        </div>
      ) : (
        <>
          <div className="text-center z-30 px-0 sm:p-10">
            <h2 className="z-30 font-semibold text-xl sm:text-3xl p-0">
              View your applicant's score
            </h2>
            <div className="w-full px-10 md:px-40">
              <form className="flex flex-col mt-10">
                <label className="text-left mb-2">Applicant's account id</label>
                <input
                  className="bg-zinc-800 rounded py-3 px-3"
                  type="text"
                  id="accountId"
                  onChange={(e) => setAccountId(e.target.value)}
                ></input>
              </form>
            </div>
          </div>
          <NavigationButtons
            backHandler={() => {
              router.push("/provider");
            }}
            nextHandler={() => handleViewScore(accountId)}
            // nextDisabled={() => console.log("hey")}
          />
        </>
      )}
    </>
  );
};

export default ViewScore;
