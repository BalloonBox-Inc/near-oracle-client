import { ISectionElement } from './types';

export default function CardWithIcons({
  title,
  img,
  description,
}: ISectionElement) {
  return (
    <div
      className='bg-zinc-900 rounded-lg flex flex-col items-center px-5 py-10 mt-10
      lg:mt-0 md:w-72 mr-0 md:mr-10'
    >
      <img src={img} alt='icon' className='w-24 h-24 mb-7' />
      <h3 className='text-lg font-raleway font-bold mb-5'>{title}</h3>
      <p className='text-lightgray text-center font-light'>{description} </p>
    </div>
  );
}
