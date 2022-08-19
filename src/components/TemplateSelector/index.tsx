import { BORDER_GRADIENT_STYLE } from '@nearoracle/src/constants';

interface ITemplateSelector {
  priceRange: string;
  cryptoAvailable: boolean;
  selected: boolean;
  onClick: () => void;
}

const TemplateSelector = ({
  priceRange,
  cryptoAvailable,
  selected,
  onClick,
}: ITemplateSelector) => {
  return (
    <div
      className='rounded-lg p-1'
      style={{
        background: selected ? BORDER_GRADIENT_STYLE : 'transparent',
      }}
    >
      <div
        className='grid grid-rows-2 bg-zinc-900 hover:bg-zinc-800 cursor-pointer px-7 py-10 rounded-lg'
        onClick={onClick}
      >
        <h3 className='text-3xl font-medium rounded-xl text-white'>
          {priceRange}
        </h3>
        <div>
          <p className='text-xs'>Available assets:</p>
          <div className='flex'>
            <span className='text-xs py-1 px-3 rounded-sm bg-near-blue mr-2'>
              Fiat
            </span>
            {cryptoAvailable && (
              <span className='text-xs py-1 px-3 rounded-sm bg-near-purple'>
                Crypto
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
