import React, { useEffect } from "react";
// import useRoutePathMatch from "../hooks/useRoutePathMatch";
import { routerAuth, routerPublic } from "../router";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// let firstLoadPage = true;

const AuthProvider = ({ children }) => {
  const location = useLocation();
  // const { authUser } = useSelector(({ auth }) => auth);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const authenticatedRoute = useRoutePathMatch(routerAuth);
  // const publicRoute = useRoutePathMatch(routerPublic);

  console.log("routerAuth => ", routerAuth);
  console.log("routerPublic => ", routerPublic);
  console.log("location => ", location);

  // useEffect(() => {
  //   if (!authUser) {
  //     authenticatedRoute.then((res) => {
  //       console.log("no auth");
  //       if (res) navigate("/");
  //     });
  //   } else {
  //     publicRoute.then((res) => {
  //       if (res) navigate("/dashboard" ?? "/");
  //       console.log("authenticated");
  //     });
  //   }
  // }, [authUser, authenticatedRoute, dispatch, navigate, publicRoute]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProvider;
