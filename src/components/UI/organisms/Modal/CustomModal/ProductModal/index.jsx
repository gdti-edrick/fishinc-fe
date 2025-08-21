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
import { useDeleteUser } from "../../../../../../api/user/mutation";
import { usePointDetail } from "../../../../../../api/point/query";
import {
  useAddEvent,
  useAddEventDetail,
  useDeleteEvent,
  useDeleteEventDetail,
  useUpdateEvent,
  useUpdateEventDetail,
} from "../../../../../../api/event/mutation";
import { useDropdownVendor } from "../../../../../../api/dropdown/query";
import {
  useAddProduct,
  useAddProductStock,
  useDeleteProduct,
  useUpdateProduct,
} from "../../../../../../api/product/mutation";

export default function ProductModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    add_change_product: (
      <AddChangeProduct
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

    add_change_product_detail: (
      <AddChangeProductDetail
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

const productFormSchema = yup.object().shape({
  productcode: yup.string().required(),
  productname: yup.string().required(),
  productcategorycode: yup.string().required(),
  productpriceidr: yup.string().required(),
  productpricepoint: yup.string().required(),
});

const AddChangeProduct = ({ data, action }) => {
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
      productcode: data.productcode,
      productname: data.productname,
      productcategorycode: data.productcategorycode,
      productpriceidr: data.productpriceidr,
      productpricepoint: data.productpricepoint,
    },
    resolver: yupResolver(productFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const AddProduct = useAddProduct();
  const UpdateProduct = useUpdateProduct();

  const onSubmit = async (dataSubmit) => {
    const dataAdd = {
      productcode: dataSubmit.productcode,
      productname: dataSubmit.productname,
      productcategorycode: dataSubmit.productcategorycode,
      productpriceidr: dataSubmit.productpriceidr,
      productpricepoint: dataSubmit.productpricepoint,
    };

    if (data.type === "add") {
      AddProduct.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddProduct => ", response);

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
      };
      UpdateProduct.mutate(dataUpdate, {
        onSuccess: (response) => {
          console.log("UpdateProduct => ", response);

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
                {data.type} Product
              </Text>
            </Box>

            <FormInput
              label="Product Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("productcode", e.target.value);
                clearErrors("productcode");
              }}
              id={"productcode"}
              placeholder="Product Code"
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
              label="Product Name"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const uppercaseValue = e.target.value.toUpperCase();
                setValue("productname", uppercaseValue);
                clearErrors("productname");
              }}
              id={"productname"}
              placeholder="Product Name"
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
              label="Product Category"
              autoFocus
              errors={errors}
              register={register}
              id={"bookingduration"}
              placeholder="Product Category Code"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(value) => {
                setValue("productcategorycode", value);
                clearErrors("productcategorycode");
              }}
              listDropdown={[
                {
                  item: "FNB",
                },
                {
                  item: "GOODS",
                },
              ]}
              keyFilter="item"
            />

            {/* <FormInput
              label="Product Category Code"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("productcategorycode", e.target.value);
                clearErrors("productcategorycode");
              }}
              id={"productcategorycode"}
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
            /> */}

            <FormInput
              label="Product Price Idr"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("productpriceidr", e.target.value);
                clearErrors("productpriceidr");
              }}
              id={"productpriceidr"}
              placeholder="Product Price Idr"
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
              label="Product Price Point"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                setValue("productpricepoint", e.target.value);
                clearErrors("productpricepoint");
              }}
              id={"productpricepoint"}
              placeholder="Product Price Point"
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
// const DetailsEvent = ({ data, action, closed }) => {
//   console.log("data from point => ", data);

//   const additionalParams = useMemo(() => {
//     const params = {};

//     Object.assign(params, {
//       userfullname: data?.userfullname,
//     });
//     Object.assign(params, {
//       userdisplayname: data?.userdisplayname,
//     });
//     Object.assign(params, {
//       userphone: data?.userphone,
//     });

//     return params;
//   }, []);

//   const queryParams = {
//     params: additionalParams,
//   };

//   const { data: dataPointDetail } = usePointDetail(queryParams);

//   const dataDetail = useMemo(() => dataPointDetail?.data[0], [dataPointDetail]);
//   console.log("dataDetail => ", dataDetail);

//   const onSubmit = async (dataSubmit) => {
//     action({ type: "success" });
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
//         overflowY: { xs: "auto", sm: "auto" },
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <Box
//         sx={{
//           height: "500px",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           backgroundColor: "white",
//           borderRadius: "33px",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "8px",
//           }}
//         >
//           <Box sx={{ marginBottom: "8px" }}>
//             <Text
//               sx={{
//                 fontSize: "24px",
//                 fontWeight: 700,
//                 color: "#FDB614",
//                 textTransform: "capitalize",
//               }}
//             >
//               Point Details
//             </Text>
//           </Box>

//           <InLineInput
//             label="Point Code"
//             value={dataDetail?.point_code}
//             disabled
//           />
//           <InLineInput
//             label="Point Total Before"
//             value={dataDetail?.point_total_before}
//             disabled
//           />
//           <InLineInput
//             label="Point Sum"
//             value={dataDetail?.point_sum}
//             disabled
//           />
//           <InLineInput
//             label="Point Total After"
//             value={dataDetail?.point_total_after}
//             disabled
//           />
//           <InLineInput
//             label="Event Code"
//             value={dataDetail?.event_code || "-"}
//             disabled
//           />
//           <InLineInput
//             label="Point Reference"
//             value={dataDetail?.point_ref || "-"}
//             disabled
//           />
//           <InLineInput
//             label="Point Created"
//             value={new Date(dataDetail?.point_created).toLocaleString()}
//             disabled
//           />
//         </Box>

//         <SubmitButton
//           title="Close"
//           onClick={closed}
//           style={{ borderRadius: "8px", backgroundColor: "#231F20" }}
//           sx={{ padding: "8px 16px" }}
//           textStyle={{
//             fontSize: "18px",
//             fontWeight: 600,
//             color: "#FDB614",
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

const Confirmation = ({ data, action }) => {
  console.log("data from user => ", data);

  const DeleteProduct = useDeleteProduct();

  const handleConfirm = () => {
    const dataValue = {
      // type: "confirm_delete",
      productcode: data.product_code,
      productstatus: data.product_status === 1 ? "0" : "1",
      productstatusstr:
        data.product_status_str === "active" ? "deactive" : "active",
    };

    DeleteProduct.mutate(dataValue, {
      onSuccess: (response) => {
        console.log("DeleteProduct => ", response);

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

const productDetailFormSchema = yup.object().shape({
  productcode: yup.string().required(),
  productname: yup.string().required(),
  vendorcode: yup.string().required(),
  productstockdesc: yup.string().required(),
  productstockqty: yup.string().required(),
  productstockbuy: yup.string().required(),
  productstockdiscount: yup.string().required(),
});

const AddChangeProductDetail = ({ data, action }) => {
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
      productcode: data.productcode,
      productname: data.productname,
      vendorcode: data.vendorcode,
      productstockdesc: data.productstockdesc,
      productstockqty: data.productstockqty,
      productstockbuy: data.productstockbuy,
      productstockdiscount: data.productstockdiscount,
    },
    resolver: yupResolver(productDetailFormSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const { data: dataDropdown } = useDropdownVendor({
    params: {
      page: 1,
      limit: 1000,
    },
  });

  const listDropdown = useMemo(() => dataDropdown?.data || [], [dataDropdown]);

  const AddProductStock = useAddProductStock();

  const onSubmit = async (dataSubmit) => {
    console.log("TEST");
    const dataAdd = {
      productcode: data.productcode,
      vendorcode: dataSubmit.vendorcode,
      productstockdesc: dataSubmit.productstockdesc,
      productstockqty: dataSubmit.productstockqty,
      productstockbuy: dataSubmit.productstockbuy,
      productstockdiscount: dataSubmit.productstockdiscount,
    };

    if (data.type === "add") {
      AddProductStock.mutate(dataAdd, {
        onSuccess: (response) => {
          console.log("AddProductStock => ", response);

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
            // height: "780px",
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
                {data.type} Product Stock
              </Text>
            </Box>

            <FormInput
              label="Product Code"
              autoFocus
              errors={errors}
              register={register}
              disabled
              onChange={(e) => {
                setValue("productcode", e.target.value);
                clearErrors("productcode");
              }}
              id={"productcode"}
              placeholder="Product Code"
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
              label="Product Name"
              autoFocus
              errors={errors}
              register={register}
              disabled
              onChange={(e) => {
                setValue("productname", e.target.value);
                clearErrors("productname");
              }}
              id={"productname"}
              placeholder="Product Name"
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
              label="Vendor Code"
              autoFocus
              errors={errors}
              register={register}
              id={"vendorcode"}
              placeholder="Vendor Code"
              labelStyle={{
                fontSize: "14px",
                color: "#565D6A",
              }}
              onChange={(value) => {
                setValue("vendorcode", value);
              }}
              listDropdown={listDropdown}
              keyFilter="vendor_code"
            />

            <FormInput
              label="Product Stock Quantity"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9-]/g, "");
                setValue("productstockqty", numericValue);
                clearErrors("productstockqty");
              }}
              id={"productstockqty"}
              placeholder="Product Stock Quantity"
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
              label="Product Stock Buy"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setValue("productstockbuy", numericValue);
                clearErrors("productstockbuy");
              }}
              id={"productstockbuy"}
              placeholder="Product Stock Buy"
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
              label="Product Stock Discount"
              autoFocus
              errors={errors}
              register={register}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9-]/g, "");
                setValue("productstockdiscount", numericValue);
                clearErrors("productstockdiscount");
              }}
              id={"productstockdiscount"}
              placeholder="Product Stock Discount"
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
                setValue("productstockdesc", e.target.value);
                clearErrors("productstockdesc");
              }}
              id={"productstockdesc"}
              placeholder="Note"
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
      eventpointstatus: "0",
      eventpointstatusstr: "deactive",
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
