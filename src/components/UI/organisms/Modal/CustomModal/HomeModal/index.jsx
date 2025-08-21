import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import { FormDropDown, FormPhone } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import { useDeleteUser } from "../../../../../../api/user/mutation";
import { Box, Button, Divider, MenuItem } from "@mui/material";
import { useNameFromPhone } from "../../../../../../api/dropdown/query";
import CloseIcon from "@mui/icons-material/Close";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  useRedeemAdd,
  useSendOtp,
} from "../../../../../../api/redeem/mutation";
import OTPInput from "react-otp-input";
import { usePointDetail } from "../../../../../../api/point/query";
import { formatThousandSeparator } from "../../../../../../utils/utils/formatThousandSeparator";

import "./index.css";
import { formatInTimeZone } from "date-fns-tz";

export default function HomeModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    market_success: (
      <MarketSuccess
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    redeem_success: (
      <RedeemSuccess
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    point_verif: (
      <PointVerif
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
    confirm_market: (
      <ConfirmMarket
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    confirm_redeem: (
      <ConfirmRedeem
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

const MarketSuccess = ({ data, action, closed }) => {
  const printRef = useRef(null);

  const isAndroid = () => /android/i.test(navigator.userAgent);

  const handlePrint = () => {
    if (!printRef.current) return;

    if (isAndroid()) {
      // Format text manually for RawBT
      const formatItemLine = (name, qty, price, width = 32) => {
        const left = `${name} ${qty}`;
        const right = price;
        const spaceCount = width - left.length - right.length;
        const space = " ".repeat(spaceCount > 0 ? spaceCount : 1);
        return `${left}${space}${right}`;
      };

      const formatLine = (leftText, rightText, width = 32) => {
        const spaceCount = width - leftText.length - rightText.length;
        const space = " ".repeat(spaceCount > 0 ? spaceCount : 1);
        return `${leftText}${space}${rightText}`;
      };

      const truncate = (text, max) =>
        text.length > max ? text.slice(0, max - 1) + "…" : text;

      const itemsText = data.items
        .map((item) => {
          const name = truncate(item.productname, 16);
          const qty = `x${item.itemqty}`;
          const price = `Rp ${parseInt(item.itemtotalidr).toLocaleString()}`;
          return formatItemLine(name, qty, price);
        })
        .join("\n");

      const centerText = (text, width = 32) => {
        const pad = Math.floor((width - text.length) / 2);
        return " ".repeat(pad > 0 ? pad : 0) + text;
      };

      const totalLine = formatLine(
        "Total:",
        `Rp ${parseInt(data.transactionidr).toLocaleString()}`
      );

      const rawText = `
${centerText(".")}
${centerText("Fish.Inc Market")}
${centerText("Entertaiment District,")}
${centerText("Pantai Indah Kapuk 2")}
${centerText("Tel: (021) 123-4567")}
------------------------------
Transaction Code: ${data.transactioncode}
Method: ${data.transactionmethod}
Date: ${new Date().toLocaleString()}
------------------------------
${itemsText}
------------------------------
${totalLine}
------------------------------
${centerText("Thank you for shopping with us!")}
${centerText("Have a great day!")}
`.trim();

      const encoded = encodeURIComponent(rawText);
      window.location.href = `rawbt:${encoded}`;
    } else {
      // Print with browser
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
    }
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
        <h2 className="text-center text-bold">Fish.Inc Market</h2>
        <p className="text-center">
          Entertaiment District, Pantai Indah Kapuk 2
        </p>
        {/* <p className="text-center font-14">Tel: (021) 123-4567</p> */}
        <Divider sx={{ width: "100%", my: 1 }} />

        <p className="font-14">
          <strong>Transaction Code:</strong> {data.transactioncode}
        </p>
        <p className="font-14">
          <strong>Method:</strong> {data.transactionmethod}
        </p>
        <p className="font-14">
          <strong>Date:</strong>{" "}
          {formatInTimeZone(
            new Date(),
            "Asia/Jakarta",
            "dd MMMM yyyy HH:mm:ss"
          )}
        </p>
        <hr />

        {/* Items */}
        {data.items.map((item, index) => (
          <div className="item-row" key={index}>
            <div className="item-left">
              <span className="text-bold">
                {" "}
                {item.productname.length > 12
                  ? item.productname.slice(0, 12) + "..."
                  : item.productname}
              </span>
              <span>{"   "}</span>
              <span>x{item.itemqty}</span>
            </div>
            <span>Rp {parseInt(item.itemtotalidr).toLocaleString()}</span>
          </div>
        ))}
        <Divider sx={{ width: "100%", my: 1 }} />

        {/* Total */}

        <div className="total-line">
          <span>Total</span>
          <span>Rp {parseInt(data.transactionidr).toLocaleString()}</span>
        </div>
        <hr />
        <p className="receipt-footer">Thank you for shopping with us!</p>
        <p className="receipt-footer">Have a great day! 😊</p>
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

const RedeemSuccess = ({ data, action, closed }) => {
  console.log("data from redeem success => ", data);

  const handleCancel = () => {
    const dataValue = {
      type: "cancel",
    };
    action(dataValue);
  };

  const additionalParams2 = useMemo(() => {
    const params = {};

    Object.assign(params, {
      userphone: data.userphone,
    });
    Object.assign(params, {
      userfullname: data.userfullname,
    });
    Object.assign(params, {
      userdisplayname: data.userdisplayname,
    });

    return params;
  }, [data.userphone, data.userfullname]);

  const queryParamsDetail = {
    params: additionalParams2,
  };

  const { data: dataPointDetail } = usePointDetail(queryParamsDetail);

  const printRef = useRef(null);

  const isAndroid = () => /android/i.test(navigator.userAgent);

  const handlePrint = () => {
    if (!printRef.current) return;

    if (isAndroid()) {
      // Format text manually for RawBT
      const formatItemLine = (name, qty, point, width = 32) => {
        const left = `${name} ${qty}`;
        const right = point;
        const spaceCount = width - left.length - right.length;
        const space = " ".repeat(spaceCount > 0 ? spaceCount : 1);
        return `${left}${space}${right}`;
      };

      const formatLine = (leftText, rightText, width = 32) => {
        const spaceCount = width - leftText.length - rightText.length;
        const space = " ".repeat(spaceCount > 0 ? spaceCount : 1);
        return `${leftText}${space}${rightText}`;
      };

      const truncate = (text, max) =>
        text.length > max ? text.slice(0, max - 1) + "…" : text;

      const itemsText = data.items
        .map((item) => {
          const name = truncate(item.productname, 16);
          const qty = `x${item.itemqty}`;
          const point = `Rp ${parseInt(item.itemtotalpoint).toLocaleString()}`;
          return formatItemLine(name, qty, point);
        })
        .join("\n");

      const centerText = (text, width = 32) => {
        const pad = Math.floor((width - text.length) / 2);
        return " ".repeat(pad > 0 ? pad : 0) + text;
      };

      const totalLine = formatLine(
        "Total:",
        `Rp ${parseInt(data.transactionpoint).toLocaleString()}`
      );

      const totalPoint = centerText(
        dataPointDetail?.data
          ? formatThousandSeparator(dataPointDetail?.data[0]?.point_total_after)
          : 0
      );

      const rawText = `
${centerText(".")}
${centerText("Fish.Inc Market")}
${centerText("Entertaiment District,")}
${centerText("Pantai Indah Kapuk 2")}
${centerText("Tel: (021) 123-4567")}
------------------------------
Transaction Code: ${data.transactioncode}
Method: ${data.transactionmethod}
Date: ${new Date().toLocaleString()}
------------------------------
${itemsText}
------------------------------
${totalLine}
------------------------------
${centerText("Point Tersisa")}
${totalPoint}
`.trim();

      const encoded = encodeURIComponent(rawText);
      window.location.href = `rawbt:${encoded}`;
    } else {
      // Print with browser
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
    }
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "520px",
          md: "600px",
          lg: "660px",
        },
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
        <h2 className="text-center text-bold">Fish.Inc Market</h2>
        <p className="text-center">
          Entertaiment District, Pantai Indah Kapuk 2
        </p>
        {/* <p className="text-center font-14">Tel: (021) 123-4567</p> */}
        <Divider sx={{ width: "100%", my: 1 }} />

        <p className="font-14">
          <strong>Transaction Code:</strong> {data.transactioncode}
        </p>
        <p className="font-14">
          <strong>Method:</strong> {data.transactionmethod}
        </p>
        <p className="font-14">
          <strong>Date:</strong>{" "}
          {formatInTimeZone(
            new Date(),
            "Asia/Jakarta",
            "dd MMMM yyyy HH:mm:ss"
          )}
        </p>
        <hr />

        {/* Items */}
        {data.items.map((item, index) => (
          <div className="item-row" key={index}>
            <div className="item-left">
              <span className="text-bold">
                {" "}
                {item.productname.length > 12
                  ? item.productname.slice(0, 12) + "..."
                  : item.productname}
              </span>
              <span>{"   "}</span>
              <span>x{item.itemqty}</span>
            </div>
            <span>{parseInt(item.itemtotalpoint).toLocaleString()} point</span>
          </div>
        ))}
        <Divider sx={{ width: "100%", my: 1 }} />

        {/* Total */}

        <div className="total-line">
          <span>Total</span>
          <span>{parseInt(data.transactionpoint).toLocaleString()} point</span>
        </div>
        <hr />

        <p className="font-14 text-italic text-center">
          Point Tersisa :{" "}
          {dataPointDetail?.data
            ? formatThousandSeparator(
                dataPointDetail?.data[0]?.point_total_after
              )
            : 0}
        </p>

        <p className="receipt-footer">Thank you for shopping with us!</p>
        <p className="receipt-footer">Have a great day! 😊</p>
      </div>

      {/* Print & Close Button */}
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
        sx={{ mt: 2, width: "100%" }}
        onClick={handleCancel}
      >
        Close
      </Button>
    </Box>
  );
};

const pointFormSchema = yup.object().shape({
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(5, "phone must be at least 5 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  usercountrycode: yup.string(),
  usercountry: yup.string(),
  userfullname: yup.string().required(),
});

const PointVerif = ({ data, action, closed }) => {
  console.log("PointVerif =>", data);
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
      userphone: data?.userphone || "",
      userfullname: data?.userfullname || "",
      usercountrycode: data?.usercountrycode || "",
      usercountry: data?.usercountry || "",
    },
    resolver: yupResolver(pointFormSchema),
    // userfullname: "",
    // userdisplayname: "",
  });

  console.log("usercountrycode => ", watch("usercountrycode"));
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitOtp, setIssubmitOtp] = useState(false);

  const [userphone, setUserphone] = useState(data?.userphone || "");
  const [userfullname, setUserfullname] = useState(data?.userfullname || "");
  const [userdisplayname, setUserdisplayname] = useState(
    data?.userdisplayname || ""
  );
  const [otpcode, setOtpcode] = useState("");
  const [time, setTime] = useState(60);
  const [countResend, setCountResend] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  }, [countResend]);

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

  const lookingUserDisplyName = useMemo(() => {
    return listDropdown.find(
      (item) => item.user_fullname === watch("userfullname")
    );
  }, [listDropdown, watch("userfullname")]);

  useEffect(() => {
    setUserdisplayname(lookingUserDisplyName?.user_displayname);
  }, [watch(userfullname)]);

  const SendOtp = useSendOtp();
  const ReedemAdd = useRedeemAdd();

  const getOtp = async () => {
    try {
      const dataAdd = {
        userfullname: userfullname,
        usercountrycode: watch("usercountrycode"),
        userphone: userphone,
      };

      SendOtp.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("SendOtp => ", response);

          if (response.status.status === 1) {
            setIssubmitOtp(true);
          } else {
            setErrorMessage(
              response.status.message[0].errormessage ||
                "Sistem Error please contact the administrator"
            );
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    console.log("submit => ", data);
    const dataSubmit = {
      ...data,
      otp: otpcode,
      userfullname: userfullname,
      userdisplayname: userdisplayname,
      userphone: userphone,
      usercountrycode: watch("usercountrycode"),
    };

    ReedemAdd.mutate(dataSubmit, {
      onSuccess: (response) => {
        console.log("ReedemAdd => ", response);

        if (response.status.status === 1) {
          console.log("ReedemAdd status => ", data);
          action({ ...data, type: "add_redeem_success" });
        } else {
          setErrorMessage(
            response.status.message[0].errormessage ||
              "Sistem Error please contact the administrator"
          );
        }
      },
    });
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "520px",
          // md: "600px",
          // lg: "660px",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form style={{ width: "100%" }}>
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
                Point Verification
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
                countryName={watch("usercountry")}
                countryChange={(phone) => {
                  console.log("phone change => ", phone);
                  setValue("usercountrycode", phone);
                }}
                dataCountry={(dataCountry) =>
                  watch("usercountry", dataCountry.countryCode)
                }
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
                  setUserfullname(value);
                }}
                listDropdown={listDropdown}
                keyFilter="user_fullname"
                renderMenuItem={listDropdown.map((name, index) => (
                  <MenuItem key={index} value={name.user_fullname}>
                    {name.user_fullname}
                  </MenuItem>
                ))}
              />

              {!isSubmitOtp ? (
                <SubmitButton
                  title="Send OTP"
                  onClick={() => {
                    if (userphone === "") {
                      return setErrorMessage("Please fill Phone Number");
                    } else if (userfullname === "") {
                      return setErrorMessage("Please choose User Full Name");
                    } else {
                      setTime(120);
                      setCountResend((prev) => prev + 1);
                      getOtp();
                      setErrorMessage("");
                    }
                  }}
                  style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
                  sx={{ padding: "8px 16px" }}
                  textStyle={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#FDB614",
                  }}
                  fullWidth={true}
                />
              ) : (
                <>
                  <OTPInput
                    value={otpcode}
                    onChange={(code) => {
                      setOtpcode(code);
                      setErrorMessage("");
                    }}
                    numInputs={6}
                    renderSeparator={<span></span>}
                    renderInput={(props) => <input {...props} />}
                    containerStyle={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    inputStyle="inputStyle"
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      variant="body2"
                      sx={{
                        fontSize: "16px",
                        color: "#333333",
                      }}
                    >
                      Haven’t got the message yet?
                    </Text>
                    <Text sx={{ color: "#838BA1" }}>
                      Time Remaining {`${Math.floor(time / 60)}`.padStart(2, 0)}
                      :{`${time % 60}`.padStart(2, 0)}
                    </Text>

                    {time === 0 && (
                      <BasicButton
                        style={{ color: "#FDB614", fontSize: "16px" }}
                        onClick={() => {
                          setTime(120);
                          setCountResend((prev) => prev + 1);
                          getOtp();
                          setErrorMessage("");
                        }}
                      >
                        Resend Code
                      </BasicButton>
                    )}
                  </div>
                </>
              )}
            </Box>
          </Box>

          <Text sx={{ color: "red", marginTop: "10px" }}>{errorMessage}</Text>

          {isSubmitOtp && (
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
                onClick={onSubmit}
                isLoaded={ReedemAdd.isPending}
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#231F20",
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
          )}
        </Box>
      </form>
    </Box>
  );
};

const Confirmation = ({ data, action }) => {
  console.log("data from user => ", data);

  const DeleteUser = useDeleteUser();

  const handleConfirm = () => {
    const dataValue = {
      // type: "confirm_delete",
      usercode: data.user_code,
      userstatus: "0",
      userstatusstr: "deactive",
    };

    DeleteUser.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteUser => ", response);

        if (response.status.status === 1) {
          action({ type: "delete_success" });
        } else {
          setErrorMessage(
            response.status.message[0].errormessage ||
              "Sistem Error please contact the administrator"
          );
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
        padding: { xs: "20px", sm: "24px", md: "32px" },
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

const ConfirmMarket = ({ data, action }) => {
  console.log("data from user => ", data);

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

const ConfirmRedeem = ({ data, action }) => {
  console.log("data confirm redeem => ", data);

  const handleConfirm = () => {
    const dataSubmit = {
      transactioncode: data.transactioncode,
      transactionmethod: data.transactionmethod,
      transactionidr: "0", // isinya total semuanya
      transactionpoint: data.transactionpoint,
      items: data.items,
      userphone: data.userphone,
      usercountrycode: data.usercountrycode,
      usercountry: data.usercountry,
      userfullname: data.userfullname,
      userdisplayname: data.userdisplayname,
    };

    action({
      type: "success_redeem",
      ...dataSubmit,
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
