import { getLocalStorageUser } from "../../utils/utils/getLocalStorage";
import instance from "../../utils/service/instance";

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

export const fetchTransactionListAll = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/transaction/v01/list-all`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionListAll"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionListAll");
  }
};
export const fetchTransactionDetail = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/transaction-item/v01/list`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionDetail"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionDetail");
  }
};

export const fetchTransactionSummaryAll = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/transaction/v01/report-summary-all`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionSummaryAll"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionSummaryAll");
  }
};
export const fetchTransactionSummaryAllItem = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/transaction-item/v01/report-summary-all`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionSummaryAllItem"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionSummaryAllItem");
  }
};

//  IDR
export const fetchTransactionListIdr = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/transaction/v01/list-idr`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionListIdr"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionListIdr");
  }
};
export const fetchTransactionSummaryIdr = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/transaction/v01/report-summary-idr`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionSummaryIdr"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionSummaryIdr");
  }
};
export const fetchTransactionSummaryIdrItem = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/transaction-item/v01/report-summary-idr`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionSummaryIdrItem"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionSummaryIdrItem");
  }
};
//  POINT
export const fetchTransactionListPoint = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(`api/transaction/v01/list-point`, config);

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionListPoint"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionListPoint");
  }
};
export const fetchTransactionSummaryPoint = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/transaction/v01/report-summary-point`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionSummaryPoint"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionSummaryPoint");
  }
};
export const fetchTransactionSummaryPointItem = async (dataValue) => {
  const { token } = getLocalStorageUser();
  config.headers.Authorization = `Bearer ${token}`;
  config.params = dataValue.params;
  try {
    const res = await instance.get(
      `api/transaction-item/v01/report-summary-point`,
      config
    );

    if (res.data?.status?.message.length > 0) {
      handleError(
        res.data?.status?.message[0]?.errormessage ||
          "Failed to fetchTransactionSummaryPointItem"
      );
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error.message);
    } else {
      handleError("An unknown error occurred");
    }
    throw new Error("Failed to fetchTransactionSummaryPointItem");
  }
};
