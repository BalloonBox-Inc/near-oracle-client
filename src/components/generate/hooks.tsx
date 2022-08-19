import { useState, useMemo, useEffect } from "react";

export function useHandleSelection() {
  const [selection, setSelection] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setToCoinbase: () => setSelection('coinbase'),
      setToPlaid: () => setSelection('plaid'),
      setToCovalent: () => setSelection('covalent'),
    };
  }, []);

  const selections = useMemo(() => {
    return {
      coinbaseSelected: selection === 'coinbase',
      plaidSelected: selection === 'plaid',
      covalentSelected: selection == 'covalent',
      noneSelected: selection === undefined,
    };
  }, [selection]);

  return [selections, handlers] as const;
}

export function useHandleTemplateSelection() {
  const [selection, setSelection] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setToLow: () => {
        setSelection('low');
      },
      setToMedium: () => {
        setSelection('medium');
      },
      setToHigh: () => {
        setSelection('high');
      },
    };
  }, []);

  const selections = useMemo(() => {
    return {
      lowSelected: selection === 'low',
      mediumSelected: selection === 'medium',
      highSelected: selection === 'high',
      noTemplateSelected: selection == undefined,
    };
  }, [selection]);

  return [selections, handlers] as const;
}
export function useManageQuery({
  router,
  setStartCoinbase,
  setToWaiting,
}: any) {
  useEffect(() => {
    router?.query?.code && setStartCoinbase(true);
  }, [router?.query?.code, setStartCoinbase]);

  useEffect(() => {
    router?.query?.status === 'loading' && setToWaiting();
  }, [router?.query, setToWaiting]);
}

export function useHandleAwaitingScoreResponse() {
  const [awaitingScoreResponse, setAwaitingScoreResponse] =
    useState<boolean>(false);

  const handlers = useMemo(() => {
    return {
      setToWaiting: () => setAwaitingScoreResponse(true),
      setNotWaiting: () => setAwaitingScoreResponse(false),
    };
  }, []);

  return [awaitingScoreResponse, handlers] as const;
}

export function useHandleSdk() {
  const [sdk, setSdk] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setStartCoinbase: () => setSdk('coinbase'),
      setStartPlaidLink: () => setSdk('plaid'),
      setStartCovalent: () => setSdk('covalent'),
      setSdkUndefined: () => setSdk(undefined),
    };
  }, []);

  const startCoinbase = sdk === 'coinbase';
  const startPlaidLink = sdk === 'plaid';
  const startCovalent = sdk === 'covalent';

  return [startPlaidLink, startCoinbase, startCovalent, handlers] as const;
}

export function useHandleExistingScore() {
  const [isExistingScore, setIsExistingScore] = useState<
    "loading" | true | false
  >("loading");

  const handlers = useMemo(() => {
    return {
      setExistingScoreToTrue: () => setIsExistingScore(true),
      setExistingScoreToFalse: () => setIsExistingScore(false),
    };
  }, []);

  const existingScoreIsLoading = isExistingScore === "loading";
  const scoreExists = !!isExistingScore;

  return [existingScoreIsLoading, scoreExists, handlers] as const;
}

export function useManageExistingScore({
  chainActivity,
  setExistingScoreToTrue,
  setExistingScoreToFalse,
  queryType,
  router,
}: any) {
  useEffect(() => {
    if (chainActivity?.scoreSubmitted) {
      setExistingScoreToTrue();
      !!queryType && router.replace("/applicant/generate");
    } else setExistingScoreToFalse();
  }, [
    chainActivity,
    queryType,
    router,
    setExistingScoreToFalse,
    setExistingScoreToTrue,
  ]);
}
