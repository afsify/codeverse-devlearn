import "./index.css";
import "antd/dist/antd";
import App from "./App.jsx";
import "intersection-observer";
import store from "./utils/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
