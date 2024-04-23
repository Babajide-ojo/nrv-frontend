import Head from "next/head";
import NavBar from "../shared/navigations/NavBar";

interface HomePageLayoutProps {
  children: React.ReactNode;
}

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-1">{children}</main>
  </div>
);

export default HomePageLayout;
