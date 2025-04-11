import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Card, Typography, Space, Spin, message } from "antd";

import { selectAll } from "../../store/selectors/coursesSelectors";
import CoursesList from "./CoursesList";
import CourseForm from "./CourseForm";
import { fetchCourses, deleteCourse } from "../../store/features/coursesSlice";

const { Title } = Typography;

export default function CoursesPage() {
  const courses = useSelector(selectAll);
  const loading = useSelector((state) => state.courses.loading);
  const error = useSelector((state) => state.courses.error);

  const [isAddFormShown, setIsAddFormShown] = useState(false);
  const [isEditModalShown, setIsEditModalShown] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to load courses: ${error}`);
    }
  }, [error]);

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

  const handleCourseDelete = async (courseId) => {
    try {
      await dispatch(deleteCourse(courseId)).unwrap();
      message.success("Course deleted successfully");
    } catch (error) {
      message.error(`Failed to delete course: ${error}`);
    }
  };

  const hideEditModal = () => {
    setIsEditModalShown(false);
  };

  return (
    <Card>
      <Spin spinning={loading}>
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
            items={courses}
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
      </Spin>
    </Card>
  );
}
