import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const isLogin = urlParams.get("islogin");
  console.log("isLogin => ", isLogin);

  if (isLogin === "expired") {
    toast.warn("Session Expired");
  } else {
    // toast.success("Success Logout");
  }

  useEffect(() => {
    // localStorage.clear();
    localStorage.removeItem("isLogged");
    localStorage.removeItem("user");
    localStorage.removeItem("crud");
    navigate("/");
  }, [dispatch, navigate]);

  return null; // No content is rendered
};

export default Logout;
