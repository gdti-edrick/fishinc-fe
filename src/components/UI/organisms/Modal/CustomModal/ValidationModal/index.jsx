import Box from "@mui/material/Box";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import {
  FormDropDown,
  FormDropDown2,
  FormInput,
  FormInputWithSuggestions,
} from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useBookingBraceletCheck,
  useBookingCreate,
  useBookingExtend,
  useBookingRebind,
  useBookingUnbind,
} from "../../../../../../api/booking/mutation";
import {
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { BasicButton } from "../../../../atoms/BasicButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useCalculateprice } from "../../../../../../api/booking/query";
import { formatThousandSeparator } from "../../../../../../utils/utils/formatThousandSeparator";
import { usePointDetail } from "../../../../../../api/point/query";
import { format } from "date-fns";

export default function ValidationModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    confirm_booking: (
      <ConfirmBooking
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    confirm_extend: (
      <ConfirmExtend
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
  };
  return (
    <BasicModal
      modalVisible={modalVisible}
      modalClosed={backdropClick && modalClosed}
      disableBackdropClick={true}
    >
      {typeModal[modalType]}
    </BasicModal>
  );
}

const ConfirmBooking = ({ data, action, closed }) => {
  const handleConfirm = () => {
    action({
      type: "confirm",
      ...data,
    });
  };

  const handleCancel = () => {
    const dataValue = {
      type: "cancel",
    };
    action(dataValue);
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
          md: "500px",
        },
        backgroundColor: "white",
        // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        // padding: { xs: "20px", sm: "24px", md: "32px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Confirmation Icon */}
      <Box
        sx={{
          width: 72,
          height: 72,
          backgroundColor: "#FDB614",
          boxShadow: "0 4px 12px rgba(253, 182, 20, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          marginBottom: 2, // spacing standar MUI (theme.spacing(2) = 16px)
        }}
      >
        <ReportProblemIcon sx={{ fontSize: 40, color: "white" }} />
      </Box>

      {/* Title */}
      <Text sx={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
        {data.modalTitle}
      </Text>

      {/* Description */}
      <Text sx={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
        {data.modalSubtitle}
      </Text>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <BasicButton
          sx={{
            backgroundColor: "#FDB614",
            color: "#000000",
            "&:hover": { backgroundColor: "#e0a800", color: "#FFFFFF" },
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleConfirm}
        >
          Yes, Confirm
        </BasicButton>
        <BasicButton
          sx={{
            backgroundColor: "#ddd",
            color: "#333",
            "&:hover": { backgroundColor: "#bbb" },
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleCancel}
        >
          Cancel
        </BasicButton>
      </Box>
    </Box>
  );
};

const ConfirmExtend = ({ data, action, closed }) => {
  // console.log("data confirm extend => ", data);

  const BookingExtend = useBookingExtend();

  const handleConfirm = () => {
    const dataCreate = {
      bookingindex: data.bookingindex,
      bookingduration: data.bookingduration,
      bookingpaymentmethod: data.bookingpaymentmethod,
    };

    BookingExtend.mutate(dataCreate, {
      onSuccess: (response) => {
        // console.log("BookingExtend => ", response);
        if (response.status.status === 1) {
          action({
            type: "success_booking_seat",
            title: "Fishing Extend",
            bookingduration: data.bookingduration,
            price: data.price,
            seatcode: data.seatcode,
            braceletcode: data.braceletcode,
            bookingpaymentmethod: data.bookingpaymentmethod,
            userphone: data.userphone,
            userfullname: data.userfullname,
          });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };
  const handleCancel = () => {
    const dataValue = {
      type: "cancel",
    };
    action(dataValue);
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
          md: "500px",
        },
        backgroundColor: "white",
        // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        // padding: { xs: "20px", sm: "24px", md: "32px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Confirmation Icon */}
      <Box
        sx={{
          width: 72,
          height: 72,
          backgroundColor: "#FDB614",
          boxShadow: "0 4px 12px rgba(253, 182, 20, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          marginBottom: 2, // spacing standar MUI (theme.spacing(2) = 16px)
        }}
      >
        <ReportProblemIcon sx={{ fontSize: 40, color: "white" }} />
      </Box>

      {/* Title */}
      <Text sx={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
        Are You Sure For Extend?
      </Text>

      {/* Description */}
      <Text sx={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
        This action cannot be undone. Do you want to proceed?
      </Text>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <BasicButton
          sx={{
            backgroundColor: "#FDB614",
            color: "#000000",
            "&:hover": { backgroundColor: "#e0a800", color: "#FFFFFF" },
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleConfirm}
        >
          Yes, Confirm
        </BasicButton>
        <BasicButton
          sx={{
            backgroundColor: "#ddd",
            color: "#333",
            "&:hover": { backgroundColor: "#bbb" },
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleCancel}
        >
          Cancel
        </BasicButton>
      </Box>
    </Box>
  );
};
