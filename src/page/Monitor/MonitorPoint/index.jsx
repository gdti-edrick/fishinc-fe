import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Numpad from "../../../components/UI/molecules/Numpad";
import { useMonitorPoint } from "../../../api/monitor/query";
import {
  FormDropDown,
  FormPhone,
} from "../../../components/UI/molecules/CustomInput";
import {
  Box,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Text } from "../../../components/UI/atoms/Typography";
import { formatThousandSeparator } from "../../../utils/utils/formatThousandSeparator";
import { formatDate } from "date-fns";

const bookingFormSchema = yup.object().shape({
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(5, "phone must be at least 5 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  usercountrycode: yup.string(),
  userfullname: yup.string().required(),
  userdisplayname: yup.string().required(),
});

const MonitorPoint = () => {
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
      userdisplayname: "",
    },
    resolver: yupResolver(bookingFormSchema),
  });
  const { errors } = formState;

  const handleNumpadClick = (value) => {
    let currentPhone = watch("userphone");

    if (value === "backspace") {
      setValue("userphone", currentPhone.slice(0, -1));
    } else if (value === "enter") {
      alert(`You entered: ${currentPhone}`);
    } else if (/^\d$/.test(value)) {
      const newPhone = currentPhone + value;
      setValue("userphone", newPhone);
      clearErrors("userphone");
    }
  };

  // const additionalParams = useMemo(() => {
  //   const params = {};

  //   Object.assign(params, {
  //     userphone: watch("userphone"),
  //   });
  //   Object.assign(params, {
  //     usercountrycode: watch("usercountrycode"),
  //   });

  //   return params;
  // }, [watch("userphone"), watch("usercountrycode")]);

  const additionalParams = useMemo(
    () => ({
      userphone: watch("userphone"),
      usercountrycode: watch("usercountrycode"),
    }),
    [watch("userphone"), watch("usercountrycode")]
  );

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataDropdown } = useMonitorPhone(queryParams);

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
      usercountrycode: watch("usercountrycode"),
    });
    Object.assign(params, {
      userfullname: watch("userfullname"),
    });
    Object.assign(params, {
      userdisplayname: lookingUserDisplyName?.user_displayname,
    });

    return params;
  }, [watch("userphone"), watch("usercountrycode"), watch("userfullname")]);

  const queryParamsDetail = {
    params: additionalParams2,
  };

  const {
    data: dataPointDetail,
    isLoading,
    refetch,
  } = useMonitorPoint(queryParamsDetail);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        textAlign: "center",
        marginTop: 50,
        backgroundColor: "#FFFFFF",
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
          clearErrors("userphone");
        }}
        id={"userphone"}
        placeholder="WhatsApp phone number"
        labelStyle={{
          fontSize: "14px",
          color: "#565D6A",
        }}
      />
      <Numpad onClick={handleNumpadClick} />

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

      {dataPointDetail?.data[0]?.point_total_after && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Text sx={{ fontSize: "18px", fontWeight: 600 }}>Total Point: </Text>
          <Text
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#FDB614",
            }}
          >
            {formatThousandSeparator(
              dataPointDetail?.data[0]?.point_total_after
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
        dataPointDetail?.data.length > 0 && (
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
                    <TableCell>{item?.event_code || "-"}</TableCell>
                    <TableCell>{item?.game_code || "-"}</TableCell>
                    <TableCell>{item?.point_code || "-"}</TableCell>
                    <TableCell>
                      {item?.point_created
                        ? // ? formatDate(item?.point_created)
                          item?.point_created
                        : "-"}
                    </TableCell>
                    <TableCell>{item?.point_ref || "-"}</TableCell>
                    <TableCell>
                      {formatThousandSeparator(item?.point_sum) || "-"}
                    </TableCell>
                    <TableCell>
                      {formatThousandSeparator(item?.point_total_before) || "-"}
                    </TableCell>
                    <TableCell>
                      {formatThousandSeparator(item?.point_total_after) || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </div>
  );
};

export default MonitorPoint;
