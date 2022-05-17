import { keyStores } from "near-api-js";
import { useEffect, useState } from "react";

// Define the name of the smart contract that we want to interact with
// This is the name of the account where the smart contract is deployed to.
const CONTRACT_NAME =
  process.env.CONTRACT_NAME || "mycontract.myaccount.testnet";

// Function that returns a NEAR connection configuration object based on the given environment.
export const getConfig = (environment = "testnet") => {
  const handleKeyStore = () => {
    if (typeof window !== "undefined") {
      return new keyStores.BrowserLocalStorageKeyStore();
    }
  };

  switch (environment) {
    case "mainnet":
      return {
        networkId: "mainnet",
        keyStore: handleKeyStore(),
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
        contractName: CONTRACT_NAME,
        headers: {},
      };
    case "betanet":
      return {
        networkId: "betanet",
        keyStore: handleKeyStore(),
        nodeUrl: "https://rpc.betanet.near.org",
        walletUrl: "https://wallet.betanet.near.org",
        helperUrl: "https://helper.betanet.near.org",
        contractName: CONTRACT_NAME,
        headers: {},
      };
    case "testnet":
    default:
      return {
        networkId: "testnet",
        keyStore: handleKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        contractName: CONTRACT_NAME,
        headers: {},
      };
  }
};

export default getConfig;
