import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import NavigationButtons from '@nearoracle/src/components/NavigationButtons';
import {
  useHandleSelection,
  useHandleTemplateSelection,
} from '@nearoracle/src/components/generate/hooks';
import TemplateSelector from '@nearoracle/src/components/TemplateSelector';
import ProviderSelector from '@nearoracle/src/components/ProviderSelector';
import { storageHelper } from '@nearoracle/src/context';

interface IMainContainerProps {
  handlePlaidConnect: () => void;
  setStartCoinbase: () => void;
  setStartCovalent: () => void;
}

const MainContainer = ({
  setStartCoinbase,
  handlePlaidConnect,
  setStartCovalent,
}: IMainContainerProps) => {
  const router = useRouter();

  const [
    { coinbaseSelected, plaidSelected, covalentSelected, noneSelected },
    { setToCoinbase, setToPlaid, setToCovalent },
  ] = useHandleSelection();

  const [
    { lowSelected, mediumSelected, highSelected, noTemplateSelected },
    { setToLow, setToMedium, setToHigh },
  ] = useHandleTemplateSelection();

  const [loanRequest, setLoanRequest] = useState<number | string>('');
  const [checked, setChecked] = useState<boolean>(false);

  const renderMinValue = () => {
    if (lowSelected) return 0;
    else if (mediumSelected) return 25000;
    else return 50000;
  };

  const renderMaxValue = () => {
    if (lowSelected) return 25000;
    else if (mediumSelected) return 50000;
    else return 100000;
  };

  useEffect(() => {
    if (lowSelected) {
      setLoanRequest(0);
      setChecked(false);
    } else if (mediumSelected) {
      setLoanRequest(25000);
      setChecked(false);
    } else if (highSelected) {
      setLoanRequest(50000);
      setChecked(false);
    }
  }, [lowSelected, mediumSelected, highSelected]);

  useEffect(() => {
    if (loanRequest) {
      storageHelper.persist('loanRequest', loanRequest);
    } else {
      storageHelper.get('loanRequest');
    }
  }, [loanRequest]);

  useEffect(() => {
    const maxValue = renderMaxValue();
    if (checked) {
      setLoanRequest(maxValue);
    }
  }, [checked]);

  const loanRangeSection = (
    <div>
      <h3 className='text-lg sm:text-xl font-medium text-white mb-4 sm:mb-10 sm:mt-0 mt-20'>
        How much are you looking to borrow?
      </h3>
      <div className='grid md:grid-cols-3 gap-3'>
        <TemplateSelector
          priceRange='$0~$25K'
          cryptoAvailable={true}
          onClick={setToLow}
          selected={lowSelected}
        />
        <TemplateSelector
          priceRange='$25K~$50K'
          cryptoAvailable={false}
          onClick={setToMedium}
          selected={mediumSelected}
        />
        <TemplateSelector
          priceRange='$50K~$100K'
          cryptoAvailable={false}
          onClick={setToHigh}
          selected={highSelected}
        />
      </div>
    </div>
  );

  const amountRangeSlider = (
    <div className='mt-20'>
      {' '}
      <h3 className='text-lg sm:text-xl font-medium text-white mb-10'>
        Select the exact amount
      </h3>
      <h2 className='text-4xl font-semibold text-white'>
        {'US$' + Number(loanRequest)?.toLocaleString()}
      </h2>
      <div>
        <input
          className='slider w-full'
          id='slider'
          type='range'
          min={renderMinValue()}
          max={renderMaxValue()}
          step='100'
          value={loanRequest}
          onChange={(e) => setLoanRequest(Number(e.target.value))}
        />
      </div>
      <div className='mt-3'>
        <input
          type='checkbox'
          value='noCustomAmount'
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label> I don't have a specific amount in mind yet.</label>
      </div>
    </div>
  );

  const availableProviders = (
    <div className='mt-20'>
      {' '}
      <h3 className='text-lg sm:text-xl font-medium text-white mb-10'>
        Available Providers
      </h3>
      <div className='grid md:grid-cols-3 gap-7'>
        <ProviderSelector
          provider='Bank'
          thumbnail='bank-icon.svg'
          poweredByLogo='plaidLogo.svg'
          description='Get your fiat transaction history from your primary bank account.'
          selected={plaidSelected}
          onClick={setToPlaid}
          disabled={false}
        />

        <ProviderSelector
          provider='Ethereum Wallet'
          thumbnail='eth-icon.svg'
          poweredByLogo='covalentLogo.svg'
          description='Get your ethereum transaction history from your ethereum wallet.'
          selected={covalentSelected}
          onClick={setToCovalent}
          disabled={mediumSelected || highSelected}
        />

        <ProviderSelector
          provider='Coinbase'
          thumbnail='coinbase-icon.svg'
          poweredByLogo='coinbaseLogo.svg'
          description='Get your crypto transaction data from your coinbase account.'
          selected={coinbaseSelected}
          onClick={setToCoinbase}
          disabled={mediumSelected || highSelected}
        />
      </div>
      {covalentSelected && (
        <div className='mt-7'>
          <Alert
            style={{
              borderColor: 'rgba(85, 75, 249, 0.5)',
              backgroundColor: 'rgba(85, 75, 249,0.3)',
            }}
            description={
              <div className='p-0'>
                <InfoCircleOutlined
                  style={{
                    fontSize: '1.5rem',
                    marginRight: '1rem',
                    color: '#554BF9',
                  }}
                />
                To proceed with the Ethereum wallet, you need to install
                Metamask browser extension.{' '}
                <a
                  href='https://metamask.io/download/'
                  target={'_blank'}
                  className='text-near-blue ml-1'
                >
                  Install Metamask
                </a>
              </div>
            }
            type='info'
          />
        </div>
      )}
    </div>
  );
  return (
    <div className='px-10 lg:px-40 2xl:px-42'>
      <div className='text-center z-30 opacity-100 px-0 sm:p-10'>
        <h2 className='z-30 font-semibold text-2xl sm:text-3xl mb-2 text-white'>
          Choose a Provider
        </h2>
        <p className='z-30 font-base text-md sm:text-lg md:text-lg lg:text-xl'>
          Select one of the following providers to get a credit score.
        </p>
      </div>
      <form>
        {loanRangeSection}
        {!noTemplateSelected && amountRangeSlider}
        {!noTemplateSelected && availableProviders}
      </form>

      <NavigationButtons
        backHandler={() => {
          router.push('/applicant');
        }}
        nextHandler={() => {
          if (coinbaseSelected) setStartCoinbase();
          else if (plaidSelected) handlePlaidConnect();
          else {
            setStartCovalent();
          }
        }}
        nextDisabled={noneSelected || noTemplateSelected}
      />
    </div>
  );
};

export default MainContainer;
