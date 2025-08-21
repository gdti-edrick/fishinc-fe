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

export const fetchProductList = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/product/v01/list`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchProductList"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchProductList");
  }
};

export const fetchAddProduct = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.post(`api/product/v01/create`, body, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchAddProduct"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchAddProduct");
  }
};

export const fetchUpdateProduct = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.put(`api/product/v01/update`, body, config);

    console.log("fetchUpdateProduct res => ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchUpdateProduct"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchUpdateProduct");
  }
};

export const fetchDeleteProduct = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.put(`api/product/v01/delete`, body, config);

    console.log("fetchDeleteProduct res => ", res);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchDeleteProduct"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchDeleteProduct");
  }
};

export const fetchProductStock = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/product-stock/v01/list-product`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchProductStock"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchProductStock");
  }
};

export const fetchAddProductStock = async (body) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  try {
    const res = await instance.post(
      `api/product-stock/v01/create`,
      body,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchAddProductStock"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchAddProductStock");
  }
};

// export const fetchUpdateEventDetail = async (body) => {
//   const { token } = getLocalStorageUser();
//   config.headers.Authorization = `Bearer ${token}`;
//   try {
//     const res = await instance.put(`api/event-point/v01/update`, body, config);

//     console.log("fetchUpdateEventDetail res => ", res);

//     if (res.data?.status?.message.length > 0) {
//       handleError(
//         res.data?.status?.message[0]?.errormessage ||
//           "Failed to fetchUpdateEventDetail"
//       );
//     }

//     return res.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       handleError(error.message);
//     } else {
//       handleError("An unknown error occurred");
//     }
//     throw new Error("Failed to fetchUpdateEventDetail");
//   }
// };

// export const fetchDeleteEventDetail = async (body) => {
//   const { token } = getLocalStorageUser();
//   config.headers.Authorization = `Bearer ${token}`;
//   try {
//     const res = await instance.put(`api/event-point/v01/delete`, body, config);

//     console.log("fetchDeleteEventDetail res => ", res);

//     if (res.data?.status?.message.length > 0) {
//       handleError(
//         res.data?.status?.message[0]?.errormessage ||
//           "Failed to fetchDeleteEventDetail"
//       );
//     }

//     return res.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       handleError(error.message);
//     } else {
//       handleError("An unknown error occurred");
//     }
//     throw new Error("Failed to fetchDeleteEventDetail");
//   }
// };

export const fetchStock = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/product-stock/v01/list`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage || "Failed to fetchStock"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchStock");
  }
};
