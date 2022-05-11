/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="text-white flex flex-col justify-center items-center h-screen bg-black bg-main-image bg-cover">
      <img
        className="w-72 mb-10"
        src="images/primary-logo.png"
        alt="primary-logo"
      />
      <div className="w-1/2 text-center mb-10">
        <p>
          NEARoracle is an oracle for credit scoring designed for the web3
          community. The oracle returns a numerical score affirming users'
          credibility and trustworthiness in the web3 space. The DApp was
          designed with one specific use case in mind: unsecured P2P lending,
          which is facilitating lending and borrowing of crypto loans.
        </p>
      </div>

      <button className="btn-gradient py-2 px-6 rounded-3xl">
        Connect to wallet
      </button>
    </div>
  );
};

export default Home;
