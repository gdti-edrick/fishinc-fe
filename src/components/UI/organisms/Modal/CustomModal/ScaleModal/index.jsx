import Box from "@mui/material/Box";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import { useAddScale } from "../../../../../../api/scale/mutation";

export default function ScaleModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_scale: (
      <AddChangeScale
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

const scaleFormSchema = yup.object().shape({
  scalecode: yup.string().required(),
  scaleusername: yup.string().required(),
  scalepassword: yup.string().required(),
});

const AddChangeScale = ({ data, action }) => {
  console.log("data from scale => ", data);
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
      scalecode: data.scalecode,
      scaleusername: data.scaleusername,
      scalepassword: data.scalepassword,
    },
    resolver: yupResolver(scaleFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddScale = useAddScale();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      scalecode: dataSubmit.scalecode,
      scaleusername: dataSubmit.scaleusername,
      scalepassword: dataSubmit.scalepassword,
    };

    if (data.type === "add") {
      AddScale.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddScale => ", response);

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
        overflowY: { xs: "auto", sm: "auto" },
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
                {data.type} Scale
              </Text>
            </Box>

            <FormInput
              label="Scale Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("scalecode", e.target.value);
                clearErrors("scalecode");
              }}
              id={"scalecode"}
              placeholder="Scale Code"
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
              label="Scale Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("scaleusername", e.target.value);
                clearErrors("scaleusername");
              }}
              id={"scaleusername"}
              placeholder="Scale Name"
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
              label="Scale Password"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("scalepassword", e.target.value);
                clearErrors("scalepassword");
              }}
              id={"scalepassword"}
              placeholder="Scale Password"
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
