import Box from "@mui/material/Box";
import { useMemo, useState } from "react";
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
} from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../../../../api/user/mutation";
import { useScaleList } from "../../../../../../api/scale/query";
import { MenuItem } from "@mui/material";
import {
  useAddWeight,
  useDeleteWeight,
} from "../../../../../../api/weight/mutation";
import { useNameFromPhone } from "../../../../../../api/dropdown/query";

export default function WeightModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_weight: (
      <AddChangeWeight
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

const weightFormSchema = yup.object().shape({
  // braceletcode: yup.string().required(),
  // scalecode: yup.string().required(),
  weightnumber: yup.string().required(),
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(10, "phone must be at least 10 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  usercountrycode: yup.string(),
  userfullname: yup.string().required(),
  userdisplayname: yup.string().required(),
});

const AddChangeWeight = ({ data, action }) => {
  console.log("data from weight => ", data);
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
      // braceletcode: data.braceletcode,
      // scalecode: data.scalecode,
      weightnumber: data.weightnumber,
      userphone: "",
      usercountrycode: "62",
      userfullname: "",
    },
    resolver: yupResolver(weightFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");
  const [userphone, setUserphone] = useState("");

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      phone: userphone,
    });
    Object.assign(params, {
      countrycode: watch("usercountrycode"),
    });

    return params;
  }, [userphone, watch("usercountrycode")]);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataDropdown } = useNameFromPhone(queryParams);

  const listDropdown = useMemo(() => dataDropdown?.data || [], [dataDropdown]);

  const AddWeight = useAddWeight();
  // const UpdateUser = useUpdateUser();

  // const { data: dataDropdown } = useScaleList({
  //   params: {
  //     page: 1,
  //     limit: 1000,
  //   },
  // });

  // const listDropdown = useMemo(() => dataDropdown?.data || [], [dataDropdown]);

  const onSubmit = async (dataSubmit) => {
    const lookingUserDisplyName = listDropdown.find(
      (item) => item.user_fullname === dataSubmit.userfullname
    );

    console.log("lookingUserDisplyName => ", lookingUserDisplyName);

    const dataAdd = {
      // braceletcode: dataSubmit.braceletcode,
      // scalecode: dataSubmit.scalecode,
      weightnumber: dataSubmit.weightnumber,
      userphone: dataSubmit.userphone,
      usercountrycode: dataSubmit.usercountrycode,
      userfullname: dataSubmit.userfullname,
      userdisplayname: lookingUserDisplyName.user_displayname,
    };

    if (data.type === "add") {
      console.log("dataAdd => ", dataAdd);
      AddWeight.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddWeight => ", response);

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
                {data.type} Weight
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

            {/* <FormInput
              label="Bracelet Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("braceletcode", e.target.value);
                clearErrors("braceletcode");
              }}
              id={"braceletcode"}
              placeholder="Bracelet Code"
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
              label="Scale Code"
              autoFocus
              errors={errors}
              register={register}
              id={"scalecode"}
              placeholder="Scale Code"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(value) => {
                setValue("scalecode", value);
              }}
              listDropdown={listDropdown}
              keyFilter="scale_code"
              renderMenuItem={listDropdown.map((name, index) => (
                <MenuItem key={index} value={name.scale_code}>
                  {name.scale_code}
                </MenuItem>
              ))}
            /> */}

            <FormInput
              label="Weight Number"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("weightnumber", numericValue);
                clearErrors("weightnumber");
              }}
              id={"weightnumber"}
              placeholder="Weight Number"
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
  console.log("data from weight => ", data);

  const DeleteWeight = useDeleteWeight();

  const handleConfirm = () => {
    const dataValue = {
      weightcode: data.weight_code,
      weightstatus: data.weight_status === 1 ? "0" : "1",
      weightstatusstr:
        data.weight_status_str === "active" ? "deactive" : "active",
    };

    DeleteWeight.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteWeight => ", response);

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
