import { useEffect } from "react";
import { notification } from "antd";
import {
  PlaidLinkOnSuccessMetadata,
  usePlaidLink,
  PlaidLinkError,
  PlaidLinkOnExitMetadata,
} from "react-plaid-link";
import { NextRouter } from "next/router";
import { useNearContext } from "@nearoracle/src/context";
import { exchangePlaidToken } from "@nearoracle/src/services";
import { storageHelper } from '@nearoracle/src/context';
interface Props {
  isOauth?: boolean;
  token: string; // this is the public token (aka link token)
  userId?: number;
  itemId?: number | null;
  children?: React.ReactNode;
  router: NextRouter;
  setStartPlaidLink: any;
  setNotWaiting: () => void;
  setToWaiting: () => void;
  plaidOAuthFlowQuery?: string | string[];
}

const PlaidLink = (props: Props) => {
  const { setPlaidPublicToken, setScoreResponse, scoreResponse } =
    useNearContext();

  const handleError = async (onExit: boolean) => {
    props.setNotWaiting();
    props.router.replace('/applicant/generate');
    props.setStartPlaidLink(false);
    notification.error({
      message: onExit
        ? 'The Plaid window was closed. Unable to connect to your account.'
        : 'There was an error connecting to your Plaid account. Please try again.',
    });
    setPlaidPublicToken(null);
  };

  const loanRequest = storageHelper.get('loanRequest');
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    const { plaid_score_res } = await exchangePlaidToken({
      publicToken,
      loanRequest,
    });

    if (plaid_score_res?.status === 'success') {
      props.router.replace('/applicant/generate?type=plaid&status=success');
      setScoreResponse(plaid_score_res);
    } else {
      handleError(false);
    }
    props.setNotWaiting();
  };

  const onExit = (
    _error: null | PlaidLinkError,
    _metadata: PlaidLinkOnExitMetadata
  ) => {
    handleError(true);
  };

  const config = {
    onSuccess,
    token: props.token,
    onExit,
  };

  const { open } = usePlaidLink(config);

  useEffect(() => {
    if (scoreResponse?.endpoint?.includes('plaid')) {
      props.router.replace('/applicant/generate?type=plaid&status=success');
    } else {
      open();
    }
  }, [open, scoreResponse]);
  return null;
};

export default PlaidLink;
