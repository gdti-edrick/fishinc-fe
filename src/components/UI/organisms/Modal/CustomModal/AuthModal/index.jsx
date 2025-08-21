import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import "./style.css";
import BasicModal from "../..";
import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";

export default function AuthModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = false,
}) {
  const typeModal = {
    success_email_verification: (
      <SuccessEmailVerif
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    success_change_password: (
      <SuccessChangePassword
        data={modalData}
        closed={modalClosed}
        action={action}
        // setVisible={() => shouldModalOpen(false)}
      />
    ),
    success_registration: (
      <SuccessRegistration
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

const SuccessEmailVerif = ({ data, action }) => {
  const { status } = data;
  return (
    <Box
      sx={{
        width: {
          xs: "300px",
          sm: "420px",
          md: "500px",
          lg: "560px",
        },
        aspectRatio: { xs: 23 / 23, sm: 23 / 18, md: 23 / 18, lg: 23 / 18 },
        // overflow: "hidden",
        overflowY: { xs: "auto", sm: "auto" },
        padding: { xs: "20px", sm: "24px", md: "32px" },
        // overflow: "scroll",
        // "-ms-overflow-style": "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ padding: { xs: "5px", sm: "10px", md: "15px" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "100px", sm: "120px", md: "140px", lg: "150px" },
            height: { xs: "100px", sm: "120px", md: "140px", lg: "150px" },
            borderRadius: "90px",
            backgroundColor: status ? "#0085FF" : "#DF0404",
          }}
        >
          {status ? (
            <CheckIcon
              sx={{
                color: "white",
                width: { xs: "80px", sm: "90px", md: "110px", lg: "120px" },
                height: { xs: "80px", sm: "90px", md: "110px", lg: "120px" },
              }}
            />
          ) : (
            <PriorityHighIcon
              sx={{
                color: "white",
                width: { xs: "80px", sm: "90px", md: "110px", lg: "120px" },
                height: { xs: "80px", sm: "90px", md: "110px", lg: "120px" },
              }}
            />
          )}
        </Box>
      </Box>
      <Text
        sx={{ fontSize: { xs: "20px", sm: "24px", md: "28px", lg: "32px" } }}
        fontWeight={700}
      >
        {status ? "Email Verification Succes" : data.message[0].errormessage}
      </Text>
      <Text
        variant={"body1"}
        fontWeight={500}
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "20px" },
          mt: { xs: "16px", sm: "18px", md: "24px" },
        }}
      >
        Please Check to your email
      </Text>
      <Text
        variant={"body1"}
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "20px" },
          textAlign: "center",
        }}
        fontWeight={500}
      >
        <span style={{ color: "#0085FF" }}>contact.uiuxexperts@gmail.com</span>{" "}
        for verification.
      </Text>
      <BasicButton
        onClick={() => action({ status })}
        fullWidth
        sx={{
          marginTop: { xs: "30px", sm: "30px", md: "45px", lg: "80px" },
          padding: { xs: "8px 6px", sm: "12px 8px", md: "16px 12px" },
          backgroundColor: "#0085FF",
          borderRadius: "8px",
          color: "white",

          ":hover": {
            bgcolor: "primary.main",
            color: "white",
          },
        }}
      >
        <Text variant={"h5"} fontWeight={500}>
          {status ? "Confirm" : "Resend"}
        </Text>
      </BasicButton>
    </Box>
  );
};

const SuccessChangePassword = ({ action }) => {
  return (
    <Box
      sx={{
        width: {
          xs: "300px",
          sm: "370px",
          md: "500px",
          lg: "560px",
        },
        // aspectRatio: 23 / 18,
        // overflow: "hidden",
        overflowY: { xs: "auto", sm: "auto" },
        padding: "32px",
        // overflow: "scroll",
        // "-ms-overflow-style": "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SvgIcon
        sx={{
          width: "180px",
          height: "180px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
        >
          <path
            d="M90 15C48.675 15 15 48.675 15 90C15 131.325 48.675 165 90 165C131.325 165 165 131.325 165 90C165 48.675 131.325 15 90 15ZM125.85 72.75L83.325 115.275C82.275 116.325 80.85 116.925 79.35 116.925C77.85 116.925 76.425 116.325 75.375 115.275L54.15 94.05C51.975 91.875 51.975 88.275 54.15 86.1C56.325 83.925 59.925 83.925 62.1 86.1L79.35 103.35L117.9 64.8C120.075 62.625 123.675 62.625 125.85 64.8C128.025 66.975 128.025 70.5 125.85 72.75Z"
            fill="#0085FF"
          />
        </svg>
      </SvgIcon>
      <Text variant={"h4"} fontWeight={700}>
        Change Password Succes
      </Text>
      <Text variant={"body1"} fontWeight={500} sx={{ mt: "24px" }}>
        Please go to login page
      </Text>
      <BasicButton
        fullWidth
        onClick={() => action({ type: "success" })}
        sx={{
          marginTop: "40px",
          padding: "16px 12px",
          backgroundColor: "#0085FF",
          borderRadius: "8px",
          color: "white",

          ":hover": {
            bgcolor: "primary.main",
            color: "white",
          },
        }}
      >
        <Text variant={"h5"} fontWeight={500}>
          Confirm
        </Text>
      </BasicButton>
    </Box>
  );
};

const SuccessRegistration = ({ data, action }) => {
  return (
    <Box
      sx={{
        width: {
          xs: "300px",
          sm: "370px",
          md: "500px",
          lg: "560px",
        },
        aspectRatio: 23 / 18,
        // overflow: "hidden",
        overflowY: { xs: "auto", sm: "auto" },
        padding: "32px",
        // overflow: "scroll",
        // "-ms-overflow-style": "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SvgIcon
        sx={{
          width: "180px",
          height: "180px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
        >
          <path
            d="M90 15C48.675 15 15 48.675 15 90C15 131.325 48.675 165 90 165C131.325 165 165 131.325 165 90C165 48.675 131.325 15 90 15ZM125.85 72.75L83.325 115.275C82.275 116.325 80.85 116.925 79.35 116.925C77.85 116.925 76.425 116.325 75.375 115.275L54.15 94.05C51.975 91.875 51.975 88.275 54.15 86.1C56.325 83.925 59.925 83.925 62.1 86.1L79.35 103.35L117.9 64.8C120.075 62.625 123.675 62.625 125.85 64.8C128.025 66.975 128.025 70.5 125.85 72.75Z"
            fill="#0085FF"
          />
        </svg>
      </SvgIcon>
      <Text variant={"h4"} fontWeight={700}>
        Registration Succes
      </Text>
      <Text variant={"body1"} fontWeight={500} sx={{ mt: "24px" }}>
        Please Check to your email
      </Text>
      <Text variant={"body1"} fontWeight={500}>
        <span style={{ color: "#0085FF" }}>{data.email}</span> for verification.
      </Text>
      <BasicButton
        fullWidth
        onClick={() => action()}
        sx={{
          marginTop: "80px",
          padding: "16px 12px",
          backgroundColor: "#0085FF",
          borderRadius: "8px",
          color: "white",

          ":hover": {
            bgcolor: "primary.main",
            color: "white",
          },
        }}
      >
        <Text variant={"h5"} fontWeight={500}>
          Confirm
        </Text>
      </BasicButton>
    </Box>
  );
};
