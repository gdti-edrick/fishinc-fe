import Box from "@mui/material/Box";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import {
  CustomInput,
  FormDropDown,
  FormInput,
  InLineInput,
} from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../../../../api/user/mutation";
import { useScaleList } from "../../../../../../api/scale/query";
import { MenuItem } from "@mui/material";
import { useAddWeight } from "../../../../../../api/weight/mutation";
import { useDropdownGameCode } from "../../../../../../api/dropdown/query";
import { useAddPoint } from "../../../../../../api/point/mutation";
import { usePointDetail } from "../../../../../../api/point/query";

export default function PointModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_point: (
      <AddChangePoint
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    details_point: (
      <DetailsPoint
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

const pointFormSchema = yup.object().shape({
  userphone: yup
    .string()
    .matches(/^\d+$/, "phone must contain only digits")
    .min(5, "phone must be at least 5 digits")
    .max(15, "phone must be at most 15 digits")
    .required("phone is required"),
  userfullname: yup.string().required(),
  userdisplayname: yup.string().required(),
  pointsum: yup.string().required(),
  eventcode: yup.string().required(),
  pointref: yup.string().required(),
  gamecode: yup.string().required(),
});

const AddChangePoint = ({ data, action }) => {
  console.log("data from point => ", data);
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
      userphone: data.userphone,
      userfullname: data.userfullname,
      userdisplayname: data.userdisplayname,
      pointsum: data.pointsum,
      eventcode: data.eventcode,
      pointref: data.pointref,
      gamecode: data.gamecode,
    },
    resolver: yupResolver(pointFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddPoint = useAddPoint();

  const { data: dataDropdown } = useDropdownGameCode({
    params: {
      page: 1,
      limit: 1000,
    },
  });

  const listDropdown = useMemo(
    () => [{ game_code: "-" }, ...(dataDropdown?.data || [])],
    [dataDropdown]
  );

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      userphone: dataSubmit.userphone,
      userfullname: dataSubmit.userfullname,
      userdisplayname: dataSubmit.userdisplayname,
      pointsum: dataSubmit.pointsum,
      eventcode: dataSubmit.eventcode,
      pointref: dataSubmit.pointref,
      gamecode: dataSubmit.gamecode,
    };

    if (data.type === "add") {
      AddPoint.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddPoint => ", response);

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
                {data.type} Point
              </Text>
            </Box>

            <FormInput
              label="User Full Name"
              autoFocus
              errors={errors}
              register={register}
              disabled
              onChange={(e) => {
                setValue("userfullname", e.target.value);
                clearErrors("userfullname");
              }}
              id={"userfullname"}
              placeholder="User Full Name"
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
              label="User Disply Name"
              autoFocus
              errors={errors}
              register={register}
              disabled
              onChange={(e) => {
                setValue("userdisplayname", e.target.value);
                clearErrors("userdisplayname");
              }}
              id={"userdisplayname"}
              placeholder="User Disply Name"
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
              label="Phone Number"
              autoFocus
              errors={errors}
              register={register}
              disabled
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("userphone", numericValue);
                clearErrors("userphone");
              }}
              id={"userphone"}
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

            <FormDropDown
              control={control}
              label="Event Code"
              autoFocus
              errors={errors}
              register={register}
              id={"eventcode"}
              placeholder="Event Code"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              // onChange={(value) => {
              //   setValue("bookingduration", value);
              //   setDuration(value);
              // }}
              onChange={(value) => {
                setValue("eventcode", value);
                clearErrors("eventcode");
              }}
              listDropdown={[
                {
                  event: "-",
                },
                {
                  event: "DEFAULT",
                },
              ]}
              keyFilter="event"
            />

            <FormDropDown
              control={control}
              label="Game Code"
              autoFocus
              errors={errors}
              register={register}
              id={"gamecode"}
              placeholder="Game Code"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(value) => {
                setValue("gamecode", value);
                // setUserfullname(value);
              }}
              listDropdown={listDropdown}
              keyFilter="game_code"
            />

            <FormInput
              label="Point Sum"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                let value = e.target.value;
                const sanitized = value.replace(/[^-\d]/g, "");
                if (sanitized.includes("-")) {
                  value = "-" + sanitized.replace(/-/g, "").replace(/^0+/, "");
                } else {
                  value = sanitized.replace(/^0+/, "");
                }

                setValue("pointsum", value);
                clearErrors("pointsum");
              }}
              id={"pointsum"}
              placeholder="Point Sum"
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
              label="Note"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("pointref", e.target.value);
                clearErrors("pointref");
              }}
              id={"pointref"}
              placeholder="Point Ref"
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
const DetailsPoint = ({ data, action, closed }) => {
  console.log("data from point => ", data);

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      userfullname: data?.userfullname,
    });
    Object.assign(params, {
      userdisplayname: data?.userdisplayname,
    });
    Object.assign(params, {
      userphone: data?.userphone,
    });

    return params;
  }, []);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataPointDetail } = usePointDetail(queryParams);

  const dataDetail = useMemo(() => dataPointDetail?.data[0], [dataPointDetail]);
  console.log("dataDetail => ", dataDetail);

  const onSubmit = async (dataSubmit) => {
    action({ type: "success" });
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
            gap: "8px",
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
              Point Details
            </Text>
          </Box>

          <InLineInput
            label="Point Code"
            value={dataDetail?.point_code}
            disabled
          />
          <InLineInput
            label="Point Total Before"
            value={dataDetail?.point_total_before}
            disabled
          />
          <InLineInput
            label="Point Sum"
            value={dataDetail?.point_sum}
            disabled
          />
          <InLineInput
            label="Point Total After"
            value={dataDetail?.point_total_after}
            disabled
          />
          <InLineInput
            label="Event Code"
            value={dataDetail?.event_code || "-"}
            disabled
          />
          <InLineInput
            label="Point Reference"
            value={dataDetail?.point_ref || "-"}
            disabled
          />
          <InLineInput
            label="Point Created"
            value={new Date(dataDetail?.point_created).toLocaleString()}
            disabled
          />
        </Box>

        <SubmitButton
          title="Close"
          onClick={closed}
          style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
          sx={{ padding: "8px 16px" }}
          textStyle={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#FDB614",
          }}
        />
      </Box>
    </Box>
  );
};

const Confirmation = ({ data, action }) => {
  console.log("data from detail point => ", data);

  const DeleteUser = useDeleteUser();

  const handleConfirm = () => {
    const dataValue = {
      // type: "confirm_delete",
      usercode: data.user_code,
      userstatus: "0",
      userstatusstr: "deactive",
    };

    DeleteUser.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteUser => ", response);

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
