import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { initializeStore } from "~/store/store";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeStore());
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
