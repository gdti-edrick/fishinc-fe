import Box from "@mui/material/Box";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import { FormDropDown, FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../../../../api/user/mutation";
import { useAdminRoleList } from "../../../../../../api/admin/query";
import { MenuItem } from "@mui/material";
import {
  useAddAdmin,
  useAddAdminRole,
  useDeleteAdmin,
  useDeleteAdminRole,
  useUpdateAdmin,
  useUpdateAdminRole,
} from "../../../../../../api/admin/mutation";

export default function AdminRoleModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_admin_role: (
      <AddChangeAdminRole
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

const adminRoleFormSchema = yup.object().shape({
  adminrolecode: yup.string().required(),
  roledesc: yup.string().required(),
});

const AddChangeAdminRole = ({ data, action }) => {
  console.log("data from admin => ", data);
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
      adminrolecode: data.adminrolecode,
      roledesc: data.roledesc,
    },
    resolver: yupResolver(adminRoleFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddAdminRole = useAddAdminRole();
  const UpdateAdminRole = useUpdateAdminRole();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      adminrolecode: dataSubmit.adminrolecode,
      roledesc: dataSubmit.roledesc,
    };

    if (data.type === "add") {
      AddAdminRole.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddAdminRole => ", response);

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
        adminroleindex: data.adminroleindex,
        adminrolecode: data.adminrolecode,
        newadminrolecode: dataSubmit.adminrolecode,
        adminroledesc: dataSubmit.roledesc,
      };
      console.log("dataUpdate => ", dataUpdate);
      UpdateAdminRole.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateAdminRole => ", response);

          if (response.status.status === 1) {
            action({ type: "add_success" });
          } else {
            setErrorMessage(response.status.message[0].errormessage);
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
            height: "500px",
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
                {data.type} Admin Role
              </Text>
            </Box>

            <FormInput
              label="Admin Role Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("adminrolecode", e.target.value);
                clearErrors("adminrolecode");
              }}
              id={"adminrolecode"}
              placeholder="Admin Role Code"
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
              label="Role Description (Optional)"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("roledesc", e.target.value);
                clearErrors("roledesc");
              }}
              id={"roledesc"}
              placeholder="Role Description"
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
  console.log("data from user => ", data);

  const DeleteAdminRole = useDeleteAdminRole();

  const handleConfirm = () => {
    const dataValue = {
      adminrolecode: data.admin_role_code,
      adminrolestatus: data.admin_role_status === 1 ? "0" : "1",
      adminrolestatusstr:
        data.admin_role_status_str === "active" ? "deactive" : "active",
    };

    DeleteAdminRole.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteAdminRole => ", response);

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
        Do you want to proceed?
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
