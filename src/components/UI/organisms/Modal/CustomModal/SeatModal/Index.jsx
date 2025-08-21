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
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../../../../api/user/mutation";
import { useForceStop } from "../../../../../../api/seat/mutation";

export default function SeatModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    // add_change_user: (
    //   <AddChangeUser
    //     data={modalData}
    //     closed={modalClosed}
    //     action={action}
    //     // setVisible={() => shouldModalOpen(false)}
    //   />
    // ),
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

// const userFormSchema = yup.object().shape({
//   userfullname: yup.string().required(),
//   userdisplayname: yup.string().required(),
//   usercountrycode: yup.string().required(),
//   userphone: yup
//     .string()
//     .matches(/^\d+$/, "phone must contain only digits")
//     .min(10, "phone must be at least 10 digits")
//     .max(15, "phone must be at most 15 digits")
//     .required("phone is required"),
//   useremail: yup.string(),
// });

// const AddChangeUser = ({ data, action }) => {
//   console.log("data from user => ", data);
//   const {
//     register,
//     handleSubmit,
//     formState,
//     watch,
//     setValue,
//     clearErrors,
//     setError,
//   } = useForm({
//     defaultValues: {
//       userfullname: data.userfullname,
//       userdisplayname: data.userdisplayname,
//       usercountrycode: data.usercountrycode,
//       userphone: data.userphone,
//       useremail: data.useremail,
//     },
//     resolver: yupResolver(userFormSchema),
//   });
//   const { errors } = formState;

//   const [errorMessage, setErrorMessage] = useState("");

//   const AddUser = useAddUser();
//   const UpdateUser = useUpdateUser();

//   const onSubmit = async (dataSubmit) => {
//     // alert("submit");
//     const dataAdd = {
//       // type: data.type,
//       userfullname: dataSubmit.userfullname,
//       userdisplayname: dataSubmit.userfullname, //isi default mengikuti userfullname
//       usercountrycode: dataSubmit.usercountrycode, //kode negara tanpa "+"
//       userphone: dataSubmit.userphone, //nomor tanpa 0 atau kode negara
//       useremail: dataSubmit.useremail, //optional tapi s
//     };

//     if (data.type === "add") {
//       AddUser.mutate(dataAdd, {
//         onSuccess: (response) => {
//           console.log("AddUser => ", response);

//           if (response.status.status === 1) {
//             action({ type: "add_success" });
//           } else {
//             setErrorMessage(response.status.message[0].errormessage || "Sistem Error please contact the administrator");
//           }
//         },
//       });
//     }
//     if (data.type === "update") {
//       const dataUpdate = {
//         ...dataAdd,
//         usercode: data.usercode,
//       };
//       console.log("dataUpdate => ", dataUpdate);
//       UpdateUser.mutate(dataUpdate, {
//         onSuccess: (response) => {
//           console.log("UpdateUser => ", response);

//           if (response.status.status === 1) {
//             action({ type: "add_success" });
//           } else {
//             setErrorMessage(response.status.message[0].errormessage || "Sistem Error please contact the administrator");
//           }
//         },
//       });
//     }

//     // action(dataValue);
//   };

//   return (
//     <Box
//       sx={{
//         minWidth: {
//           xs: "300px",
//           sm: "520px",
//           md: "600px",
//           lg: "660px",
//         },
//         // aspectRatio: { xs: 23 / 23, sm: 23 / 18, md: 23 / 18, lg: 23 / 18 },
//         // overflow: "hidden",
//         overflowY: { xs: "auto", sm: "auto" },
//         // padding: { xs: "20px", sm: "24px", md: "32px" },
//         // overflow: "scroll",
//         // "-ms-overflow-style": "none",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
//         <Box
//           sx={{
//             height: "500px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             backgroundColor: "white",
//             borderRadius: "33px",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               // gap: "8px",
//             }}
//           >
//             <Box sx={{ marginBottom: "8px" }}>
//               <Text
//                 sx={{
//                   fontSize: "24px",
//                   fontWeight: 700,
//                   color: "#FDB614",
//                   textTransform: "capitalize",
//                 }}
//               >
//                 {data.type} User
//               </Text>
//             </Box>

//             <FormInput
//               label="User Full Name"
//               autoFocus
//               errors={errors}
//               register={register}
//               onChange={(e) => {
//                 setValue("userfullname", e.target.value);
//                 setValue("userdisplayname", e.target.value);
//                 // setUsername(e.target.value);
//                 clearErrors("userfullname");
//               }}
//               id={"userfullname"}
//               placeholder="User Full Name"
//               labelStyle={{
//                 fontSize: "16px",
//               }}
//               inputStyle={{
//                 "& .MuiInputBase-root": {
//                   borderRadius: 100,
//                   padding: "0px",
//                   border: "1px solid #010101",
//                 },
//                 "& .MuiInputBase-input": {
//                   padding: "9px 16px 9px 16px",
//                 },
//               }}
//               abdormentStyle={{
//                 paddingRight: "28px",
//               }}
//             />

//             <FormInput
//               label="Country Code"
//               autoFocus
//               errors={errors}
//               register={register}
//               onChange={(e) => {
//                 const numericValue = e.target.value.replace(/\D/g, "");
//                 setValue("usercountrycode", numericValue);
//                 // setUsername(e.target.value);
//                 clearErrors("usercountrycode");
//               }}
//               id={"usercountrycode"}
//               placeholder="Country Code"
//               labelStyle={{
//                 fontSize: "16px",
//               }}
//               inputStyle={{
//                 "& .MuiInputBase-root": {
//                   borderRadius: 100,
//                   padding: "0px",
//                   border: "1px solid #010101",
//                 },
//                 "& .MuiInputBase-input": {
//                   padding: "9px 16px 9px 16px",
//                 },
//               }}
//               abdormentStyle={{
//                 paddingRight: "28px",
//               }}
//             />

//             <FormInput
//               label="Phone Number"
//               autoFocus
//               errors={errors}
//               register={register}
//               onChange={(e) => {
//                 const numericValue = e.target.value.replace(/\D/g, "");
//                 setValue("userphone", numericValue);
//                 // setValue("phone", e.target.value);
//                 // setPhone(e.target.value);
//                 clearErrors("userphone");
//               }}
//               id={"userphone"}
//               placeholder="WhatsApp phone number"
//               labelStyle={{
//                 fontSize: "16px",
//               }}
//               inputStyle={{
//                 "& .MuiInputBase-root": {
//                   borderRadius: 100,
//                   padding: "0px",
//                   border: "1px solid #010101",
//                 },
//                 "& .MuiInputBase-input": {
//                   padding: "9px 16px 9px 16px",
//                 },
//               }}
//               abdormentStyle={{
//                 paddingRight: "28px",
//               }}
//             />

//             <FormInput
//               label="Email (Optional)"
//               autoFocus
//               errors={errors}
//               register={register}
//               onChange={(e) => {
//                 setValue("useremail", e.target.value);
//                 clearErrors("useremail");
//               }}
//               id={"useremail"}
//               placeholder="User Email"
//               labelStyle={{
//                 fontSize: "16px",
//               }}
//               inputStyle={{
//                 "& .MuiInputBase-root": {
//                   borderRadius: 100,
//                   padding: "0px",
//                   border: "1px solid #010101",
//                 },
//                 "& .MuiInputBase-input": {
//                   padding: "9px 16px 9px 16px",
//                 },
//               }}
//               abdormentStyle={{
//                 paddingRight: "28px",
//               }}
//             />
//           </Box>

//           <Text sx={{ color: "red", marginTop: "-10px" }}>{errorMessage}</Text>

//           <SubmitButton
//             title="Submit"
//             onClick={handleSubmit(onSubmit)}
//             style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
//             sx={{ padding: "8px 16px" }}
//             textStyle={{
//               fontSize: "18px",
//               fontWeight: 600,
//               color: "#FDB614",
//             }}
//           />
//         </Box>
//       </form>
//     </Box>
//   );
// };

const Confirmation = ({ data, action }) => {
  console.log("data from seat => ", data);

  const [errorMessage, setErrorMessage] = useState("");

  const ForceStop = useForceStop();

  const handleConfirm = () => {
    const dataValue = {
      seatcode: data.seat_code,
    };

    ForceStop.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("ForceStop => ", response);

        if (response.status.status === 1) {
          action({ type: "delete_success" });
        } else {
          setErrorMessage(response?.status?.message[0].errormessage);
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

      <Text sx={{ color: "red", marginTop: "-10px" }}>{errorMessage}</Text>

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
