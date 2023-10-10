import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../utils/alertSlice";
import UserLayout from "../../components/layout/UserLayout";
import { getAbout } from "../../api/services/userService";

function About() {
  const [adminData, setAdminData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        dispatch(showLoading());
        const response = await getAbout();
        dispatch(hideLoading());
        const adminData = response.data.data;
        setAdminData(adminData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching About:", error);
        setAdminData({});
      }
    };
    fetchAbout();
  }, []);

  if (!adminData.name) {
    dispatch(showLoading());
  }

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h1 className="text-2xl font-semibold">{adminData.name}</h1>
          <p className="text-gray-600 font-sans">{adminData.email}</p>
          <p className="text-gray-600 font-sans">{adminData.phone}</p>
          <p className="text-gray-600 font-sans">{adminData.address}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          <ul className="list-disc ml-6  font-sans">
            <li>Instagram: {adminData.contact?.instagram}</li>
            <li>LinkedIn: {adminData.contact?.linkedIn}</li>
            <li>GitHub: {adminData.contact?.github}</li>
            <li>Twitter: {adminData.contact?.twitter}</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold">Education</h2>
          <ul className="list-disc ml-6  font-sans">
            {adminData.education?.map((edu, index) => (
              <li key={index}>
                {edu.institution} - {edu.course} ({edu.branch}), Graduated in{" "}
                {edu.year}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Skills</h2>
          <ul className="list-disc ml-6  font-sans">
            {adminData.skill?.map((skill, index) => (
              <li key={index}>
                {skill.name} - {skill.proficiency} level
              </li>
            ))}
          </ul>
        </div>
      </div>
    </UserLayout>
  );
}

export default About;
