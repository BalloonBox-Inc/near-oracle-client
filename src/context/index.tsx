import React, { createContext, useEffect, useReducer, useMemo } from "react";
import { connect, WalletConnection } from "near-api-js";
import { useRouter } from "next/router";
import { notification } from "antd";

import getConfig from "@nearoracle/src/utils/config";
import { ICoinbaseTokenCreateResponse } from "@nearoracle/pages/api/coinbase";
import {
  IScoreResponsePlaid,
  IScoreResponseCoinbase,
} from "@nearoracle/src/types/types";

export interface INearContext {
  handleSignIn: () => void;
  handleSignOut: () => void;
  loading: boolean;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  wallet: WalletConnection | null;
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null;
  setScoreResponse: React.Dispatch<
    React.SetStateAction<IScoreResponseCoinbase | IScoreResponsePlaid | null>
  >;
  coinbaseToken: ICoinbaseTokenCreateResponse | null;
  setCoinbaseToken: React.Dispatch<
    React.SetStateAction<ICoinbaseTokenCreateResponse | null>
  >;
  setPlaidPublicToken: React.Dispatch<React.SetStateAction<null | string>>;
  plaidPublicToken: string | null;
}

export const storageHelper = {
  persist: (key: string, item: any) =>
    localStorage.setItem(key, JSON.stringify(item)),
  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  },
};

const contextReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_WALLET":
      return {
        ...state,
        wallet: action.payload,
      };
    case "SET_ISCONNECTED":
      return {
        ...state,
        isConnected: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_SCORE_RESPONSE":
      return {
        ...state,
        scoreResponse: action.payload,
      };
    case "SET_COINBASE_TOKEN":
      return {
        ...state,
        coinbaseToken: action.payload,
      };
    case "SET_PLAID_PUBLIC_TOKEN":
      return {
        ...state,
        plaidPublicToken: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  wallet: null,
  isConnected: false,
  loading: true,
  scoreResponse: null,
  coinbaseToken: null,
  plaidPublicToken: null,
};

export const NearContext = createContext<INearContext | undefined>(undefined);

export const NearProvider = ({ children }: any) => {
  const config = getConfig("testnet");
  const [state, dispatch] = useReducer(contextReducer, initialState);

  const handlers = useMemo(() => {
    return {
      setWallet: (wallet: WalletConnection) =>
        dispatch({ type: "SET_WALLET", payload: wallet }),
      setIsConnected: (isConnected: boolean) =>
        dispatch({ type: "SET_ISCONNECTED", payload: isConnected }),
      setLoading: (loading: boolean) =>
        dispatch({ type: "SET_LOADING", payload: loading }),
      setScoreResponse: (
        scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
      ) => dispatch({ type: "SET_SCORE_RESPONSE", payload: scoreResponse }),
      setCoinbaseToken: (coinbaseToken: ICoinbaseTokenCreateResponse | null) =>
        dispatch({ type: "SET_COINBASE_TOKEN", payload: coinbaseToken }),
      setPlaidPublicToken: (plaidPublicToken: string | null) =>
        dispatch({ type: "SET_PLAID_PUBLIC_TOKEN", payload: plaidPublicToken }),
    };
  }, []);

  const {
    setWallet,
    setIsConnected,
    setLoading,
    setScoreResponse,
    setCoinbaseToken,
    setPlaidPublicToken,
  } = handlers;

  const {
    wallet,
    isConnected,
    loading,
    scoreResponse,
    coinbaseToken,
    plaidPublicToken,
  } = state;

  const router = useRouter();

  useEffect(() => {
    const initContract = async () => {
      // Initialize connection to the NEAR testnet
      const near = await connect(config);
      // Initializing wallet based account.
      const nearWallet = new WalletConnection(near, "near-oracle");
      setWallet(nearWallet);
    };

    initContract();

    // Todo: Initializing the contract APIs by contract name and configuration
    // window.contract = await new Contract(
    //   wallet.account(),
    //   config.contractName,
    //   {
    //     // View methods are read only. They don't modify the state, but usually return some value.
    //     viewMethods: ["getGreeting"],
    //     // Change methods can modify the state. But you don't receive the returned value when called.
    //     changeMethods: ["setGreeting"],
    //   }
    // );
  }, []);

  useEffect(() => {
    wallet && wallet.isSignedIn() && setIsConnected(true);
  }, [wallet]);

  useEffect(() => {
    const returnHome = () => {
      if (typeof window !== "undefined") {
        (router.pathname.includes("applicant") ||
          router.pathname.includes("providers")) &&
          router.push("/");
      }
    };

    if (!loading) {
      !isConnected && returnHome();
    }
  }, [router, isConnected, loading]);

  useEffect(() => {
    if (!loading) {
      storageHelper.persist("coinbaseToken", coinbaseToken);
      storageHelper.persist("plaidPublicToken", plaidPublicToken);
      storageHelper.persist("scoreResponse", scoreResponse);
    }
  }, [coinbaseToken, plaidPublicToken, scoreResponse]);

  useEffect(() => {
    setCoinbaseToken(storageHelper.get("coinbaseToken"));
    setPlaidPublicToken(storageHelper.get("plaidPublicToken"));
    setScoreResponse(storageHelper.get("scoreResponse"));
    setLoading(false);
  }, []);

  const handleSignIn = () => {
    wallet?.requestSignIn();
  };

  const handleSignOut = () => {
    wallet?.signOut();
    setIsConnected(false);
    setCoinbaseToken(null);
    setPlaidPublicToken(null);
    localStorage.clear();
    router.replace("/");
    notification.success({
      message: "Successfully disconnected wallet",
    });
  };

  return (
    <NearContext.Provider
      value={{
        handleSignIn,
        handleSignOut,
        isConnected,
        setIsConnected,
        wallet,
        scoreResponse,
        setScoreResponse,
        coinbaseToken,
        setCoinbaseToken,
        plaidPublicToken,
        setPlaidPublicToken,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
