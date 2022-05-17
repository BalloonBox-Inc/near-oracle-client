import Link from "next/link";
import Connect from "@nearoracle/src/components/connect";
import { useState, useContext } from "react";
import { NearContext } from "@nearoracle/src/context";

export default function Header() {
  const [showAccount, setShowAccount] = useState<boolean>(false);
  const { isConnected } = useContext(NearContext);
  return (
    <header className="flex items-center justify-between w-full py-4 px-10">
      <Link passHref={true} href="/">
        <a className="mt-1">
          <img
            src={"/images/primary-logo.png"}
            width={120}
            height={100}
            alt="nearoracle-logo"
          />
        </a>
      </Link>
      <div className="flex items-center">
        {isConnected && (
          <Link passHref={true} href={"/start"}>
            <div
              className={`mr-5 text-white text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400`}
            >
              Start
            </div>
          </Link>
        )}
        <Connect showAccount={showAccount} setShowAccount={setShowAccount} />
      </div>
    </header>
  );
}
