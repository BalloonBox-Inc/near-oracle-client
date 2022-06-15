import Lottie from "react-lottie";
import { useRouter } from "next/router";

import Button from "@nearoracle/src/components/Button";
import ServiceSelector from "@nearoracle/src/components/ServiceSelector";
import checkMarkAnimations from "@nearoracle/src/components/Lottie/check-mark.json";

const scoreSaved = () => {
  const router = useRouter();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: checkMarkAnimations,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Lottie options={defaultOptions} height={200} width={200} />
      <h2 className="font-semibold text-xl sm:text-4xl mb-10">Score saved!</h2>
      <div className="justify-center items-center flex flex-col ">
        <ServiceSelector
          text="View my score"
          onClick={() => router.push("/applicant/score")}
        />
        <ServiceSelector
          text="Go back to the menu"
          onClick={() => router.push("/start")}
        />
      </div>
    </>
  );
};

export default scoreSaved;
