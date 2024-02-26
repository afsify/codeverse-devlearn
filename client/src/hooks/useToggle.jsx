import toast from "react-hot-toast";

const useToggle = (apiFunction, setData) => {
  const toggleStatus = async (itemId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await apiFunction(itemId, newStatus);
      if (response.data.success) {
        const updatedItem = response.data.data;
        setData((prevData) =>
          prevData.map((item) =>
            item._id === updatedItem._id ? { ...item, status: newStatus } : item
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return { toggleStatus };
};

export default useToggle;
