import PropTypes from "prop-types";
import { motion } from "framer-motion";

function Name({ children }) {
  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-purple text-white sticky top-0 z-20 rounded-xl h-16 flex justify-center px-4 shadow-md shadow-black"
    >
      <div className="flex justify-between w-full container items-center gap-x-2">
        {children}
      </div>
    </motion.div>
  );
}

Name.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Name;
