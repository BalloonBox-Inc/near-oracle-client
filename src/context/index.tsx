import React, { createContext, useState, useEffect } from "react";
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

export const NearContext = createContext<INearContext | undefined>(undefined);

export const NearProvider = ({ children }: any) => {
  const config = getConfig("testnet");
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [scoreResponse, setScoreResponse] = useState<
    IScoreResponseCoinbase | IScoreResponsePlaid | null
  >(null);
  const [coinbaseToken, setCoinbaseToken] = useState(null);
  const [plaidPublicToken, setPlaidPublicToken] = useState(null);
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
        (!isConnected && router.asPath.includes("applicant")) ||
          (router.asPath.includes("providers") && router.push("/"));
      }
      returnHome();
    };
  }, [router, isConnected]);

  useEffect(() => {
    if (!loading) {
      storageHelper.persist("coinbaseToken", coinbaseToken);
      storageHelper.persist("plaidPublicToken", plaidPublicToken);
    }
  }, [coinbaseToken, plaidPublicToken]);

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
