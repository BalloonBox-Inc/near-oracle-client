import getConfig from "@nearoracle/src/utils/config";
import {
  connect,
  Contract,
  keyStores,
  WalletAccount,
  WalletConnection,
} from "near-api-js";

const config = getConfig("testnet");

export async function initContract() {
  const near = await connect(config);
  const wallet = new WalletConnection(near, "near-oracle");
  if (!wallet.isSignedIn()) return wallet.requestSignIn();
  console.log(wallet);
  const accountId = wallet.getAccountId();
}

export async function logout() {
  const near = await connect(config);
  const wallet = new WalletConnection(near, "near-oracle");
  wallet.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
}
