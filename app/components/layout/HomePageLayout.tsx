import NavBar from "../shared/navigations/NavBar";
import Footer from "../screens/landing-page/Footer";

interface HomePageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const HomePageLayout: React.FC<HomePageLayoutProps> = ({
  children,
  showFooter = true,
}) => (
  <div className="flex flex-col min-h-screen">
    {/* Fixed Navbar */}
    <NavBar />
    <main className="flex-1 pt-24">{children}</main>
    {showFooter && <Footer />}
  </div>
);

export default HomePageLayout;
