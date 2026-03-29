import { HomeClient } from "@/components/home-client";
import { Footer } from "@/components/landing/footer";
import { HowResults } from "@/components/landing/how-results";
import { WhatItChecks } from "@/components/landing/what-it-checks";
import { WhyInfraLens } from "@/components/landing/why-infralens";

export default function Home() {
  return (
    <HomeClient
      landingSections={
        <>
          <WhatItChecks />
          <HowResults />
          <WhyInfraLens />
        </>
      }
      footer={<Footer />}
    />
  );
}
