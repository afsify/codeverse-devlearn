import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Card, Typography } from "antd";
import UserLayout from "../../components/layout/UserLayout";
import { listService } from "../../api/services/userService";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

function Service() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        dispatch(showLoading());
        const response = await listService();
        dispatch(hideLoading());
        const serviceData = response.data.data;
        setServices(serviceData);
        setFilteredServices(serviceData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching services:", error);
        setServices([]);
        setFilteredServices([]);
      }
    };
    fetchServices();
  }, [dispatch]);

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    filterServices(input);
  };

  const filterServices = (input) => {
    const filtered = services.filter((service) =>
      service.title.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredServices(services);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <UserLayout>
      <div className="px-4 pb-3 flex items-center justify-between">
        <Title level={2}>Services</Title>
        <div className="flex items-center">
          <Input
            placeholder="Search services"
            value={searchInput}
            onChange={handleSearchInputChange}
            className="rounded-md py-2 w-44"
            prefix={
              <SearchOutlined
                style={{ color: "#1890ff", marginRight: "5px" }}
              />
            }
            suffix={
              searchInput && (
                <CloseCircleOutlined
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={clearSearchInput}
                />
              )
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service._id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => navigate(`${service.link}`, { state: { service } })}
            transition={{ duration: 0.05, delay: index * 0.05 }}
            className="col-span-1 transform rounded-lg transition duration-300 ease-in-out"
          >
            <motion.div>
              <Card
                cover={
                  <img
                    alt={service.title}
                    src={service.image}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                }
                className=" shadow-md hover:scale-105 hover:shadow-xl duration-300 overflow-hidden rounded-lg cursor-pointer"
              >
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-500">{service.description}</p>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </UserLayout>
  );
}

export default Service;
