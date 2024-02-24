import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { Button, Empty, Modal, Switch, Table, Input } from "antd";
import BannerForm from "../../components/admin/BannerForm";
import AdminLayout from "../../components/layout/AdminLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  listBanner,
  editBanner,
  bannerStatus,
  insertBanner,
  deleteBanner,
} from "../../api/services/adminService";

const { confirm } = Modal;

function BannerManage() {
  const dispatch = useDispatch();
  const [size] = useState("large");
  const [banners, setBanners] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "20%",
      align: "center",
      render: (text, record) => (
        <img src={record.image} alt={record.title} className="rounded-lg" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      filterDropdown: () => (
        <Input
          size="large"
          placeholder="Search Title"
          value={searchInput}
          className="rounded-md w-44"
          onChange={(e) => setSearchInput(e.target.value)}
          prefix={
            <SearchOutlined style={{ color: "#1890ff", marginRight: "5px" }} />
          }
          suffix={
            searchInput && (
              <CloseCircleOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => setSearchInput("")}
              />
            )
          }
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchInput ? "#1890ff" : undefined }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      width: "30%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => (
        <Switch
          className="bg-light-purple"
          checked={record.status}
          onChange={() => toggleBannerStatus(record._id, record.status)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <div className="md:space-x-1 space-y-1">
          <Button
            className="text-white"
            icon={<EditOutlined />}
            size={size}
            onClick={() =>
              editBannerHandler(
                record._id,
                record.image,
                record.title,
                record.description,
                record.link
              )
            }
          />
          <Button
            className="text-white"
            icon={<DeleteOutlined />}
            size={size}
            onClick={() => showDeleteConfirm(record._id)}
          />
        </div>
      ),
    },
  ];

  const filteredData = banners.filter((record) =>
    record.title.toLowerCase().includes(searchInput.toLowerCase())
  );

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
      <div className="overflow-x-auto mt-5">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 4 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span className="text-lg text-gray-500">
                    No banners available.
                  </span>
                }
              />
            ),
          }}
          bordered
        />
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
