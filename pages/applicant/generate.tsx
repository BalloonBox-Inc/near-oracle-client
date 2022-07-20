import { useRouter } from "next/router";
import { notification } from "antd";

import Coinbase from '@nearoracle/src/components/Coinbase';
import Covalent from '@nearoracle/src/components/Covalent';
import MainContainer from '@nearoracle/src/components/generate/MainContainer';
import {
  useHandleAwaitingScoreResponse,
  useHandleSdk,
  useManageQuery,
  useHandleExistingScore,
  useManageExistingScore,
} from '@nearoracle/src/components/generate/hooks';
import { LoadingContainer } from '@nearoracle/src/components/LoadingContainer';

import { useNearContext } from '@nearoracle/src/context';
import PlaidLink from '@nearoracle/src/components/plaid';
import ScoreResponseModal from '@nearoracle/src/components/generate/ScoreResponseModal';
import ExistingScoreModal from '@nearoracle/src/components/generate/ExistingScoreModal';
import { INearContext } from '@nearoracle/src/context';
interface IGenerateScorePage {
  chainActivity: INearContext['chainActivity'];
}

export const GenerateScore = ({ chainActivity }: IGenerateScorePage) => {
  const router = useRouter();
  const queryType = router?.query?.type;
  const queryStatus = router?.query?.status;
  const [awaitingScoreResponse, { setToWaiting, setNotWaiting }] =
    useHandleAwaitingScoreResponse();
  const [
    startPlaidLink,
    startCoinbase,
    startCovalent,
    { setStartPlaidLink, setStartCoinbase, setStartCovalent, setSdkUndefined },
  ] = useHandleSdk();

  const [
    existingScoreIsLoading,
    scoreExists,
    { setExistingScoreToTrue, setExistingScoreToFalse },
  ] = useHandleExistingScore();

  const {
    plaidPublicToken,
    setPlaidPublicToken,
    setScoreResponse,
    handleSetChainActivity,
  } = useNearContext();

  useManageExistingScore({
    chainActivity,
    setExistingScoreToTrue,
    setExistingScoreToFalse,
    queryType,
    router,
  });

  useManageQuery({ router, setStartCoinbase, setToWaiting });

  const connectionError = (client: 'coinbase' | 'plaid' | string) =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  const startOver = () => {
    setSdkUndefined();
    setNotWaiting();
    setScoreResponse(null);
    setPlaidPublicToken(null);
    router.replace('/applicant/generate');
  };

  const handlePlaidConnect = async () => {
    if (plaidPublicToken) {
      setStartPlaidLink();
      router.replace('/applicant/generate?type=plaid&status=success');
    } else {
      router.replace('/applicant/generate?type=plaid&status=loading');
      try {
        setToWaiting();
        const plaidRes = await fetch('/api/plaid');
        const plaidResJson = await plaidRes.json();
        if (plaidResJson?.link_token) {
          setStartPlaidLink();
          setPlaidPublicToken({ publicToken: plaidResJson.link_token });
        }
      } catch (error) {
        connectionError('plaid');
      }
    }
  };
  if (existingScoreIsLoading) {
    return (
      <div className='px-14 py-10'>
        <LoadingContainer text={''} />
      </div>
    );
  }

  return (
    <div className='text-white'>
      {queryStatus === 'success' && (
        <ScoreResponseModal
          queryStatus={queryStatus}
          queryType={queryType}
          pushToScore={() => router.push('/applicant/score')}
          startOver={startOver}
        />
      )}
      {awaitingScoreResponse && (
        <LoadingContainer text='Calculating your score. This may take a minute.' />
      )}
      {!awaitingScoreResponse && (
        <MainContainer
          setStartCoinbase={setStartCoinbase}
          handlePlaidConnect={handlePlaidConnect}
          setStartCovalent={setStartCovalent}
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
          setToWaiting={setToWaiting}
          setNotWaiting={setNotWaiting}
          setStartPlaidLink={setStartPlaidLink}
        />
      )}
      {startCovalent && (
        <Covalent
          setToWaiting={setToWaiting}
          setNotWaiting={setNotWaiting}
          router={router}
        />
      )}

      {scoreExists && (
        <ExistingScoreModal
          scoreExists={scoreExists}
          startOver={startOver}
          handleSetChainActivity={handleSetChainActivity}
          chainActivity={chainActivity}
        />
      )}
    </div>
  );
};

export const GenerateScorePage = () => {
  const { chainActivity } = useNearContext();
  return <GenerateScore chainActivity={chainActivity} />;
};

export default GenerateScorePage;
