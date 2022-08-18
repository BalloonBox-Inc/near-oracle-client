import { ISectionElement } from './types';

export default function StepBox({
  title,
  img,
  description,
  style,
  side,
}: ISectionElement) {
  return (
    <div
      className={`bg-zinc-900 rounded-lg flex flex-col items-center sm:flex-row py-10 px-10 ${
        side === 'left' ? 'mr-0 md:mr-40' : 'ml-0 md:ml-40'
      } `}
      style={style}
    >
      {side === 'left' ? (
        <>
          <img
            src={img}
            alt='icon'
            className='sm:mt-0 sm:w-48 sm:h-24 sm:mr-10 sm:mb-0 mb-10'
          />
          <div>
            <h3 className='text-lg font-bold font-raleway mb-5'>{title}</h3>
            <p className='text-lightgray max-w-sm font-light'>{description} </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className='text-lg font-bold font-raleway mb-5'>{title}</h3>
            <p className='text-lightgray max-w-sm font-light'>{description} </p>
          </div>

          <img
            src={img}
            alt='icon'
            className='sm:mt-0 sm:h-28 sm:ml-10 mt-10'
          />
        </>
      )}
    </div>
  );
}
