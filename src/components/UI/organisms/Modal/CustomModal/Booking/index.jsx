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
  FormDropDown3,
  FormInput,
  FormInputWithSuggestions,
  FormPhone,
} from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useBookingBraceletCheck,
  useBookingCreate,
  useBookingExtend,
  useBookingNoteAdd,
  useBookingRebind,
  useBookingUnbind,
} from "../../../../../../api/booking/mutation";
import {
  useDropdownPromoName,
  useDropdownPromoSource,
  useNameFromPhone,
} from "../../../../../../api/dropdown/query";
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
import {
  useBookingNote,
  useCalculateprice,
} from "../../../../../../api/booking/query";
import { formatThousandSeparator } from "../../../../../../utils/utils/formatThousandSeparator";
import { usePointDetail } from "../../../../../../api/point/query";
import { format } from "date-fns";
import ValidationModal from "../ValidationModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { formatInTimeZone } from "date-fns-tz";

export default function BookingModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    book_now: (
      <BookNow
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    extend: (
      <Extend
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    rebind: (
      <Rebind
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),

    bracelet_check: (
      <BraceletCheck
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    success_bracelet_check: (
      <SuccessBraceletCheck
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    point_check: (
      <PointCheck
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    confirmation: (
      <Confirmation
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),

    success_booking: (
      <SuccessBooking
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    success_booking_receipt: (
      <SuccessBookingReceipt
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    booking_note: (
      <BookingNote
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

const bookingFormSchema = yup.object().shape({
  seatcode: yup.string(),
  bookingduration: yup.string().required(),
  userfullname: yup.string().required(),
  userdisplayname: yup.string().required(),
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(5, "phone must be at least 5 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  usercountrycode: yup.string(),
  braceletcode: yup.string().required(),
  bookingpaymentmethod: yup.string().required(),
  promoindex: yup.string().required(),
});

const BookNow = ({ data, action, closed }) => {
  // console.log("data from user => ", data);
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
    control,
  } = useForm({
    defaultValues: {
      seatcode: data.seat_code,
      bookingduration: "60",
      userfullname: "",
      userdisplayname: "",
      userphone: "",
      usercountrycode: "62",
      braceletcode: "",
      bookingpaymentmethod: "QRIS",
      promoindex: "",
      promoName: "",
    },
    resolver: yupResolver(bookingFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");
  const [userphone, setUserphone] = useState("");
  const [duration, setDuration] = useState("60");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    // console.log("item action => ", item);
    switch (item.type) {
      case "confirm":
        // refetch();
        closeModal();
        fetchBookingCreate(item);
        break;
      case "cancel":
        closeModal();
        break;
      default:
        break;
    }
  };

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      phone: userphone,
    });
    Object.assign(params, {
      countrycode: watch("usercountrycode"),
    });
    Object.assign(params, {
      bookingduration: duration,
    });
    Object.assign(params, {
      promoindex: watch("promoindex"),
    });

    return params;
  }, [userphone, watch("usercountrycode"), duration, watch("promoindex")]);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataDropdown } = useNameFromPhone(queryParams);
  const { data: dataPrice } = useCalculateprice(queryParams);

  const listDropdown = useMemo(() => dataDropdown?.data || [], [dataDropdown]);

  const { data: dataDropdownPromo } = useDropdownPromoName({});

  const listDropdownPromo = useMemo(
    () => dataDropdownPromo?.data || [],
    [dataDropdownPromo]
  );

  const BookingCreate = useBookingCreate();

  const onSubmit = async (dataSubmit) => {
    const dataCreate = {
      bookingduration: dataSubmit.bookingduration,
      userfullname: dataSubmit.userfullname,
      userdisplayname: dataSubmit.userdisplayname,
      userphone: dataSubmit.userphone,
      usercountrycode: dataSubmit.usercountrycode,
      seatcode: dataSubmit.seatcode,
      braceletcode: dataSubmit.braceletcode,
      bookingpaymentmethod: dataSubmit.bookingpaymentmethod,
      price: dataPrice?.data[0].ticket_price,
      promoindex: dataSubmit.promoindex,
    };

    setModalVisible(true);
    setModalType("confirm_booking");
    setModalData({
      modalTitle: "Are You Sure For Booking?",
      modalSubtitle: "This action cannot be undone. Do you want to proceed?",
      ...dataCreate,
    });
  };

  const isNameInList = (list, name) => {
    return list.some(
      (user) => user.user_fullname === name || user.user_displayname === name
    );
  };

  const fetchBookingCreate = async (dataSubmit) => {
    const dataCreate = {
      bookingduration: dataSubmit.bookingduration,
      userfullname: dataSubmit.userfullname,
      userdisplayname: dataSubmit.userdisplayname,
      userphone: dataSubmit.userphone,
      usercountrycode: dataSubmit.usercountrycode,
      seatcode: dataSubmit.seatcode,
      braceletcode: dataSubmit.braceletcode,
      bookingpaymentmethod: dataSubmit.bookingpaymentmethod,
      price: dataPrice?.data[0].ticket_price,
      promoindex: dataSubmit.promoindex,
    };

    console.log("YES dataCreate  => ", dataCreate);

    BookingCreate.mutate(dataCreate, {
      onSuccess: (response) => {
        console.log("BookingCreate => ", response);
        if (response.status.status === 1) {
          action({
            type: "success_booking_seat",
            title: "Fishing",
            bookingduration: dataSubmit.bookingduration,
            price: dataPrice?.data[0].ticket_price,
            promo: dataPrice?.data[0]?.ticket_promo,
            total: dataPrice?.data[0]?.ticket_total,
            seatcode: dataSubmit.seatcode,
            braceletcode: dataSubmit.braceletcode,
            bookingpaymentmethod: dataSubmit.bookingpaymentmethod,
            userfullname: dataSubmit.userfullname,
            userphone: dataSubmit.userphone,
            bookingStart: response.data[0].booking_start,
            bookingCode: response.data[0].booking_code,
          });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };

  const lookingUserDisplyName = useMemo(() => {
    return listDropdown.find(
      (item) => item.user_fullname === watch("userfullname")
    );
  }, [listDropdown, watch("userfullname")]);

  useEffect(() => {
    setValue("userdisplayname", lookingUserDisplyName?.user_displayname);
  }, [watch("userfullname")]);

  console.log("dataPrice => ", dataPrice);
  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            // height: "700px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Booking Seat
              </Text>
              <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // gap: "8px",
                // height: "560px",
                overflow: "scroll",
              }}
            >
              <FormInput
                label="Seat Code"
                autoFocus
                errors={errors}
                register={register}
                disabled
                onChange={(e) => {
                  setValue("seatcode", e.target.value);
                  // setUsername(e.target.value);
                  clearErrors("seatcode");
                }}
                id={"seatcode"}
                placeholder="User Full Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              />

              <FormDropDown
                control={control}
                label="Duration - Minute"
                autoFocus
                errors={errors}
                register={register}
                id={"bookingduration"}
                placeholder="Duration in minute"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  setValue("bookingduration", value);
                  setDuration(value);
                }}
                listDropdown={[
                  {
                    duration: "60",
                  },
                  {
                    duration: "90",
                  },
                  {
                    duration: "120",
                  },
                ]}
                keyFilter="duration"
              />

              <FormPhone
                label="Phone Number"
                autoFocus
                errors={errors}
                countryValue={watch("usercountrycode")}
                countryChange={(phone) => setValue("usercountrycode", phone)}
                value={watch("userphone")}
                onChange={(e) => {
                  let numericValue = e.target.value.replace(/\D/g, "");

                  if (numericValue.startsWith("0")) {
                    numericValue = numericValue.slice(1);
                  }

                  setValue("userphone", numericValue);
                  setUserphone(numericValue);
                  clearErrors("userphone");
                }}
                id={"userphone"}
                placeholder="WhatsApp phone number"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
              />
              {/* <FormInput
                label="Phone Number"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setValue("userphone", numericValue);
                  setUserphone(numericValue);
                  clearErrors("userphone");
                }}
                id={"userphone"}
                placeholder="WhatsApp phone number"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: 100,
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              /> */}
              <FormDropDown2
                control={control}
                label="User Full Name"
                autoFocus
                errors={errors}
                register={register}
                id={"userfullname"}
                placeholder="User Full Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  setValue("userfullname", value);
                  // setValue("userdisplayname", value);
                }}
                listDropdown={listDropdown}
                keyFilter="user_fullname"
                renderMenuItem={listDropdown.map((name, index) => (
                  <MenuItem key={index} value={name.user_fullname}>
                    {name.user_fullname}
                  </MenuItem>
                ))}
              />
              <FormInput
                label="User Disply Name"
                autoFocus
                errors={errors}
                register={register}
                disabled={isNameInList(listDropdown, watch("userdisplayname"))}
                onChange={(e) => {
                  setValue("userdisplayname", e.target.value);
                  clearErrors("userdisplayname");
                }}
                id={"userdisplayname"}
                placeholder="User Disply Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: 100,
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              />

              <FormInput
                label="Bracelet Code"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue("braceletcode", e.target.value);
                  clearErrors("braceletcode");
                }}
                id={"braceletcode"}
                placeholder="Bracelet Code"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: 100,
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              />

              {/* <FormDropDown
                control={control}
                label="Promo Name"
                autoFocus
                errors={errors}
                register={register}
                id={"promo_name"}
                placeholder="Promo Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  console.log("value", value);
                  setPromoName(value.promo_name);
                  setPromoIndex(value.promo_index);
                }}
                listDropdown={listDropdownPromo}
                keyFilter="promo_name"
              /> */}

              <FormDropDown3
                control={control}
                label="Promo Name"
                autoFocus
                id={"promoindex"}
                errors={errors}
                register={register}
                placeholder="Promo Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(e) => {
                  setValue("promoindex", e.target.value);
                  clearErrors("promoindex");
                }}
                value={watch("promoindex")}
                renderMenuItem={listDropdownPromo.map((item, index) => (
                  <MenuItem key={index} value={item.promo_index}>
                    {item.promo_name}
                  </MenuItem>
                ))}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // gap: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                    Price:{" "}
                  </Text>
                  <Text
                    sx={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FDB614",
                    }}
                  >
                    {dataPrice?.status?.status !== 0 &&
                      formatThousandSeparator(
                        dataPrice?.data[0]?.ticket_price || "0"
                      )}
                  </Text>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // gap: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                    Promo:{" "}
                  </Text>
                  <Text
                    sx={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FDB614",
                    }}
                  >
                    {dataPrice?.status?.status !== 0 &&
                      formatThousandSeparator(
                        dataPrice?.data[0]?.ticket_promo || "0"
                      )}
                  </Text>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // gap: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                    Total:{" "}
                  </Text>
                  <Text
                    sx={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FDB614",
                    }}
                  >
                    {dataPrice?.status?.status !== 0 &&
                      formatThousandSeparator(
                        dataPrice?.data[0]?.ticket_total || "0"
                      )}
                  </Text>
                </Box>
              </Box>

              <FormDropDown
                control={control}
                label="Bookingpayment Method"
                autoFocus
                errors={errors}
                register={register}
                id={"bookingpaymentmethod"}
                placeholder="Bookingpayment Method"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  setValue("bookingpaymentmethod", value);
                }}
                listDropdown={[
                  {
                    payment: "DEBIT",
                  },
                  {
                    payment: "CREDIT",
                  },
                  {
                    payment: "QRIS",
                  },
                  {
                    payment: "INTERNAL",
                  },
                ]}
                keyFilter="payment"
              />
            </Box>
          </Box>

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Cancel"
              onClick={closed}
              style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
            <SubmitButton
              title="Submit"
              onClick={handleSubmit(onSubmit)}
              style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </form>

      <ValidationModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

const extendFormSchema = yup.object().shape({
  seatcode: yup.string(),
  bookingduration: yup.string().required(),
  bookingpaymentmethod: yup.string().required(),
  promoindex: yup.string().required(),
});

const Extend = ({ data, action, closed }) => {
  // console.log("data extend => ", data);
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
    control,
  } = useForm({
    defaultValues: {
      seatcode: data.seat_code,
      bookingduration: "60",
      bookingpaymentmethod: "QRIS",
      promoindex: "",
      promoName: "",
    },
    resolver: yupResolver(extendFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");
  const [duration, setDuration] = useState("60");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    // console.log("item action => ", item);
    switch (item.type) {
      case "confirm":
        closeModal();
        fetchBookingCreate(item);
        break;
      case "cancel":
        closeModal();
        break;
      default:
        break;
    }
  };

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      bookingduration: duration,
    });

    Object.assign(params, {
      promoindex: watch("promoindex"),
    });

    return params;
  }, [duration, watch("promoindex")]);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataPrice } = useCalculateprice(queryParams);
  const BookingExtend = useBookingExtend();

  const { data: dataDropdownPromo } = useDropdownPromoName({});

  const listDropdownPromo = useMemo(
    () => dataDropdownPromo?.data || [],
    [dataDropdownPromo]
  );

  const onSubmit = async (dataSubmit) => {
    // console.log("dataSubmit => ", dataSubmit);
    const dataCreate = {
      bookingindex: data?.booking_index,
      bookingduration: dataSubmit.bookingduration,
      bookingpaymentmethod: dataSubmit.bookingpaymentmethod,
      price: dataPrice?.data[0].ticket_price,
      seatcode: data.seat_code,
      braceletcode: data.bracelet_code,
      userphone: data.user_phone,
      userfullname: data.user_fullname,
      promoindex: dataSubmit.promoindex,
    };

    setModalVisible(true);
    setModalType("confirm_booking");
    setModalData({
      modalTitle: "Are You Sure For Extend?",
      modalSubtitle: "This action cannot be undone. Do you want to proceed?",
      ...dataCreate,
    });
  };

  const fetchBookingCreate = async (dataSubmit) => {
    const dataCreate = {
      bookingindex: data?.booking_index,
      bookingduration: dataSubmit.bookingduration,
      bookingpaymentmethod: dataSubmit.bookingpaymentmethod,
      price: dataPrice?.data[0].ticket_price,
      seatcode: data.seat_code,
      braceletcode: data.bracelet_code,
      userphone: data.user_phone,
      userfullname: data.user_fullname,
      promoindex: dataSubmit.promoindex,
    };

    console.log("YES dataCreate  => ", dataCreate);

    BookingExtend.mutate(dataCreate, {
      onSuccess: (response) => {
        console.log("BookingExtend => ", response);
        if (response.status.status === 1) {
          action({
            type: "success_booking_seat",
            title: "Fishing Extend",
            bookingduration: dataSubmit.bookingduration,
            price: dataPrice?.data[0].ticket_price,
            promo: dataPrice?.data[0]?.ticket_promo,
            total: dataPrice?.data[0]?.ticket_total,
            seatcode: data.seat_code,
            braceletcode: data.bracelet_code,
            bookingpaymentmethod: dataSubmit.bookingpaymentmethod,
            userphone: data.user_phone,
            userfullname: data.user_fullname,
            bookingStart: response.data[0].booking_start,
            bookingCode: response.data[0].booking_code,
          });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
          // sm: "520px",
          // md: "600px",
          // lg: "660px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            height: "700px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Extend
              </Text>
              <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "560px",
                overflow: "scroll",
              }}
            >
              <FormInput
                label="Seat Code"
                autoFocus
                errors={errors}
                register={register}
                disabled
                onChange={(e) => {
                  setValue("seatcode", e.target.value);
                  // setUsername(e.target.value);
                  clearErrors("seatcode");
                }}
                id={"seatcode"}
                placeholder="User Full Name"
                labelStyle={{
                  fontSize: "16px",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              />
              <FormDropDown
                control={control}
                label="Duration - Minute"
                autoFocus
                errors={errors}
                register={register}
                id={"bookingduration"}
                placeholder="Duration in minute"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  setValue("bookingduration", value);
                  setDuration(value);
                }}
                listDropdown={[
                  {
                    duration: "30",
                  },
                  {
                    duration: "60",
                  },
                  {
                    duration: "90",
                  },
                  {
                    duration: "120",
                  },
                ]}
                keyFilter="duration"
              />

              <FormDropDown3
                control={control}
                label="Promo Name"
                autoFocus
                id={"promoindex"}
                errors={errors}
                register={register}
                placeholder="Promo Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(e) => {
                  setValue("promoindex", e.target.value);
                  clearErrors("promoindex");
                }}
                value={watch("promoindex")}
                renderMenuItem={listDropdownPromo.map((item, index) => (
                  <MenuItem key={index} value={item.promo_index}>
                    {item.promo_name}
                  </MenuItem>
                ))}
              />

              <FormDropDown
                control={control}
                label="Bookingpayment Method"
                autoFocus
                errors={errors}
                register={register}
                id={"bookingpaymentmethod"}
                placeholder="Bookingpayment Method"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  setValue("bookingpaymentmethod", value);
                }}
                listDropdown={[
                  {
                    payment: "DEBIT",
                  },
                  {
                    payment: "CREDIT",
                  },
                  {
                    payment: "QRIS",
                  },
                  {
                    payment: "INTERNAL",
                  },
                ]}
                keyFilter="payment"
              />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // gap: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                    Price:{" "}
                  </Text>
                  <Text
                    sx={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FDB614",
                    }}
                  >
                    {dataPrice?.status?.status !== 0 &&
                      formatThousandSeparator(
                        dataPrice?.data[0]?.ticket_price || "0"
                      )}
                  </Text>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // gap: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                    Promo:{" "}
                  </Text>
                  <Text
                    sx={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FDB614",
                    }}
                  >
                    {dataPrice?.status?.status !== 0 &&
                      formatThousandSeparator(
                        dataPrice?.data[0]?.ticket_promo || "0"
                      )}
                  </Text>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // gap: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                    Total:{" "}
                  </Text>
                  <Text
                    sx={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FDB614",
                    }}
                  >
                    {dataPrice?.status?.status !== 0 &&
                      formatThousandSeparator(
                        dataPrice?.data[0]?.ticket_total || "0"
                      )}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Cancel"
              onClick={closed}
              style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
            <SubmitButton
              title="Submit"
              onClick={handleSubmit(onSubmit)}
              style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </form>

      <ValidationModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

const braceletFormSchema = yup.object().shape({
  braceletcode: yup.string().required(),
});

const BraceletCheck = ({ data, action, closed }) => {
  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
    control,
  } = useForm({
    defaultValues: {
      braceletcode: "",
    },
    resolver: yupResolver(braceletFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const BookingBraceletCheck = useBookingBraceletCheck();

  useEffect(() => {
    // Auto-focus on the input field when the modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Runs only once when the component mounts

  const onSubmit = async (dataSubmit) => {
    const dataCreate = {
      braceletcode: dataSubmit.braceletcode,
    };
    BookingBraceletCheck.mutate(dataCreate, {
      onSuccess: (response) => {
        if (response.status.status === 1) {
          action({ type: "success_bracelet", ...response.data[0] });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Bracelet Check
              </Text>
              <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "160px",
                overflow: "scroll",
              }}
            >
              {/* Please make when firt open this modal then auto active / cliked in input with  id "braceletcode" */}
              <FormInput
                label="Bracelet Code"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue("braceletcode", e.target.value);
                  // setUsername(e.target.value);
                  clearErrors("braceletcode");
                }}
                id={"braceletcode"}
                placeholder="Bracelet Code"
                inputRef={inputRef}
                labelStyle={{
                  fontSize: "16px",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              />
            </Box>
          </Box>

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Cancel"
              onClick={closed}
              style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
            <SubmitButton
              title="Submit"
              onClick={handleSubmit(onSubmit)}
              style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};
const SuccessBraceletCheck = ({ data, action, closed }) => {
  const list = [
    {
      title: "Bracelet Code",
      value: data.bracelet_code,
    },
    {
      title: "Seat Code",
      value: data.seat_code,
    },
    {
      title: "Full Name",
      value: data.user_fullname,
    },
    {
      title: "Disply Name",
      value: data.user_displayname,
    },
    {
      title: "Phone Number",
      value: data.user_phone,
    },
    {
      title: "Duration",
      value: `${data.booking_duration} min`,
    },
  ];

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%" }}>
        <Box
          sx={{
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Bracelet Check Detail
              </Text>
              <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px 0px",
                // height: "160px",
                overflow: "scroll",
              }}
            >
              {data.bracelet_status_str === "active" ? (
                <Text>Bracelet is Active</Text>
              ) : (
                <>
                  {list.map((item, index) => (
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Text
                        sx={{
                          color: "#231F20",
                          fontSize: "16px",
                          width: "130px",
                          fontWeight: 600,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        sx={{
                          color: "#231F20",
                          fontSize: "16px",
                          width: "8px",
                          fontWeight: 600,
                        }}
                      >
                        :
                      </Text>
                      <Text sx={{ color: "#231F20", fontSize: "16px" }}>
                        {item.value}
                      </Text>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Close"
              onClick={closed}
              style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
};

const Rebind = ({ data, action, closed }) => {
  // console.log("Rebind => ", data);

  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
    control,
  } = useForm({
    defaultValues: {
      braceletcode: "",
    },
    resolver: yupResolver(braceletFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const BookingRebind = useBookingRebind();

  useEffect(() => {
    // Auto-focus on the input field when the modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Runs only once when the component mounts

  const onSubmit = async (dataSubmit) => {
    const dataCreate = {
      braceletcode: dataSubmit.braceletcode,
      seatcode: data?.seat_code,
    };
    BookingRebind.mutate(dataCreate, {
      onSuccess: (response) => {
        // console.log("BookingRebind => ", response);
        if (response.status.status === 1) {
          action({ type: "success_rebind" });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "400px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Rebind
              </Text>
              <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "160px",
                overflow: "scroll",
              }}
            >
              {/* Please make when firt open this modal then auto active / cliked in input with  id "braceletcode" */}
              <FormInput
                label="Bracelet Code"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue("braceletcode", e.target.value);
                  // setUsername(e.target.value);
                  clearErrors("braceletcode");
                }}
                id={"braceletcode"}
                placeholder="Bracelet Code"
                inputRef={inputRef}
                labelStyle={{
                  fontSize: "16px",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              />
            </Box>
          </Box>

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Cancel"
              onClick={closed}
              style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
            <SubmitButton
              title="Submit"
              onClick={handleSubmit(onSubmit)}
              style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};

const pointFormSchema = yup.object().shape({
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(10, "phone must be at least 10 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  usercountrycode: yup.string(),
  userfullname: yup.string().required(),
  userdisplayname: yup.string().required(),
});

const PointCheck = ({ data, action, closed }) => {
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
    control,
  } = useForm({
    defaultValues: {
      userphone: "",
      usercountrycode: "62",
      userfullname: "",
    },
    resolver: yupResolver(pointFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const [userphone, setUserphone] = useState("");

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      phone: userphone,
    });
    Object.assign(params, {
      countrycode: watch("usercountrycode"),
    });

    return params;
  }, [userphone, watch("usercountrycode")]);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataDropdown } = useNameFromPhone(queryParams);

  const listDropdown = useMemo(() => dataDropdown?.data || [], [dataDropdown]);

  const additionalParams2 = useMemo(() => {
    const params = {};

    const lookingUserDisplyName = listDropdown.find(
      (item) => item.user_fullname === watch("userfullname")
    );

    Object.assign(params, {
      userphone: watch("userphone"),
    });

    Object.assign(params, {
      userfullname: watch("userfullname"),
    });
    Object.assign(params, {
      userdisplayname: lookingUserDisplyName?.user_displayname,
    });

    return params;
  }, [userphone, watch("userfullname"), watch("usercountrycode")]);

  const queryParamsDetail = {
    params: additionalParams2,
  };

  const {
    data: dataPointDetail,
    isLoading,
    refetch,
  } = usePointDetail(queryParamsDetail);

  const onSubmit = async (dataSubmit) => {
    // const newParams = {
    //   params: {
    //     userphone: dataSubmit.userphone,
    //     userfullname: dataSubmit.userfullname,
    //     userdisplayname: dataSubmit.userfullname,
    //   },
    // };
    // setQueryParamsDetail(newParams); // Update state, which triggers refetch
    // refetch(); // Manually trigger refetch after updating params
  };

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd MMM yyyy") : "-";
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "800px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Point Check
              </Text>
              <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                // height: "460px",
                overflow: "scroll",
              }}
            >
              <FormPhone
                label="Phone Number"
                autoFocus
                errors={errors}
                countryValue={watch("usercountrycode")}
                countryChange={(phone) => setValue("usercountrycode", phone)}
                value={watch("userphone")}
                onChange={(e) => {
                  let numericValue = e.target.value.replace(/\D/g, "");

                  if (numericValue.startsWith("0")) {
                    numericValue = numericValue.slice(1);
                  }

                  setValue("userphone", numericValue);
                  setUserphone(numericValue);
                  clearErrors("userphone");
                }}
                id={"userphone"}
                placeholder="WhatsApp phone number"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
              />
              {/* <FormInput
                label="Phone Number"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setValue("userphone", numericValue);
                  setUserphone(numericValue);
                  clearErrors("userphone");
                }}
                id={"userphone"}
                placeholder="WhatsApp phone number"
                labelStyle={{
                  fontSize: "16px",
                }}
                inputStyle={{
                  "& .MuiInputBase-root": {
                    borderRadius: 100,
                    padding: "0px",
                    border: "1px solid #010101",
                  },
                  "& .MuiInputBase-input": {
                    padding: "9px 16px 9px 16px",
                  },
                }}
                abdormentStyle={{
                  paddingRight: "28px",
                }}
              /> */}
              <FormDropDown
                control={control}
                label="User Full Name"
                autoFocus
                errors={errors}
                register={register}
                id={"userfullname"}
                placeholder="User Full Name"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                onChange={(value) => {
                  setValue("userfullname", value);
                  setValue("userdisplayname", value);
                }}
                listDropdown={listDropdown}
                keyFilter="user_fullname"
                renderMenuItem={listDropdown.map((name, index) => (
                  <MenuItem key={index} value={name.user_fullname}>
                    {name.user_fullname}
                  </MenuItem>
                ))}
              />
            </Box>
          </Box>

          {dataPointDetail?.data && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Text sx={{ fontSize: "18px", fontWeight: 600 }}>
                Total Point:{" "}
              </Text>
              <Text
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#FDB614",
                }}
              >
                {formatThousandSeparator(
                  dataPointDetail?.data[0].point_total_after
                )}{" "}
              </Text>
            </Box>
          )}

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            dataPointDetail?.data && (
              <TableContainer
                component={Paper}
                sx={{ marginTop: "8px", maxHeight: "400px", overflowY: "auto" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "76px" }}>Event Code</TableCell>
                      <TableCell sx={{ width: "78px" }}>Game Code</TableCell>
                      <TableCell>Point Code</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Ref</TableCell>
                      <TableCell>Sum</TableCell>
                      <TableCell>Before</TableCell>
                      <TableCell>After</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPointDetail?.data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.event_code || "-"}</TableCell>
                        <TableCell>{item.game_code || "-"}</TableCell>
                        <TableCell>{item.point_code || "-"}</TableCell>
                        <TableCell>{formatDate(item.point_created)}</TableCell>
                        <TableCell>{item.point_ref || "-"}</TableCell>
                        <TableCell>
                          {formatThousandSeparator(item.point_sum) || "-"}
                        </TableCell>
                        <TableCell>
                          {formatThousandSeparator(item.point_total_before) ||
                            "-"}
                        </TableCell>
                        <TableCell>
                          {formatThousandSeparator(item.point_total_after) ||
                            "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Cancel"
              onClick={closed}
              style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
            <SubmitButton
              title="Submit"
              onClick={handleSubmit(onSubmit)}
              style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box> */}
        </Box>
      </form>
    </Box>
  );
};

const Confirmation = ({ data, action }) => {
  // console.log("data from user => ", data);

  const BookingUnbind = useBookingUnbind();
  const BookingRebind = useBookingRebind();

  const handleUnbind = () => {
    const dataUnbind = {
      braceletcode: data?.bracelet_code,
      seatcode: data?.seat_code,
    };

    BookingUnbind.mutate(dataUnbind, {
      onSuccess: (response) => {
        // console.log("BookingUnbind => ", response);
        if (response.status.status === 1) {
          action({ type: "success_unbind" });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };
  const handleRebind = () => {
    const dataRebind = {
      braceletcode: data?.bracelet_code,
      seatcode: data?.seat_code,
    };

    BookingRebind.mutate(dataRebind, {
      onSuccess: (response) => {
        // console.log("BookingRebind => ", response);
        if (response.status.status === 1) {
          action({ type: "success_rebind" });
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };

  const handleConfirm = () => {
    if (data.type === "unbind") {
      handleUnbind();
      return;
    } else if (data.type === "rebind") {
      handleRebind();
      return;
    } else {
      console.log("Something wrong !");
    }
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
          width: "60px",
          height: "60px",
          backgroundColor: "#FFEAEA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          marginBottom: "16px",
        }}
      >
        ❗
      </Box>

      {/* Title */}
      <Text sx={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
        Are You Sure?
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
            backgroundColor: "#ff4d4f",
            color: "white",
            "&:hover": { backgroundColor: "#d9363e" },
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

const SuccessBooking = ({ data, action }) => {
  // console.log("data from user => ", data);

  const handleConfirm = () => {
    action({ type: "success" });
  };

  return (
    <Box
      sx={{
        minWidth: { xs: "320px", sm: "420px", md: "500px" },
        backgroundColor: "white",
        borderRadius: "16px",
        // padding: { xs: "24px", sm: "32px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        // boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      {/* Success Icon */}
      <Box
        sx={{
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          marginBottom: "16px",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: "48px", color: "white" }} />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#333",
        }}
      >
        {data.title}
      </Typography>

      {/* Description */}
      <Typography
        sx={{ fontSize: "16px", color: "#555", marginBottom: "24px" }}
      >
        {data.subtitle}
      </Typography>

      {/* Button */}
      <BasicButton
        sx={{
          backgroundColor: "#4CAF50",
          color: "white",
          "&:hover": { backgroundColor: "#388E3C" },
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
        onClick={handleConfirm}
      >
        OK, Got It!
      </BasicButton>
    </Box>
  );
};

// const SuccessBookingReceipt = ({ data, action }) => {
//   console.log("data from user => ", data);

//   const handleConfirm = () => {
//     action({ type: "success" });
//   };

//   return (
//     <Box
//       sx={{
//         minWidth: { xs: "320px", sm: "420px", md: "500px" },
//         backgroundColor: "white",
//         borderRadius: "16px",
//         // padding: { xs: "24px", sm: "32px" },
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//         // boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
//         animation: "fadeIn 0.3s ease-in-out",
//       }}
//     >
//       {/* Success Icon */}
//       <Box
//         sx={{
//           width: "80px",
//           height: "80px",
//           background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: "50%",
//           marginBottom: "16px",
//         }}
//       >
//         <CheckCircleIcon sx={{ fontSize: "48px", color: "white" }} />
//       </Box>

//       {/* Title */}
//       <Typography
//         sx={{
//           fontSize: "22px",
//           fontWeight: "bold",
//           marginBottom: "8px",
//           color: "#333",
//         }}
//       >
//         {data.title}
//       </Typography>

//       {/* Description */}
//       <Typography
//         sx={{ fontSize: "16px", color: "#555", marginBottom: "24px" }}
//       >
//         {data.subtitle}
//       </Typography>

//       {/* Button */}
//       <BasicButton
//         sx={{
//           backgroundColor: "#4CAF50",
//           color: "white",
//           "&:hover": { backgroundColor: "#388E3C" },
//           padding: "12px 24px",
//           borderRadius: "8px",
//           fontSize: "16px",
//           fontWeight: "bold",
//         }}
//         onClick={handleConfirm}
//       >
//         OK, Got It!
//       </BasicButton>
//     </Box>
//   );
// };

const SuccessBookingReceipt = ({ data, action, closed }) => {
  // console.log("data from SuccessBookingReceipt => ", data);

  const printRef = useRef(null);

  const isAndroid = () => /android/i.test(navigator.userAgent);

  const handlePrint = () => {
    if (!printRef.current) return;

    // Print Browser
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=350,height=600");
    printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  width: 80mm;
                  font-size: 18px;
                }
                .receipt {
                  width: 80mm;
                  padding: 5mm;
                }
                .item-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 4px 0;
                }
                .item-left {
                  display: flex;
                  gap: 8px;
                }
                .font-16 {
                  font-size: 16px;
                }
                .font-14 {
                  font-size: 14px;
                }
                .text-center {
                  text-align: center;
                }
                .text-bold {
                  font-weight: bold;
                }
                .text-italic {
                  font-style: italic;
                }
                .total-line {
                  display: flex;
                  justify-content: space-between;
                  font-weight: bold;
                  margin-top: 8px;
                  font-size: 18px;
                }

                .receipt-footer {
                  text-align: center;
                  font-style: italic;
                  margin: 4px 0;
                  font-size: 16px;
                }
                hr {
                  border: none;
                  border-top: 1px dashed #000;
                  margin: 6px 0;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="receipt">${printContents}</div>
          </body>
        </html>
      `);
    printWindow.document.close();

    //     if (isAndroid()) {
    //       // Format text manually for RawBT
    //       const formatItemLine = (name, qty, price, width = 32) => {
    //         const left = `${name} ${qty}`;
    //         const right = price;
    //         const spaceCount = width - left.length - right.length;
    //         const space = " ".repeat(spaceCount > 0 ? spaceCount : 1);
    //         return `${left}${space}${right}`;
    //       };

    //       const formatLine = (leftText, rightText, width = 32) => {
    //         const spaceCount = width - leftText.length - rightText.length;
    //         const space = " ".repeat(spaceCount > 0 ? spaceCount : 1);
    //         return `${leftText}${space}${rightText}`;
    //       };

    //       const truncate = (text, max) =>
    //         text.length > max ? text.slice(0, max - 1) + "…" : text;

    //       // const itemsText = data.items
    //       //   .map((item) => {
    //       //     const name = truncate(item.productname, 16);
    //       //     const qty = `x${item.itemqty}`;
    //       //     const price = `Rp ${parseInt(item.itemtotalidr).toLocaleString()}`;
    //       //     return formatItemLine(name, qty, price);
    //       //   })
    //       //   .join("\n");

    //       const itemsText = () => {
    //         const name = data.title;
    //         const qty = `${data.bookingduration} min`;
    //         const price = `Rp ${parseInt(data.price).toLocaleString()}`;
    //         return formatItemLine(name, qty, price);
    //       };

    //       const centerText = (text, width = 32) => {
    //         const pad = Math.floor((width - text.length) / 2);
    //         return " ".repeat(pad > 0 ? pad : 0) + text;
    //       };

    //       const totalLine = formatLine(
    //         "Total:",
    //         `Rp ${parseInt(data.total).toLocaleString()}`
    //       );

    //       const rawText = `
    // ${centerText(".")}
    // ${centerText("Fishinc")}
    // ${centerText("Entertaiment District,")}
    // ${centerText("Pantai Indah Kapuk 2")}
    // ${centerText("Tel: (021) 123-4567")}
    // ------------------------------
    // Seat: ${data.seatcode}
    // Bracelet Code: ${data.braceletcode}
    // Method: ${data.bookingpaymentmethod}
    // Date: ${new Date().toLocaleString()}
    // ------------------------------
    // ${itemsText()}
    // ------------------------------
    // ${totalLine}
    // ------------------------------
    // ${centerText("Thank you for shopping with us!")}
    // ${centerText("Have a great day!")}
    // `.trim();

    //       const encoded = encodeURIComponent(rawText);
    //       window.location.href = `rawbt:${encoded}`;
    //     } else {
    //       // Print with browser
    //       const printContents = printRef.current.innerHTML;
    //       const printWindow = window.open("", "", "width=350,height=600");
    //       printWindow.document.write(`
    //         <html>
    //           <head>
    //             <title>Print Receipt</title>
    //             <style>
    //               @media print {
    //                 body {
    //                   margin: 0;
    //                   padding: 0;
    //                   width: 80mm;
    //                   font-size: 18px;
    //                 }
    //                 .receipt {
    //                   width: 80mm;
    //                   padding: 5mm;
    //                 }
    //                 .item-row {
    //                   display: flex;
    //                   justify-content: space-between;
    //                   margin: 4px 0;
    //                 }
    //                 .item-left {
    //                   display: flex;
    //                   gap: 8px;
    //                 }
    //                 .font-16 {
    //                   font-size: 16px;
    //                 }
    //                 .font-14 {
    //                   font-size: 14px;
    //                 }
    //                 .text-center {
    //                   text-align: center;
    //                 }
    //                 .text-bold {
    //                   font-weight: bold;
    //                 }
    //                 .text-italic {
    //                   font-style: italic;
    //                 }
    //                 .total-line {
    //                   display: flex;
    //                   justify-content: space-between;
    //                   font-weight: bold;
    //                   margin-top: 8px;
    //                   font-size: 18px;
    //                 }

    //                 .receipt-footer {
    //                   text-align: center;
    //                   font-style: italic;
    //                   margin: 4px 0;
    //                   font-size: 16px;
    //                 }
    //                 hr {
    //                   border: none;
    //                   border-top: 1px dashed #000;
    //                   margin: 6px 0;
    //                 }
    //               }
    //             </style>
    //           </head>
    //           <body onload="window.print(); window.close();">
    //             <div class="receipt">${printContents}</div>
    //           </body>
    //         </html>
    //       `);
    //       printWindow.document.close();
    //     }
  };

  const handleCancel = () => {
    action({ type: "cancel" });
  };

  return (
    <Box
      sx={{
        minWidth: { xs: "300px", sm: "520px", md: "600px", lg: "660px" },
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Print Area */}
      <div ref={printRef} style={{ width: "100%" }}>
        <h2 className="text-center text-bold">Fish.Inc</h2>
        <p className="text-center">
          Entertaiment District, Pantai Indah Kapuk 2
        </p>
        {/* <p className="text-center font-14">Tel: (021) 123-4567</p> */}
        <Divider sx={{ width: "100%", my: 1 }} />

        {/* bookingStart: item.bookingStart,
          bookingCode: item.bookingCode, */}

        <p className="font-14">
          <strong>Book Code:</strong> {data.bookingCode}
        </p>
        <p className="font-14">
          <strong>Name:</strong> {data.userfullname}
        </p>
        <p className="font-14">
          <strong>Phone:</strong> {data.userphone}
        </p>
        <p className="font-14">
          <strong>Seat:</strong> {data.seatcode}
        </p>
        <p className="font-14">
          <strong>Bracelet Code:</strong> {data.braceletcode}
        </p>
        <p className="font-14">
          <strong>Method:</strong> {data.bookingpaymentmethod}
        </p>
        <p className="font-14">
          <strong>Date:</strong>{" "}
          {formatInTimeZone(
            new Date(data.bookingStart),
            "UTC",
            "dd MMMM yyyy HH:mm:ss"
          )}
        </p>
        <hr />

        {/* Items */}

        <div className="item-row">
          <div className="item-left">
            <span className="text-bold">{data.title}</span>
            <span>{"   "}</span>
            <span>{data.bookingduration} min</span>
          </div>
          <span>Rp {parseInt(data.price).toLocaleString()}</span>
        </div>

        <Divider sx={{ width: "100%", my: 1 }} />

        {/* Discount */}

        <div className="total-line">
          <span>Dscount</span>
          <span>Rp {parseInt(data.promo).toLocaleString()}</span>
        </div>
        {/* Total */}

        <div className="total-line">
          <span>Total</span>
          <span>Rp {parseInt(data.total).toLocaleString()}</span>
        </div>
        <hr />
        <p className="receipt-footer">Thank you for fishing with us!</p>
        <p className="receipt-footer">Have a great day!</p>
      </div>

      {/* Buttons */}
      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2, width: "100%" }}
        onClick={handlePrint}
      >
        Print Receipt
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 1, width: "100%" }}
        onClick={handleCancel}
      >
        Close
      </Button>
    </Box>
  );
};

const noteFormSchema = yup.object().shape({
  bookingnote: yup.string().required(),
});

const BookingNote = ({ data, action, closed }) => {
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
    control,
  } = useForm({
    defaultValues: {
      bookingnote: "",
    },
    resolver: yupResolver(noteFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const [userphone, setUserphone] = useState("");

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      bookingcode: data.bookingcode,
    });

    return params;
  }, [userphone]);

  const queryParams = {
    params: additionalParams,
  };

  const {
    data: dataBookingNote,
    isLoading,
    refetch,
  } = useBookingNote(queryParams);

  const BookingNoteAdd = useBookingNoteAdd();
  const onSubmit = async (dataSubmit) => {
    const dataCreate = {
      bookingcode: data.bookingcode,
      bookingnote: dataSubmit.bookingnote,
    };

    BookingNoteAdd.mutate(dataCreate, {
      onSuccess: (response) => {
        console.log("BookingNoteAdd => ", response);
        if (response.status.status === 1) {
          setValue("bookingnote", "");
          refetch();
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "800px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "33px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",

              // gap: "8px",
            }}
          >
            <Box
              sx={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                Booking Note
              </Text>
              {/* <BasicButton
                onClick={closed}
                sx={{
                  padding: "0px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "0px",
                }}
              >
                <CloseIcon sx={{ opacity: 0.4 }} />
              </BasicButton> */}
            </Box>
          </Box>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {dataBookingNote.data.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "#888",
                    padding: "1rem",
                  }}
                >
                  <Text>Note is empty</Text>
                </Box>
              ) : (
                dataBookingNote.data.map((note, index) => (
                  <Box
                    key={index}
                    sx={{
                      marginBottom: "1rem",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "0.5rem",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{note.booking_note_note}</Text>
                    <Text>
                      {formatInTimeZone(
                        new Date(note.booking_note_created),
                        "UTC",
                        "dd MMMM yyyy HH:mm:ss"
                      )}
                    </Text>
                  </Box>
                ))
              )}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              // height: "460px",
              overflow: "scroll",
            }}
          >
            <FormInput
              label="Input Note"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("bookingnote", e.target.value);
                clearErrors("bookingnote");
              }}
              id={"bookingnote"}
              placeholder="Input Note"
              labelStyle={{
                fontSize: "16px",
              }}
              inputStyle={{
                "& .MuiInputBase-root": {
                  borderRadius: 100,
                  padding: "0px",
                  border: "1px solid #010101",
                },
                "& .MuiInputBase-input": {
                  padding: "9px 16px 9px 16px",
                },
              }}
              abdormentStyle={{
                paddingRight: "28px",
              }}
            />
          </Box>

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
            }}
          >
            <SubmitButton
              title="Add Note"
              onClick={handleSubmit(onSubmit)}
              style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
              sx={{ padding: "8px 16px" }}
              textStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FDB614",
              }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};
