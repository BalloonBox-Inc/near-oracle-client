interface IProviderSection {
  title: string;
  logo: string;
  description: string;
  piechart: string;
  cats: string;
  cat1: string;
  des1: string;
  cat2: string;
  des2: string;
  cat3: string;
  des3: string;
  cat4: string;
  des4: string;
  color2: string;
  color3: string;
  color4: string;
}
const ProviderSection = ({
  title,
  logo,
  description,
  piechart,
  cats,
  cat1,
  des1,
  cat2,
  des2,
  cat3,
  des3,
  cat4,
  des4,
  color2,
  color3,
  color4,
}: IProviderSection) => {
  return (
    <div className='bg-zinc-900 p-10 my-10 rounded-xl'>
      <div className='flex items-center'>
        <h3 className='flex text-lg md:text-xl'>
          <div className='mr-2 font-semibold'>{title}</div>
          <div className='flex text-sm items-center'>
            (powered by <img src={logo} className='ml-2 w-14'></img>)
          </div>
        </h3>
      </div>
      <p className='text-lightgray mt-5'>
        {description} <span className='font-semibold'>{cats}</span>
      </p>

      <div className='grid grid-rows-3 md:grid-rows-none md:grid-cols-3 gap-10 mt-10'>
        <div className='flex flex-col justify-evenly'>
          <div>
            {' '}
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-white rounded-full mr-3' />
              <h4 className='text-base font-bold font-raleway'>{cat1}</h4>
            </div>
            <p className='text-lightgray text-sm mt-5'>{des1}</p>
          </div>
          <div>
            {' '}
            <div className='flex items-center'>
              <div
                className={`w-3 h-3 rounded-full mr-3`}
                style={{ backgroundColor: color2 }}
              />
              <h4 className='text-base font-bold font-raleway'>{cat2}</h4>
            </div>
            <p className='text-lightgray text-sm mt-5'>{des2}</p>
          </div>
        </div>

        <div className='row-span-1 md:col-span-1 justify-self-center'>
          {' '}
          <img src={piechart} alt='pie-chart' className='p-0 m-0' />
        </div>
        <div className='flex flex-col justify-evenly'>
          <div>
            {' '}
            <div className='flex items-center'>
              <div
                className={`w-3 h-3 rounded-full mr-3`}
                style={{ backgroundColor: color3 }}
              />
              <h4 className='text-base font-bold font-raleway'>{cat3}</h4>
            </div>
            <p className='text-lightgray text-sm mt-5'>{des3}</p>
          </div>
          <div>
            {' '}
            <div className='flex items-center'>
              <div
                className={`w-3 h-3 rounded-full mr-3`}
                style={{ backgroundColor: color4 }}
              />
              <h4 className='text-base font-bold font-raleway'>{cat4}</h4>
            </div>
            <p className='text-lightgray text-sm mt-5'>{des4}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSection;
