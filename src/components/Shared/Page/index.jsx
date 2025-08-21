import React, { useEffect, useState } from "react";
import { LAYOUT_APP, SUB_LAYOUT } from "../../../utils/utils/constant";
import { useLocation, useNavigate } from "react-router-dom";
import { basicRoutes, routerAuth, routerPublic } from "../../../router";
import useAppContext from "../../../hooks/useAppContext";
import Layout from "../../Template/Layout";

const Page = ({
  component,
  layout = LAYOUT_APP.DEFAULT,
  subLayout = SUB_LAYOUT.NONE,
  ...restProps
}) => {
  let location = useLocation();
  const navigate = useNavigate();

  const { activeLayout, setActiveLayout, activeSubLayout, setActiceSubLayout } =
    useAppContext();

  const [prevList, setPrevList] = useState([]);

  React.useEffect(() => {
    const prevList = JSON.parse(localStorage.getItem("prevList"));
    setPrevList(prevList ?? basicRoutes);

    if (layout !== activeLayout) {
      setActiveLayout(layout);
    }
    if (subLayout !== activeSubLayout) {
      setActiceSubLayout(subLayout);
    }
  }, [
    activeLayout,
    activeSubLayout,
    layout,
    setActiceSubLayout,
    setActiveLayout,
    subLayout,
  ]);

  const PageComponent = component;

  const allRoute = prevList.length > 0 ? prevList : basicRoutes;

  function isPathInRoutes(Routes) {
    return Routes.some((route) => route.path === location.pathname);
  }

  const isAuth = isPathInRoutes(routerAuth);
  const isPublic = isPathInRoutes(routerPublic);

  const isAuthUser = JSON.parse(localStorage.getItem("isLogged"));

  useEffect(() => {
    if (!isAuthUser) {
      if (isAuth) {
        console.log("no auth");
        navigate("/");
      }
    } else {
      if (isPublic) {
        navigate("/home" ?? "/");
        console.log("authenticated");
      }
    }
  }, [isAuth, isAuthUser, isPublic, navigate]);

  if (allRoute.includes(location.pathname)) {
    return (
      <>
        <Layout>
          <PageComponent {...restProps} />
        </Layout>
      </>
    );
  }
  return <PageComponent {...restProps} />;
};

export default Page;
