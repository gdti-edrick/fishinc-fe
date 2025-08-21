import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

// import { toast } from "sonner";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FormInput } from "../../../../components/UI/molecules/CustomInput";
import { Text } from "../../../../components/UI/atoms/Typography";
import { SubmitButton } from "../../../../components/UI/molecules/Button";

const RegisterAdmin = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5%",
      }}
    >
      <RegisterAdminComponent />
    </Box>
  );
};

export default RegisterAdmin;

const RegisterAdminSchema = yup.object().shape({
  phone: yup.string().required(),
  username: yup.string().required(),
  fullname: yup.string().required(),
  email: yup.string().email().required(),
});

const RegisterAdminComponent = () => {
  const loaderFetching = useSelector((state) => state.common.loaderFetching);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      phone: "",
      username: "",
      fullname: "",
      email: "",
    },
    resolver: yupResolver(RegisterAdminSchema),
  });
  const { errors } = formState;
  // const addNewAdminMutation = useAddAdmin();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data) => {
    // dispatch(setloaderFetching(true));
    // try {
    //   const newData = {
    //     fullname: data.fullname,
    //     username: data.username,
    //     email: data.email,
    //     phone: data.phone,
    //   };
    //   const promise = () =>
    //     new Promise((resolve) =>
    //       setTimeout(
    //         () =>
    //           addNewAdminMutation
    //             .mutateAsync(newData)
    //             .then((res) => resolve(res)),
    //         2000
    //       )
    //     );
    //   // toast.promise(promise, {
    //   //   loading: "Loading...",
    //   //   success: (response) => {
    //   //     if (!response.status.status) {
    //   //       throw new Error(response.status.message[0].errormessage);
    //   //     } else {
    //   //       dispatch(setloaderFetching(false)); // Stop loading
    //   //       setIsSuccess(true);
    //   //       return "Add new admin success!";
    //   //     }
    //   //   },
    //   //   error: (err) => {
    //   //     console.log(err);
    //   //     dispatch(setloaderFetching(false)); // Stop loading
    //   //     return err.message || "An error occurred";
    //   //   },
    //   // });
    // } catch (error) {
    //   console.log(error);
    //   // dispatch(setloaderFetching(false));
    // }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/list-admin", { replace: true });
    }
  }, [isSuccess, navigate]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "33px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Box>
          <Text
            sx={{ fontSize: "30px", color: "#231F20", textAlign: "center" }}
          >
            Create new account Admin
          </Text>
        </Box>
        <FormInput
          label="Fullname"
          autoFocus
          errors={errors}
          register={register}
          id={"fullname"}
          placeholder="Fullname"
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
          label="Wa Phone Number"
          autoFocus
          errors={errors}
          register={register}
          id={"phone"}
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
          label="Username"
          autoFocus
          errors={errors}
          register={register}
          id={"username"}
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
          label="Email"
          autoFocus
          errors={errors}
          register={register}
          id={"email"}
          placeholder="email"
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
      <i
        style={{
          color: "var(--error-color)",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <b>NOTE :</b>
        <p style={{ margin: "0" }}>
          After create new admin, please reset your password on login page{" "}
          <br /> by clicking "Forgot Password" and create new password.
        </p>
      </i>

      <SubmitButton
        disabled={loaderFetching}
        title="Submit"
        onClick={handleSubmit(onSubmit)}
        style={{ borderRadius: "63px" }}
        sx={{
          padding: "8px",
          backgroundColor: "var(--success-color) !important",
          fontWeight: 500,
        }}
      />
    </form>
  );
};
