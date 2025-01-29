import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, notification, Modal, Form, Input } from "antd";
import "./AddUsers.css";
function AddUsers() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/getAllUser"
      );
      setUsers(response.data.users);
    } catch (error) {
      notification.error({ message: "Error fetching users" });
    }
  };

  const showModal = async (user) => {
    setCurrentUser(user);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/getUser/${user._id}`
      );
      const userDetails = response.data.user;
      form.setFieldsValue({
        username: userDetails.username,
        email: userDetails.email,
        password: "",
      });
      setIsModalVisible(true);
    } catch (error) {
      notification.error({ message: "Error fetching user details" });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsAddModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      if (!values.password) delete values.password;
      await axios.put(
        `http://localhost:5000/api/users/updateUser/${currentUser._id}`,
        values
      );
      notification.success({ message: "User updated successfully" });
      fetchUsers();
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: "Error updating user" });
    }
  };

  const handleAddUser = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/users/register", values);
      notification.success({ message: "User added successfully" });
      fetchUsers();
      setIsAddModalVisible(false);
    } catch (error) {
      notification.error({ message: "Error adding user" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/deleteUser/${id}`);
      notification.success({ message: "User deleted successfully" });
      fetchUsers();
    } catch (error) {
      notification.error({ message: "Error deleting user" });
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <div>
          <Button
            type="default"
            className="bg-blue-700 hover:!bg-blue-500 text-white px-4 py-1 mr-2"
            onClick={() => showModal(user)}
          >
            Edit
          </Button>
          <Button
            type="default"
            className="bg-red-700 hover:!bg-red-500 text-white px-4 py-1 ml-2"
            onClick={() => handleDelete(user._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center">Manage Users</h1>

      <div className="bg-white p-4 shadow-lg rounded-2xl">
        {/* Right Aligned Add User Button */}
        <div className="flex justify-end pr-28 mb-4">
          <Button
            type="primary"
            onClick={() => {
              form.resetFields(); // Ensure empty fields
              setIsAddModalVisible(true);
            }}
          >
            Add User
          </Button>
        </div>

        {/* Table with full width */}
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 6 }}
          scroll={{ x: 800 }}
          className="w-full max-w-screen-xl mx-auto custom-table"
        />
      </div>

      {/* Add User Modal */}
      <Modal
        title="Add User"
        visible={isAddModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
            <Button onClick={handleCancel} className="ml-2">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update User Modal */}
      <Modal
        title="Update User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button onClick={handleCancel} className="ml-2">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddUsers;
