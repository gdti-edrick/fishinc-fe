import { getLocalStorageUser } from "../../utils/utils/getLocalStorage";
import instance from "../../utils/service/instance";
import axios from "axios";

const POST_URL = import.meta.env.VITE_BACKEND_URL;
const config = {
  headers: {
    // SIGNATURE: "#",
    // SECRET: import.meta.env.VITE_SECRET,
    // ipaddress: "1.1.1.1",
    // monitkey: `P5GW_DmfA2LaqBnhYgsdyj@bHQwu6TxX`,
    monitkey: import.meta.env.VITE_MONIT_KEY,
  },
};

const handleError = (errorMessage) => {
  console.error(errorMessage);
};

export const fetchMonitorDwma = async () => {
  try {
    const res = await axios.get(`${POST_URL}/api/monitor/v01/top-dwma`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchMonitorDwma"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchMonitorDwma");
  }
};

export const fetchMonitorInfo = async () => {
  try {
    const res = await axios.get(`${POST_URL}/api/monitor/v01/info`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchMonitorInfo"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchMonitorInfo");
  }
};

export const fetchMonitorBigSmall = async () => {
  try {
    const res = await axios.get(`${POST_URL}/api/monitor/v01/bigsmall`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchMonitorBigSmall"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchMonitorBigSmall");
  }
};

export const fetchMonitorPhone = async (dataValue) => {
  config.params = dataValue;
  try {
    const res = await axios.get(`${POST_URL}/api/monitor/v01/phone`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchMonitorPhone"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchMonitorPhone");
  }
};

export const fetchMonitorPoint = async (dataValue) => {
  config.params = dataValue.params;
  try {
    const res = await axios.get(`${POST_URL}/api/monitor/v01/point`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchMonitorPoint"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchMonitorPoint");
  }
};

export const fetchMonitorWeight = async (dataValue) => {
  config.params = dataValue.params;
  try {
    const res = await axios.get(`${POST_URL}/api/monitor/v01/weight`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchMonitorWeight"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchMonitorWeight");
  }
};
