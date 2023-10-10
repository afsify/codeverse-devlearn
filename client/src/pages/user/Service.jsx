import { useState, useEffect } from "react";
import UserLayout from "../../components/layout/UserLayout";
import { listService } from "../../api/services/userService";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";

function Service() {
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();

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
  }, []);

  return (
    <UserLayout>
      <div className="site-card-wrapper p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <div
              key={service._id}
              className="col-span-1 transform hover:scale-105 hover:shadow-md transition duration-300 ease-in-out"
            >
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
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}

export default Service;
