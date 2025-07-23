import { Outlet } from "react-router";
import Footer from "~/components/footer";
import Header from "~/components/header";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

export default Layout;
