import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Empty, Modal, Switch } from "antd";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  listService,
  insertService,
  editService,
  serviceStatus,
  deleteService,
} from "../../api/services/adminService";
import Title from "../../components/admin/Title";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import ServiceForm from "../../components/admin/ServiceForm";

function ServiceManage() {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [size] = useState("large");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        dispatch(showLoading());
        const response = await listService();
        dispatch(hideLoading());
        const serviceData = response.data.data;
        setServices(serviceData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching services:", error);
        setServices([]);
      }
    };
    fetchServices();
  }, [dispatch]);

  const insertServiceHandler = async (formData) => {
    try {
      dispatch(showLoading());
      const response = await insertService(formData);
      dispatch(hideLoading());
      if (response.data.success) {
        const newService = response.data.savedService;
        setServices([...services, newService]);
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

  const editServiceHandler = (serviceId, image, title, description, link) => {
    const serviceToEdit = {
      _id: serviceId,
      image: image,
      title: title,
      description: description,
      link: link,
    };
    setEditData(serviceToEdit);
    showModal();
  };

  const editExistingServiceHandler = async (formData) => {
    try {
      const response = await editService(editData._id, formData);
      if (response.data.success) {
        const updatedService = response.data.savedService;
        const updatedServices = services.map((service) =>
          service._id === updatedService._id ? updatedService : service
        );
        setServices(updatedServices);
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

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await serviceStatus(serviceId, newStatus);
      if (response.data.success) {
        const updatedServicesResponse = await listService();
        const updatedServicesData = updatedServicesResponse.data;
        setServices(updatedServicesData);
        toast.success(response.data.message);
        const updatedServices = services.map((service) =>
          service._id === serviceId
            ? { ...service, status: newStatus }
            : service
        );
        setServices(updatedServices);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const deleteServiceHandler = async (serviceId) => {
    try {
      const response = await deleteService(serviceId);
      if (response.data.success) {
        const updatedServices = services.filter(
          (service) => service._id !== serviceId
        );
        setServices(updatedServices);
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

  const showDeleteConfirm = (serviceId) => {
    confirm({
      title: "Are you sure you want to delete this service?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        deleteServiceHandler(serviceId);
      },
      onCancel() {},
    });
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Services</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Service
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
            {services.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-14">
                  <div className="flex justify-center items-center h-full">
                    <Empty
                      description={
                        <span className="text-lg text-gray-500">
                          No services available.
                        </span>
                      }
                    />
                  </div>
                </td>
              </tr>
            ) : (
              services.map((service, index) => (
                <tr key={service._id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 flex justify-center">
                    <img
                      src={service.image}
                      alt={service.title}
                      width="200"
                      className="rounded-lg"
                    />
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    {service.title}
                  </td>
                  <td className="text-center border border-gray-300 py-2 max-w-md">
                    {service.description}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    <Switch
                      className="bg-light-purple"
                      checked={service.status}
                      onChange={() =>
                        toggleServiceStatus(service._id, service.status)
                      }
                    />
                  </td>
                  <td className="text-center border border-gray-300">
                    <Button
                      icon={<EditOutlined />}
                      size={size}
                      onClick={() =>
                        editServiceHandler(
                          service._id,
                          service.image,
                          service.title,
                          service.description,
                          service.link
                        )
                      }
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      size={size}
                      onClick={() => showDeleteConfirm(service._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ServiceForm
        visible={isModalVisible}
        onCreate={editData ? editExistingServiceHandler : insertServiceHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default ServiceManage;
