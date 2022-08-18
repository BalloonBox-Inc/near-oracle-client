import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useNearContext } from "@nearoracle/src/context";
import HeroSection from '@nearoracle/src/components/home/HeroSection';
import WhySection from '@nearoracle/src/components/home/WhySection';
import HowItWorksSection from '@nearoracle/src/components/home/HowItWorksSection';

const Home: NextPage = () => {
  const { isConnected } = useNearContext();

  return (
    <>
      <HeroSection isConnected={isConnected} />
      <WhySection />
      <HowItWorksSection />
    </>
  );
};

export default Home;
