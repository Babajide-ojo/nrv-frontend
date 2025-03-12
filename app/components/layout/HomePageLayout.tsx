import Head from "next/head";
import NavBar from "../shared/navigations/NavBar";

interface HomePageLayoutProps {
  children: React.ReactNode;
}

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    {/* Fixed Navbar with transparent white background */}
    <NavBar />
    <main className="flex-1 pt-24">{children}</main> {/* Adjusted padding to account for fixed navbar */}
  </div>
);

export default HomePageLayout;
