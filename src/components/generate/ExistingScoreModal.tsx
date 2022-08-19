import { Modal } from "antd";
import router from "next/router";

import Button, { BUTTON_STYLES } from "@nearoracle/src/components/Button";
import { IChainActivity } from "@nearoracle/src/context";

const ExistingScoreModal = ({
  scoreExists,
  startOver,
  chainActivity,
  handleSetChainActivity,
}: {
  scoreExists: boolean;
  startOver: () => void;
  chainActivity: IChainActivity;
  handleSetChainActivity: (a: IChainActivity | null) => void;
}) => {
  return (
    <Modal footer={null} centered closable={false} visible={scoreExists}>
      <div className="py-6 w-full space-y-2 flex justify-center items-center flex-col">
        <p
          data-testid="existing-score"
          className="text-base text-center font-semibold"
        >
          You have already submitted a score using{" "}
          <span className="text-zinc-400">{chainActivity?.dataProvider}.</span>
        </p>
      </div>
      <div className="flex w-full justify-center items-center space-x-4">
        <div>
          <Button
            onClick={() => router.push("/applicant/score")}
            text="See Score"
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              handleSetChainActivity(null);
              startOver();
            }}
            text="Generate New Score"
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExistingScoreModal;
