import { BORDER_GRADIENT_STYLE } from '@nearoracle/src/constants';

interface IProviderSelector {
  provider: string;
  thumbnail: string;
  poweredByLogo: string;
  description: string;
  selected: boolean;
  onClick?: () => void;
  disabled: boolean;
}

const ProviderSelector = ({
  provider,
  thumbnail,
  poweredByLogo,
  description,
  selected,
  onClick,
  disabled,
}: IProviderSelector) => {
  return (
    <>
      {!disabled && (
        <div
          className='rounded-lg p-1'
          style={{
            background:
              selected && !disabled ? BORDER_GRADIENT_STYLE : 'transparent',
          }}
        >
          <div
            className={`bg-zinc-900 hover:bg-zinc-800 cursor-pointer p-7 rounded-lg ${
              disabled && 'opacity-40'
            }`}
            onClick={onClick}
          >
            <div className='flex items-start'>
              <img
                src={`/images/${thumbnail}`}
                className='w-12 mr-3'
                alt={thumbnail}
              />
              <div className='flex flex-col'>
                <h3 className='text-lg text-white m-0'>{provider}</h3>
                <p
                  className='flex items-center font-light'
                  style={{ fontSize: '11px' }}
                >
                  (Powered by{' '}
                  <img
                    className='w-12 ml-2'
                    src={`/images/${poweredByLogo}`}
                    alt={poweredByLogo}
                  />
                  )
                </p>
              </div>
            </div>
            <p className='mt-2 mb-0 text-gray-200 text-sm'>{description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderSelector;
