import { getLocalStorageUser } from "../../utils/utils/getLocalStorage";
import instance from "../../utils/service/instance";

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

export const fetchRedeemCode = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  // config.params = dataValue.params;
  try {
    const res = await instance.get(`api/transaction/v01/code`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchRedeemCode"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchRedeemCode");
  }
};

export const fetchRedeemSearchList = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/product/v01/redeem-search`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchRedeemSearchList"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchRedeemSearchList");
  }
};

export const fetchRedeemSearch = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/product/v01/redeem-search?productcode=${dataValue.productcode}`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchRedeemSearch"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchRedeemSearch");
  }
};

export const fetchRedeemAdd = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.otp = body.otp;
  config.headers.userfullname = body.userfullname;
  config.headers.userphone = body.userphone;
  config.headers.usercountrycode = body.usercountrycode;
  try {
    const res = await instance.post(`api/transaction/v01/create`, body, config);

    console.log("fetchRedeemAdd res => ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchRedeemAdd"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchRedeemAdd");
  }
};

export const fetchSendOtp = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.post(
      `api/transaction/v01/send-otp`,
      body,
      config
    );

    console.log("fetchSendOtp res => ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchSendOtp"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchSendOtp");
  }
};
