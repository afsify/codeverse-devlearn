import { useState } from "react";
import useEdit from "../../hooks/useEdit";
import useFetch from "../../hooks/useFetch";
import useInsert from "../../hooks/useInsert";
import useToggle from "../../hooks/useToggle";
import useDelete from "../../hooks/useDelete";
import Title from "../../components/admin/Title";
import { Button, Empty, Switch, Table, Input } from "antd";
import ServiceForm from "../../components/admin/ServiceForm";
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
  listService,
  editService,
  insertService,
  serviceStatus,
  deleteService,
} from "../../api/services/adminService";

function ServiceManage() {
  const [size] = useState("large");
  const [editData, setEditData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: service, setData: setService } = useFetch(listService);
  const { editItem } = useEdit(editService, setService, setIsModalVisible);
  const { toggleStatus } = useToggle(serviceStatus, setService);
  const { deleteItem } = useDelete(deleteService, setService);
  const { insertItem } = useInsert(
    insertService,
    setService,
    setIsModalVisible
  );

  const insertServiceHandler = async (formData) => {
    insertItem(formData);
  };

  const showEditWindow = (serviceToEdit) => {
    setEditData(serviceToEdit);
    showModal();
  };

  const editServiceHandler = async (formData) => {
    editItem(editData._id, formData);
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    toggleStatus(serviceId, currentStatus);
  };

  const deleteServiceHandler = async (serviceId) => {
    deleteItem(serviceId);
  };

  const filteredData = service.filter((record) =>
    record.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const showDeleteConfirm = (serviceId) => {
    const handleDelete = (serviceId) => {
      deleteServiceHandler(serviceId);
    };
    DeleteConfirm(handleDelete, serviceId);
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
          onChange={() => toggleServiceStatus(record._id, record.status)}
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
        <h2 className="text-xl font-semibold">Services</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Service
        </Button>
      </Title>
      <div className="overflow-x-auto mt-5">
        <Table
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={{ position: ["bottomCenter"], pageSize: 5 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span className="text-lg text-gray-500">
                    No services available.
                  </span>
                }
              />
            ),
          }}
        />
      </div>
      <ServiceForm
        visible={isModalVisible}
        onCreate={editData ? editServiceHandler : insertServiceHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default ServiceManage;
