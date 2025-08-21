import instance from "../service/instance";
import { getLocalStorageUser } from "../utils/getLocalStorage";

export default function AuthMiddleware({ getState }) {
  return (next) => (action) => {
    let returnValue = next(action);
    const stateRedux = getState();
    const state = getLocalStorageUser();

    // console.log("");
    // console.log("");
    // console.log("===========================");
    // console.log("INSTANCE MIDLLEWARE =>", state);
    // console.log("===========================");
    // console.log("");
    // console.log("");

    if (state?.token) {
      instance.defaults.headers.Authorization = `Bearer ${state.token}`;
    } else {
      delete instance.defaults.headers.Authorization;
    }

    if (stateRedux?.auth?.ipAddress) {
      instance.defaults.headers.ipaddress = `Bearer ${stateRedux.auth.ipAddress}`;
    } else {
      delete instance.defaults.headers.ipaddress;
    }

    return returnValue;
  };
}
