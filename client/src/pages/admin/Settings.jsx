import toast from "react-hot-toast";
import { Image } from "cloudinary-react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Title from "../../components/admin/Title";
import { cloudUpload } from "../../api/cloudinary";
import imageLinks from "../../assets/images/imageLinks";
import AdminLayout from "../../components/layout/AdminLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { Form, Input, Button, Select, Upload, Collapse } from "antd";
import { CameraOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getAdmin, updateAbout } from "../../api/services/adminService";

const { Option } = Select;
const { Panel } = Collapse;

function Settings() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState(adminData?.resume || null);
  const [image, setImage] = useState(adminData?.image || imageLinks.profile);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        dispatch(showLoading());
        const response = await getAdmin();
        dispatch(hideLoading());
        const adminDetail = response.data.data;
        setAdminData(adminDetail);
        form.setFieldsValue(adminDetail);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching admin:", error);
      }
    };
    fetchAdmin();
  }, [dispatch, form]);

  const onFinish = async (values) => {
    try {
      const updatedValues = { ...values, image, resume };
      const response = await updateAbout(adminData._id, updatedValues);
      const updatedAdmin = { ...adminData, ...values };
      setAdminData(updatedAdmin);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (adminData?.image) {
      setImage(adminData.image);
    }
  }, [adminData]);

  const customRequest = async (options) => {
    try {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      setUploading(true);
      const response = await cloudUpload(formData);
      const cloudinaryImageUrl = response.data.secure_url;
      setImage(cloudinaryImageUrl);
      setUploading(false);
    } catch (error) {
      console.log("Error Uploading Image", error);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (adminData?.resume) {
      setResume(adminData.resume);
    }
  }, [adminData]);

  const onResumeUpload = async (options) => {
    try {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      setLoading(true);
      const response = await cloudUpload(formData);
      const cloudinaryImageUrl = response.data.secure_url;
      setResume(cloudinaryImageUrl);
      setLoading(false);
    } catch (error) {
      console.log("Error Uploading Image", error);
      setLoading(false);
    }
  };

  function formatNameForCV(name) {
    return name.toUpperCase().replace(/\s+/g, "_") + "_CV" + ".png";
  }

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Settings</h2>
      </Title>
      <div className="overflow-x-auto rounded-lg shadow-sm shadow-black mt-5 p-4">
        <Form
          form={form}
          name="admin-form"
          initialValues={adminData}
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-2xl font-semibold mb-4">About</h1>
              <div className="flex justify-around">
                <div className="w-40 h-40 relative mt-4">
                  <div className="overflow-hidden rounded-full w-40 h-40 mx-auto shadow-lg shadow-black">
                    {uploading ? (
                      <div className="w-full h-full bg-gray-300 flex justify-center items-center">
                        <div className="relative h-24 w-24">
                          <div className="rounded-full h-24 w-24 border-t-4 border-t-blue-500 animate-spin absolute"></div>
                          <div className="h-full w-full flex justify-center items-center">
                            <h1 className="text-blue-500 text-3xl font-mono font-extrabold">
                              &lt;/&gt;
                            </h1>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        className="object-cover"
                        cloudName={import.meta.env.VITE_CLOUD_NAME}
                        publicId={image}
                        width="auto"
                        height="150"
                        crop="scale"
                        alt="Profile"
                      />
                    )}
                  </div>
                  <Upload
                    customRequest={customRequest}
                    accept="image/*"
                    showUploadList={false}
                  >
                    <Button className="flex items-center justify-center text-white text-base p-2 rounded-full absolute bottom-2 right-2">
                      <CameraOutlined />
                    </Button>
                  </Upload>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-27 h-48 overflow-hidden shadow-sm shadow-black group mb-2">
                    {loading ? (
                      <div className="flex items-center justify-center w-full h-full bg-gray-300">
                        <div className="relative h-32 w-32">
                          <div className="rounded-full h-32 w-32 border-t-4 border-t-blue-500 animate-spin absolute"></div>
                          <div className="h-full w-full flex justify-center items-center">
                            <h1 className="text-blue-500 text-3xl font-mono font-extrabold">
                              &lt;/&gt;
                            </h1>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        className="object-contain w-full h-full transition-opacity duration-300 ease-in-out group-hover:opacity-50"
                        cloudName={import.meta.env.VITE_CLOUD_NAME}
                        publicId={resume || imageLinks.vertical}
                        alt="Resume"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-70 bg-black">
                      {resume && (
                        <a
                          href={resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-[8px] hover:text-blue-700 hover:underline font-semibold"
                        >
                          {formatNameForCV(adminData?.name)}
                        </a>
                      )}
                    </div>
                  </div>
                  <Upload
                    customRequest={onResumeUpload}
                    accept="image/*"
                    showUploadList={false}
                  >
                    <Button
                      shape="round"
                      size="small"
                      className="bg-blue-500 text-white"
                    >
                      Upload CV
                    </Button>
                  </Upload>
                </div>
              </div>
              <Form.Item
                name="name"
                label={<span className="font-semibold">Name</span>}
                className="mb-2"
              >
                <Input
                  placeholder="Name"
                  className="p-2 placeholder-gray-300"
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={<span className="font-semibold">Email</span>}
                className="mb-2"
              >
                <Input
                  placeholder="Email"
                  className="p-2 placeholder-gray-300"
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<span className="font-semibold">Phone</span>}
                className="mb-2"
              >
                <Input
                  placeholder="Phone"
                  className="p-2 placeholder-gray-300"
                />
              </Form.Item>
              <Form.Item
                name="address"
                label={<span className="font-semibold">Address</span>}
                className="mb-2"
              >
                <Input
                  placeholder="Address"
                  className="p-2 placeholder-gray-300"
                />
              </Form.Item>
              <Form.Item
                label={<span className="font-semibold">Contact</span>}
                className="mb-2"
                name="contact"
              >
                <Input.Group>
                  <Form.Item
                    label={
                      <span className="font-medium text-xs ml-5">LinkedIn</span>
                    }
                    name={["contact", "linkedIn"]}
                    className="mb-2"
                  >
                    <Input
                      placeholder="LinkedIn"
                      className="p-2 placeholder-gray-300"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="font-medium text-xs ml-5">GitHub</span>
                    }
                    name={["contact", "github"]}
                    className="mb-2"
                  >
                    <Input
                      placeholder="GitHub"
                      className="p-2 placeholder-gray-300"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="font-medium text-xs ml-5">YouTube</span>
                    }
                    name={["contact", "youtube"]}
                    className="mb-2"
                  >
                    <Input
                      placeholder="YouTube"
                      className="p-2 placeholder-gray-300"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="font-medium text-xs ml-5">
                        Instagram
                      </span>
                    }
                    className="mb-2"
                    name={["contact", "instagram"]}
                  >
                    <Input
                      placeholder="Instagram"
                      className="p-2 placeholder-gray-300"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="font-medium text-xs ml-5">WhatsApp</span>
                    }
                    className="mb-2"
                    name={["contact", "whatsapp"]}
                  >
                    <Input
                      placeholder="WhatsApp"
                      className="p-2 placeholder-gray-300"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={<span className="font-semibold">Education</span>}
                className="mb-2"
                name="education"
              >
                <Form.List name="education">
                  {(fields, { add, remove }) => (
                    <div className="mb-4">
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <div className="mb-4" key={key}>
                          <Collapse accordion>
                            <Panel
                              header={
                                <span className="font-semibold">
                                  {form.getFieldValue([
                                    "education",
                                    fieldKey,
                                    "institution",
                                  ])}
                                </span>
                              }
                            >
                              <Form.Item
                                {...restField}
                                label={
                                  <span className="font-medium text-xs">
                                    Institution
                                  </span>
                                }
                                className="mb-2"
                                name={[name, "institution"]}
                                fieldKey={[fieldKey, "institution"]}
                              >
                                <Input
                                  placeholder="Institution"
                                  className="p-2 placeholder-gray-300"
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label={
                                  <span className="font-medium text-xs">
                                    Course
                                  </span>
                                }
                                className="mb-2"
                                name={[name, "course"]}
                                fieldKey={[fieldKey, "course"]}
                              >
                                <Input
                                  placeholder="Course"
                                  className="p-2 placeholder-gray-300"
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label={
                                  <span className="font-medium text-xs">
                                    Branch
                                  </span>
                                }
                                className="mb-2 "
                                name={[name, "branch"]}
                                fieldKey={[fieldKey, "branch"]}
                              >
                                <Input
                                  placeholder="Branch"
                                  className="p-2 placeholder-gray-300"
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label={
                                  <span className="font-medium text-xs">
                                    Year
                                  </span>
                                }
                                className="mb-2"
                                name={[name, "year"]}
                                fieldKey={[fieldKey, "year"]}
                              >
                                <Input
                                  type="number"
                                  placeholder="Year"
                                  className="p-2 placeholder-gray-300"
                                />
                              </Form.Item>
                              <div className="flex justify-center mt-4">
                                <Button
                                  className="text-white"
                                  onClick={() => {
                                    remove(name);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </Panel>
                          </Collapse>
                        </div>
                      ))}
                      <Button
                        className="flex items-center text-white"
                        onClick={() => {
                          add();
                        }}
                      >
                        <PlusCircleOutlined />
                        Add
                      </Button>
                    </div>
                  )}
                </Form.List>
                <Form.Item
                  label={<span className="font-semibold">Skills</span>}
                  name="skill"
                >
                  <Form.List name="skill">
                    {(fields, { add, remove }) => (
                      <div>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <div className="mb-4" key={key}>
                            <Collapse accordion>
                              <Panel
                                header={
                                  <span className="font-semibold">
                                    {form.getFieldValue([
                                      "skill",
                                      fieldKey,
                                      "name",
                                    ])}
                                  </span>
                                }
                              >
                                <Form.Item
                                  {...restField}
                                  label={
                                    <span className="font-medium text-xs">
                                      Name
                                    </span>
                                  }
                                  className="mb-2"
                                  name={[name, "name"]}
                                  fieldKey={[fieldKey, "name"]}
                                >
                                  <Input
                                    placeholder="Name"
                                    className="p-2 placeholder-gray-300"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  label={
                                    <span className="font-medium text-xs">
                                      Proficiency
                                    </span>
                                  }
                                  className="mb-2"
                                  name={[name, "proficiency"]}
                                  fieldKey={[fieldKey, "proficiency"]}
                                >
                                  <Select size="large" defaultValue={30}>
                                    {[...Array(20)].map((_, index) => (
                                      <Option
                                        key={index + 1}
                                        value={(index + 1) * 5}
                                      >
                                        {(index + 1) * 5}%
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <div className="flex justify-center mt-4">
                                  <Button
                                    onClick={() => {
                                      remove(name);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </Panel>
                            </Collapse>
                          </div>
                        ))}
                        <Button
                          className="flex items-center text-white"
                          onClick={() => {
                            add();
                          }}
                        >
                          <PlusCircleOutlined />
                          Add
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <Form.Item>
              <Button
                className="font-semibold text-white"
                size="large"
                htmlType="submit"
              >
                Update About
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
}

export default Settings;
