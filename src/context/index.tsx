import React, { createContext, useEffect, useReducer, useMemo } from "react";
import { connect, WalletConnection, Contract } from "near-api-js";
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
  setIsConnected: (isConnected: boolean) => void;
  wallet: WalletConnection | null;
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null;
  setScoreResponse: (
    scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
  ) => void;
  coinbaseToken: ICoinbaseTokenCreateResponse | null;
  setCoinbaseToken: (
    coinbaseToken: ICoinbaseTokenCreateResponse | null
  ) => void;
  setPlaidPublicToken: (plaidPublicToken: string | null) => void;
  plaidPublicToken: string | null;
  contract: Contract;
  chainActivity: IChainActivity;
  setChainActivity: (chainActivity: IChainActivity) => void;
  handleSetChainActivity: (a: IChainActivity | null) => void;
}

export enum CHAIN_ACTIVITIES {
  scoreSubmitted = "scoreSubmitted",
  dataProvider = "dataProvider",
  scoreAmount = "scoreAmount",
  scoreMessage = "scoreMessage",
}
export interface IChainActivity {
  [CHAIN_ACTIVITIES.scoreSubmitted]?: boolean;
  [CHAIN_ACTIVITIES.dataProvider]?: "coinbase" | "plaid";
  [CHAIN_ACTIVITIES.scoreAmount]?: number;
  [CHAIN_ACTIVITIES.scoreMessage]?: string;
}

export const CHAIN_ACTIVITIES_INIT = {
  scoreSubmitted: undefined,
  dataProvider: undefined,
  scoreAmount: undefined,
  scoreMessage: undefined,
};

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
    case "SET_CHAIN_ACITIVITY":
      return {
        ...state,
        chainActivity: action.payload,
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
    case "SET_CONTRACT":
      return {
        ...state,
        contract: action.payload,
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
  chainActivity: CHAIN_ACTIVITIES_INIT,
  coinbaseToken: null,
  plaidPublicToken: null,
  contract: null,
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
      setChainActivity: (chainActivity: IChainActivity) =>
        dispatch({ type: "SET_CHAIN_ACTIVITY", payload: chainActivity }),
      setCoinbaseToken: (coinbaseToken: ICoinbaseTokenCreateResponse | null) =>
        dispatch({ type: "SET_COINBASE_TOKEN", payload: coinbaseToken }),
      setPlaidPublicToken: (plaidPublicToken: string | null) =>
        dispatch({ type: "SET_PLAID_PUBLIC_TOKEN", payload: plaidPublicToken }),
      setContract: (contract: Contract | null) =>
        dispatch({ type: "SET_CONTRACT", payload: contract }),
    };
  }, []);

  const {
    setWallet,
    setIsConnected,
    setLoading,
    setScoreResponse,
    setCoinbaseToken,
    setPlaidPublicToken,
    setContract,
    setChainActivity,
  } = handlers;

  const {
    wallet,
    isConnected,
    loading,
    scoreResponse,
    coinbaseToken,
    plaidPublicToken,
    contract,
    chainActivity,
  } = state;

  const router = useRouter();

  useEffect(() => {
    const initContract = async () => {
      // Initialize connection to the NEAR testnet
      const near = await connect(config);
      // Initializing wallet based account.
      const nearWallet = new WalletConnection(near, "near-oracle");
      setWallet(nearWallet);

      // Initializing the contract APIs by contract name and configuration

      const nearContract = new Contract(
        nearWallet.account(),
        "storescore.bbox.testnet",
        {
          viewMethods: ["query_score_history"],
          changeMethods: ["store_score"],
        }
      );
      setContract(nearContract);
    };

    initContract();
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
    console.log(isConnected);

    if (!loading) {
      !isConnected && returnHome();
    }
  }, [router, isConnected, loading]);

  useEffect(() => {
    if (!loading) {
      storageHelper.persist("coinbaseToken", coinbaseToken);
      storageHelper.persist("plaidPublicToken", plaidPublicToken);
      storageHelper.persist("scoreResponse", scoreResponse);
      storageHelper.persist("chainActivity", chainActivity);
    }
  }, [coinbaseToken, plaidPublicToken, scoreResponse, chainActivity]);

  useEffect(() => {
    setIsConnected(storageHelper.get("near-oracle_wallet_auth_key") && true);
    setCoinbaseToken(storageHelper.get("coinbaseToken"));
    setPlaidPublicToken(storageHelper.get("plaidPublicToken"));
    setScoreResponse(storageHelper.get("scoreResponse"));
    setChainActivity(storageHelper.get("chainActivity"));
    setLoading(false);
  }, []);

  // redirect to the NEAR wallet SDK
  const handleSignIn = () => {
    wallet?.requestSignIn();
  };

  const handleSignOut = () => {
    wallet?.signOut();
    setIsConnected(false);
    setCoinbaseToken(null);
    setPlaidPublicToken(null);
    setScoreResponse(null);
    setChainActivity(CHAIN_ACTIVITIES_INIT);
    localStorage.clear();
    notification.success({
      message: "Successfully disconnected wallet",
    });
  };

  const handleSetChainActivity = (val: IChainActivity | null) => {
    if (val) {
      setChainActivity({ ...chainActivity, ...val });
      storageHelper.persist("chainActivity", val);
    }
    // } else {
    //   setChainActivity(CHAIN_ACTIVITIES_INIT);
    //   storageHelper.persist("chainActivity", CHAIN_ACTIVITIES_INIT);
    // }
  };

  return (
    <NearContext.Provider
      value={{
        loading,
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
        contract,
        setChainActivity,
        chainActivity,
        handleSetChainActivity,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
