import Box from "@mui/material/Box";

import { Text } from "../../../../atoms/Typography";
import { BasicButton } from "../../../../atoms/BasicButton";
import { FormInput } from "../../../../molecules/CustomInput";
import { SubmitButton } from "../../../../molecules/Button";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../../../../api/user/mutation";
import MonitorPhoneContainer from "../../../../../Template/Container/MonitorPhoneContainer";
import BasicModal from "../..";
import { useEffect, useMemo, useState } from "react";
import { use } from "react";
import {
  useMonitorPoint,
  useMonitorWeight,
} from "../../../../../../api/monitor/query";
import { formatThousandSeparator } from "../../../../../../utils/utils/formatThousandSeparator";
import { formatInTimeZone } from "date-fns-tz";

import FishGroup from "../../../../../../assets/images/dashboard/FishGroup.svg";
import FisIncBlack from "../../../../../../assets/images/dashboard/Fushinc_black.svg";
import FishHood from "../../../../../../assets/images/dashboard/FishHood.png";
import Coin from "../../../../../../assets/icons/dashboard/coin.svg";
import { Tab, Tabs } from "@mui/material";

export default function MonitorModal({
  modalVisible,
  modalClosed,
  modalType,
  modalData,
  action,
  backdropClick = true,
}) {
  const typeModal = {
    monitor_point: (
      <MonitorPoint
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
      disableBackdropClick={false}
    >
      {typeModal[modalType]}
    </BasicModal>
  );
}

const MonitorPoint = ({ data, action, closed }) => {
  console.log("data => ", data);

  useEffect(() => {
    const timer = setTimeout(() => {
      closed();
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [closed]);

  const [usercountrycode, setUsercountrycode] = useState(data?.usercountrycode);
  const [userphone, setUserphone] = useState(data?.userphone);
  const [userfullname, setUserfullname] = useState(
    data?.list[0]?.user_fullname
  );
  const [userdisplayname, setUserdisplayname] = useState(
    data?.list[0]?.user_displayname
  );

  const [tabValue, setTabValue] = useState("point");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const additionalParams2 = useMemo(() => {
    const params = {};

    Object.assign(params, {
      userphone: userphone,
    });
    Object.assign(params, {
      usercountrycode: usercountrycode,
    });
    Object.assign(params, {
      userfullname: userfullname,
    });
    Object.assign(params, {
      userdisplayname: userdisplayname,
    });

    return params;
  }, [userphone, usercountrycode, userfullname, userdisplayname]);

  const queryParamsDetail = {
    params: additionalParams2,
  };

  const {
    data: dataPointDetail,
    isLoading,
    refetch,
  } = useMonitorPoint(queryParamsDetail);

  const { data: dataWeightDetail } = useMonitorWeight(queryParamsDetail);

  console.log("dataPointDetail => ", dataPointDetail);

  const cardCallback = (cbItem) => {
    console.log("cardCallback =>", cbItem);
    setUsercountrycode(cbItem.usercountrycode);
    setUserphone(cbItem.userphone);
    setUserfullname(cbItem.userfullname);
    setUserdisplayname(cbItem.userdisplayname);
  };

  const renderTab = () => {
    switch (tabValue) {
      case "point":
        return <PointTab dataPointDetail={dataPointDetail} />;
      case "weight":
        return <WeightTab dataWeightDetail={dataWeightDetail} />;
      default:
        return null;
    }
  };

  return (
    <MonitorPhoneContainer>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            width: "35%",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {data?.list?.map((item, index) => (
              <Card
                key={index}
                dataCard={item}
                userphone={data.userphone}
                usercountrycode={data.usercountrycode}
                cb={cardCallback}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "32px 0px 0px 0px",
            }}
          >
            <BasicButton
              onClick={() => {
                action({
                  type: "done",
                });
              }}
              sx={{
                width: "75%",
                padding: "12px",
                backgroundColor: "#000000",
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: 700,
                borderRadius: "100px",
              }}
            >
              Done
            </BasicButton>
          </Box>
        </Box>
        <Box sx={{ width: "65%", padding: "80px 40px" }}>
          <Box
            sx={{
              // width: "100%",
              height: "100%",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
              padding: "30px 40px 0px 40px",
              borderRadius: "30px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "20px",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
                centered
                sx={{
                  ".Mui-selected": {
                    color: `#000000`,
                    fontWeight: 900,
                  },
                }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#FFCB10",
                  },
                }}
              >
                <Tab
                  value="point"
                  label="Point"
                  sx={{
                    fontSize: { xs: "12px", sm: "16px", md: "20px" },
                    fontWeight: 700,
                    textTransform: "none",
                    "&.Mui-selected": {
                      color: "#000000",
                    },
                  }}
                />
                <Tab
                  value="weight"
                  label="Weight"
                  sx={{
                    fontSize: { xs: "12px", sm: "16px", md: "20px" },
                    fontWeight: 700,
                    textTransform: "none",
                    "&.Mui-selected": {
                      color: "#000000",
                    },
                  }}
                />
              </Tabs>
            </Box>
            {renderTab()}
          </Box>
        </Box>
      </Box>
    </MonitorPhoneContainer>
  );
};

const Card = ({ dataCard, userphone, usercountrycode, cb }) => {
  return (
    <BasicButton
      onClick={() =>
        cb({
          userphone: userphone,
          usercountrycode: usercountrycode,
          userdisplayname: dataCard.user_displayname,
          userfullname: dataCard.user_fullname,
        })
      }
      sx={{
        width: "100%",
        aspectRatio: "610/300",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "24px",
        borderRadius: "32px",
        backgroundColor: "#FDB614",
      }}
    >
      <Box
        component="img"
        alt="Logo"
        src={FisIncBlack}
        sx={{
          width: "100px",
        }}
      />

      <Box
        component="img"
        alt="fish"
        src={FishGroup}
        sx={{
          width: "40%",
          position: "absolute",
          right: "10px",
          top: "10px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Text variant="h4" sx={{ fontWeight: 800 }}>
          {dataCard.user_fullname}
        </Text>
        <Text variant="h5">
          +{usercountrycode} {userphone}
        </Text>
      </Box>
    </BasicButton>
  );
};

const ListPoint = ({ item, index }) => {
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px",
        borderBottom: "1px solid #E5E5E5",
        position: "relative",
      }}
    >
      <Text
        sx={{
          position: "absolute",
          bottom: "10px",
          left: "12px",
          fontSize: "12px",
        }}
      >
        {formatInTimeZone(
          new Date(item.point_created),
          "UTC",
          "dd MMMM yyyy HH:mm:ss"
        )}
      </Text>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
        }}
      >
        <Box
          component="img"
          alt="fishhood"
          src={FishHood}
          sx={{
            width: "160px",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Text sx={{ fontSize: "20px", fontWeight: 600 }}>Game Code</Text>
            <Text>{item.game_code || "-"}</Text>
          </Box>
          <Box>
            <Text sx={{ fontSize: "20px", fontWeight: 600 }}>Point Code</Text>
            <Text>{item.point_code || "-"}</Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Text
          sx={{
            fontSize: "40px",
            fontWeight: 700,
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            color: "#FDB614",
          }}
        >
          {item.point_sum > 0 ? "+" : ""}
          {formatThousandSeparator(item.point_sum) || 0}
        </Text>
        <Text
          sx={{
            fontSize: "24px",
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {formatThousandSeparator(item.point_total_after) || 0}
        </Text>
      </Box>
    </Box>
  );
};

const FishSparator = () => {
  return (
    <Box
      sx={{
        padding: "20px 0px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "1px",
          width: "100%",
          backgroundColor: "#231F20",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F7F9FB",
            width: "60px",
            height: "60px",
            borderRadius: "100%",
          }}
        >
          <Box
            component="img"
            alt="cover"
            src={Coin}
            sx={{
              maxHeight: "60px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const PointTab = ({ dataPointDetail }) => {
  const hasData =
    Array.isArray(dataPointDetail?.data) && dataPointDetail.data.length > 0;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          // alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="h4" sx={{ fontWeight: 600 }}>
          POINT CHECK
        </Text>
        <Box>
          <Text
            sx={{
              fontSize: "24px",
              fontWeight: 500,
            }}
          >
            Total Point:{" "}
          </Text>
          <Text
            sx={{
              fontSize: "40px",
              fontWeight: 900,
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
              color: "#FDB614",
            }}
          >
            {formatThousandSeparator(
              dataPointDetail?.data[0]?.point_total_after
            )}{" "}
          </Text>
        </Box>
      </Box>

      <FishSparator />

      <Box sx={{ marginTop: "12px", height: "78%", overflow: "scroll" }}>
        {hasData ? (
          dataPointDetail.data.map((item, index) => (
            <ListPoint item={item} key={index} />
          ))
        ) : (
          <Text sx={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
            No data available
          </Text>
        )}
      </Box>
    </>
  );
};
const WeightTab = ({ dataWeightDetail }) => {
  const hasData =
    Array.isArray(dataWeightDetail?.data) && dataWeightDetail.data.length > 0;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          // alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="h4" sx={{ fontWeight: 600 }}>
          WEIGHT CHECK
        </Text>
        {/* <Box>
          <Text
            sx={{
              fontSize: "24px",
              fontWeight: 500,
            }}
          >
            Total Point:{" "}
          </Text>
          <Text
            sx={{
              fontSize: "40px",
              fontWeight: 900,
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
              color: "#FDB614",
            }}
          >
            {formatThousandSeparator(
              dataWeightDetail?.data[0]?.point_total_after
            )}{" "}
          </Text>
        </Box> */}
      </Box>

      {/* <FishSparator /> */}

      <Box sx={{ marginTop: "12px", height: "78%", overflow: "scroll" }}>
        {hasData ? (
          dataWeightDetail?.data &&
          dataWeightDetail?.data.map((item, index) => (
            <ListWeight item={item} key={index} />
          ))
        ) : (
          <Text sx={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
            No data available
          </Text>
        )}
      </Box>
    </>
  );
};

const ListWeight = ({ item, index }) => {
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px",
        borderBottom: "1px solid #E5E5E5",
        position: "relative",
      }}
    >
      <Text
        sx={{
          position: "absolute",
          bottom: "10px",
          left: "12px",
          fontSize: "12px",
        }}
      >
        {formatInTimeZone(
          new Date(item.weight_created),
          "UTC",
          "dd MMMM yyyy HH:mm:ss"
        )}
      </Text>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
        }}
      >
        <Box
          component="img"
          alt="fishhood"
          src={FishHood}
          sx={{
            width: "160px",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Text sx={{ fontSize: "20px", fontWeight: 600 }}>
              Bracelet Code
            </Text>
            <Text>{item.bracelet_code || "-"}</Text>
          </Box>
          <Box>
            <Text sx={{ fontSize: "20px", fontWeight: 600 }}>Scale Code</Text>
            <Text>{item.scale_code || "-"}</Text>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "30px",
          }}
        >
          <Box>
            <Text sx={{ fontSize: "20px", fontWeight: 600 }}>Event Point</Text>
            <Text sx={{ color: "#FDB614", fontWeight: 600 }}>
              {item.event_point_sum_point || "0"}
            </Text>
          </Box>
          <Box>
            <Text sx={{ fontSize: "20px", fontWeight: 600 }}>Game Point</Text>
            <Text sx={{ color: "#FDB614", fontWeight: 600 }}>
              {item.game_point || "0"}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Text
          sx={{
            fontSize: "40px",
            fontWeight: 700,
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            color: "#FDB614",
          }}
        >
          {item.point_sum > 0 ? "+" : ""}
          {formatThousandSeparator(item.weight_number) || 0} gr
        </Text>
      </Box>
    </Box>
  );
};
