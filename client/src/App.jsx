import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";
import Toaster from "./components/constant/Toaster";
import Spinner from "./components/constant/Spinner";
import ThemeProvider from "./components/constant/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Spinner />
      <Toaster />
      <ThemeProvider>
        <Routes>
          <Route path={"/*"} element={<UserRoute />} />
          <Route path={"/admin/*"} element={<AdminRoute />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
