import HomePageLayout from "./components/layout/HomePageLayout";
import Home from "./components/screens/home/Home";
import LandingPage from "./components/screens/landing-page/LandingPage";

        

export default function Index() {
  return (
    <HomePageLayout>
      <LandingPage />
    </HomePageLayout>
  );
}
