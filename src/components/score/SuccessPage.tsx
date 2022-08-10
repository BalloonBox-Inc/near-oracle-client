import Lottie from 'react-lottie';
import { useRouter } from 'next/router';

import ServiceSelector from '@nearoracle/src/components/ServiceSelector';
import checkMarkAnimations from '@nearoracle/src/components/Lottie/check-mark.json';

const SuccessPage = ({ transactionHashes, config, score }: any) => {
  const router = useRouter();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: checkMarkAnimations,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <Lottie options={defaultOptions} height={200} width={200} />
      <h2 className='font-semibold text-xl sm:text-4xl mb-5'>
        {score ? 'Score saved!' : 'NFT minted!'}
      </h2>
      <p className='mb-10 text-lg'>
        <a
          href={`${config.explorerUrl}/transactions/${transactionHashes}`}
          target='_blank'
          className='text-white hover:text-gray-400 underline'
        >
          View on NEAR Explorer
        </a>
      </p>
      <div className='justify-center items-center flex flex-col'>
        {score && (
          <ServiceSelector
            text='Mint my score as an NFT'
            onClick={() => router.replace('/applicant/nft')}
          />
        )}
        <ServiceSelector
          text='View my score'
          onClick={() => router.push('/applicant/score')}
        />

        <ServiceSelector
          text='Go back to the menu'
          onClick={() => router.push('/start')}
        />
      </div>
    </>
  );
};

export default SuccessPage;
