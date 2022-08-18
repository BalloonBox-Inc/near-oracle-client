import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { pipe, replace, slice } from 'ramda';

import NavigationButtons from '@nearoracle/src/components/NavigationButtons';
import { useNearContext } from '@nearoracle/src/context';
import ScoreSpeedometer from '@nearoracle/src/components/score';

import { LoadingContainer } from '@nearoracle/src/components/LoadingContainer';
import Button from '@nearoracle/src/components/Button';

interface IAccountInfo {
  score: number;
  timestamp: number; // in nanoseconds
  description: string;
}

const ViewScore = () => {
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<IAccountInfo | null>(null);
  const { scoreContract } = useNearContext();
  const [loading, setLodaing] = useState(false);

  const queryAccountId = router.query.accountId;

  useEffect(() => {
    !accountInfo && router.push('/provider/view');
  }, [router, accountInfo]);

  const convertScoreDescriptionForProvider = (description: string) => {
    const initialTransform = pipe(
      replace(/Your/g, "This user's"),
      replace(/your/g, 'their'),
      replace(/you/g, 'them')
    )(description);
    const tryAgainIndex = initialTransform.indexOf('Try again');
    if (tryAgainIndex < 0) {
      return initialTransform;
    }

    return slice(0, tryAgainIndex, initialTransform);
  };

  const handleViewScore = async (id: string | null) => {
    setLodaing(true);
    try {
      const response: any = await scoreContract?.query_score_history({
        account_id: id,
      });

      const scoresArray = response?.scores;
      const scoresArrayLength = response?.scores.length;
      // Get the latest score stored
      setAccountInfo(scoresArray[scoresArrayLength - 1]);
      router.push(`/provider/view?accountId=${id}`);
      setLodaing(false);
    } catch (err) {
      notification.error({
        message:
          'This account has no score history. Please try with a different account.',
      });
      setLodaing(false);
    }
  };

  const covertTimeToDate = (timestamp: number) => {
    const milliseconds = timestamp / 1000000;
    const dateObject = new Date(milliseconds);
    const convertedTime = dateObject.toLocaleString('en-GB', {
      timeZone: 'UTC',
    });
    return convertedTime;
  };

  const convertedTime = covertTimeToDate(accountInfo?.timestamp!) + ' UTC';

  return (
    <>
      {queryAccountId && accountInfo && (
        <div className='text-center sm:p-10'>
          <h2 className='z-30 font-semibold text-xl sm:text-3xl p-0'>
            {accountId}'s Credit Score
          </h2>
          <ScoreSpeedometer
            score={accountInfo?.score}
            date={convertedTime}
            showScore
          />
          <div className='flex flex-col mb-10 bg-zinc-800 rounded-md px-10 py-8 md:mx-30 lg:mx-36 xl:mx-40'>
            <h3 className='text-lg font-semibold text-left'>Overview</h3>
            <p className='text-white text-left'>
              {convertScoreDescriptionForProvider(accountInfo?.description)}
            </p>
          </div>

          <Button
            text="Get another applicant's score"
            onClick={() => router.push('/provider')}
          />
        </div>
      )}
      {loading && (
        <LoadingContainer text={`Loading the applicant's credit score..`} />
      )}
      {!loading && !accountInfo && (
        <>
          <div className='text-center z-30 px-0 sm:p-10'>
            <h2 className='z-30 font-semibold text-xl sm:text-3xl p-0'>
              View an Applicant's Score
            </h2>
            <div className='w-full px-10 md:px-40'>
              <form className='flex flex-col mt-10'>
                <label className='text-left mb-2'>
                  Applicant's NEAR Wallet ID
                </label>
                <input
                  className='bg-zinc-800 rounded py-3 px-3'
                  type='text'
                  id='accountId'
                  onChange={(e) => setAccountId(e.target.value)}
                ></input>
              </form>
            </div>
          </div>

          <NavigationButtons
            backHandler={() => {
              router.push('/provider');
            }}
            nextHandler={() => handleViewScore(accountId)}
            nextDisabled={!accountId?.trim()}
          />
        </>
      )}
    </>
  );
};

export default ViewScore;
