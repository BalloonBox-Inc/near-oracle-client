import ProviderSection from '@nearoracle/src/components/learn/ProviderSection';

const LearnMorePage = () => {
  const howItWorks = (
    <div className='py-10 sm:py-10 md:py-20'>
      <h1 className='font-bold font-raleway text-2xl md:text-4xl leading-tight'>
        {' '}
        How{' '}
        <span className='text-transparent near-bg-gradient background-clip'>
          NearOracle
        </span>{' '}
        Works{' '}
      </h1>
      <p className='text-xs md:text-sm text-lightgray mt-5'>
        NearOracle allows you to log into one of three possible validators: your
        Coinbase account, your MetaMask non-custodial ETH wallet, or the
        financial institution you do your banking with. The oracle retrieves
        data on your financial history, and through an algorithm, it calculates
        and returns you a credit score. The dApp further allows you to store
        your credit score to the Near blockchain as well as to mint your credit
        score as an NFT. You are required to pay a small gas fee to cover both
        calculation cost and blockchain storage cost. While your data remains
        private, your score will be permanently added to the blockchain and you
        can view it for free at any time in the future. Similarly, you can
        visualize your NFTs among the collectibles of your Near wallet.
      </p>
      <div className='bg-zinc-900 px-10 py-14 rounded-2xl mt-10 flex justify-between items-center md:flex-row flex-col'>
        <div className='w-48'>
          <img src='./images/validators.svg' alt='plaidcoinbasemetamask' />
          <p className='text-lightgray mt-5 text-center'>
            Select one financial validator that will provide your financial
            data.
          </p>
        </div>
        <img
          src='./images/white-arrow.svg'
          alt='whitearrow'
          className='w-12 lg:w-28 md:rotate-0 rotate-90 md:p-0 py-5'
        />
        <div className='w-48 flex flex-col items-center'>
          <img
            src='./images/primary-logo.png'
            alt='crystalball'
            className='w-25 mb-5'
          />
          <p className='text-lightgray mt-5 text-center'>
            NearOracle algorithm calculates your score.
          </p>
        </div>
        <img
          src='./images/white-arrow.svg'
          alt='whitearrow'
          className='w-12 lg:w-28 md:rotate-0 rotate-90 md:p-0 py-5'
        />
        <div className='w-48 flex flex-col items-center'>
          <img
            src='./images/near_logo_wht.svg'
            alt='blockchain'
            className='w-42 md:rotate-0 md:p-0 py-5'
          />
          <p className='text-lightgray mt-5 text-center'>
            Encrypt and store your score to Near blockchain (costs a gas fee)
          </p>
        </div>
        <img
          src='./images/white-arrow.svg'
          alt='whitearrow'
          className='w-12 lg:w-28 md:rotate-0 rotate-90 md:p-0 py-5'
        />
        <div className='w-48 flex flex-col items-center'>
          <img src='./images/nft.png' alt='key' className='mb-5' />
          <p className='text-lightgray mt-5 text-center'>
            Add value to your score, minting it as an NFT
          </p>
        </div>
      </div>
    </div>
  );

  const howWeCaculate = (
    <div className='pt-5 sm:pt-10 md:pt-20 relative'>
      <h1 className='font-bold font-raleway text-2xl md:text-4xl leading-tight'>
        How we calculate your score
      </h1>
      <p className='text-xs md:text-sm text-lightgray my-5'>
        NearOracle scores are calculated using many pieces of data retrieved
        from either your bank account or your crypto wallets. We developed three
        distinct models, depending on your choice of providers: Bank accounts,
        Ethereum wallet, Coinbase. The percentages in the donut chart reflect
        how important each of the categories is in determining your cumulative
        score.
      </p>
      <ProviderSection
        title='Bank'
        logo='/images/plaidLogo.svg'
        description='Your banking data are grouped into 4 categories: '
        piechart='/images/bank-pie.svg'
        cats='Credit, Velocity, Stability, Diversity.'
        cat1='Stability (1o%)'
        des1='computes your total account balance now as well as the minimum running balance for the past few years.'
        cat2='Diversity (1o%)'
        des2='rewards the diversity of a portfolio, checking for all account types: savings, retail investment, brokerage, loans, and retirement accounts. It also rewards based on the volume of capital held in each account.'
        cat3='Credit (4o%)'
        des3='detects the number, duration, type of credit accounts, and the age of the oldest account. It also considers the percentage of available credit used, the cumulative credit limit, and how often interest was charged on your credit cards.'
        cat4='Velocity (4o%)'
        des4='analyzes how many and how fast transactions occur in checking account(s). It calculates the number and volume of monthly recurring deposits and withdrawals, the cumulative monthly income, and expenses.'
        color2='#FFB1C4'
        color3='#FF144E'
        color4='#FF698E'
      />
      <ProviderSection
        title='Ethereum Wallet'
        logo='/images/covalentLogo.svg'
        description='The data fetched from your MetaMask wallet are grouped into 4 categories: '
        piechart='/images/eth-pie.svg'
        cats='Traffic, Wealth, Stamina, Credibility.
        '
        cat1='Credibility (10%)'
        des1='considers how long your ETH wallet has been active.'
        cat2='Stamina (20%)'
        des2=' investigates how diversified your wallet is and what types of transactions you perform regularly (staking, voting, transferring, swapping, minting, selling, buying, etc.)
        '
        cat3='Traffic (37%)'
        des3='estimates the count, volume, and frequency of your crypto transactions.
        '
        cat4='Wealth (33%)'
        des4='calculates the net worth of your wallet across all crypto assets you own.
        '
        color2='#D2D5DA'
        color3='#394150'
        color4='#6C727F'
      />
      <ProviderSection
        title='Coinbase'
        logo='/images/coinbaseLogo.svg'
        description='The financial data from your Coinbase account are grouped into 4 categories: '
        piechart='/images/coinbase-pie.svg'
        cats='KYC, History, Liquidity, Activity.'
        cat1='KYC (10%)'
        des1={`checks whether you correctly kyc'ed into Coinbase and whether you own any active account
        `}
        cat2='History (10%)'
        des2='looks at the length of transaction history and the age of your longest-standing wallet.'
        cat3='Liquidity (40%)'
        des3='computes your current cumulative net account balance as well as the minimum running balance for the past few years.'
        cat4='Activity (40%)'
        des4='checks how lively is the transaction history, the volume traded, staked, bought, sold, withdrawn in the last year, and the net profit since account inception.'
        color2='#C3D4FF'
        color3='#1652F0'
        color4='#7295F0'
      />
    </div>
  );

  return (
    <>
      {howItWorks}
      {howWeCaculate}
    </>
  );
};

export default LearnMorePage;
