import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContainer } from "../../../components/Template/Container";

import { Text } from "../../../components/UI/atoms/Typography";
import LogoIcon from "../../../components/UI/molecules/LogoIcon";
import { Box } from "@mui/material";
import { BasicButton } from "../../../components/UI/atoms/BasicButton";
import { FormPhone } from "../../../components/UI/molecules/CustomInput";
import Numpad from "../../../components/UI/molecules/Numpad";
import { SubmitButton } from "../../../components/UI/molecules/Button";
import MonitorPhoneContainer from "../../../components/Template/Container/MonitorPhoneContainer";
import { useMonitorPhone } from "../../../api/monitor/mutation";
import MonitorModal from "../../../components/UI/organisms/Modal/CustomModal/MonitorModal";

const bookingFormSchema = yup.object().shape({
  userphone: yup
    .string()
    .matches(/^\d+$/, "xxphone is required")
    .min(5, "xxphone must be at least 5 digits")
    .max(15, "xxphone must be at most 15 digits")
    .required("xxphone is required"),
  usercountrycode: yup.string(),
});

const MonitorPoint2 = () => {
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
    },
    resolver: yupResolver(bookingFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const handleNumpadClick = (value) => {
    let currentPhone = watch("userphone");
    setErrorMessage("");

    if (value === "backspace") {
      setValue("userphone", currentPhone.slice(0, -1));
    } else if (value === "enter") {
      handleSubmit(onSubmit)();
    } else if (/^\d$/.test(value)) {
      let newPhone = currentPhone + value;

      if (newPhone.startsWith("0")) {
        newPhone = newPhone.slice(1);
      }

      setValue("userphone", newPhone);
      clearErrors("userphone");
    }
  };

  const MonitorPhone = useMonitorPhone();

  const onSubmit = async (data) => {
    const newData = {
      userphone: watch("userphone"),
      usercountrycode: watch("usercountrycode"),
    };

    MonitorPhone.mutate(newData, {
      onSuccess: (response) => {
        console.log("MonitorPhone => ", response);
        if (response?.status?.status === 1 && response?.data.length > 0) {
          console.log("response.data =>", response.data);
          setModalVisible(true);
          setModalType("monitor_point");
          setModalData({
            list: response.data,
            userphone: watch("userphone"),
            usercountrycode: watch("usercountrycode"),
          });
        } else {
          setErrorMessage(response?.status?.message[0]?.errormessage);
        }
      },
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item => ", item);
    switch (item.type) {
      case "done":
        setValue("userphone", "");
        closeModal();
        break;

      default:
        break;
    }
  };

  return (
    <MonitorPhoneContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-end",
          gap: "16px",
          margin: { xs: "16px", sm: "64px", md: "128px" },
        }}
      >
        <Box sx={{ width: "500px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <BasicButton
              sx={{
                display: "flex",
                zIndex: 300,
                alignItems: "center",
                width: "90%",
              }}
            >
              {<LogoIcon />}
            </BasicButton>
          </Box>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "white",
              padding: "45px",
              borderRadius: "33px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <Box>
                <Text
                  sx={{ fontSize: "50px", fontWeight: 700, color: "#231F20" }}
                >
                  See Your
                </Text>
                <Text
                  sx={{ fontSize: "50px", fontWeight: 700, color: "#231F20" }}
                >
                  Catch Points!
                </Text>
              </Box>
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
                  setErrorMessage("");
                }}
                id={"userphone"}
                placeholder="WhatsApp phone number"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
              />
            </Box>

            <Text sx={{ color: "red", marginTop: "-10px" }}>
              {errorMessage}
            </Text>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "64px",
              }}
            >
              <SubmitButton
                title="Sign In"
                onClick={handleSubmit(onSubmit)}
                style={{ borderRadius: "63px" }}
                sx={{
                  padding: "8px 8px",
                  marginTop: "32px",
                  backgroundColor: "var(--warning-color) !important",
                  fontWeight: 500,
                }}
              />
            </Box>
          </form>
        </Box>
        <Numpad onClick={handleNumpadClick} />
      </Box>
      <MonitorModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </MonitorPhoneContainer>
  );
};

export default MonitorPoint2;
