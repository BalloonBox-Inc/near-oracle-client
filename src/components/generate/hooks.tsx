import { useState, useMemo, useEffect } from "react";

export function useHandleSelection() {
  const [selection, setSelection] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setToCoinbase: () => setSelection("coinbase"),
      setToPlaid: () => setSelection("plaid"),
    };
  }, []);

  const selections = useMemo(() => {
    return {
      coinbaseSelected: selection === "coinbase",
      plaidSelected: selection === "plaid",
      noneSelected: selection === undefined,
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
    router?.query?.status === "loading" && setToWaiting();
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
      setStartCoinbase: () => setSdk("coinbase"),
      setStartPlaidLink: () => setSdk("plaid"),
      setSdkUndefined: () => setSdk(undefined),
    };
  }, []);

  const startCoinbase = sdk === "coinbase";
  const startPlaidLink = sdk === "plaid";

  return [startPlaidLink, startCoinbase, handlers] as const;
}
