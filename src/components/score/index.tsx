import { useEffect, useState } from "react";
import Image from "next/image";

import ScoreMainImg from "@nearoracle/public/images/score-main.svg";
import ScoreNeedleTip from "@nearoracle/public/images/score-needle-tip.svg";

const ScoreSpeedometer = ({
  score,
  quality,
  showScore,
  date,
}: {
  score: number;
  quality?: string;
  showScore?: boolean;
  date?: string;
}) => {
  const [randomNumber, setRandomNumber] = useState<string | null>("300");
  const rotationCalculator = (scr: number) => {
    if (scr < 550) {
      // for ever 50 after 300 percent, the value is +10 degrees
      const multiplesOf50 = (scr - 300) / 50;
      const result = -90 + multiplesOf50 * 10;
      return result;
    }

    if (scr === 605) {
      return 0;
    }

    if (scr > 550) {
      const difference = scr - 605;

      const result = 0.29 * difference;
      return result;
    }

    return -90;
  };

  const renderTagBgColor = (quality: string) => {
    let bgColor;

    switch (quality) {
      case "very poor":
        bgColor = "#E03C37";
        break;

      case "poor":
        bgColor = "#CC6AC0";
        break;

      case "fair":
        bgColor = "#99428E";
        break;

      case "good":
        bgColor = "#8F00FF";
        break;

      case "very good":
        bgColor = "#554BF9";
        break;

      case "excellent":
        bgColor = "#3AA7A3";
        break;

      case "exceptional":
        bgColor = "#4DD09A";
        break;

      default:
        bgColor = "#E03C37";
    }

    return bgColor;
  };

  useEffect(() => {
    const randomNumb = setInterval(() => {
      setRandomNumber((Math.random() * 600 + 300).toFixed(0));
    }, 140);

    return () => clearInterval(randomNumb);
  }, []);

  return (
    <div className="flex w-full justify-center pt-10">
      <div className="inline-block relative">
        {/* WEB */}
        <div className="hidden sm:block" style={{ width: "575px" }}>
          <Image src={ScoreMainImg} alt="score-top" />
        </div>

        <div
          style={{
            transitionDuration: "1s",
            transform: showScore
              ? `rotate(${rotationCalculator(score)}deg)`
              : `rotate(0deg)`,
            transformOrigin: "bottom",
            visibility: showScore ? "visible" : "hidden",
          }}
          className={`z-50 hidden sm:flex absolute center-absolute duration-500`}
        >
          <Image height={150} src={ScoreNeedleTip} alt="score-top" />
        </div>

        <div
          style={{
            visibility: !showScore ? "visible" : "hidden",
          }}
          className={`z-50 hidden sm:flex absolute center-absolute needle-move`}
        >
          <Image height={150} src={ScoreNeedleTip} alt="score-top" />
        </div>

        <div
          style={{ left: "15.95rem", top: "14.5rem" }}
          className="hidden sm:flex bg-white w-16 h-16 rounded-full z-50 absolute  justify-center items-center"
        >
          <div className="bg-black w-3 h-3 rounded-full z-50" />
        </div>
        <div className="absolute justify-center items-center w-full z-50 flex flex-col">
          <div className="text-4xl sm:text-6xl font-bold z-40 mt-48 sm:-mt-52 tracking-tighter">
            {showScore ? score : randomNumber}
          </div>
          {date && <p className="mt-5">Score stored on: {date}</p>}
          {quality && (
            <div
              style={{ backgroundColor: renderTagBgColor(quality) }}
              className="px-4 py-1 text-xs sm:text-xs rounded-2xl mt-4 uppercase"
            >
              {quality}
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="block sm:hidden" style={{ width: "375px" }}>
          <Image src={ScoreMainImg} alt="score-top" />
        </div>

        <div
          style={{
            transitionDuration: "1s",
            transform: showScore
              ? `rotate(${rotationCalculator(score)}deg)`
              : `rotate(0deg)`,
            transformOrigin: "bottom",
            visibility: showScore ? "visible" : "hidden",
          }}
          className={`z-50 flex sm:hidden absolute center-absolute duration-500`}
        >
          <Image height={95} src={ScoreNeedleTip} alt="score-top" />
        </div>
        <div
          style={{
            visibility: !showScore ? "visible" : "hidden",
          }}
          className="z-50 flex sm:hidden absolute center-absolute needle-move "
        >
          <Image height={95} src={ScoreNeedleTip} alt="score-top" />
        </div>
        <div
          style={{ left: "171px", top: "150px" }}
          className="sm:hidden flex bg-white w-9 h-9 rounded-full z-50 absolute justify-center items-center"
        >
          <div className="bg-black w-2 h-2 rounded-full z-50" />
        </div>
        {/* END */}
      </div>
    </div>
  );
};

export default ScoreSpeedometer;
