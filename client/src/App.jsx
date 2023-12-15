import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";
import Toaster from "./components/constant/Toaster";
import Spinner from "./components/constant/Spinner";

function App() {
  return (
    <BrowserRouter>
      <Spinner />
      <Toaster />
      <Routes>
        <Route path={"/*"} element={<UserRoute />} />
        <Route path={"/admin/*"} element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
