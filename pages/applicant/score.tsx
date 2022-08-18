import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { notification } from 'antd';
import Modal from 'antd/lib/modal/Modal';

import ScoreSpeedometer from '@nearoracle/src/components/score';
import { useNearContext } from '@nearoracle/src/context';
import Button, { BUTTON_STYLES } from '@nearoracle/src/components/Button';
import { storageHelper } from '@nearoracle/src/context';
import SuccessPage from '@nearoracle/src/components/score/SuccessPage';
import {
  IScoreResponseCoinbase,
  IScoreResponsePlaid,
} from '@nearoracle/src/types/types';
import { useSetStatus } from '@nearoracle/src/components/score/hooks';
import { LoadingContainer } from '@nearoracle/src/components/LoadingContainer';
import NavigationButtons from '@nearoracle/src/components/NavigationButtons';
import getConfig from '@nearoracle/src/utils/config';

const ApplicantScorePage = () => {
  const {
    wallet,
    scoreResponse,
    loading,
    scoreContract,
    scoreWhitelistContract,
    chainActivity,
    handleSetChainActivity,
  } = useNearContext();

  const [
    { statusLoading, statusSuccess },
    { setLoadingStatus, setSuccessStatus },
  ] = useSetStatus();

  const [showScore, setShowScore] = useState<boolean>(false);
  const [showScoreDescription, setShowScoreDescription] = useState(false);
  const [loanRequest, setLoanRequest] = useState<number | string>('');
  const router = useRouter();

  const queryTransactionHash = router?.query?.transactionHashes;
  const queryErrorCode = router?.query?.errorCode;

  const config = getConfig();

  const renderProvider = (
    scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
  ) => {
    if (scoreResponse?.endpoint.includes('coinbase')) {
      return 'Coinbase';
    } else if (scoreResponse?.endpoint.includes('plaid')) return 'Plaid';
    else return 'Covalent';
  };

  // Store the score to the NEAR blockchain
  const handleSetScore = async (
    scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
  ) => {
    if (scoreResponse) {
      setLoadingStatus();
      await scoreWhitelistContract?.add_to_whitelist({
        args: { account_id: wallet?._authData.accountId },
      });

      await scoreContract?.store_score({
        callbackUrl: `${process.env.NEXT_BASE_URL}/applicant/score`,
        args: {
          score: scoreResponse?.score,
          description: scoreResponse?.message,
        },
      });
    }
  };

  // Whene there's a transactionHashes query parameter, save the chain acitivity in the localStroage.
  useEffect(() => {
    queryTransactionHash &&
      handleSetChainActivity({
        scoreAmount: scoreResponse?.score,
        scoreMessage: scoreResponse?.message,
        scoreSubmitted: true,
        dataProvider: renderProvider(scoreResponse),
        txHashes: queryTransactionHash,
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
      queryErrorCode?.includes('userRejected') &&
        notification.error({
          message: 'Near wallet window was closed. Please try again',
        });
      router.replace('/applicant/score');
    }
  }, [queryErrorCode, router]);

  useEffect(() => {
    if (!scoreResponse && !loading) {
      router.push('/applicant/generate');
    }
  }, [loading, scoreResponse, router]);

  useEffect(() => {
    const scoreAnimated = storageHelper.get('scoreAnimationViewed');

    setTimeout(
      () => {
        setShowScore(true);
        storageHelper.persist('scoreAnimationViewed', true);
      },
      scoreAnimated ? 0 : 3800
    );
  }, []);

  useEffect(() => {
    setLoanRequest(storageHelper.get('loanRequest'));
  });
  const mainScoreContainer = (
    <div className='px-14 py-10 w-full flex flex-col items-center text-center'>
      {queryTransactionHash ? (
        <SuccessPage
          transactionHashes={queryTransactionHash}
          config={config}
          score={true}
        />
      ) : (
        <>
          <h2 className='z-40 font-semibold text-2xl sm:text-4xl mb-1'>
            Your NearOracle score
          </h2>
          <p className='text-lg'>
            Calculated with {renderProvider(scoreResponse)}
          </p>
          {/* <div className='bg-white/10 border-1 flex flex-col justify-center items-center py-3 rounded-md w-72'>
            Loan amount requested:{' '}
            <h2 className='text-4xl font-semibold text-white ml-2 mb-0'>
              {'US$' + Number(loanRequest)?.toLocaleString()}
            </h2>{' '}
          </div> */}
          <div className='bg-white/10 border-1 flex flex-col justify-center items-center py-3 rounded-md w-72'>
            Eligible loan amount:{' '}
            <h2 className='text-2xl sm:text-4xl font-semibold text-white ml-2 mb-0'>
              {'US$' +
                Number(scoreResponse?.risk?.loan_amount)?.toLocaleString()}
            </h2>{' '}
            <div className='mt-1'>
              (Requested loan amount:{' '}
              <span className='font-medium'>
                {'US$' + Number(loanRequest)?.toLocaleString()}
              </span>
              )
            </div>
          </div>

          {scoreResponse?.score && (
            <div className='flex w-full justify-center z-0'>
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
            text='Explain my score'
            classes={{
              button: 'text-xs text-white mb-3 hover:text-blue',
            }}
          />

          {statusSuccess ? (
            <>
              <p className='text-lg mt-3 font-semibold'>
                {' '}
                Your score has already been saved to the blockchain.{' '}
              </p>
              <a
                href={`${config.explorerUrl}/transactions/${chainActivity.txHashes}`}
                target='_blank'
              >
                <Button
                  text=' View on NEAR Explorer'
                  style={BUTTON_STYLES.OUTLINE}
                />
              </a>
              {!chainActivity?.nftMinted && (
                <div className='mt-2'>
                  <Button
                    text='Mint your score as an NFT'
                    onClick={() => router.replace('/applicant/nft')}
                  />
                </div>
              )}
            </>
          ) : (
            <Button
              text='Save score to blockchain'
              onClick={() => handleSetScore(scoreResponse)}
            />
          )}
          <NavigationButtons backHandler={() => router.push('/applicant')} />
          <Modal
            visible={showScoreDescription}
            footer={null}
            onCancel={() => setShowScoreDescription(false)}
            bodyStyle={{ background: '#18181B' }}
            style={{ top: '20%' }}
          >
            <div
              className={`sm:px-8 flex py-5 justify-center rounded-md z-50 duration-500 font-sans  ${
                !showScore ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className='p-8 rounded-lg z-50 max-w-xl w-full'>
                <h3 className='text-lg uppercase font-semibold mb-4'>
                  Summary
                </h3>
                <p className='sm:text-base leading-7 mb-3 text-white'>
                  {scoreResponse?.message || scoreResponse?.message}
                </p>
                <a href='/learn' target='_blank' className='text-white'>
                  <p className='underline cursor-pointer hover:text-gray-500'>
                    Learn more
                  </p>
                </a>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );

  return (
    <>
      {statusLoading ? (
        <LoadingContainer text='Submitting score to the blockchain.' />
      ) : (
        mainScoreContainer
      )}
    </>
  );
};

export default ApplicantScorePage;
