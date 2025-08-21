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

export const fetchEntityList = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/entity/v01/list`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchEntityList"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchEntityList");
  }
};

export const fetchAddEntity = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.post(`api/entity/v01/create`, body, config);

    console.log("fetchAddEntity res => ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchAddEntity"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchAddEntity");
  }
};

export const fetchUpdateEntity = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.put(`api/entity/v01/update`, body, config);

    console.log("fetchUpdateEntity res => ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchUpdateEntity"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchUpdateUser");
  }
};

export const fetchDeleteEntity = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.put(`api/entity/v01/delete`, body, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchDeleteEntity"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchDeleteEntity");
  }
};
