import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { Button, Empty, Modal, Switch } from "antd";
import BannerForm from "../../components/admin/BannerForm";
import AdminLayout from "../../components/layout/AdminLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  listBanner,
  editBanner,
  bannerStatus,
  insertBanner,
  deleteBanner,
} from "../../api/services/adminService";

function BannerManage() {
  const dispatch = useDispatch();
  const [size] = useState("large");
  const [banners, setBanners] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        dispatch(showLoading());
        const response = await listBanner();
        dispatch(hideLoading());
        const bannerData = response.data.data;
        setBanners(bannerData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, [dispatch]);

  const insertBannerHandler = async (formData) => {
    try {
      dispatch(showLoading());
      const response = await insertBanner(formData);
      dispatch(hideLoading());
      if (response.data.success) {
        const newBanner = response.data.savedBanner;
        setBanners([...banners, newBanner]);
        setIsModalVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const editBannerHandler = (bannerId, image, title, description, link) => {
    const bannerToEdit = {
      _id: bannerId,
      image: image,
      title: title,
      description: description,
      link: link,
    };
    setEditData(bannerToEdit);
    showModal();
  };

  const editExistingBannerHandler = async (formData) => {
    try {
      const response = await editBanner(editData._id, formData);
      if (response.data.success) {
        const updatedBanner = response.data.savedBanner;
        const updatedBanners = banners.map((banner) =>
          banner._id === updatedBanner._id ? updatedBanner : banner
        );
        setBanners(updatedBanners);
        setIsModalVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const toggleBannerStatus = async (bannerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await bannerStatus(bannerId, newStatus);
      if (response.data.success) {
        const updatedBannersResponse = await listBanner();
        const updatedBannersData = updatedBannersResponse.data;
        setBanners(updatedBannersData);
        toast.success(response.data.message);
        const updatedBanners = banners.map((banner) =>
          banner._id === bannerId ? { ...banner, status: newStatus } : banner
        );
        setBanners(updatedBanners);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const deleteBannerHandler = async (bannerId) => {
    try {
      const response = await deleteBanner(bannerId);
      if (response.data.success) {
        const updatedBanners = banners.filter(
          (banner) => banner._id !== bannerId
        );
        setBanners(updatedBanners);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const { confirm } = Modal;

  const showDeleteConfirm = (bannerId) => {
    confirm({
      title: "Are you sure you want to delete this banner?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        deleteBannerHandler(bannerId);
      },
      onCancel() {},
    });
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Banners</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Banner
        </Button>
      </Title>
      <div className="overflow-x-auto rounded-xl mt-5">
        <table className="w-full table-auto border-collapse border border-gray-300 shadow-md shadow-black">
          <thead className="bg-dark-purple text-white">
            <tr>
              <th className="text-center border border-gray-300 py-2">#</th>
              <th className="text-center border border-gray-300">Image</th>
              <th className="text-center border border-gray-300 py-2">Title</th>
              <th className="text-center border border-gray-300 py-2">
                Description
              </th>
              <th className="text-center border border-gray-300 py-2">
                Status
              </th>
              <th className="text-center border border-gray-300 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-14">
                  <div className="flex justify-center items-center h-full">
                    <Empty
                      description={
                        <span className="text-lg text-gray-500">
                          No banners available.
                        </span>
                      }
                    />
                  </div>
                </td>
              </tr>
            ) : (
              banners.map((banner, index) => (
                <tr key={banner._id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 flex justify-center">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      width="200"
                      className="rounded-lg"
                    />
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    {banner.title}
                  </td>
                  <td className="text-center border border-gray-300 py-2 max-w-md">
                    {banner.description}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    <Switch
                      className="bg-light-purple"
                      checked={banner.status}
                      onChange={() =>
                        toggleBannerStatus(banner._id, banner.status)
                      }
                    />
                  </td>
                  <td className="text-center border border-gray-300">
                    <Button
                      icon={<EditOutlined />}
                      size={size}
                      onClick={() =>
                        editBannerHandler(
                          banner._id,
                          banner.image,
                          banner.title,
                          banner.description,
                          banner.link
                        )
                      }
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      size={size}
                      onClick={() => showDeleteConfirm(banner._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <BannerForm
        visible={isModalVisible}
        onCreate={editData ? editExistingBannerHandler : insertBannerHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default BannerManage;
