import toast from "react-hot-toast";

const useDelete = (apiFunction, setData) => {
  const deleteItem = async (itemId) => {
    try {
      const response = await apiFunction(itemId);
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prevData) => prevData.filter((item) => item._id !== itemId));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return { deleteItem };
};

export default useDelete;
