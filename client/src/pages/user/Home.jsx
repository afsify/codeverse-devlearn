import { Spin } from "antd";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import Banner from "../../components/user/Banner";
import LazyLoader from "../../components/user/LazyLoader";
import UserLayout from "../../components/layout/UserLayout";
import ProjectCard from "../../components/user/ProjectCard";
const LazyCourseCard = lazy(() => import("../../components/user/CourseCard"));

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
        <Suspense
          fallback={
            <Spin
              size="large"
              className="flex h-screen justify-center items-center"
            />
          }
        >
          <LazyCourseCard />
        </Suspense>
        <LazyLoader>
          <ProjectCard />
        </LazyLoader>
      </motion.div>
    </UserLayout>
  );
}

export default Home;
