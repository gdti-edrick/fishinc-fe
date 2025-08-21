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
import { useMarketCode, useMarketSearchList } from "../../api/market/query";
import {
  FormDropDown,
  FormInput,
} from "../../components/UI/molecules/CustomInput";
import { SubmitButton } from "../../components/UI/molecules/Button";
import { useMarketAdd, useMarketSearch } from "../../api/market/mutation";
import { BasicButton } from "../../components/UI/atoms/BasicButton";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";
import { BasicDropDown } from "../../components/UI/atoms/BasicInput";
import HomeModal from "../../components/UI/organisms/Modal/CustomModal/HomeModal";
import { Delete } from "@mui/icons-material";

const userFormSchema = yup.object().shape({
  productcode: yup.string().required(),
});

const MarketTab = () => {
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

  useEffect(() => {
    if (productInputRef.current) {
      productInputRef.current.focus(); // Auto-focus when component mounts
    }
  }, []);

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => {
      if (productInputRef.current) {
        productInputRef.current.focus();
      }
    }, 1000); // Set timeout for 1 second
  };

  const handleFocus = () => {
    clearTimeout(timeoutRef.current); // Clear timeout when input regains focus
  };

  const [tempData, setTempData] = useState([]);
  const [transactionmethod, setTransactionmethod] = useState("QRIS");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

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

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item action => ", item);
    switch (item.type) {
      case "add_success":
        refetch();
        closeModal();
        break;
      case "delete_success":
        refetch();
        closeModal();
        break;
      case "confirm":
        closeModal();
        fetchMarketCreate(item);
        break;
      case "cancel":
        closeModal();
        break;
      case "success_market":
        setModalVisible(true);
        setModalType("market_success");
        setModalData(item);
        clearData();
        break;

      default:
        break;
    }
  };

  const { data: dataMarketList } = useMarketSearchList(queryParams);
  const { data: dataMarketCode, refetch } = useMarketCode();
  const MarketSearch = useMarketSearch();
  const MarketAdd = useMarketAdd();

  const marketlist = useMemo(() => dataMarketList?.data, [dataMarketList]);
  const marketCode = useMemo(() => dataMarketCode?.data, [dataMarketCode]);
  const totalPrice = useMemo(() => {
    return tempData.reduce(
      (sum, item) => sum + item.product_price_idr * item.itemqty,
      0
    );
  }, [tempData]);

  const clearData = () => {
    refetch();
    setTempData([]);
    setErrorMessage([]);
    setProductcode("");
  };

  console.log("Market Code =>", marketCode);

  const onSubmit = async (dataSubmit) => {
    const dataSearch = {
      productcode: dataSubmit.productcode,
    };

    MarketSearch.mutate(dataSearch, {
      onSuccess: (response) => {
        console.log("MarketSearch => ", response);
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
                productpricepoint: "0",
                itemtotalpoint: "0",
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
    if (totalPrice === 0) {
      return setErrorMessage("Please choose at least 1 item");
    }

    const remappedArray = tempData.map((item) => ({
      productcode: item.product_code,
      productname: item.product_name,
      productpriceidr: `${item.product_price_idr}`,
      productpricepoint: item.productpricepoint,
      itemqty: `${item.itemqty}`,
      itemtotalidr: `${item.product_price_idr * item.itemqty}`, // Calculate total price
      itemtotalpoint: item.itemtotalpoint,
    }));

    const dataSubmit = {
      transactioncode: marketCode,
      transactionmethod: transactionmethod,
      transactionidr: `${totalPrice}`, // isinya total semuanya
      transactionpoint: "0", // isinya total semuanya
      items: remappedArray,
    };

    setModalVisible(true);
    setModalType("confirm_market");
    setModalData({
      modalTitle: "Are You Sure?",
      modalSubtitle: "This action cannot be undone. Do you want to proceed?",
      ...dataSubmit,
    });

    // MarketAdd.mutate(dataSubmit, {
    //   onSuccess: (response) => {
    //     console.log("MarketAdd => ", response);

    //     if (response.status.status === 1) {
    //       setModalVisible(true);
    //       setModalType("market_success");
    //       setModalData(dataSubmit);
    //       clearData();
    //     } else {
    //       setErrorMessage(
    //         response.status.message[0].errormessage ||
    //           "Sistem Error please contact the administrator"
    //       );
    //     }
    //   },
    // });
  };

  const handleDelete = (index) => {
    setTempData((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleSelect = (suggestion) => {
  //   const dataSearch = {
  //     productcode: suggestion.productcode,
  //   };

  //   MarketSearch.mutate(dataSearch, {
  //     onSuccess: (response) => {
  //       console.log("MarketSearch => ", response);
  //       setValue("productcode", ""); // Reset input field
  //       productInputRef.current.focus(); // Refocus after submission

  //       if (response.status.status === 1) {
  //         const productData = response.data[0];
  //         const foundProduct = tempData.find(
  //           (item) => item.product_code === productData.product_code
  //         );

  //         if (foundProduct) {
  //           // Check if itemqty can be increased without exceeding product_stock
  //           if (foundProduct.itemqty < productData.product_stock) {
  //             setTempData((prev) =>
  //               prev.map((item) =>
  //                 item.product_code === foundProduct.product_code
  //                   ? { ...item, itemqty: item.itemqty + 1 }
  //                   : item
  //               )
  //             );
  //           } else {
  //             console.warn(
  //               `Stock limit reached for ${foundProduct.product_name}.`
  //             );
  //             setErrorMessage(
  //               `Stock limit reached for ${foundProduct.product_name}.`
  //             );
  //           }
  //         } else {
  //           // Ensure product stock is available before adding a new item
  //           if (productData.product_stock > 0) {
  //             const dataPush = {
  //               ...productData,
  //               itemqty: 1,
  //               productpricepoint: "0",
  //               itemtotalpoint: "0",
  //             };
  //             setTempData((prev) => [...prev, dataPush]);
  //           } else {
  //             // console.warn(
  //             //   `Product ${productData.product_name} is out of stock.`
  //             // );
  //             setErrorMessage(
  //               `Product ${productData.product_name} is out of stock.`
  //             );
  //           }
  //         }
  //       } else {
  //         setErrorMessage(response.status.message[0].errormessage);
  //       }
  //     },
  //   });
  // }

  const fetchMarketCreate = async (dataSubmit) => {
    const dataCreate = {
      transactioncode: dataSubmit.transactioncode,
      transactionmethod: dataSubmit.transactionmethod,
      transactionidr: dataSubmit.transactionidr, // isinya total semuanya
      transactionpoint: dataSubmit.transactionpoint, // isinya total semuanya
      items: dataSubmit.items,
    };

    MarketAdd.mutate(dataCreate, {
      onSuccess: (response) => {
        console.log("MarketAdd => ", response);

        if (response.status.status === 1) {
          setModalVisible(true);
          setModalType("market_success");
          setModalData(dataCreate);
          clearData();
        } else {
          setErrorMessage(
            response.status.message[0].errormessage ||
              "Sistem Error please contact the administrator"
          );
        }
      },
    });
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
        <Text sx={{ fontWeight: 600 }}>Market</Text>

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
                marginTop: "20px",
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
                  const value = e.target.value;
                  setValue("productcode", value.toUpperCase());
                  setProductcode(value.toUpperCase());
                  setErrorMessage("");
                  clearErrors("productcode");
                }}
                id={"productcode"}
                inputRef={productInputRef} // Assign ref to input
                onBlur={handleBlur} // Handle losing focus
                onFocus={handleFocus} // Clear timeout when focusing again
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
            <Text sx={{ color: "red", marginTop: "0px" }}>{errorMessage}</Text>
          </form>

          <BasicDropDown
            label="Payment Method"
            autoFocus
            placeholder="Bookingpayment Method"
            labelStyle={{
              fontSize: "16px",
            }}
            style={{ width: "200px", marginTop: "20px" }}
            value={transactionmethod}
            onChange={(value) => {
              setTransactionmethod(value);
            }}
            listDropdown={[
              {
                payment: "DEBIT",
              },
              {
                payment: "CREDIT",
              },
              {
                payment: "QRIS",
              },
              {
                payment: "INTERNAL",
              },
            ]}
            keyFilter="payment"
          />
        </Box>

        {tempData.length !== 0 && (
          <Box sx={{ marginTop: "20px", maxWidth: "800px" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Price
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
                        {formatThousandSeparator(item.product_price_idr)}
                      </TableCell>
                      <TableCell align="right">{item.itemqty}</TableCell>
                      <TableCell align="right">
                        {formatThousandSeparator(
                          item.product_price_idr * item.itemqty
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
                      Total Price
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "20px" }}
                      align="right"
                    >
                      {formatThousandSeparator(totalPrice)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
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

export default MarketTab;
