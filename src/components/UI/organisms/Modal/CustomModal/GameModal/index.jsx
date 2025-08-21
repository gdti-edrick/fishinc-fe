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
  useAddGame,
  useDeleteGame,
  useUpdateGame,
} from "../../../../../../api/game/mutation";
import { format } from "date-fns";

export default function GameModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_game: (
      <AddChangeGame
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

const gameFormSchema = yup.object().shape({
  gamecode: yup.string().required(),
  gamename: yup.string().required(),
  gamedesc: yup.string().required(),
  gamestart: yup.string().required(),
  gameend: yup.string().required(),
  gamepoint: yup.string().required(),
});

const AddChangeGame = ({ data, action }) => {
  console.log("data from game => ", data);
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
      gamecode: data.gamecode,
      gamename: data.gamename,
      gamedesc: data.gamedesc,
      gamestart: data.gamestart,
      gameend: data.gameend,
      gamepoint: data.gamepoint,
    },
    resolver: yupResolver(gameFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddGame = useAddGame();
  const UpdateGame = useUpdateGame();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      gamecode: dataSubmit.gamecode,
      gamename: dataSubmit.gamename,
      gamedesc: dataSubmit.gamedesc,
      // gamestart: dataSubmit.gamestart,
      gamestart: format(new Date(dataSubmit.gamestart), "dd-MM-yyyy HH:mm:ss"),
      gameend: format(new Date(dataSubmit.gameend), "dd-MM-yyyy HH:mm:ss"),
      // gameend: dataSubmit.gameend,
      gamepoint: dataSubmit.gamepoint,
    };

    if (data.type === "add") {
      AddGame.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddGame => ", response);

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
        gameindex: data.gameindex,
      };
      console.log("dataUpdate => ", dataUpdate);
      UpdateGame.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateGame => ", response);

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
                {data.type} Game
              </Text>
            </Box>

            <FormInput
              label="Game Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("gamecode", e.target.value);
                clearErrors("gamecode");
              }}
              id={"gamecode"}
              placeholder="Game Code"
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
              label="Game Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("gamename", e.target.value);
                clearErrors("gamename");
              }}
              id={"gamename"}
              placeholder="Game Name"
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
              label="Game Description"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("gamedesc", e.target.value);
                clearErrors("gamedesc");
              }}
              id={"gamedesc"}
              placeholder="Game Description"
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
              label="Game Start"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("gamestart", e.target.value);
                clearErrors("gamestart");
              }}
              id={"gamestart"}
              placeholder="Game Start"
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
              label="Game End"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("gameend", e.target.value);
                clearErrors("gameend");
              }}
              id={"gameend"}
              placeholder="Game End"
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
              label="Game Point"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("gamepoint", numericValue);
                clearErrors("gamepoint");
              }}
              id={"gamepoint"}
              placeholder="Game Point"
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
  console.log("data from game => ", data);

  const DeleteGame = useDeleteGame();

  const handleConfirm = () => {
    const dataValue = {
      gamecode: data.game_code,
      gamestatus: data.game_status === 1 ? "0" : "1",
      gamestatusstr: data.game_status_str === "active" ? "deactive" : "active",
    };

    DeleteGame.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteGame => ", response);

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
