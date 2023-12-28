import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import "./index.css";
import "antd/dist/antd";
import App from "./App.jsx";
import store from "./utils/store";
import ReactDOM from "react-dom/client";
import 'intersection-observer';

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
