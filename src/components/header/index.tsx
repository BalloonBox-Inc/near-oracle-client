import Link from "next/link";
import { useState } from "react";

import Connect from "@nearoracle/src/components/connect";
import TestBanner from "@nearoracle/src/components/TestBanner";
import { useNearContext } from "@nearoracle/src/context";

export default function Header() {
  const [showAccount, setShowAccount] = useState<boolean>(false);
  const { isConnected } = useNearContext();
  const ENV_CONFIG = process.env.ENV_CONFIG;
  return (
    <div className='z-10'>
      {ENV_CONFIG === 'testnet' && <TestBanner />}
      <header
        className='flex items-center justify-between w-full py-4 px-10'
        style={{ height: '80px' }}
      >
        <Link passHref={true} href='/'>
          <a className='mt-1'>
            <img
              src={'/images/primary-logo.png'}
              width={120}
              height={100}
              alt='nearoracle-logo'
              className={`${showAccount ? 'disappear' : 'reappear'}`}
            />
          </a>
        </Link>
        <div className='flex items-center'>
          <Link
            passHref={true}
            href={
              ENV_CONFIG === 'testnet'
                ? 'https://www.nearoracle.com/'
                : 'https://test.nearoracle.com/'
            }
          >
            <div
              className={`mr-5 text-white font-semibold text-sm sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400 text-transparent near-bg-gradient background-clip ${
                showAccount ? 'disappear' : 'reappear'
              }`}
            >
              {ENV_CONFIG === 'testnet' ? 'Use Mainnet' : 'Use Testnet'}
            </div>
          </Link>
          {isConnected && (
            <Link passHref={true} href={'/start'}>
              <div
                className={`mr-5 text-white text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400 ${
                  showAccount ? 'disappear' : 'reappear'
                }`}
              >
                Start
              </div>
            </Link>
          )}
          <Link passHref={true} href={'/learn'}>
            <div
              className={`mr-5 text-white sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400 ${
                showAccount ? 'disappear' : 'reappear'
              }`}
            >
              Learn
            </div>
          </Link>
          <Connect showAccount={showAccount} setShowAccount={setShowAccount} />
        </div>
      </header>
    </div>
  );
}
