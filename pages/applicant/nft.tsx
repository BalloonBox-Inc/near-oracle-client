import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { notification } from 'antd';
import { NFTStorage } from 'nft.storage';

import Canvas from '@nearoracle/src/components/Canvas';
import { useNearContext } from '@nearoracle/src/context';
import Button from '@nearoracle/src/components/Button';
import SuccessPage from '@nearoracle/src/components/score/SuccessPage';
import getConfig from '@nearoracle/src/utils/config';
import { useHandleAwaitingScoreResponse } from '@nearoracle/src/components/generate/hooks';
import { LoadingContainer } from '@nearoracle/src/components/LoadingContainer';

const ApplicantNftPage = () => {
  const {
    chainActivity,
    wallet,
    nftContract,
    nftWhitelistContract,
    handleSetChainActivity,
  } = useNearContext();

  const [awaitingScoreResponse, { setToWaiting, setNotWaiting }] =
    useHandleAwaitingScoreResponse();

  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor1, setBgColor1] = useState('#ffffff');
  const [bgColor2, setBgColor2] = useState('#ffffff');
  const [planetSelected, setPlanetSelected] = useState('Earth.png');
  const [dataUrl, setDataUrl] = useState('');

  const router = useRouter();

  const queryTransactionHash = router?.query?.transactionHashes;
  const queryErrorCode = router?.query?.errorCode;
  const queryStatus = router?.query?.status;

  const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY as string;
  const ENV_CONFIG = process.env.ENV_CONFIG as string;

  const config = getConfig(ENV_CONFIG);



  useEffect(() => {
    queryTransactionHash && handleSetChainActivity({ nftMinted: true });
  }, [queryTransactionHash]);

  useEffect(() => {
    if (queryErrorCode) {
      queryErrorCode?.includes('userRejected') &&
        notification.error({
          message: 'Near wallet window was closed. Please try again',
        });
      router.replace('/applicant/nft');
    }
  }, [queryErrorCode, router]);

  const tokenGenerator = () => {
    return (
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2)
    );
  };

  const renderGraphic = (context: CanvasRenderingContext2D) => {
    // Draw background
    let gradient = context.createLinearGradient(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(1, bgColor2);

    context.fillStyle = gradient;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw a planet
    if (typeof window !== 'undefined') {
      const img = new Image();
      img.src = `/images/planets/${planetSelected}`;

      img.onload = function () {
        context.drawImage(
          img,
          0,
          0,
          context.canvas.width,
          context.canvas.height
        );
        // Display a score
        context.fillStyle = textColor;
        context.font = '100px Tahoma';
        if (chainActivity.scoreAmount !== undefined) {
          context.textAlign = 'center';
          context.fillText(
            chainActivity.scoreAmount.toString(),
            context.canvas.width / 2,
            context.canvas.height / 2
          );
        }

        // Display an account id
        context.fillStyle = textColor;
        context.font = '20px Tahoma';
        context.textAlign = 'center';
        if (wallet?._authData.accountId !== undefined) {
          context.fillText(
            wallet?._authData.accountId,
            context.canvas.width / 2,
            250
          );
        }
        setDataUrl(context.canvas.toDataURL('image/png'));
      };
    }
  };

  function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI?.split(',')[0]?.split(':')[1]?.split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  const handleNftMint = async () => {
    setToWaiting();
    router.replace('/applicant/nft?status=loading');
    const blob = dataURItoBlob(dataUrl);
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });

    const cid = await client.storeBlob(blob);

    const numOfNFT = await nftContract.nft_supply_for_owner({
      account_id: wallet?._authData.accountId,
    });

    await nftWhitelistContract?.add_to_whitelist({
      args: { account_id: wallet?._authData.accountId },
    });

    await nftContract?.nft_mint({
      callbackUrl: `${process.env.NEXT_BASE_URL}/applicant/nft`,
      args: {
        token_id: tokenGenerator(),
        metadata: {
          title: `NearOracle Score #${Number(numOfNFT) + 1}`,
          description: `${wallet?._authData.accountId}'s NFT #${
            Number(numOfNFT) + 1
          } : ${chainActivity?.scoreAmount}`,
          media: cid,
        },
        receiver_id: wallet?._authData.accountId,
      },
      amount: '10000000000000000000000', // attached deposit in yoctoNEAR
    });
  };

  const planetArray = [
    'Earth.png',
    'Jupiter.png',
    'Mars.png',
    'Mercury.png',
    'Neptune.png',
    'Venus.png',
    'Saturn.png',
    'Uranus.png',
  ];

  return (
    <div className='px-14 py-10 w-full flex flex-col items-center text-center'>
      {' '}
      {queryTransactionHash && (
        <SuccessPage
          transactionHashes={queryTransactionHash}
          config={config}
          score={false}
        />
      )}
      {awaitingScoreResponse && <LoadingContainer text='Minting your NFT...' />}
      {!queryTransactionHash && queryStatus !== 'loading' && (
        <>
          <h2 className='z-40 font-semibold text-2xl sm:text-4xl mb-5 text-white'>
            Custom design your NFT
          </h2>
          <div className='grid gap-2 lg:grid-cols-2 w-full justify-center py-10'>
            <div
              id='nft-container'
              className='relative'
              style={{ width: '400px', height: '400px' }}
            >
              <Canvas draw={renderGraphic} height={400} width={400} />
            </div>
            <div className='flex flex-col'>
              <div className='flex flex-col justify-center mb-3'>
                <div className='text-left text-md font-semibold mb-3'>
                  Background color 1
                </div>

                <input
                  type='color'
                  name='bg-color1'
                  value={bgColor1}
                  onChange={(e) => {
                    setBgColor1(e.target.value);
                  }}
                />
              </div>

              <div className='flex flex-col justify-center mb-3'>
                <div className='text-left text-md font-semibold mb-3'>
                  Background color 2
                </div>
                <input
                  type='color'
                  name='bg-color2'
                  value={bgColor2}
                  onChange={(e) => {
                    setBgColor2(e.target.value);
                  }}
                />
              </div>

              <div className='flex flex-col justify-center'>
                <div className='text-left text-md font-semibold mb-3'>
                  Text Color
                </div>
                <input
                  type='color'
                  name='text-color'
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                  }}
                />
              </div>

              <div className='mt-5'>
                <div className='text-left text-md font-semibold mb-5'>
                  Planets
                </div>
                <div className='grid grid-rows-2 grid-flow-col'>
                  {planetArray.map((planet) => {
                    return (
                      <div
                        className={`hover:bg-white/10 cursor-pointer ${
                          planetSelected === planet &&
                          'border-2 border-near-purple bg-white/10'
                        }`}
                        style={{ width: '80px', height: '80px' }}
                        key={planet}
                        onClick={() => setPlanetSelected(planet)}
                      >
                        <img src={`/images/planets/${planet}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className='mt-2'>
            <Button text='Mint an NFT' onClick={handleNftMint} />
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicantNftPage;
