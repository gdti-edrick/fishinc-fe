import Box from "@mui/material/Box";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import { FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddHoliday,
  useDeleteHoliday,
  useUpdateHoliday,
} from "../../../../../../api/holiday/mutation";
import { convertToCustomDateTime } from "../../../../../../utils/utils/formatString";
import { useUpdatePricelist } from "../../../../../../api/pricelist/mutation";

export default function PricelistModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_pricelist: (
      <AddChangePricelist
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

const pricelistFormSchema = yup.object().shape({
  pricelistprice: yup.string().required(),
  priceliststart: yup.string().required(),
  pricelistend: yup.string().required(),
});

const AddChangePricelist = ({ data, action }) => {
  console.log("data from pricelist => ", data);
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
      pricelistprice: data.pricelistprice,
      priceliststart: data.priceliststart,
      pricelistend: data.pricelistend,
    },
    resolver: yupResolver(pricelistFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const UpdatePricelist = useUpdatePricelist();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      pricelistprice: dataSubmit.pricelistprice,
      priceliststart: dataSubmit.priceliststart,
      pricelistend: dataSubmit.pricelistend,
    };

    console.log("dataAdd => ", dataAdd);
    if (data.type === "update") {
      const dataUpdate = {
        ...dataAdd,
        pricelistindex: data.pricelistindex,
      };
      console.log("dataUpdate => ", dataUpdate);
      UpdatePricelist.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdatePricelist => ", response);

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
                {data.type} Pricelist
              </Text>
            </Box>

            <FormInput
              label="Pricelist Price (number only)"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("pricelistprice", numericValue);
                clearErrors("pricelistprice");
              }}
              id={"pricelistprice"}
              placeholder="Pricelist Price"
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
              label="Pricelist Start (number only)"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("priceliststart", numericValue);
                clearErrors("priceliststart");
              }}
              id={"priceliststart"}
              placeholder="Pricelist Start"
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
              label="Pricelist End (number only)"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("pricelistend", numericValue);
                clearErrors("pricelistend");
              }}
              id={"pricelistend"}
              placeholder="Pricelist End"
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
