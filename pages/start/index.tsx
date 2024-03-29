import ServiceSelector from "@nearoracle/src/components/ServiceSelector";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "@nearoracle/src/components/Button";

const Start = () => {
  const router = useRouter();
  const [userTypeSelection, setUserTypeSelection] = useState<
    "applicant" | "provider" | null
  >(null);
  return (
    <div className='sm:px-14 sm:py-10'>
      <div className='w-full text-center'>
        <div className='flex flex-col items-center space-y-5 justify-center w-full'>
          <div className='z-50 opacity-100 px-0 sm:p-10'>
            <h2 className='z-50 font-semibold text-xl sm:text-3xl p-0'>
              Select Your User Type
            </h2>
          </div>

          <ServiceSelector
            title='Applicant'
            onClick={() => setUserTypeSelection('applicant')}
            selected={userTypeSelection === 'applicant'}
            text='I would like to generate a credit score and store it on the
              NEAR Protocol.'
          />
          <ServiceSelector
            title='Service Provider'
            onClick={() => setUserTypeSelection('provider')}
            selected={userTypeSelection === 'provider'}
            text="I would like to see an applicant's score already stored
        on the NEAR Protocol."
          />
        </div>
      </div>
      <div className='pt-16 z-30 flex justify-end'>
        <Button
          onClick={() => {
            router.push(`/${userTypeSelection}`);
          }}
          isDisabled={!userTypeSelection}
          text='Continue'
        />
      </div>
    </div>
  );
};

export default Start;
