import Box from "@mui/material/Box";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import { FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../../../../api/user/mutation";
import {
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatThousandSeparator } from "../../../../../../utils/utils/formatThousandSeparator";
import { formatInTimeZone } from "date-fns-tz";

export default function TransactionModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    detail_summary_table: (
      <DetailSummaryTable
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    add_change_user: (
      <AddChangeUser
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
    market_success: (
      <MarketSuccess
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

const DetailSummaryTable = ({ data, action }) => {
  console.log("data from detail summary => ", data);

  const columns = useMemo(
    () => [
      { key: "product_code", label: "Product Code" },
      { key: "product_name", label: "Product Name" },
      { key: "total_transaction", label: "Total Transaction" },
      { key: "total_qty", label: "Total Quantity" },
      { key: "total_income", label: "Total Income" },
      { key: "point_used", label: "Point Used" },
    ],
    []
  );

  return (
    <Box
      sx={{
        minWidth: {
          xs: "300px",
          sm: "520px",
          md: "600px",
          lg: "660px",
        },
        overflowY: { xs: "auto", sm: "auto" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginBottom: "8px" }}>
        <Text
          sx={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#FDB614",
            textTransform: "capitalize",
          }}
        >
          Detail Summary
        </Text>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Text sx={{ fontSize: "14px", fontWeight: 600 }}>
                      {col.label}
                    </Text>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {row[col.key] !== null
                        ? formatThousandSeparator(row[col.key])
                        : "0"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const userFormSchema = yup.object().shape({
  userfullname: yup.string().required(),
  userdisplayname: yup.string().required(),
  usercountrycode: yup.string().required(),
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(5, "phone must be at least 5 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  useremail: yup.string(),
});

const AddChangeUser = ({ data, action }) => {
  console.log("data from user => ", data);
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      userfullname: data.userfullname,
      userdisplayname: data.userdisplayname,
      usercountrycode: data.usercountrycode,
      userphone: data.userphone,
      useremail: data.useremail,
    },
    resolver: yupResolver(userFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddUser = useAddUser();
  const UpdateUser = useUpdateUser();

  const onSubmit = async (dataSubmit) => {
    // alert("submit");
    const dataAdd = {
      // type: data.type,
      userfullname: dataSubmit.userfullname,
      userdisplayname: dataSubmit.userfullname, //isi default mengikuti userfullname
      usercountrycode: dataSubmit.usercountrycode, //kode negara tanpa "+"
      userphone: dataSubmit.userphone, //nomor tanpa 0 atau kode negara
      useremail: dataSubmit.useremail, //optional tapi s
    };

    if (data.type === "add") {
      AddUser.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddUser => ", response);

          if (response.status.status === 1) {
            action({ type: "add_success" });
          } else {
            setErrorMessage(
              response.status.message[0].errormessage ||
                "Sistem Error please contact the administrator"
            );
          }
        },
      });
    }
    if (data.type === "update") {
      const dataUpdate = {
        ...dataAdd,
        usercode: data.usercode,
      };
      console.log("dataUpdate => ", dataUpdate);
      UpdateUser.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateUser => ", response);

          if (response.status.status === 1) {
            action({ type: "add_success" });
          } else {
            setErrorMessage(
              response.status.message[0].errormessage ||
                "Sistem Error please contact the administrator"
            );
          }
        },
      });
    }

    // action(dataValue);
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
        // aspectRatio: { xs: 23 / 23, sm: 23 / 18, md: 23 / 18, lg: 23 / 18 },
        // overflow: "hidden",
        overflowY: { xs: "auto", sm: "auto" },
        // padding: { xs: "20px", sm: "24px", md: "32px" },
        // overflow: "scroll",
        // "-ms-overflow-style": "none",
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
              // gap: "8px",
            }}
          >
            <Box sx={{ marginBottom: "8px" }}>
              <Text
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#FDB614",
                  textTransform: "capitalize",
                }}
              >
                {data.type} User
              </Text>
            </Box>

            <FormInput
              label="User Full Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("userfullname", e.target.value);
                setValue("userdisplayname", e.target.value);
                // setUsername(e.target.value);
                clearErrors("userfullname");
              }}
              id={"userfullname"}
              placeholder="User Full Name"
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

            <FormInput
              label="Country Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("usercountrycode", numericValue);
                // setUsername(e.target.value);
                clearErrors("usercountrycode");
              }}
              id={"usercountrycode"}
              placeholder="Country Code"
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

            <FormInput
              label="Phone Number"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("userphone", numericValue);
                // setValue("phone", e.target.value);
                // setPhone(e.target.value);
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
            />

            <FormInput
              label="Email (Optional)"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("useremail", e.target.value);
                clearErrors("useremail");
              }}
              id={"useremail"}
              placeholder="User Email"
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

          <Text sx={{ color: "red", marginTop: "-10px" }}>{errorMessage}</Text>

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
          />
        </Box>
      </form>
    </Box>
  );
};

const Confirmation = ({ data, action }) => {
  console.log("data from transaction => ", data);

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

const MarketSuccess = ({ data, action, closed }) => {
  console.log("data from transaction => ", data);
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
          {/* <strong>Date:</strong> {new Date().toLocaleString()} */}
          <strong>Date:</strong>{" "}
          {formatInTimeZone(
            new Date(data.transactioncreated),
            "UTC",
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
