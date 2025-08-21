import axios from "axios";
import { getLocalStorageUser } from "../../utils/utils/getLocalStorage";

const POST_URL = import.meta.env.VITE_BACKEND_URL;
const config = {
  headers: {
    SIGNATURE: "#",
    SECRET: import.meta.env.VITE_SECRET,
    ipaddress: "1.1.1.1",
  },
};

const handleError = (errorMessage) => {
  console.error(errorMessage);
  // teleNotif(errorMessage);
};

export const fetchSignin = async (dataValue) => {
  config.headers.password = dataValue.password;

  try {
    const data = {
      loginname: dataValue.loginname,
    };

    const res = await axios.post(
      `${POST_URL}/api/auth/v01/signin`,
      data,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to sign in"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to sign in");
  }
};

export const fetchFirstSignin = async (dataValue) => {
  console.log("data fetchFirstSignin => ", dataValue);
  config.headers.password = dataValue.password;
  config.headers.Authorization = `Bearer ${dataValue.temp_token}`;

  console.log("headers fetchFirstSignin => ", config.headers);
  try {
    const data = {
      loginname: dataValue.loginname,
    };

    const res = await axios.post(
      `${POST_URL}/api/auth/v01/first-login`,
      data,
      config
    );

    console.log("RES fetchFirstSignin=> ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchFirstSignin"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchFirstSignin");
  }
};

export const fetchSignup = async (dataValue) => {
  try {
    const res = await axios.post(
      `${POST_URL}/api/auth/v01/signup`,
      dataValue,
      config
    );

    console.log("RES fetchSignup=> ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to sign up"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to sign in");
  }
};

export const fetchForgotPassword = async (dataValue) => {
  try {
    const res = await axios.post(
      `${POST_URL}/api/auth/v01/forgot-password`,
      dataValue,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to forgot password"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to sign in");
  }
};

export const fetchNewPassword = async (dataValue) => {
  config.headers.password = dataValue.password;
  delete dataValue.password;
  try {
    const res = await axios.put(
      `${POST_URL}/api/auth/v01/new-password`,
      dataValue,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to register new password"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to sign in");
  }
};

export const fetchRefreshToken = async () => {
  const { refreshToken } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${refreshToken}`;
  try {
    const res = await axios.get(
      POST_URL + `/api/auth/v01/refresh-token`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      console.log("ERROR MSG: ", res.data?.status?.message[0]?.errormessage);
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to refresh token"
      );
    }

    return res.data.support.token;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
      return error.response;
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to refreshToken");
  }
};
