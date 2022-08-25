import detectEthereumProvider from '@metamask/detect-provider';
import { notification } from 'antd';
import { storageHelper, useNearContext } from '@nearoracle/src/context';
import { useEffect, useState } from 'react';
import { NextRouter } from 'next/router';

const Covalent = ({
  setToWaiting,
  setNotWaiting,
  router,
  connectionError,
}: {
  router: NextRouter;
  setToWaiting: () => void;
  setNotWaiting: () => void;
  connectionError: (s: string) => void;
}) => {
  const { setScoreResponse } = useNearContext();
  const [ethAccount, setEthAccount] = useState<string | null>(null);

  useEffect(() => {
    handleMetamask();
  }, [ethAccount]);

  const handleMetamask = async () => {
    setToWaiting();
    const provider: any = await detectEthereumProvider();

    if (typeof window.ethereum !== 'undefined' && provider) {
      const accounts = await provider?.request({ method: 'eth_accounts' });
      const account = accounts[0];

      if (account) {
        setToWaiting();
        // Calculate the score with the ETH address retrievd from the metamask wallet
        try {
          const covalentRes = await fetch(`/api/covalent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              loan_request: storageHelper.get('loanRequest'),
              eth_address: account,
            }),
          });
          const { covalentScore } = await covalentRes.json();

          if (covalentScore.status === 'success') {
            setScoreResponse(covalentScore);
            router.replace('/applicant/generate?type=covalent&status=success');
          } else {
            connectionError('covalent');
            setNotWaiting();
            setScoreResponse(null);
            router.replace('/applicant/generate');
          }
        } catch (error) {
          notification.error({ message: 'Error connecting covalent' });
          setNotWaiting();
        }
      } else {
        setToWaiting();
        provider
          .request({ method: 'eth_requestAccounts' })
          .then(setNotWaiting());
      }
    } else {
      notification.error({ message: 'Please install Metamask to proceed.' });
      setNotWaiting();
    }
    provider?.on('chainChanged', handleChainChanged);
    provider?.on('accountsChanged', handleAccountsChanged);
  };

  let currentAccount: string | null = null;
  function handleChainChanged(_chainId: string) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
    notification.info({ message: 'Chain changed!' });
  }

  function handleAccountsChanged(accounts: Array<string>) {
    setEthAccount(accounts[0]);
    notification.info({
      message: 'Metamask account updated.',
    });
    if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
    }
  }

  return null;
};

export default Covalent;
