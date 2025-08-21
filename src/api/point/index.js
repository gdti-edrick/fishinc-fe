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

export const fetchPointList = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/point/v01/list`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchPointList"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchPointList");
  }
};

export const fetchPointDetail = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/point/v01/list-detail`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchPointList"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchPointList");
  }
};

export const fetchAddPoint = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.post(`api/point/v01/adjust`, body, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchAddPoint"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchAddPoint");
  }
};

// export const fetchUpdateUser = async (body) => {
//   const { token } = getLocalStorageUser();
//   config.headers.Authorization = `Bearer ${token}`;
//   console.log("fetchUpdateUser body => ", body);
//   try {
//     const res = await instance.put(`api/user/v01/update`, body, config);

//     console.log("fetchUpdateUser res => ", res);

//     if (res.data?.status?.message.length > 0) {
//       handleError(
//         res.data?.status?.message[0]?.errormessage ||
//           "Failed to fetchUpdateUser"
//       );
//     }

//     return res.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       handleError(error.message);
//     } else {
//       handleError("An unknown error occurred");
//     }
//     throw new Error("Failed to fetchUpdateUser");
//   }
// };

// export const fetchDeleteUser = async (body) => {
//   const { token } = getLocalStorageUser();
//   config.headers.Authorization = `Bearer ${token}`;
//   console.log("fetchDeleteUser body => ", body);
//   try {
//     const res = await instance.put(`api/user/v01/delete`, body, config);

//     console.log("fetchDeleteUser res => ", res);

//     if (res.data?.status?.message.length > 0) {
//       handleError(
//         res.data?.status?.message[0]?.errormessage ||
//           "Failed to fetchDeleteUser"
//       );
//     }

//     return res.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       handleError(error.message);
//     } else {
//       handleError("An unknown error occurred");
//     }
//     throw new Error("Failed to fetchDeleteUser");
//   }
// };
