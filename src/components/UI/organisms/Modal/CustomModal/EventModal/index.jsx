import Box from "@mui/material/Box";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import { FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddEvent,
  useAddEventDetail,
  useDeleteEvent,
  useDeleteEventDetail,
  useUpdateEvent,
  useUpdateEventDetail,
} from "../../../../../../api/event/mutation";
import { convertToCustomDateTime } from "../../../../../../utils/utils/formatString";

export default function EventModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_event: (
      <AddChangeEvent
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

    add_change_event_detail: (
      <AddChangeEventDetail
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    confirmation_detail: (
      <ConfirmationDetail
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

const eventFormSchema = yup.object().shape({
  eventcode: yup.string().required(),
  eventname: yup.string().required(),
  eventdesc: yup.string(),
  eventstart: yup.string().required(),
  eventend: yup.string().required(),
  // eventprice: yup.string().required(),
  eventprice: yup
    .string()
    .required()
    .test("min", ".........Minimum is Rp 10.000", (value) => {
      const numValue = parseInt(value);
      return numValue >= 10000;
    }),
  eventdiscount: yup.string().required(),
});

const AddChangeEvent = ({ data, action }) => {
  console.log("data from event => ", data);
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
      eventcode: data.eventcode,
      eventname: data.eventname,
      eventdesc: data.eventdesc,
      eventstart: data.eventstart,
      eventend: data.eventend,
      eventprice: data.eventprice,
      eventdiscount: data.eventdiscount,
    },
    resolver: yupResolver(eventFormSchema),
  });
  const { errors } = formState;

  console.log("eventstart => ", watch("eventstart"));

  const [errorMessage, setErrorMessage] = useState("");

  const AddEvent = useAddEvent();
  const UpdateEvent = useUpdateEvent();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      eventcode: dataSubmit.eventcode,
      eventname: dataSubmit.eventname,
      eventdesc: dataSubmit.eventdesc,
      eventstart: convertToCustomDateTime(dataSubmit.eventstart),
      eventend: convertToCustomDateTime(dataSubmit.eventend),
      eventprice: dataSubmit.eventprice,
      eventdiscount: dataSubmit.eventdiscount,
    };

    if (data.type === "add") {
      AddEvent.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddEvent => ", response);

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
        eventindex: data.eventindex,
      };
      UpdateEvent.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateEvent => ", response);

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
            height: "740px",
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
                {data.type} Event
              </Text>
            </Box>

            <FormInput
              label="Event Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("eventcode", e.target.value);
                clearErrors("eventcode");
              }}
              id={"eventcode"}
              placeholder="Event Code"
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
              label="Event Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("eventname", e.target.value);
                clearErrors("eventname");
              }}
              id={"eventname"}
              placeholder="Event Name"
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
              label="Event Decription (Optional)"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("eventdesc", e.target.value);
                clearErrors("eventdesc");
              }}
              id={"eventdesc"}
              placeholder="Event Decription"
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
              label="Event Start"
              type="date"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("eventstart", e.target.value);
                clearErrors("eventstart");
              }}
              id={"eventstart"}
              placeholder="Event Start"
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
              label="Event End"
              type="date"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("eventend", e.target.value);
                clearErrors("eventend");
              }}
              id={"eventend"}
              placeholder="Event End"
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
              label="Event Price"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("eventprice", numericValue);
                clearErrors("eventprice");
              }}
              id={"eventprice"}
              placeholder="Event Price"
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
              label="Event Discount"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("eventdiscount", numericValue);
                clearErrors("eventdiscount");
              }}
              id={"eventdiscount"}
              placeholder="Event Discount"
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
  console.log("data from event => ", data);

  const DeleteEvent = useDeleteEvent();

  const handleConfirm = () => {
    const dataValue = {
      // type: "confirm_delete",
      eventcode: data.event_code,
      eventstatus: data.event_status === 1 ? "0" : "1",
      eventstatusstr:
        data.event_status_str === "active" ? "deactive" : "active",
    };

    DeleteEvent.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteEvent => ", response);

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

const eventDetailFormSchema = yup.object().shape({
  eventcode: yup.string().required(),
  eventpointminweight: yup.string().required(),
  eventpointmaxweight: yup.string().required(),
  eventpointsumpoint: yup.string().required(),
});

const AddChangeEventDetail = ({ data, action }) => {
  console.log("data from event detail => ", data);
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
      eventcode: data.eventcode,
      eventpointminweight: data.eventpointminweight,
      eventpointmaxweight: data.eventpointmaxweight,
      eventpointsumpoint: data.eventpointsumpoint,
    },
    resolver: yupResolver(eventDetailFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddEventDetail = useAddEventDetail();
  const UpdateEventDetail = useUpdateEventDetail();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      eventcode: data.eventcode,
      eventpointminweight: dataSubmit.eventpointminweight,
      eventpointmaxweight: dataSubmit.eventpointmaxweight,
      eventpointsumpoint: dataSubmit.eventpointsumpoint,
    };

    if (data.type === "add") {
      AddEventDetail.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddEventDetail => ", response);

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
        eventpointcode: data.eventpointcode,
      };
      UpdateEventDetail.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateEventDetail => ", response);

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
            height: "740px",
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
                {data.type} Event Point
              </Text>
            </Box>

            <FormInput
              label="Event Code"
              autoFocus
              errors={errors}
              register={register}
              disabled
              onChange={(e) => {
                setValue("eventcode", e.target.value);
                clearErrors("eventcode");
              }}
              id={"eventcode"}
              placeholder="Event Code"
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
              label="Min Weight"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("eventpointminweight", numericValue);
                clearErrors("eventpointminweight");
              }}
              id={"eventpointminweight"}
              placeholder="Min Weight"
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
              label="Max Weight"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("eventpointmaxweight", numericValue);
                clearErrors("eventpointmaxweight");
              }}
              id={"eventpointmaxweight"}
              placeholder="Max Weight"
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
              label="Sum Point"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("eventpointsumpoint", numericValue);
                clearErrors("eventpointsumpoint");
              }}
              id={"eventpointsumpoint"}
              placeholder="Sum Point"
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

const ConfirmationDetail = ({ data, action }) => {
  console.log("data from user => ", data);

  const DeleteEventDetail = useDeleteEventDetail();

  const handleConfirm = () => {
    const dataValue = {
      eventpointcode: data.event_point_code,
      eventpointstatus: data.event_point_status === 1 ? "0" : "1",
      eventpointstatusstr:
        data.event_point_status_str === "active" ? "deactive" : "active",
    };

    DeleteEventDetail.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteEventDetail => ", response);

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
