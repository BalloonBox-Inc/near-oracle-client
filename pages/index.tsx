import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

import { NearContext } from "@nearoracle/src/context";
import Button, { BUTTON_STYLES } from "@nearoracle/src/components/Button";
import Connect from "@nearoracle/src/components/connect";

const Home: NextPage = () => {
  const { isConnected } = useContext(NearContext);
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:py-40 py-10">
        <div className="w-full text-center md:text-left px-5">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            {" "}
            A credit scoring oracle on Near Protocol
          </h1>
          <p className="text-lightgray mt-5 text-lg">
            NearOracle is an oracle for credit scoring developed for Near
            Protocol. Get your credit score, and publish it to the Near Protocol
            to share.
          </p>
          <div className="flex mt-10 mx-auto lg:mx-0 flex-col items-center sm:flex-row">
            <div className="sm:mr-5 sm:mb-0 mb-5">
              {" "}
              {isConnected ? (
                <Button
                  text="Get Started"
                  onClick={() => {
                    router.push("/start");
                  }}
                />
              ) : (
                <Connect />
              )}
            </div>

            <Button style={BUTTON_STYLES.OUTLINE} text="Learn more" />
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Home;
