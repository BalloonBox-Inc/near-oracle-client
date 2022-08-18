import React, {
  createContext,
  useEffect,
  useReducer,
  useMemo,
  useContext,
} from "react";
import {
  connect,
  WalletConnection,
  Contract,
  Account,
  keyStores,
  KeyPair,
} from 'near-api-js';
import { useRouter } from 'next/router';
import { notification } from 'antd';

import getConfig, { CONTRACT_NAME } from '@nearoracle/src/utils/config';
import { ICoinbaseTokenCreateResponse } from '@nearoracle/pages/api/coinbase';
import {
  IScoreResponsePlaid,
  IScoreResponseCoinbase,
} from '@nearoracle/src/types/types';

export type Set_Is_Connected = (isConnected: boolean) => void;
export type Set_Score_Response = (
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
) => void;
export type Coinbase_Token = ICoinbaseTokenCreateResponse | null;
export type Set_Coinbase_Token = (coinbaseToken: Coinbase_Token) => void;
export type Wallet = WalletConnection | null;
export type Plaid_Token = PlaidToken | null;
export type Set_Plaid_Token = (plaidPublicToken: Plaid_Token) => void;
export type Set_Chain_Activity = (chainActivity: IChainActivity) => void;
export type Handle_Set_Chain_Activity = (a: IChainActivity | null) => void;
export type Smart_Contract = {
  account: Account;
  contractId: string;
  query_score_history: (account_id: AccountIdParam) => void;
  store_score: ({ callbackUrl, args }: any) => void;
  nft_mint: ({ callbackUrl, args }: any) => void;
  nft_supply_for_owner: (account_id: AccountIdParam) => void;
  add_to_whitelist: ({ args }: any) => void;
};

export type AccountIdParam = {
  account_id: string | null;
};
export interface INearContext {
  loading: boolean;
  isConnected: boolean;
  setIsConnected: Set_Is_Connected;
  wallet: Wallet;
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null;
  setScoreResponse: Set_Score_Response;
  coinbaseToken: Coinbase_Token;
  setCoinbaseToken: Set_Coinbase_Token;
  plaidPublicToken: Plaid_Token;
  setPlaidPublicToken: Set_Plaid_Token;
  scoreContract: Smart_Contract;
  nftContract: Smart_Contract;
  scoreWhitelistContract: Smart_Contract;
  nftWhitelistContract: Smart_Contract;
  chainActivity: IChainActivity;
  setChainActivity: Set_Chain_Activity;
  handleSetChainActivity: Handle_Set_Chain_Activity;
  handleSignIn: () => void;
  handleSignOut: () => void;
}
export interface PlaidToken {
  publicToken: string;
}

export enum CHAIN_ACTIVITIES {
  scoreSubmitted = 'scoreSubmitted',
  dataProvider = 'dataProvider',
  scoreAmount = 'scoreAmount',
  scoreMessage = 'scoreMessage',
  txHashes = 'txHashes',
  nftMinted = 'nftMinted',
}
export interface IChainActivity {
  [CHAIN_ACTIVITIES.scoreSubmitted]?: boolean;
  [CHAIN_ACTIVITIES.dataProvider]?: 'Coinbase' | 'Plaid' | 'Covalent';
  [CHAIN_ACTIVITIES.scoreAmount]?: number;
  [CHAIN_ACTIVITIES.scoreMessage]?: string;
  [CHAIN_ACTIVITIES.txHashes]?: any;
  [CHAIN_ACTIVITIES.nftMinted]?: boolean;
}

export const CHAIN_ACTIVITIES_INIT = {
  scoreSubmitted: undefined,
  dataProvider: undefined,
  scoreAmount: undefined,
  scoreMessage: undefined,
  txHashes: undefined,
  nftMinted: undefined,
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

export const Context = createContext<INearContext | undefined>(undefined);

const useNearContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useNearContext must be used within a Context Provider');
  }
  return context;
};

const initialState = {
  wallet: null,
  isConnected: false,
  loading: true,
  scoreResponse: null,
  chainActivity: CHAIN_ACTIVITIES_INIT,
  coinbaseToken: null,
  plaidPublicToken: null,
  scoreContract: null,
  scoreWhitelistContract: null,
  nftContract: null,
  nftWhitelistContract: null,
};

function contextReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.payload,
      };
    case 'SET_ISCONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_SCORE_RESPONSE':
      return {
        ...state,
        scoreResponse: action.payload,
      };
    case 'SET_CHAIN_ACTIVITY':
      return {
        ...state,
        chainActivity: action.payload,
      };
    case 'SET_COINBASE_TOKEN':
      return {
        ...state,
        coinbaseToken: action.payload,
      };
    case 'SET_PLAID_PUBLIC_TOKEN':
      return {
        ...state,
        plaidPublicToken: action.payload,
      };
    case 'SET_SCORE_WHITELIST_CONTRACT':
      return {
        ...state,
        scoreWhitelistContract: action.payload,
      };
    case 'SET_SCORE_CONTRACT':
      return {
        ...state,
        scoreContract: action.payload,
      };
    case 'SET_NFT_WHITELIST_CONTRACT':
      return {
        ...state,
        nftWhitelistContract: action.payload,
      };
    case 'SET_NFT_CONTRACT':
      return {
        ...state,
        nftContract: action.payload,
      };

    default:
      return state;
  }
}

const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);

  const handlers = useMemo(() => {
    return {
      setWallet: (wallet: WalletConnection) =>
        dispatch({ type: 'SET_WALLET', payload: wallet }),
      setIsConnected: (isConnected: boolean) =>
        dispatch({ type: 'SET_ISCONNECTED', payload: isConnected }),
      setLoading: (loading: boolean) =>
        dispatch({ type: 'SET_LOADING', payload: loading }),
      setScoreResponse: (
        scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
      ) => dispatch({ type: 'SET_SCORE_RESPONSE', payload: scoreResponse }),
      setChainActivity: (chainActivity: IChainActivity) =>
        dispatch({ type: 'SET_CHAIN_ACTIVITY', payload: chainActivity }),
      setCoinbaseToken: (coinbaseToken: ICoinbaseTokenCreateResponse | null) =>
        dispatch({ type: 'SET_COINBASE_TOKEN', payload: coinbaseToken }),
      setPlaidPublicToken: (plaidPublicToken: Plaid_Token) =>
        dispatch({ type: 'SET_PLAID_PUBLIC_TOKEN', payload: plaidPublicToken }),
      setScoreContract: (contract: Contract | null) =>
        dispatch({ type: 'SET_SCORE_CONTRACT', payload: contract }),
      setNftContract: (contract: Contract | null) =>
        dispatch({ type: 'SET_NFT_CONTRACT', payload: contract }),
      setScoreWhitelistContract: (contract: Contract | null) =>
        dispatch({ type: 'SET_SCORE_WHITELIST_CONTRACT', payload: contract }),
      setNftWhitelistContract: (contract: Contract | null) =>
        dispatch({ type: 'SET_NFT_WHITELIST_CONTRACT', payload: contract }),
    };
  }, []);

  const {
    setWallet,
    setIsConnected,
    setLoading,
    setScoreResponse,
    setCoinbaseToken,
    setPlaidPublicToken,
    setScoreContract,
    setNftContract,
    setScoreWhitelistContract,
    setNftWhitelistContract,
    setChainActivity,
  } = handlers;

  const {
    wallet,
    isConnected,
    loading,
    scoreResponse,
    coinbaseToken,
    plaidPublicToken,
    scoreContract,
    nftContract,
    scoreWhitelistContract,
    nftWhitelistContract,
    chainActivity,
  } = state;

  const router = useRouter();

  useEffect(() => {
    const config = getConfig('testnet');
    const contract_owner = process.env.CONTRACT_OWNER_PRIVATE_KEY as string;

    const initContract = async () => {
      // Initialize connection to the network (testnet/mainnet)
      const near = await connect(config);
      const networkId = 'testnet';

      // Initializing wallet based account.
      const nearWallet = new WalletConnection(near, 'near-oracle');
      setWallet(nearWallet);

      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(contract_owner);

      await keyStore.setKey('testnet', 'bbox.testnet', keyPair);

      const signerConfig = {
        networkId,
        keyStore,
        nodeUrl: `https://rpc.${networkId}.near.org`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
        explorerUrl: `https://explorer.${networkId}.near.org`,
        headers: {},
      };

      const near2 = await connect(signerConfig);
      const signerAccount = await near2.account('bbox.testnet');

      // Initializing the four different contract APIs by contract name and configuration
      const scoreWhitelistContract = new Contract(
        signerAccount,
        process.env.SCORE_CONTRACT_NAME as string,
        {
          viewMethods: ['contract_owner'],
          changeMethods: ['add_to_whitelist'],
        }
      );

      setScoreWhitelistContract(scoreWhitelistContract);

      const scoreContract = new Contract(
        nearWallet.account(),
        process.env.SCORE_CONTRACT_NAME as string,
        {
          viewMethods: ['query_score_history'],
          changeMethods: ['store_score'],
        }
      );
      setScoreContract(scoreContract);

      const nftWhitelistContract = new Contract(
        signerAccount, // NEAR account to sign change method transactions
        process.env.NFT_CONTRACT_NAME as string, // the account where the contract has been deployed
        {
          viewMethods: ['contract_owner'],
          changeMethods: ['add_to_whitelist'],
        }
      );
      setNftWhitelistContract(nftWhitelistContract);

      const nftContract = new Contract(
        nearWallet.account(),
        process.env.NFT_CONTRACT_NAME as string,
        {
          viewMethods: ['nft_supply_for_owner', 'contract_owner'],
          changeMethods: ['nft_mint'],
        }
      );
      setNftContract(nftContract);
    };

    initContract();
  }, []);

  useEffect(() => {
    wallet && wallet.isSignedIn() && setIsConnected(true);
  }, [wallet]);

  useEffect(() => {
    const returnHome = () => {
      if (typeof window !== 'undefined') {
        (router.pathname.includes('start') ||
          router.pathname.includes('applicant') ||
          router.pathname.includes('provider')) &&
          router.push('/');
      }
    };
    if (!loading) {
      !isConnected && returnHome();
    }
  }, [router, isConnected, loading]);

  useEffect(() => {
    if (!loading) {
      storageHelper.persist('coinbaseToken', coinbaseToken);
      storageHelper.persist('plaidPublicToken', plaidPublicToken);
      storageHelper.persist('scoreResponse', scoreResponse);
      storageHelper.persist('chainActivity', chainActivity);
    }
  }, [coinbaseToken, plaidPublicToken, scoreResponse, chainActivity, loading]);

  useEffect(() => {
    setIsConnected(storageHelper.get('near-oracle_wallet_auth_key') && true);
    setCoinbaseToken(storageHelper.get('coinbaseToken'));
    setPlaidPublicToken(storageHelper.get('plaidPublicToken'));
    setScoreResponse(storageHelper.get('scoreResponse'));
    setChainActivity(storageHelper.get('chainActivity'));
    setLoading(false);
  }, []);

  const accountIdQuery = router.query.account_id;

  useEffect(() => {
    if (accountIdQuery) {
      notification.success({ message: 'Successfully connected wallet!' });
      router.replace('/');
    }
  }, [router]);

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
      message: 'Successfully disconnected wallet',
    });
  };

  const handleSetChainActivity = (val: IChainActivity | null) => {
    if (val) {
      setChainActivity({ ...chainActivity, ...val });
      storageHelper.persist('chainActivity', val);
    } else {
      setChainActivity(CHAIN_ACTIVITIES_INIT);
      storageHelper.persist('chainActivity', CHAIN_ACTIVITIES_INIT);
    }
  };

  return (
    <Context.Provider
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
        scoreContract,
        nftContract,
        scoreWhitelistContract,
        nftWhitelistContract,
        setChainActivity,
        chainActivity,
        handleSetChainActivity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, useNearContext };
