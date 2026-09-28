"use client";

import HomePageLayout from "./components/layout/HomePageLayout";
// Previous marketing page kept for reference:
// import LandingPage from "./components/screens/landing-page/LandingPage";
import NewLanding from "./components/screens/landing-page/NewLanding";

export default function Index() {
  return (
    <HomePageLayout showFooter={false}>
      <NewLanding />
    </HomePageLayout>
  );
}
