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
      replace(/you/g, 'them'),
      replace('Congrats, them have successfully obtained a credit score!', ' '),
      replace(
        'Please top up their wallet or use a different wallet address.',
        ' '
      )
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

  const renderLoanAmount = (score: number) => {
    const loanAmountBin = [0, 500, 1000, 5000, 10000, 15000, 20000, 25000];
    const scoreBin = [300, 500, 560, 650, 740, 800, 870, 900];
    let loanAmount;
    for (let i = 0; i < scoreBin.length; i++) {
      if (score > scoreBin[i] && score < scoreBin[i + 1]) {
        loanAmount = loanAmountBin[i + 1];
      } else if (score === scoreBin[i]) {
        loanAmount = loanAmountBin[i];
      }
    }
    return loanAmount;
  };

  const convertedTime = covertTimeToDate(accountInfo?.timestamp!) + ' UTC';

  return (
    <>
      {queryAccountId && accountInfo && (
        <div className='text-center sm:p-10'>
          <h2 className='z-30 font-semibold text-xl sm:text-3xl p-0'>
            {accountId}'s Credit Score
          </h2>
          <div className='flex justify-center'>
            <div className='bg-white/10 border-1 flex flex-col justify-center items-center py-3 rounded-md w-72'>
              Your applicant qualifies for:{' '}
              <h2 className='text-2xl sm:text-4xl font-semibold text-white ml-2 mb-0'>
                {'$' +
                  Number(
                    renderLoanAmount(accountInfo?.score)
                  )?.toLocaleString() +
                  ' USD'}
              </h2>{' '}
            </div>
          </div>

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
          <div className='text-center z-10 px-0 sm:p-10'>
            <h2 className='font-semibold text-xl sm:text-3xl p-0'>
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
