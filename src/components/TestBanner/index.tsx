import { WarningOutlined } from "@ant-design/icons";

const TestBanner = () => {
  return (
    <div className='top-20 w-full near-bg-gradient z-10 px-5 py-4 pb-0 flex xs:flex-row flex-col justify-center items-center'>
      <p className='flex text-center sm:text-sm text-xs'>
        <WarningOutlined style={{ fontSize: '1rem', marginRight: '0.4rem' }} />{' '}
        This is a testnet environment. The funds are not real. &nbsp;{' '}
      </p>
    </div>
  );
};

export default TestBanner;
