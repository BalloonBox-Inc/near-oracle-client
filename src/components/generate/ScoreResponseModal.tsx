import { Modal } from "antd";

import Button, { BUTTON_STYLES } from "@nearoracle/src/components/Button";

const ScoreResponseModal = ({
  queryStatus,
  queryType,
  pushToScore,
  startOver,
}: {
  queryStatus: string;
  queryType: string | string[] | undefined;
  pushToScore: () => void;
  startOver: () => void;
}) => {

  return (
    <Modal
      footer={null}
      centered
      closable={true}
      onCancel={startOver}
      visible={queryStatus === 'success'}
    >
      <div className='h-52 w-full flex justify-center items-center flex-col font-sans'>
        <h2 className='text-xl font-semibold'>Ready to calculate score</h2>
        <p>with </p>
        <div className='w-full justify-center flex'>
          <img
            width={'40%'}
            src={`../../images/${queryType}Logo.svg`}
            alt={`${queryType}-logo`}
          />
        </div>
      </div>
      <div className='flex flex-col w-full justify-center items-center font-sans mb-3'>
        <div className='w-max'>
          <Button
            onClick={pushToScore}
            text='Continue to score calculation'
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div className='w-max mt-3'>
          <Button
            onClick={startOver}
            text='Start over'
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScoreResponseModal;
