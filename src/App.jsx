import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/index.js";
import AppRoutes from "./AppRoutes.jsx";
import MyContextValue from "./utils/MyContextValue";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <MyContextValue>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={true} />
          <ToastContainer />
          <AppRoutes />
        </QueryClientProvider>
      </MyContextValue>
    </Provider>
  );
}

export default App;
