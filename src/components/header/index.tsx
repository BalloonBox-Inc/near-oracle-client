import Link from "next/link";
import { useState } from "react";

import Connect from "@nearoracle/src/components/connect";
import TestBanner from "@nearoracle/src/components/TestBanner";
import { useNearContext } from "@nearoracle/src/context";

export default function Header() {
  const [showAccount, setShowAccount] = useState<boolean>(false);
  const { isConnected } = useNearContext();
  return (
    <div>
      <TestBanner />
      <header
        className="flex items-center justify-between w-full py-4 px-10"
        style={{ height: "80px" }}
      >
        <Link passHref={true} href="/">
          <a className="mt-1">
            <img
              src={"/images/primary-logo.png"}
              width={120}
              height={100}
              alt="nearoracle-logo"
              className={`${showAccount ? "disappear" : "reappear"}`}
            />
          </a>
        </Link>
        <div className="flex items-center">
          {isConnected && (
            <Link passHref={true} href={"/start"}>
              <div
                className={`mr-5 text-white text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400 ${
                  showAccount ? "disappear" : "reappear"
                }`}
              >
                Start
              </div>
            </Link>
          )}
          <Connect showAccount={showAccount} setShowAccount={setShowAccount} />
        </div>
      </header>
    </div>
  );
}
