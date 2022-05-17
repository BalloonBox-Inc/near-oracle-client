import React, { createContext, useState, useEffect } from "react";
import { connect, Contract, WalletConnection } from "near-api-js";
import getConfig from "@nearoracle/src/utils/config";
import { useRouter } from "next/router";
import { notification } from "antd";

export interface INearContext {
  handleSignIn: () => void;
  handleSignOut: () => void;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  wallet: WalletConnection | null;
}

export const NearContext = createContext<INearContext | undefined>(undefined);

export const NearProvider = ({ children }: any) => {
  const config = getConfig("testnet");
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
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

  const handleSignIn = () => {
    wallet?.requestSignIn();
  };

  const handleSignOut = () => {
    wallet?.signOut();
    setIsConnected(false);
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
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
