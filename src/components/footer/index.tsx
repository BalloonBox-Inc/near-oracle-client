import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className={`py-3 px-10 w-full flex flex-row text-white justify-between font-sans absolute bottom-0`}
      style={{
        height: "5rem",
      }}
    >
      <div>
        <Link passHref={true} href="/">
          <a>
            <img
              src="/images/primary-logo.png"
              width={100}
              height={40}
              alt="nearoracle-logo"
              className="cursor-pointer"
            />
          </a>
        </Link>

        <p className="pl-3 text-xs">
          &copy; {new Date().getFullYear()} NearOracle
        </p>
      </div>
      <div className="flex items-center flex-col sm:flex-row">
        <p className="text-xs pt-3 mr-2">secured by</p>
        <a href="https://near.org/" target="_blank" rel="noreferrer">
          <img
            src={"/images/near_logo_wht.svg"}
            width="100px"
            height="40px"
            alt="near-logo"
            className="cursor-pointer"
          />
        </a>
      </div>
    </footer>
  );
}
