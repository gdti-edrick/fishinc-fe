import { useContext } from "react";
import MyContext from "../utils/MyContext";

const useAppContext = () => {
  // return React.useContext(AppContext);
  return useContext(MyContext);
};

export default useAppContext;
