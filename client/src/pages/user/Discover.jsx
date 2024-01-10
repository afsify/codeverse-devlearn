import { useLocation } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import { motion } from "framer-motion";

function Discover() {
  const location = useLocation();
  const service = location?.state.service;

  return (
    <UserLayout>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg p-4"
        >
          <div className="relative w-full h-40 sm:h-80 md:h-[500px]">
            <img
              alt={service.title}
              src={service.image}
              className="w-full h-full object-cover rounded-lg mb-4"
            />
          </div>
          <div className="flex justify-center items-center flex-col">
            <h3 className="text-3xl font-semibold text-center mb-1 mt-4">
              {service.title}
            </h3>
            <p className="text-gray-600 text-center md:w-1/2 mb-4">
              {service.description}
            </p>
          </div>
        </motion.div>
      )}
    </UserLayout>
  );
}

export default Discover;
