import React from "react";
import MyContext from "./MyContext";

const MyContextValue = ({ children }) => {
  const [activeLayout, setActiveLayout] = React.useState("default");
  const [activeSubLayout, setActiceSubLayout] = React.useState("");
  const [rebuildRoutes, setRebuildRoutes] = React.useState(true);
  const [navShow, setNavShow] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    if (rebuildRoutes) {
      setRebuildRoutes(false);
    }
  }, [rebuildRoutes]);

  const value = {
    activeLayout,
    setActiveLayout,
    rebuildRoutes,
    setRebuildRoutes,
    activeSubLayout,
    setActiceSubLayout,
    navShow,
    setNavShow,
    pagination,
    setPagination,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContextValue;
