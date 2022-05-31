import { useState } from "react";

import router from "next/router";

import NavigationButtons from "@nearoracle/src/components/NavigationButtons";
import ServiceSelector from "@nearoracle/src/components/ServiceSelector";

const ApplicantServicesPage = () => {
  const [selection, setSelection] = useState<null | "generate">(null);

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
                <span className="font-semibold">Applicant</span>
              </p>
            </div>

            <ServiceSelector
              selected={selection === "generate"}
              onClick={() => setSelection("generate")}
              text="Generate a Score"
            />
          </div>
        </div>
      </div>
      <NavigationButtons
        backHandler={() => router.push(`/start`)}
        nextHandler={() => router.push(`/applicant/${selection}`)}
        nextDisabled={!selection}
      />
    </>
  );
};

export default ApplicantServicesPage;
