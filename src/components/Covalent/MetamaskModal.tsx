import Modal from 'antd/lib/modal/Modal';
import Button, { BUTTON_STYLES } from '@nearoracle/src/components/Button';

const MetamaskModal = () => {
  return (
    <Modal footer={null} centered closable={true}>
      <div className='h-52 w-full flex justify-center items-center flex-col font-sans'>
        <h2 className='text-xl font-semibold'>Ready to calculate score</h2>
      </div>
    </Modal>
  );
};

export default MetamaskModal;
