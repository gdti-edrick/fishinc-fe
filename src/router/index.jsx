import Page from "../components/Shared/Page";
import NotFound404 from "../components/Template/NotFound404";

import Login from "../page/Auth/Login";
import Logout from "../page/Auth/Logout";
import Bracelet from "../page/Bracelet";
import Home from "../page/Home";
import AdminRole from "../page/Admin/AdminRole";
import AdminCrud from "../page/Admin/AdminCrud";
import Entity from "../page/Entity";
import Scale from "../page/Scale";
import Seat from "../page/Seat";
import Admin from "../page/Admin/Admin";
import RegisterAdmin from "../page/Admin/Admin/AddNew";
import User from "../page/User";
import Point from "../page/Point";
import Weight from "../page/Weight";
import Booking from "../page/Booking";
import PointDetail from "../page/Point/PointDetail";
import Report from "../page/Report";
import Game from "../page/Game";
import Event from "../page/Event";
import EventDetail from "../page/Event/EventDetail";
import Product from "../page/Product";
import ProductDetail from "../page/Product/ProductDetail";
import Vendor from "../page/Vendor";
import StockList from "../page/Product/StockList";
import Transaction from "../page/Transaction";
import TransactionDetail from "../page/Transaction/TransactionDetail";
import MonitorInfo from "../page/Monitor/MonitorInfo";
import MonitorRanking from "../page/Monitor/MonitorRanking";
import MonitorInfo2 from "../page/Monitor/MonitorInfo2";
import Print from "../page/Print";
import PrintPage from "../page/Print/Print2";
import MonitorInfo3 from "../page/Monitor/MonitorInfo3";
import MonitorRanking2 from "../page/Monitor/MonitorRanking2";
import MonitorRanking3 from "../page/Monitor/MonitorRanking3";
import Sound from "../page/Sound";
import ReportCashier from "../page/Report/ReportCashier";
import ReportIncome from "../page/Report/ReportIncome";
import ReportPurchasing from "../page/Report/ReportPurchasing";
import ReportPnl from "../page/Report/ReportPnl";
import LogList from "../page/Log";
import ReportIncomePoint from "../page/Report/ReportIncomePoint";
import ReportPoint from "../page/Report/ReportPoint";
import MonitorPoint from "../page/Monitor/MonitorPoint";
import MonitorPoint2 from "../page/Monitor/MonitorPoint2";
import Holiday from "../page/Holiday";
import Pricelist from "../page/Pricelist";
import Promo from "../page/Promo";

const authenticatedTemporaryRoutes = [];

export let authenticatedRoutes = [
  {
    path: "/home",
    element: <Page component={Home} />,
  },
  // {
  //   path: "/report",
  //   element: <Page component={Report} />,
  // },
  // {
  //   path: "/report-cashier",
  //   element: <Page component={ReportCashier} />,
  // },
  {
    path: "/report-purchasing",
    element: <Page component={ReportPurchasing} />,
  },
  {
    path: "/report-income",
    element: <Page component={ReportIncome} />,
  },
  {
    path: "/report-point",
    element: <Page component={ReportPoint} />,
  },
  {
    path: "/report-income-point",
    element: <Page component={ReportIncomePoint} />,
  },
  {
    path: "/report-pnl",
    element: <Page component={ReportPnl} />,
  },
  {
    path: "/admin-role",
    element: <Page component={AdminRole} />,
  },
  {
    path: "/admin-crud",
    element: <Page component={AdminCrud} />,
  },
  {
    path: "/admin",
    element: <Page component={Admin} />,
  },
  {
    path: "/register-admin",
    element: <Page component={RegisterAdmin} />,
  },
  {
    path: "/booking",
    element: <Page component={Booking} />,
  },
  {
    path: "/entity",
    element: <Page component={Entity} />,
  },
  {
    path: "/bracelet",
    element: <Page component={Bracelet} />,
  },
  {
    path: "/scale",
    element: <Page component={Scale} />,
  },
  {
    path: "/seat",
    element: <Page component={Seat} />,
  },
  {
    path: "/user",
    element: <Page component={User} />,
  },
  {
    path: "/point",
    element: <Page component={Point} />,
  },
  {
    path: "/product",
    element: <Page component={Product} />,
  },
  {
    path: "/promo",
    element: <Page component={Promo} />,
  },
  {
    path: "/product/stock",
    element: <Page component={ProductDetail} />,
  },
  {
    path: "/product/stock_list",
    element: <Page component={StockList} />,
  },
  {
    path: "/point/detail",
    element: <Page component={PointDetail} />,
  },
  // {
  //   path: "/event",
  //   element: <Page component={Event} />,
  // },
  // {
  //   path: "/event/detail",
  //   element: <Page component={EventDetail} />,
  // },
  {
    path: "/weight-point",
    element: <Page component={EventDetail} />,
  },
  {
    path: "/weight",
    element: <Page component={Weight} />,
  },
  {
    path: "/game",
    element: <Page component={Game} />,
  },
  {
    path: "/vendor",
    element: <Page component={Vendor} />,
  },
  {
    path: "/transaction",
    element: <Page component={Transaction} />,
  },
  {
    path: "/transaction/detail",
    element: <Page component={TransactionDetail} />,
  },
  {
    path: "/holiday",
    element: <Page component={Holiday} />,
  },
  {
    path: "/pricelist",
    element: <Page component={Pricelist} />,
  },
  {
    path: "/logs",
    element: <Page component={LogList} />,
  },
];

const publicRoutes = [
  {
    path: "/",
    element: <Page component={Login} layout={"solo-page"} />,
  },
  {
    path: "/register",
    element: <Page component={Login} layout={"solo-page"} />,
  },
  {
    path: "/logout",
    element: <Page component={Logout} layout="solo-page" />,
  },
  {
    path: "/monitor",
    element: <Page component={MonitorInfo3} layout="solo-page" />,
  },
  {
    path: "/monitor-ranking",
    element: <Page component={MonitorRanking3} layout="solo-page" />,
  },
  {
    path: "/monitor-point",
    element: <Page component={MonitorPoint2} layout="solo-page" />,
  },
  {
    path: "/print",
    element: <Page component={PrintPage} layout="solo-page" />,
  },
  {
    path: "/sound",
    element: <Page component={Sound} layout="solo-page" />,
  },
];

// const basicRouteAddition = ["/dashboard"];

export const basicRoutes = [
  ...publicRoutes.map((route) => route.path),
  ...authenticatedRoutes.map((route) => route.path),
  // ...(process.env.NODE_ENV === "development"
  //   ? authenticatedRoutes.map((route) => route.path)
  //   : basicRouteAddition),
  // ...basicRouteAddition,
];

const router = [
  {
    path: "*",
    element: <Page component={NotFound404} layout={"solo-page"} />,
  },
  ...authenticatedTemporaryRoutes,
  ...authenticatedRoutes,
  ...publicRoutes,
];
const routerAuth = [...authenticatedRoutes];
const routerPublic = [...publicRoutes];
const routerTempAuth = [...authenticatedTemporaryRoutes];
export {
  router,
  routerAuth,
  routerPublic,
  routerTempAuth,
  publicRoutes,
  // authenticatedRoutes,
  authenticatedTemporaryRoutes,
};
