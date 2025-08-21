import { Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useNameFromPhone } from "../../api/dropdown/query";
import { usePointDetail } from "../../api/point/query";
import {
  FormDropDown,
  FormInput,
  FormPhone,
} from "../../components/UI/molecules/CustomInput";
import { Text } from "../../components/UI/atoms/Typography";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";

const pointFormSchema = yup.object().shape({
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

const PointComponent = ({
  userfullname,
  setUserfullname,
  setUserdisplayname,
  userphone,
  setUserphone,
  setPointUser,
  usercountrycode,
  setUsercountrycode,
  setUsercountry,
}) => {
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
      userphone: userphone,
      userfullname: userfullname,
      usercountrycode: usercountrycode,
    },
    resolver: yupResolver(pointFormSchema),
  });
  const { errors } = formState;

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      phone: userphone,
    });
    Object.assign(params, {
      countrycode: usercountrycode,
    });

    return params;
  }, [userphone, usercountrycode]);

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
  }, [watch("userfullname"), watch("userphone")]);

  const queryParamsDetail = {
    params: additionalParams2,
  };

  const { data: dataPointDetail, refetch } = usePointDetail(queryParamsDetail);

  useEffect(() => {
    if (dataPointDetail?.data) {
      console.log(
        "dataPointDetail 123 =>",
        dataPointDetail?.data[0]?.point_total_after
      );
      setPointUser(dataPointDetail?.data[0]?.point_total_after || 0);
    }
  }, [dataPointDetail]);

  useEffect(() => {
    if (userphone === "") {
      setValue("userphone", "");
      refetch();
    }
  }, [userphone]);

  const lookingUserDisplyName = useMemo(() => {
    return listDropdown.find(
      (item) => item.user_fullname === watch("userfullname")
    );
  }, [listDropdown, watch("userfullname")]);

  useEffect(() => {
    setUserdisplayname(lookingUserDisplyName?.user_displayname);
  }, [watch("userfullname")]);

  const onSubmit = async (dataSubmit) => {};
  return (
    <Box sx={{}}>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                maxWidth: "620px",
              }}
            >
              <FormPhone
                label="Phone Number"
                autoFocus
                errors={errors}
                countryValue={usercountrycode}
                countryChange={(phone) => setUsercountrycode(phone)}
                dataCountry={(dataCountry) =>
                  setUsercountry(dataCountry.countryCode)
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
                // autoComplete="off"
                errors={errors}
                register={register}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setValue("userphone", numericValue);
                  setUserphone(numericValue);
                  clearErrors("userphone");
                  setUserfullname("");
                  setUserdisplayname("");
                  setValue("userfullname", "");
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
                  setValue("userdisplayname", value);
                }}
                listDropdown={listDropdown}
                keyFilter="user_fullname"
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Text
                  sx={{ fontSize: "18px", fontWeight: 600, width: "120px" }}
                >
                  Total Point:{" "}
                </Text>
                <Text
                  sx={{
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#FDB614",
                  }}
                >
                  {dataPointDetail?.data
                    ? formatThousandSeparator(
                        dataPointDetail?.data[0]?.point_total_after
                      )
                    : 0}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default PointComponent;
