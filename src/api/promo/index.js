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

export const fetchPromoList = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/promo/v01/list`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchPromoList"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchPromoList");
  }
};

export const fetchAddPromo = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  console.log("fetchAddPromo body => ", body);
  try {
    const res = await instance.post(`api/promo/v01/create`, body, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchAddPromo"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchAddPromo");
  }
};

// export const fetchUpdatePromo = async (body) => {
//   const { token } = getLocalStorageUser();
//   config.headers.Authorization = `Bearer ${token}`;
//   try {
//     const res = await instance.put(`api/promo/v01/update`, body, config);

//     if (res.data?.status?.message.length > 0) {
//       handleError(
//         res.data?.status?.message[0]?.errormessage ||
//           "Failed to fetchUpdatePromo"
//       );
//     }

//     return res.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       handleError(error.message);
//     } else {
//       handleError("An unknown error occurred");
//     }
//     throw new Error("Failed to fetchUpdatePromo");
//   }
// };

export const fetchDeletePromo = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.put(`api/promo/v01/delete`, body, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchDeletePromo"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchDeletePromo");
  }
};
