import detectEthereumProvider from '@metamask/detect-provider';
import { notification } from 'antd';
import { storageHelper, useNearContext } from '@nearoracle/src/context';
import { useEffect } from 'react';
import { NextRouter } from 'next/router';

const Covalent = ({
  setToWaiting,
  setNotWaiting,
  router,
}: {
  router: NextRouter;
  setToWaiting: () => void;
  setNotWaiting: () => void;
}) => {
  const { setScoreResponse } = useNearContext();

  useEffect(() => {
    getEthAddress();
  }, []);

  const getEthAddress = async () => {
    const provider: any = await detectEthereumProvider();

    // 1. Check if metamask is installed
    if (typeof window.ethereum !== 'undefined' && provider) {
      // 2. Check if metamask is connected or request to connect
      const accounts = await provider?.request({
        method: 'eth_accounts',
      });
      const account = accounts[0];

      if (account) {
        setToWaiting();
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
            notification.error({ message: covalentScore.message });
            setNotWaiting();
            setScoreResponse(null);
            router.replace('/applicant/generate');
          }
        } catch (error) {
          notification.error({ message: 'Error connecting covalent' });
          setNotWaiting();
        }
      } else {
        provider.request({ method: 'eth_requestAccounts' });
      }
    } else {
      notification.error({ message: 'Please install Metamask to proceed.' });
    }
  };
  return null;
};

export default Covalent;
