import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Text } from "../../components/UI/atoms/Typography";
import {
  FormDropDown,
  FormInput,
} from "../../components/UI/molecules/CustomInput";
import { SubmitButton } from "../../components/UI/molecules/Button";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";
import { BasicDropDown } from "../../components/UI/atoms/BasicInput";
import HomeModal from "../../components/UI/organisms/Modal/CustomModal/HomeModal";
import { useRedeemCode, useRedeemSearchList } from "../../api/redeem/query";
import { useRedeemAdd, useRedeemSearch } from "../../api/redeem/mutation";
import PointComponent from "./PointComponent";
import { Delete } from "@mui/icons-material";

const userFormSchema = yup.object().shape({
  productcode: yup.string().required(),
});

const RedeemTab = () => {
  const {
    control,
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      productcode: "",
    },
    resolver: yupResolver(userFormSchema),
  });
  const { errors } = formState;

  const productInputRef = useRef(null);
  const timeoutRef = useRef(null); // Ref for timeout control

  const [pointUser, setPointUser] = useState("0");

  const [tempData, setTempData] = useState([]);
  const [transactionmethod, setTransactionmethod] = useState("POINT");
  const [errorMessage, setErrorMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const [userfullname, setUserfullname] = useState("");
  const [userdisplayname, setUserdisplayname] = useState("");
  const [userphone, setUserphone] = useState("");
  const [usercountrycode, setUsercountrycode] = useState("62");
  const [usercountry, setUsercountry] = useState("");
  const [productcode, setProductcode] = useState("");

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      productcode: productcode.toUpperCase(),
    });

    return params;
  }, [productcode]);

  const queryParams = {
    params: additionalParams,
  };

  useEffect(() => {
    if (productInputRef.current) {
      productInputRef.current.focus(); // Auto-focus when component mounts
    }
  }, []);

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => {
      if (productInputRef.current && !modalVisible) {
        productInputRef.current.focus();
      }
    }, 3000); // Set timeout for 1 second
  };

  const handleFocus = () => {
    clearTimeout(timeoutRef.current); // Clear timeout when input regains focus
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item action => ", item);
    switch (item.type) {
      case "add_redeem_success":
        setModalVisible(true);
        setModalType("redeem_success");
        setModalData(item);
        clearData();
        break;

      case "cancel":
        closeModal();
        break;

      case "success_redeem":
        setModalVisible(true);
        setModalType("point_verif");
        setModalData(item);
        // clearData();
        break;

      default:
        break;
    }
  };

  const { data: dataMarketList } = useRedeemSearchList(queryParams);
  const { data: dataRedeemCode, refetch } = useRedeemCode();
  const RedeemSearch = useRedeemSearch();
  const RedeemAdd = useRedeemAdd();

  const marketlist = useMemo(() => dataMarketList?.data, [dataMarketList]);
  const redeemCode = useMemo(() => dataRedeemCode?.data, [dataRedeemCode]);
  const totalPoint = useMemo(() => {
    return tempData.reduce(
      (sum, item) => sum + item.product_price_point * item.itemqty,
      0
    );
  }, [tempData]);

  const clearData = () => {
    refetch();
    setTempData([]);
    setErrorMessage("");
    setUserphone("");
    setUserfullname("");
    setUserdisplayname("");
  };

  const onSubmit = async (dataSubmit) => {
    const dataSearch = {
      productcode: dataSubmit.productcode,
    };

    RedeemSearch.mutate(dataSearch, {
      onSuccess: (response) => {
        setValue("productcode", ""); // Reset input field
        productInputRef.current.focus(); // Refocus after submission

        if (response.status.status === 1) {
          const productData = response.data[0];
          const foundProduct = tempData.find(
            (item) => item.product_code === productData.product_code
          );

          if (foundProduct) {
            // Check if itemqty can be increased without exceeding product_stock
            if (foundProduct.itemqty < productData.product_stock) {
              setTempData((prev) =>
                prev.map((item) =>
                  item.product_code === foundProduct.product_code
                    ? { ...item, itemqty: item.itemqty + 1 }
                    : item
                )
              );
            } else {
              console.warn(
                `Stock limit reached for ${foundProduct.product_name}.`
              );
              setErrorMessage(
                `Stock limit reached for ${foundProduct.product_name}.`
              );
            }
          } else {
            // Ensure product stock is available before adding a new item
            if (productData.product_stock > 0) {
              const dataPush = {
                ...productData,
                itemqty: 1,
                productpriceidr: "0",
                itemtotalidr: "0",
                // productpricepoint: "0",
                // itemtotalpoint: "0",
              };
              setTempData((prev) => [...prev, dataPush]);
            } else {
              // console.warn(
              //   `Product ${productData.product_name} is out of stock.`
              // );
              setErrorMessage(
                `Product ${productData.product_name} is out of stock.`
              );
            }
          }
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
        setProductcode("");
      },
    });
  };

  const handlePay = () => {
    if (totalPoint === 0) {
      return setErrorMessage("Please choose at least 1 item");
    }

    if (totalPoint > pointUser) {
      return setErrorMessage("You don't have enough point");
    }

    const remappedArray = tempData.map((item) => ({
      productcode: item.product_code,
      productname: item.product_name,
      productpriceidr: `${item.productpriceidr}`,
      productpricepoint: `${item.product_price_point}`,
      itemqty: `${item.itemqty}`,
      itemtotalidr: item.itemtotalidr,
      itemtotalpoint: `${item.product_price_point * item.itemqty}`,
    }));

    const dataSubmit = {
      transactioncode: redeemCode,
      transactionmethod: transactionmethod,
      transactionidr: "0", // isinya total semuanya
      transactionpoint: `${totalPoint}`, // isinya total semuanya
      items: remappedArray,
      userphone,
      usercountrycode,
      usercountry,
      userfullname,
      userdisplayname,
    };

    setModalVisible(true);
    setModalType("confirm_redeem");
    setModalData(dataSubmit);
  };

  const handleDelete = (index) => {
    setTempData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "94%",
      }}
    >
      <Box sx={{ backgroundColor: "#fff", padding: "16px", height: "100%" }}>
        <Text sx={{ fontWeight: 600 }}>Redeem</Text>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "16px",
            // gap: "30px",
          }}
        >
          <PointComponent
            userfullname={userfullname}
            setUserfullname={setUserfullname}
            setUserdisplayname={setUserdisplayname}
            userphone={userphone}
            setUserphone={setUserphone}
            setPointUser={setPointUser}
            usercountrycode={usercountrycode}
            setUsercountrycode={setUsercountrycode}
            setUsercountry={setUsercountry}
          />

          {userfullname && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  sx={{
                    width: "500px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    borderRadius: "33px",
                    position: "relative",
                  }}
                >
                  <FormInput
                    label="Product Code"
                    autoFocus
                    autoComplete="off"
                    errors={errors}
                    register={register}
                    onChange={(e) => {
                      setValue("productcode", e.target.value);
                      setProductcode(e.target.value);
                      setErrorMessage("");
                      clearErrors("productcode");
                    }}
                    id={"productcode"}
                    inputRef={productInputRef} // Assign ref to input
                    onBlur={handleBlur} // Handle losing focus
                    onFocus={handleFocus} // Clear timeout when focusing again
                    placeholder="Product Code"
                    labelStyle={{
                      fontSize: "14px",
                      color: "#565D6A",
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

                  {marketlist && marketlist.length > 0 && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        listStyleType: "none",
                        padding: 0,
                        margin: 0,
                        maxHeight: "150px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {marketlist.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            onSubmit({
                              productcode: suggestion.product_code,
                            })
                          }
                          style={{ padding: "8px", cursor: "pointer" }}
                        >
                          {suggestion.product_code} {"   "}{" "}
                          {suggestion.product_name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "end",
                      padding: "0px 0px 20px 0px",
                    }}
                  >
                    <SubmitButton
                      title="Submit Manual"
                      onClick={handleSubmit(onSubmit)}
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#231F20",
                        height: "56px",
                      }}
                      sx={{ padding: "8px 16px" }}
                      textStyle={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#FDB614",
                      }}
                    />
                  </Box>
                </Box>
              </form>

              <BasicDropDown
                label="Payment Method"
                autoFocus
                placeholder="Bookingpayment Method"
                labelStyle={{
                  fontSize: "14px",
                  color: "#565D6A",
                }}
                style={{ width: "200px" }}
                value={transactionmethod}
                onChange={(value) => {
                  setTransactionmethod(value);
                }}
                listDropdown={[
                  {
                    payment: "POINT",
                  },
                ]}
                keyFilter="payment"
              />
            </Box>
          )}
        </Box>

        {tempData.length !== 0 && (
          <Box
            sx={{ marginTop: "20px", marginBottom: "20px", maxWidth: "800px" }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Point
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell align="right">
                        {formatThousandSeparator(item.product_price_point)}
                      </TableCell>
                      <TableCell align="right">{item.itemqty}</TableCell>
                      <TableCell align="right">
                        {formatThousandSeparator(
                          item.product_price_point * item.itemqty
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDelete(index)}
                          style={{
                            // backgroundColor: "red",
                            color: "red",
                            border: "none",
                            padding: "5px 5px",
                            cursor: "pointer",
                          }}
                        >
                          <Delete sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{ fontWeight: "bold", fontSize: "20px" }}
                      align="right"
                    >
                      Total Point
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "20px" }}
                      align="right"
                    >
                      {formatThousandSeparator(totalPoint)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Text sx={{ color: "red", marginTop: "0px" }}>{errorMessage}</Text>

        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "20px",
          }}
        >
          {tempData.map((item, index) => (
            <Box
              sx={{
                width: "500px",
                border: "1px solid #FDB614",
                borderRadius: "8px",
                padding: "8px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "4px",
                  width: "240px",
                }}
              >
                <Text>Product Name : </Text>
                <Text sx={{ fontWeight: 600 }}>{item.product_name}</Text>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "4px",
                  width: "180px",
                }}
              >
                <Text>Product Price</Text>
                <Text sx={{ fontWeight: 600 }}>{item.product_price_idr}</Text>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "4px" }}>
                <Text>Qty</Text>
                <Text sx={{ fontWeight: 600 }}>{item.itemqty}</Text>
              </Box>
            </Box>
          ))}
        </Box> */}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
        <SubmitButton
          title="Bayar"
          onClick={handlePay}
          style={{
            borderRadius: "8px",
            backgroundColor: "#231F20",
            height: "56px",
            width: "200px",
          }}
          sx={{ padding: "8px 16px" }}
          textStyle={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#FDB614",
          }}
        />
      </Box>
      <HomeModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default RedeemTab;
