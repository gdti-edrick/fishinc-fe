import Box from "@mui/material/Box";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import { useChangePassword } from "../../../../../../api/profil/mutation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography } from "@mui/material";

export default function LogoutModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
}) {
  const typeModal = {
    logout: (
      <Logout
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    change_password: (
      <ChangePassword
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    success_change_password: (
      <Success
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
  };
  return (
    <BasicModal modalVisible={modalVisible} modalClosed={modalClosed}>
      {typeModal[modalType]}
    </BasicModal>
  );
}

const Logout = ({ action }) => {
  const handleSubmit = async (data) => {
    action(data);
  };
  return (
    <Box
      sx={{
        maxWidth: {
          xs: "300px",
          sm: "400px",
          md: "500px",
          lg: "600px",
        },
        maxHeight: {
          xs: "300px",
          sm: "400px",
          md: "500px",
          lg: "600px",
        },
        minWidth: "300px",
        width: "560px",
        overflowY: { xs: "auto", sm: "auto" },
        padding: { xs: "8px", sm: "0px" },

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: "12px", sm: "16px", md: "24px" },
      }}
    >
      <Box
        sx={{
          // background: "rgba(0, 133, 255, 0.1)",
          padding: "12px",
          borderRadius: "40px",
        }}
      >
        <Box
          component="img"
          src="/assets/icons/sidebar/logout.svg"
          alt=""
          sx={{
            width: { xs: "60px", sm: "90px", md: "110px" },
            height: { xs: "60px", sm: "90px", md: "110px" },
          }}
        />
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Text variant="h5" style={{ fontWeight: 700 }}>
          Are you sure want to log out?
        </Text>
        <Text
          variant="body1"
          sx={{
            fontSize: { xs: "14px", sm: "14px", md: "16px" },
            color: "#6F6C90",
          }}
        >
          Please Confirm If you want to logout.
        </Text>
      </Box>

      <Box sx={{ display: "flex", gap: "24px" }}>
        <BasicButton
          sx={{
            backgroundColor: "#CDCDCD",
            color: "#FFFFFF",
            boxShadow: "0px 3px 12px 0px rgba(74, 58, 255, 0.18)",
            padding: { xs: "8px 16px", sm: "12px 24px", md: "16px 32px" },
            borderRadius: "56px",
            ":hover": {
              bgcolor: "#C0C0C0",
              color: "white",
            },
          }}
          onClick={() => handleSubmit({ type: "cancel" })}
        >
          Cancel
        </BasicButton>
        <BasicButton
          sx={{
            backgroundColor: "#FDB614",
            color: "#FFFFFF",
            boxShadow: "0px 3px 12px 0px rgba(74, 58, 255, 0.18)",
            padding: { xs: "8px 16px", sm: "12px 24px", md: "16px 32px" },
            borderRadius: "56px",
            ":hover": {
              bgcolor: "primary.main",
              color: "white",
            },
          }}
          onClick={() => handleSubmit({ type: "confirm" })}
        >
          Confirm
        </BasicButton>
      </Box>
    </Box>
  );
};

const changePasswordFormSchema = yup.object().shape({
  password: yup.string().min(7).max(32).required(),
  newpassword: yup.string().min(7).max(32).required(),
});

const ChangePassword = ({ data, action, closed }) => {
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
      password: "",
      newpassword: "",
    },
    resolver: yupResolver(changePasswordFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const ChangePassword = useChangePassword();

  useEffect(() => {
    // Auto-focus on the input field when the modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Runs only once when the component mounts

  const onSubmit = async (dataSubmit) => {
    const dataCreate = {
      password: dataSubmit.password,
      newpassword: dataSubmit.newpassword,
    };

    ChangePassword.mutate(dataCreate, {
      onSuccess: (response) => {
        console.log("ChangePassword => ", response);
        if (response.status.status === 1) {
          action({ type: "success_change_password", ...response.data[0] });
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
                Change Password
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
                overflow: "scroll",
              }}
            >
              {/* Please make when firt open this modal then auto active / cliked in input with  id "braceletcode" */}
              <FormInput
                label="Password"
                type="password"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue("password", e.target.value);
                  clearErrors("password");
                }}
                id={"password"}
                placeholder="Password"
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
              <FormInput
                label="New Password"
                type="password"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue("newpassword", e.target.value);
                  clearErrors("newpassword");
                }}
                id={"newpassword"}
                placeholder="New Password"
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

const Success = ({ data, action }) => {
  // console.log("data from user => ", data);

  const handleConfirm = () => {
    action({ type: "cancel" });
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
