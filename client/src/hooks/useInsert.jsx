import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../utils/alertSlice";
import toast from "react-hot-toast";

const useInsert = (apiFunction, setData, setIsModalVisible) => {
  const dispatch = useDispatch();

  const insertItem = async (formData) => {
    try {
      dispatch(showLoading());
      const response = await apiFunction(formData);
      if (response.data.success) {
        const newData = response.data.data;
        setData((prevData) => [...prevData, newData]);
        toast.success(response.data.message);
        setIsModalVisible(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return { insertItem };
};

export default useInsert;
