import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../utils/alertSlice";

const useEdit = (apiFunction, setData, setIsModalVisible) => {
  const dispatch = useDispatch();

  const editItem = async (itemId, formData) => {
    try {
      dispatch(showLoading());
      const response = await apiFunction(itemId, formData);
      if (response.data.success) {
        const updatedItem = response.data.data;
        setData((prevData) =>
          prevData.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
        toast.success(response.data.message);
        setIsModalVisible(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

  return { editItem };
};

export default useEdit;
