import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";

import { setloaderFetching } from "../../../redux/slice/commonSlice";
import { Text } from "../../../components/UI/atoms/Typography";
import { BasicButton } from "../../../components/UI/atoms/BasicButton";
import { FormInput } from "../../../components/UI/molecules/CustomInput";
import AuthModal from "../../../components/UI/organisms/Modal/CustomModal/AuthModal";

import { SubmitButton } from "../../../components/UI/molecules/Button";
import { AuthContainer } from "../../../components/Template/Container";
import LogoIcon from "../../../components/UI/molecules/LogoIcon";
import { useFirstSignIn, useSignIn } from "../../../api/auth/mutation";
// import { toast } from "sonner";
// import { SnackbarProvider, useSnackbar } from "notistack";

const loginFormSchema = yup.object().shape({
  loginname: yup.string().required(),
  password: yup.string().min(7).max(32).required(),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  // const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      loginname: "",
      password: "",
    },
    resolver: yupResolver(loginFormSchema),
  });
  const { errors } = formState;

  // const { mutate: doSignIn } = useSignIn();
  const SignInMutation = useSignIn();
  const FirstSignInMutation = useFirstSignIn();

  const onSuccessSignin = (response) => {
    localStorage.setItem("isLogged", "true");
    localStorage.setItem("user", JSON.stringify(response?.support));

    console.log("response.data =>", response.data);

    const admin_crud = response?.data?.admin_crud || [];
    // const admin_crud = response.data ? response.data.admin_crud : [];

    const dataCrud = {
      admin_crud: [...admin_crud],
    };
    localStorage.setItem("crud", JSON.stringify(dataCrud));
    navigate("/home");
  };

  const onSubmit = async (data) => {
    dispatch(setloaderFetching(true));
    try {
      const newData = {
        loginname: data.loginname,
        password: data.password,
      };

      SignInMutation.mutate(newData, {
        onSuccess: (response) => {
          if (response?.status?.status === 1 && response?.support?.token) {
            onSuccessSignin(response);
            // localStorage.setItem("isLogged", "true");
            // localStorage.setItem("user", JSON.stringify(response?.support));

            // console.log("response.data =>", response.data);

            // const admin_crud = response?.data?.admin_crud || [];
            // // const admin_crud = response.data ? response.data.admin_crud : [];

            // const dataCrud = {
            //   admin_crud: [...admin_crud],
            // };
            // localStorage.setItem("crud", JSON.stringify(dataCrud));
            // navigate("/home");
          } else if (
            response?.status?.status === 1 &&
            response?.support?.first_login === 1
          ) {
            const newDataFirst = {
              loginname: data.loginname,
              password: data.password,
              temp_token: response.support.temp_token,
            };

            FirstSignInMutation.mutate(newDataFirst, {
              onSuccess: (responseFirst) => {
                if (response?.status?.status === 1) {
                  setErrorMessage("You are first login");

                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } else {
                  setErrorMessage(responseFirst?.status?.message[0]?.code);
                }
              },
            });
          } else {
            setErrorMessage(response?.status?.message[0]?.code);
          }
        },
      });

      // console.log("data => ", data);
      // const responseApi = {
      //   token: "1234",
      //   refreshToken: "1234",
      //   user_email: "kuncoro@mail.com",
      //   user_fullname: "kuncoro",
      //   user_username: "kuncoro",
      //   user_group: "USER",
      // };
      // handleLogin(responseApi);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setloaderFetching(false));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item => ", item);
    // switch (item.type) {
    //   case "2FA":
    //     post2FA(item);
    //     break;

    //   default:
    //     break;
    // }
  };

  return (
    <AuthContainer>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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
          <Text sx={{ fontSize: "30px", color: "#231F20" }}>Welcome Back!</Text>
          <FormInput
            label="Username"
            autoFocus
            errors={errors}
            register={register}
            id={"loginname"}
            placeholder="username"
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
            type="password"
            label="Password"
            errors={errors}
            register={register}
            id={"password"}
            placeholder="Type your password"
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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* <BasicButton
              onClick={() => navigate("/forgot")}
              sx={{
                color: "#FDB614",
                fontSize: "16px",
              }}
            >
              Forgot Password?
            </BasicButton> */}
          </div>
        </Box>

        <Text sx={{ color: "red", marginTop: "-10px" }}>{errorMessage}</Text>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

          {/* <div
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
              Don’t have an account yet?
            </Text>
            <BasicButton
              style={{ color: "#FDB614", fontSize: "16px" }}
              onClick={() => navigate("/register")}
            >
              Register for free
            </BasicButton>
          </div> */}
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <BasicButton
            onClick={() => {
              const url =
                "https://sites.google.com/view/manualbookfishinc/halaman-muka#h.rybgfm2kkcx2";
              window.open(url, "_blank");
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Box
              component={"img"}
              sx={{ width: "20px" }}
              src="https://api.iconify.design/mingcute:question-line.svg"
            />
            <Text variant="body1">Need Help</Text>
          </BasicButton>
        </Box>
      </form>

      <AuthModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </AuthContainer>
  );
};

export default Login;
