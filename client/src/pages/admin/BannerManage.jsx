import { useState } from "react";
import useEdit from "../../hooks/useEdit";
import useFetch from "../../hooks/useFetch";
import useInsert from "../../hooks/useInsert";
import useToggle from "../../hooks/useToggle";
import useDelete from "../../hooks/useDelete";
import Title from "../../components/admin/Title";
import { Button, Empty, Switch, Table, Input } from "antd";
import BannerForm from "../../components/admin/BannerForm";
import AdminLayout from "../../components/layout/AdminLayout";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  listBanner,
  editBanner,
  bannerStatus,
  insertBanner,
  deleteBanner,
} from "../../api/services/adminService";

function BannerManage() {
  const [size] = useState("large");
  const [editData, setEditData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: banner, setData: setBanner } = useFetch(listBanner);
  const { insertItem } = useInsert(insertBanner, setBanner, setIsModalVisible);
  const { editItem } = useEdit(editBanner, setBanner, setIsModalVisible);
  const { toggleStatus } = useToggle(bannerStatus, setBanner);
  const { deleteItem } = useDelete(deleteBanner, setBanner);

  const insertBannerHandler = async (formData) => {
    insertItem(formData);
  };

  const showEditWindow = (bannerToEdit) => {
    setEditData(bannerToEdit);
    showModal();
  };

  const editBannerHandler = async (formData) => {
    editItem(editData._id, formData);
  };

  const toggleBannerStatus = async (bannerId, currentStatus) => {
    toggleStatus(bannerId, currentStatus);
  };

  const deleteBannerHandler = async (bannerId) => {
    deleteItem(bannerId);
  };

  const filteredData = banner.filter((record) =>
    record.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const showDeleteConfirm = (bannerId) => {
    const handleDelete = (bannerId) => {
      deleteBannerHandler(bannerId);
    };
    DeleteConfirm(handleDelete, bannerId);
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
            onClick={() => showEditWindow(record)}
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
          pagination={{ position: ["bottomCenter"], pageSize: 5 }}
          bordered
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
        />
      </div>
      <BannerForm
        visible={isModalVisible}
        onCreate={editData ? editBannerHandler : insertBannerHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default BannerManage;
