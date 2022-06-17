import { useContext } from "react";
import { DisconnectOutlined, CloseOutlined } from "@ant-design/icons";
import { useNearContext } from "@nearoracle/src/context";

const Connect = ({ showAccount, setShowAccount }: any) => {
  const { handleSignIn, handleSignOut, isConnected, wallet } = useNearContext();

  return (
    <div
      className={`flex text-white items-center btn-gradient py-1 px-5 rounded-3xl cursor-pointer`}
      onClick={() => {
        !isConnected ? handleSignIn() : setShowAccount(true);
      }}
    >
      {showAccount && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowAccount(false);
          }}
          role={"presentation"}
          className={`mr-2 -mt-1 z-50`}
        >
          <CloseOutlined />
        </div>
      )}

      <img className="w-10" src="/images/logo-white.svg" alt="near-logo" />
      {!isConnected && <div>Connect</div>}
      {showAccount && (
        <div className="flex justify-center items-center">
          <div className="mr-2 flex items-center text-xs sm:text-sm">
            {wallet?.getAccountId()}
          </div>{" "}
          <DisconnectOutlined
            onClick={(e) => {
              e.stopPropagation();
              handleSignOut();
              setShowAccount(false);
            }}
            className="text-lg hover:text-red-400 transition-colors"
          />
        </div>
      )}
    </div>
  );
};

export default Connect;
