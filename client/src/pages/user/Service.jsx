import { Input } from "antd";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import UserLayout from "../../components/layout/UserLayout";
import { listService } from "../../api/services/userService";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

function Service() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
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
    inputRef.current && inputRef.current.focus();
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
      <div
        className="px-4 pb-3 flex items-center justify-between"
      >
        <h2 className="text-3xl font-semibold">Services</h2>
        <div className="flex items-center">
          <Input
            ref={inputRef}
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
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4"
      >
        {filteredServices.map((service, index) => (
          <motion.div
            key={service._id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.05, delay: index * 0.05 }}
            className="col-span-1 transform hover:scale-105 hover:shadow-md transition duration-300 ease-in-out"
          >
            <motion.div>
              <div className="bg-white shadow-md rounded-lg cursor-pointer">
                <img
                  alt={service.title}
                  src={service.image}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </UserLayout>
  );
}

export default Service;
