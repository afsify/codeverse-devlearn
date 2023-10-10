import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Title from "../../components/admin/Title";
import { Form, Input, Button, Select } from "antd";
import { getAdmin, updateAbout } from "../../api/services/adminService";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";

const { Option } = Select;

function Settings() {
  const dispatch = useDispatch();
  const [adminData, setAdminData] = useState({});
  const [form] = Form.useForm();

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
  }, [form]);

  const onFinish = async (values) => {
    try {
      await updateAbout(adminData._id, values);
      const updatedAdmin = { ...adminData, ...values };
      setAdminData(updatedAdmin);
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Settings</h2>
      </Title>
      <div className="mx-auto p-4 bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/4">
        <Form
          form={form}
          name="admin-form"
          initialValues={adminData}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item label="Contact" name="contact">
            <Input.Group compact>
              <Form.Item name={["contact", "instagram"]} noStyle>
                <Input placeholder="Instagram" />
              </Form.Item>
              <Form.Item name={["contact", "linkedIn"]} noStyle>
                <Input placeholder="LinkedIn" />
              </Form.Item>
              <Form.Item name={["contact", "github"]} noStyle>
                <Input placeholder="GitHub" />
              </Form.Item>
              <Form.Item name={["contact", "twitter"]} noStyle>
                <Input placeholder="Twitter" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.List name="education">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} className="mb-4">
                    <Form.Item
                      {...restField}
                      label="Institution"
                      name={[name, "institution"]}
                      fieldKey={[fieldKey, "institution"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the institution",
                        },
                      ]}
                    >
                      <Input placeholder="Institution" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Course"
                      name={[name, "course"]}
                      fieldKey={[fieldKey, "course"]}
                      rules={[
                        { required: true, message: "Please enter the course" },
                      ]}
                    >
                      <Input placeholder="Course" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Branch"
                      name={[name, "branch"]}
                      fieldKey={[fieldKey, "branch"]}
                    >
                      <Input placeholder="Branch" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Year"
                      name={[name, "year"]}
                      fieldKey={[fieldKey, "year"]}
                      rules={[
                        {
                          type: "number",
                          message: "Please enter a valid year",
                        },
                      ]}
                    >
                      <Input type="number" placeholder="Year" />
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        remove(name);
                      }}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  Add Education
                </Button>
              </div>
            )}
          </Form.List>
          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} className="mb-4">
                    <Form.Item
                      {...restField}
                      label="Skill"
                      name={[name, "name"]}
                      fieldKey={[fieldKey, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the skill name",
                        },
                      ]}
                    >
                      <Input placeholder="Skill Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Proficiency"
                      name={[name, "proficiency"]}
                      fieldKey={[fieldKey, "proficiency"]}
                    >
                      <Select>
                        <Option value="Beginner">Beginner</Option>
                        <Option value="Intermediate">Intermediate</Option>
                        <Option value="Advanced">Advanced</Option>
                        <Option value="Expert">Expert</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        remove(name);
                      }}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  Add Skill
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AdminLayout>
  );
}

export default Settings;
