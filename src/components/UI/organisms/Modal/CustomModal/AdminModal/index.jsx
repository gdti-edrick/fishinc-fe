import Box from "@mui/material/Box";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import {
  FormDropDown,
  FormDropDown3,
  FormInput,
  FormRadioGroup,
} from "../../../../molecules/CustomInput";
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
  useAdminUnsuspendNewPass,
  useDeleteAdmin,
  useUpdateAdmin,
  useUpdateAdminCrud,
} from "../../../../../../api/admin/mutation";
import { useDropdownAdminRole } from "../../../../../../api/dropdown/query";

export default function AdminModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_admin: (
      <AddChangeAdmin
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
    unsuspend: (
      <Unsuspend
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    add_change_admin_crud: (
      <AddChangeAdminCrud
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

const adminFormSchema = yup.object().shape({
  loginname: yup.string().required(),
  displayname: yup.string().required(),
  firstloginpass: yup.string().required(), // only 1 or 0
  adminrolecode: yup.string().required(),
  password: yup.string().min(7).max(32).required(),
});

const AddChangeAdmin = ({ data, action }) => {
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
      loginname: data.loginname,
      displayname: data.displayname,
      firstloginpass: data.firstloginpass, // only 1 or 0
      adminrolecode: data.adminrolecode,
      password: data.password,
    },
    resolver: yupResolver(adminFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddAdmin = useAddAdmin();
  const UpdateAdmin = useUpdateAdmin();

  const { data: dataDropdown } = useDropdownAdminRole({});

  const listDropdown = useMemo(() => dataDropdown?.data || [], [dataDropdown]);

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      loginname: dataSubmit.loginname,
      displayname: dataSubmit.displayname,
      firstloginpass: data.firstloginpass, // 1 or 0
      adminrolecode: dataSubmit.adminrolecode,
      password: dataSubmit.password,
    };

    if (data.type === "add") {
      AddAdmin.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddAdmin => ", response);

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
        admincode: data.admincode,
        firstlogin: dataSubmit.firstloginpass,
      };
      console.log("dataUpdate => ", dataUpdate);
      UpdateAdmin.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateAdmin => ", response);

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
            // height: "500px",
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
                {data.type} Admin
              </Text>
            </Box>

            <FormInput
              label="Login Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("loginname", e.target.value);
                clearErrors("loginname");
              }}
              id={"loginname"}
              placeholder="Login Name"
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
              label="Disply Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("displayname", e.target.value);
                clearErrors("displayname");
              }}
              id={"displayname"}
              placeholder="Disply Name"
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
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("password", e.target.value);
                clearErrors("password");
              }}
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

            <FormDropDown
              control={control}
              label="Admin Role"
              autoFocus
              errors={errors}
              register={register}
              id={"adminrolecode"}
              placeholder="Admin Role"
              labelStyle={{
                fontSize: "16px",
                // color: "#565D6A",
              }}
              onChange={(value) => {
                setValue("adminrolecode", value);
              }}
              listDropdown={listDropdown}
              keyFilter="admin_role_code"
              renderMenuItem={listDropdown.map((name, index) => (
                <MenuItem key={index} value={name.admin_role_code}>
                  {name.admin_role_code}
                </MenuItem>
              ))}
            />

            <FormRadioGroup
              label="First Login"
              id="firstloginpass"
              value={watch("firstloginpass")}
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("firstloginpass", e.target.value);
                clearErrors("firstloginpass");
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
          </Box>

          <Text sx={{ color: "red", marginTop: "-10px" }}>{errorMessage}</Text>

          <SubmitButton
            title="Submit"
            onClick={handleSubmit(onSubmit)}
            style={{
              borderRadius: "8px",
              backgroundColor: "#231F20",
              marginTop: "16px",
            }}
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

  const DeleteAdmin = useDeleteAdmin();

  const handleConfirm = () => {
    const dataValue = {
      admincode: data.admin_code,
      adminstatus: data.admin_status === 1 ? "0" : "1",
      adminstatusstr:
        data.admin_status_str === "active" ? "deactive" : "active",
    };

    DeleteAdmin.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteAdmin => ", response);

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

const unsuspendFormSchema = yup.object().shape({
  adminnewpassword: yup.string().min(7).max(32).required(),
});

const Unsuspend = ({ data, action, closed }) => {
  console.log("data unsuspend => ", data);

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
      adminnewpassword: "",
    },
    resolver: yupResolver(unsuspendFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AdminUnsuspendNewPass = useAdminUnsuspendNewPass();

  useEffect(() => {
    // Auto-focus on the input field when the modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Runs only once when the component mounts

  const onSubmit = async (dataSubmit) => {
    const dataCreate = {
      admincode: data.admin_code,
      adminnewpassword: dataSubmit.adminnewpassword,
    };
    AdminUnsuspendNewPass.mutate(dataCreate, {
      onSuccess: (response) => {
        if (response.status.status === 1) {
          action({ type: "unsuspend_success" });
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
            height: "300px",
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
                Unsuspend
              </Text>
              {/* <BasicButton
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
              </BasicButton> */}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "160px",
                overflow: "scroll",
              }}
            >
              {/* Please make when firt open this modal then auto active / cliked in input with  id "braceletcode" */}
              <FormInput
                label="New Password"
                type="password"
                autoFocus
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue("adminnewpassword", e.target.value);
                  // setUsername(e.target.value);
                  clearErrors("adminnewpassword");
                }}
                id={"adminnewpassword"}
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

const adminCrudFormSchema = yup.object().shape({
  admincrudcode: yup.string().required(),
  adminrulecode: yup.string().required(),
  entityCode: yup.string().required(),
  c: yup.string().required(),
  r: yup.string().required(),
  u: yup.string().required(),
  d: yup.string().required(),
});

const AddChangeAdminCrud = ({ data, action }) => {
  console.log("data from admin crud => ", data);
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
      admincrudcode: data.admincrudcode,
      adminrulecode: data.adminrulecode,
      entityCode: data.entityCode,
      // c: data.c === "1" ? "Yes" : "No",
      c: data.c,
      r: data.r,
      u: data.u,
      d: data.d,
    },
    resolver: yupResolver(adminCrudFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const UpdateAdminCrud = useUpdateAdminCrud();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      admincrudcode: dataSubmit.admincrudcode,
      // c: dataSubmit.c === "Yes" ? "1" : "0",
      c: dataSubmit.c,
      r: dataSubmit.r,
      u: dataSubmit.u,
      d: dataSubmit.d,
    };

    if (data.type === "update") {
      const dataUpdate = {
        ...dataAdd,
        admincode: data.admincode,
        firstlogin: dataSubmit.firstloginpass,
      };
      console.log("dataUpdate => ", dataUpdate);
      UpdateAdminCrud.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateAdminCrud => ", response);

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
                {data.type} Admin CRUD
              </Text>
            </Box>

            <FormInput
              label="CRUD Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("admincrudcode", e.target.value);
                clearErrors("admincrudcode");
              }}
              id={"admincrudcode"}
              placeholder="CRUD Code"
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
              label="Rule Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("adminrulecode", e.target.value);
                clearErrors("adminrulecode");
              }}
              id={"adminrulecode"}
              placeholder="Rule Code"
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
              label="Entity Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("entityCode", e.target.value);
                clearErrors("entityCode");
              }}
              id={"entityCode"}
              placeholder="Entity Code"
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
            <FormDropDown3
              control={control}
              label="Create"
              autoFocus
              errors={errors}
              register={register}
              placeholder="Create"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(e) => {
                setValue("c", e.target.value);
                clearErrors("c");
              }}
              value={watch("c")}
              id={"c"}
              renderMenuItem={[
                { title: "No", value: "0" },
                { title: "Yes", value: "1" },
              ].map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            />

            <FormDropDown3
              control={control}
              label="Read"
              autoFocus
              errors={errors}
              register={register}
              placeholder="Read"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(e) => {
                setValue("r", e.target.value);
                clearErrors("r");
              }}
              id={"r"}
              value={watch("r")}
              renderMenuItem={[
                { title: "No", value: "0" },
                { title: "Yes", value: "1" },
              ].map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            />

            <FormDropDown3
              control={control}
              label="Update"
              autoFocus
              errors={errors}
              register={register}
              placeholder="Update"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(e) => {
                setValue("u", e.target.value);
                clearErrors("u");
              }}
              id={"u"}
              value={watch("u")}
              renderMenuItem={[
                { title: "No", value: "0" },
                { title: "Yes", value: "1" },
              ].map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            />

            <FormDropDown3
              control={control}
              label="Delete"
              autoFocus
              errors={errors}
              register={register}
              placeholder="Delete"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(e) => {
                setValue("d", e.target.value);
                clearErrors("d");
              }}
              id={"d"}
              value={watch("d")}
              renderMenuItem={[
                { title: "No", value: "0" },
                { title: "Yes", value: "1" },
              ].map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
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
