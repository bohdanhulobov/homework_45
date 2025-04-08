import { Button, Card, Typography, Space, Tag, Popconfirm } from "antd";

const { Text, Title } = Typography;

export default function CourseCard({ onEdit, onDelete, ...course }) {
  return (
    <Card
      title={<Title level={4}>{course.name}</Title>}
      style={{ marginBottom: 16 }}
      extra={
        <Space>
          <Button type="primary" onClick={() => onEdit(course.id)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete Course"
            description="Are you sure you want to delete this course?"
            onConfirm={() => onDelete(course.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      }
    >
      <p>{course.description}</p>
      <Space direction="vertical">
        <Text strong>
          Lessons:{" "}
          <Tag color="blue">{course.lessonCount || "Not specified"}</Tag>
        </Text>
        <Text strong>
          Start Date:{" "}
          <Tag color="green">{course.startDate || "Not specified"}</Tag>
        </Text>
      </Space>
    </Card>
  );
}
