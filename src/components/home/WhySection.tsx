import CardWithIcons from './CardsWithIcons';

export default function WhySection() {
  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <h2 className='text-4xl font-raleway font-bold mb-20'>
        Why{' '}
        <span className='text-transparent near-bg-gradient background-clip'>
          NearOracle
        </span>
        ?
      </h2>

      <div className='flex flex-col lg:flex-row md:mt-0'>
        <CardWithIcons
          title='Secure &#38; Private'
          img='./images/lock-icon.svg'
          description='
          While your data remains private, your score will be permanently added to the blockchain and you can view it for free at any time in the future. '
        />
        <CardWithIcons
          title='Blockchain Centric'
          img='./images/blockchain-outline.svg'
          description="Outside of your browser's cache &amp; the NEAR Protocol, there's no 3rd party database storing any of your data, securing you as its rightful owner."
        />
        <CardWithIcons
          title='Open Source'
          img='./images/opensource.svg'
          description='We believe in full transparency and giving back to the community, which is why NearOracle is entirely open source.'
        />
      </div>
    </div>
  );
}
