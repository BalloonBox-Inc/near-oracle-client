import { useState } from 'react';

import StepBox from './StepBox';

export default function HowItWorksSection() {
  const [applicant, setApplicant] = useState(true);

  return (
    <div className='flex flex-col items-center justify-center px-5 sm:px-10 md:px-0 py-10 relative'>
      <h2 className='text-4xl font-bold mb-10 font-raleway'>How it works</h2>
      <div className='flex items-center bg-neutral-800 mb-10 px-2 py-4 rounded-full cursor-pointer relative'>
        <div
          className={`near-bg-gradient py-5 rounded-full ${
            applicant ? 'w-36' : 'w-40 right-3'
          } -z-5 absolute`}
        ></div>
        <div
          className={`text-lightgray hover:text-white z-10`}
          style={{ width: '140px', textAlign: 'center' }}
          onClick={() => setApplicant(true)}
        >
          Applicant
        </div>
        <div
          className={`text-lightgray hover:text-white z-10 cursor-pointer`}
          style={{ width: '160px', textAlign: 'center' }}
          onClick={() => setApplicant(false)}
        >
          Service Provider
        </div>
      </div>

      {applicant ? (
        <div className='relative'>
          <StepBox
            title='Integrate with validators'
            img='./images/providers.svg'
            description="We acquire users' financial data by integrating with three validators : Coinbase, ETH wallet (MetaMask), or the financial institution you do your banking with. "
            style={{ marginBottom: '3rem' }}
            side='left'
          />
          <img
            src='./images/arrow-1.svg'
            alt='arrow-1'
            className='absolute top-40 -left-5 invisible md:visible'
          />
          <StepBox
            title='Calculate financial score'
            img='./images/credit-gauge.svg'
            description='We run an algorithm on the given data to compute a score representing the financial health of a user.'
            style={{ marginBottom: '3rem' }}
            side='right'
          />
          <img
            src='./images/arrow-2.svg'
            alt='arrow-2'
            className='absolute bottom-20 right-10 -z-10 invisible md:visible'
          />
          <StepBox
            title='Save it to the blockchain'
            img='./images/near_logo_wht.svg'
            description='We save your score to the NEAR blockchain.'
            style={{ marginBottom: '3rem' }}
            side='left'
          />

          <img
            src='./images/arrow-3.svg'
            alt='arrow-3'
            className='absolute bottom-20 left-10 invisible md:visible'
          />
          <StepBox
            title='Mint your score as an NFT'
            img='./images/nft.png'
            description='Add value to your score, mint it as an NFT with your custom design.'
            style={{ marginBottom: '3rem' }}
            side='right'
          />
        </div>
      ) : (
        <div className='relative'>
          <StepBox
            title='Algorithm calculates financial score'
            img='./images/provider-1.svg'
            description='Applicants will get a score that is calculated by an algorithm based on their financial data retrieved by three validators: Plaid, Ethereum wallet, Coinbase.'
            style={{ marginBottom: '3rem' }}
            side='right'
          />
          <img
            src='./images/arrow-2.svg'
            alt='arrow-2'
            className='absolute invisible md:visible right-10 top-40'
          />
          <StepBox
            title='Score stored to the NEAR blockchain'
            img='./images/near_logo_wht.svg'
            description='Once the applicants get their scores, they can store their score to the NEAR blockchain.'
            style={{ marginBottom: '3rem' }}
            side='left'
          />
          <img
            src='./images/arrow-1.svg'
            alt='arrow-1'
            className='absolute top-90 left-20 invisible md:visible'
          />
          <StepBox
            title="View your applicants' scores"
            img='./images/provider-3.svg'
            description="Check your applicants' scores by simply entering the NEAR wallet id of the applicant."
            style={{ marginBottom: '3rem' }}
            side='right'
          />
        </div>
      )}
    </div>
  );
}
