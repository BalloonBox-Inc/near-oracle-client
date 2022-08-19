import router from 'next/router';

import Button, { BUTTON_STYLES } from '../Button';
import Connect from '../connect';

export default function HeroSection({ isConnected }: { isConnected: boolean }) {
  return (
    <div className='flex justify-center'>
      <div className='text-center px-5 md:py-40 py-32 md:w-3/4 xl:w-1/2'>
        <h1 className='font-raleway text-4xl md:text-5xl font-bold'>
          {' '}
          A credit scoring oracle <br />
          on NEAR Protocol
        </h1>
        <p className='text-lightgray mt-5 text-lg w-full'>
          Get a credit score based on your crypto and fiat financial history.{' '}
          <br />
          No account required, connect your NEAR wallet and get started!
        </p>
        <div className='flex justify-center mt-10 mx-auto lg:mx-0 flex-col items-center sm:flex-row'>
          <div className='sm:mr-5 sm:mb-0 mb-5'>
            {' '}
            {isConnected ? (
              <Button
                text='Get Started'
                onClick={() => {
                  router.push('/start');
                }}
              />
            ) : (
              <Connect />
            )}
          </div>
          <Button
            style={BUTTON_STYLES.OUTLINE}
            text='Learn more'
            onClick={() => {
              router.push('/learn');
            }}
          />
        </div>
      </div>
    </div>
  );
}
