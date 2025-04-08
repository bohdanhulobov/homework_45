import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Table,
  Typography,
  Space,
  Card,
  Popconfirm,
} from "antd";
import StudentForm from "./StudentForm";
import { deleteStudent } from "../store/features/studentsSlice";
import { selectAll } from "../store/selectors/studentsSelectors";

const { Title } = Typography;

export default function StudentsPage() {
  const students = useSelector(selectAll);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

  const handleAdd = () => {
    setEditStudentId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (id) => {
    setEditStudentId(id);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Social Networks",
      dataIndex: "socialNetworkLinks",
      key: "socialNetworkLinks",
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete Student"
            description="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Title level={3}>Students</Title>
          <Button type="primary" onClick={handleAdd} size="large">
            Add Student
          </Button>
        </Space>

        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />

        <Modal
          title={editStudentId ? "Edit Student" : "Add Student"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <StudentForm
            studentId={editStudentId}
            onSave={() => setIsModalVisible(false)}
          />
        </Modal>
      </Space>
    </Card>
  );
}
