import { useContext, useEffect } from "react";
import { notification } from "antd";
import {
  PlaidLinkOnSuccessMetadata,
  usePlaidLink,
  PlaidLinkError,
  PlaidLinkOnExitMetadata,
} from "react-plaid-link";

import { NearContext } from "@nearoracle/src/context";
import { exchangePlaidToken } from "@nearoracle/src/services";

const PlaidLink = (props) => {
  const { setPlaidPublicToken, setScoreResponse, scoreResponse } =
    useContext(NearContext);

  const handleError = async (onExit: boolean) => {
    props.setNotWaiting();
    props.router.replace("/applicant/generate");
    props.setStartPlaidLink(false);
    notification.error({
      message: onExit
        ? "The Plaid window was closed. Unable to connect to your account."
        : "There was an error connecting to your Plaid account. Please try again.",
    });
    setPlaidPublicToken(null);
  };

  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    const { plaid_score_res } = await exchangePlaidToken({ publicToken });
    if (plaid_score_res?.status_code === 200) {
      props.router.replace("/applicant/generate?type=plaid&status=success");
      setScoreResponse(plaid_score_res);
    } else {
      notification.error({ message: "Failed to calculate the score" });
      props.router.replace("/applicant/generate");
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
    if (scoreResponse?.endpoint.includes("plaid")) {
      props.router.replace("/applicant/generate?type=plaid&status=success");
    } else {
      open();
    }
  }, [open, scoreResponse]);
  return null;
};

export default PlaidLink;
