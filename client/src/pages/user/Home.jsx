import { motion } from "framer-motion";
import Banner from "../../components/user/Banner";
import UserLayout from "../../components/layout/UserLayout";
import ProjectCard from "../../components/user/ProjectCard";

function Home() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <UserLayout>
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <Banner />
        <ProjectCard />
      </motion.div>
    </UserLayout>
  );
}

export default Home;
