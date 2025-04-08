import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Card, Typography, Space } from "antd";

import { selectAll } from "../../store/selectors/coursesSelectors";
import CoursesList from "./CoursesList";
import CourseForm from "./CourseForm";
import { deleteItem } from "../../store/features/coursesSlice";

const { Title } = Typography;

export default function CoursesPage() {
  const data = useSelector(selectAll);

  const [isAddFormShown, setIsAddFormShown] = useState(false);
  const [isEditModalShown, setIsEditModalShown] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);

  const dispatch = useDispatch();

  const showAddCourseForm = () => {
    setIsAddFormShown(true);
  };

  const hideAddCourseForm = () => {
    setIsAddFormShown(false);
  };

  const handleCourseEdit = (courseId) => {
    setIsEditModalShown(true);
    setEditCourseId(courseId);
  };

  const handleCourseDelete = (courseId) => {
    dispatch(deleteItem(courseId));
  };

  const hideEditModal = () => {
    setIsEditModalShown(false);
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Title level={3}>Courses</Title>
          <Button type="primary" size="large" onClick={showAddCourseForm}>
            Add Course
          </Button>
        </Space>

        {isAddFormShown && (
          <Card title="Add New Course">
            <CourseForm onSave={hideAddCourseForm} />
          </Card>
        )}

        <CoursesList
          items={data}
          onEdit={handleCourseEdit}
          onDelete={handleCourseDelete}
        />

        <Modal
          title="Edit Course"
          open={isEditModalShown}
          onCancel={hideEditModal}
          footer={null}
          width={600}
        >
          <CourseForm courseId={editCourseId} onSave={hideEditModal} />
        </Modal>
      </Space>
    </Card>
  );
}
