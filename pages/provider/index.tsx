import { useState } from "react";
import { useRouter } from "next/router";
import ServiceSelector from "@nearoracle/src/components/ServiceSelector";
import NavigationButtons from "@nearoracle/src/components/NavigationButtons";

const ProviderServicesPage = () => {
  const [selection, setSelection] = useState<null | "view">(null);
  const router = useRouter();
  return (
    <>
      <div className="px-14 py-10 -mb-10">
        <div className="w-full text-center">
          <div className=" flex flex-col items-center space-y-6  justify-center w-full">
            <div className="z-30 opacity-100 px-0 sm:p-10">
              <h2 className="z-50 font-semibold text-xl sm:text-3xl md:text-3xl p-0">
                Choose a Service
              </h2>
              <p className="z-30 font-base text-md sm:text-lg md:text-lg lg:text-xl p-0">
                Selected User Type:{" "}
                <span className="font-semibold">Provider</span>
              </p>
            </div>

            <ServiceSelector
              selected={selection === "view"}
              onClick={() => setSelection("view")}
              text="View an applicant's score"
            />
          </div>
        </div>
      </div>
      <NavigationButtons
        backHandler={() => router.push(`/start`)}
        nextHandler={() => router.push(`/provider/${selection}`)}
        nextDisabled={!selection}
      />
    </>
  );
};

export default ProviderServicesPage;
