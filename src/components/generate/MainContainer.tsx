import { useRouter } from "next/router";

import NavigationButtons from "@nearoracle/src/components/NavigationButtons";
import ServiceSelector from "@nearoracle/src/components/ServiceSelector";
import { useHandleSelection } from "@nearoracle/src/components/generate/hooks";

const MainContainer = ({ setStartCoinbase, handlePlaidConnect }) => {
  const router = useRouter();

  const [
    { coinbaseSelected, plaidSelected, noneSelected },
    { setToCoinbase, setToPlaid },
  ] = useHandleSelection();

  return (
    <>
      <div className="text-center z-30 opacity-100 px-0 sm:p-10">
        <h2 className="z-30 font-semibold text-xl sm:text-3xl p-0">
          Choose a Provider
        </h2>
        <p className="z-30 font-base text-md sm:text-lg md:text-lg lg:text-xl">
          Select one of the following providers to qualify for a credit check.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="mb-3">
          {" "}
          <ServiceSelector
            img="/images/coinbaseLogo.svg"
            alt="coinbase-logo"
            className="w-2/3 h-12"
            onClick={setToCoinbase}
            selected={coinbaseSelected}
          />
        </div>

        <ServiceSelector
          img="/images/plaidLogo.svg"
          alt="plaid-logo"
          className="w-1/2 h-12"
          onClick={setToPlaid}
          selected={plaidSelected}
        />
      </div>
      <NavigationButtons
        backHandler={() => {
          router.push("/applicant");
        }}
        nextHandler={() =>
          coinbaseSelected ? setStartCoinbase() : handlePlaidConnect()
        }
        nextDisabled={noneSelected}
      />
    </>
  );
};

export default MainContainer;
