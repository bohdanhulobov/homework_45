import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Typography,
  Button,
  Space,
  Descriptions,
  Divider,
  Table,
  Modal,
  Select,
  Form,
  message,
  Spin,
} from "antd";
import { ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons";
import { selectById } from "../../store/selectors/coursesSelectors";
import { selectAll as selectAllStudents } from "../../store/selectors/studentsSelectors";
import {
  assignStudentToCourse,
  fetchCourses,
} from "../../store/features/coursesSlice";
import * as Yup from "yup";
import { Formik } from "formik";

const { Title } = Typography;

const assignStudentSchema = Yup.object().shape({
  studentId: Yup.string().required("Student is required"),
});

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const course = useSelector((state) => selectById(state, id));
  const allStudents = useSelector(selectAllStudents);
  const loading = useSelector((state) => state.courses.loading);

  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [courseStudents, setCourseStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(true);

  useEffect(() => {
    if (!course) {
      dispatch(fetchCourses());
    }
  }, [course, dispatch]);

  useEffect(() => {
    if (id) {
      setFetchingStudents(true);
      fetch(`http://localhost:3000/courses/${id}/students`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setCourseStudents(data || []);
          setFetchingStudents(false);
        })
        .catch((error) => {
          console.error("Error fetching course students:", error);
          message.error(`Failed to load students: ${error.message}`);
          setFetchingStudents(false);
        });
    }
  }, [id]);

  const handleBack = () => {
    navigate("/courses");
  };

  const handleAssignStudent = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(
        assignStudentToCourse({
          courseId: id,
          studentId: values.studentId,
        }),
      ).unwrap();

      setFetchingStudents(true);
      const response = await fetch(
        `http://localhost:3000/courses/${id}/students`,
      );
      if (!response.ok) {
        throw new Error(`Failed to refresh students: ${response.status}`);
      }
      const data = await response.json();
      setCourseStudents(data || []);

      message.success("Student assigned to course successfully");
      setIsAssignModalVisible(false);
      resetForm();
    } catch (error) {
      message.error(`Failed to assign student to course: ${error.message}`);
    } finally {
      setSubmitting(false);
      setFetchingStudents(false);
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
  ];

  const isLoading = loading || fetchingStudents;

  if (!course) {
    return (
      <Card>
        <Spin spinning={loading}>
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Title level={3}>Loading course...</Title>
            {!loading && (
              <>
                <p>
                  Course not found. The course may have been deleted or you
                  entered an invalid URL.
                </p>
                <Button type="primary" onClick={handleBack}>
                  Back to Courses
                </Button>
              </>
            )}
          </div>
        </Spin>
      </Card>
    );
  }

  return (
    <Card>
      <Spin spinning={isLoading}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ paddingLeft: 0 }}
          >
            Back to Courses
          </Button>

          <Title level={2}>{course.name}</Title>

          <Descriptions bordered>
            <Descriptions.Item label="Description" span={3}>
              {course.description || "No description provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Number of Lessons">
              {course.lessonCount || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {course.startDate || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">
            <Space>
              <span>Students Enrolled</span>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setIsAssignModalVisible(true)}
              >
                Assign Student
              </Button>
            </Space>
          </Divider>

          <Table
            dataSource={courseStudents}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "No students assigned to this course yet" }}
          />
        </Space>
      </Spin>

      <Modal
        title="Assign Student to Course"
        open={isAssignModalVisible}
        onCancel={() => setIsAssignModalVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{ studentId: "" }}
          validationSchema={assignStudentSchema}
          onSubmit={handleAssignStudent}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Student"
                validateStatus={
                  errors.studentId && touched.studentId ? "error" : ""
                }
                help={touched.studentId && errors.studentId}
              >
                <Select
                  name="studentId"
                  placeholder="Select a student"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    handleChange({ target: { name: "studentId", value } });
                  }}
                  onBlur={handleBlur}
                  value={values.studentId}
                >
                  {allStudents.map((student) => (
                    <Select.Option key={student.id} value={student.id}>
                      {student.fullname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Space>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Assign
                </Button>
                <Button onClick={() => setIsAssignModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form>
          )}
        </Formik>
      </Modal>
    </Card>
  );
}
