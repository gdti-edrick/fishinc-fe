import Box from "@mui/material/Box";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import {
  FormDropDown,
  FormInput,
  FormPhone,
  FormRadioGroup,
} from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddPromo,
  useDeletePromo,
} from "../../../../../../api/promo/mutation";
import { useDropdownPromoSource } from "../../../../../../api/dropdown/query";
import { Checkbox, FormControlLabel } from "@mui/material";
import { convertToCustomDateTime } from "../../../../../../utils/utils/formatString";

export default function PromoModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_promo: (
      <AddChangePromo
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

const promoFormSchema = yup.object().shape({
  promoname: yup.string().required(),
  promosource: yup.string().required(), // DROPDOWN buat kayak booking create
  promopercentage: yup.string().required(), // Jika promopercentage diisi, maka promoflat harus 0
  promoflat: yup.string().required(), // Jika promoflat diisi, maka promopercentage harus 0
  promoexpired: yup.string(),
  promoinfinite: yup.string().required(),
});

const AddChangePromo = ({ data, action }) => {
  // console.log("data from promo => ", data);
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
      promoname: data.promoname,
      promosource: data.promosource,
      promopercentage: data.promopercentage,
      promoflat: data.promoflat,
      promoexpired: data.promoexpired,
      promoinfinite: data.promoinfinite,
    },
    resolver: yupResolver(promoFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddPromo = useAddPromo();

  const { data: dataDropdown } = useDropdownPromoSource({
    params: {
      page: 1,
      limit: 1000,
    },
  });

  const listDropdown = useMemo(
    () => [...(dataDropdown?.data || [])],
    [dataDropdown]
  );

  const watchPercentage = watch("promopercentage");
  const watchFlat = watch("promoflat");
  const watchInfinite = watch("promoinfinite");

  useEffect(() => {
    if (watchPercentage && parseFloat(watchPercentage) > 0) {
      setValue("promoflat", "0");
      clearErrors("promoflat");
    }
  }, [watchPercentage, setValue]);

  useEffect(() => {
    if (watch("promoinfinite") === "1") {
      setValue("promoexpired", "");
      clearErrors("promoexpired");
    }
  }, [watch("promoinfinite"), setValue]);

  useEffect(() => {
    if (watchFlat && parseFloat(watchFlat) > 0) {
      setValue("promopercentage", "0");
      clearErrors("promopercentage");
    }
  }, [watchFlat, setValue]);

  console.log("errors => ", errors);

  const onSubmit = async (dataSubmit) => {
    console.log("dataSubmit => ", dataSubmit);
    const dataAdd = {
      promoname: dataSubmit.promoname,
      promosource: dataSubmit.promosource,
      promopercentage: dataSubmit.promopercentage,
      promoflat: dataSubmit.promoflat,
      promoexpired:
        dataSubmit.promoinfinite === "1"
          ? ""
          : convertToCustomDateTime(dataSubmit.promoexpired),
      promoinfinite: dataSubmit.promoinfinite ? "1" : "0",
    };

    if (data.type === "add") {
      AddPromo.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddPromo => ", response);

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
                {data.type} Promo
              </Text>
            </Box>

            <FormInput
              label="Promo Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("promoname", e.target.value);
                clearErrors("promoname");
              }}
              id={"promoname"}
              placeholder="Promo Name"
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

            <FormDropDown
              control={control}
              label="Promo Source"
              autoFocus
              errors={errors}
              register={register}
              id={"promosource"}
              placeholder="Promo Source"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(value) => {
                setValue("promosource", value);
              }}
              listDropdown={listDropdown}
              keyFilter="promo_source"
            />

            <FormInput
              label="Promo Percentage"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("promopercentage", e.target.value);
                clearErrors("promopercentage");
              }}
              id={"promopercentage"}
              placeholder="Promo Percentage"
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
              label="Promo Flat"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("promoflat", e.target.value);
                clearErrors("promoflat");
              }}
              id={"promoflat"}
              placeholder="Promo Flat"
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
            <FormRadioGroup
              label="Promo Infinite"
              id="promoinfinite"
              value={watch("promoinfinite")}
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("promoinfinite", e.target.value);
                clearErrors("promoinfinite");
              }}
              labelStyle={{
                fontSize: "16px",
              }}
              radioGroupStyle={{
                display: "flex",
                gap: "16px",
              }}
              radioStyle={{
                border: "1px solid #010101",
                borderRadius: "100px",
                padding: "9px 16px",
              }}
            />

            <FormInput
              label="Promo Expired"
              type="date"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("promoexpired", e.target.value);
                clearErrors("promoexpired");
              }}
              disabled={watch("promoinfinite") === "1" ? true : false}
              id={"promoexpired"}
              placeholder="Holiday Date"
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
  console.log("data from promo => ", data);

  const DeletePromo = useDeletePromo();

  const handleConfirm = () => {
    const dataValue = {
      promoindex: data.promo_index,
      promostatus: data.promo_status === 1 ? "0" : "1",
      // userstatusstr: data.promo_status_str === "active" ? "deactive" : "active",
    };

    DeletePromo.mutate(dataValue, {
      onSuccess: (response) => {
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
