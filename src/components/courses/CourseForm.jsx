import { Button, Form, Input, DatePicker, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, updateCourse } from "../../store/features/coursesSlice";
import { selectById } from "../../store/selectors/coursesSelectors";
import dayjs from "dayjs";
import * as Yup from "yup";
import { Formik } from "formik";

const courseSchema = Yup.object().shape({
  name: Yup.string()
    .required("Course name is required")
    .min(3, "Course name must be at least 3 characters"),
  description: Yup.string(),
  lessonCount: Yup.number()
    .required("Number of lessons is required")
    .positive("Must be a positive number")
    .integer("Must be a whole number"),
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
});

export default function CourseForm({ onSave, courseId }) {
  const dispatch = useDispatch();
  const currentCourse = useSelector((state) => selectById(state, courseId));

  const initialValues = {
    name: currentCourse?.name || "",
    description: currentCourse?.description || "",
    lessonCount: currentCourse?.lessonCount || 1,
    startDate: currentCourse?.startDate ? dayjs(currentCourse.startDate) : null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
      };

      if (courseId) {
        await dispatch(
          updateCourse({ ...formattedValues, id: courseId }),
        ).unwrap();
      } else {
        await dispatch(addCourse(formattedValues)).unwrap();
      }

      onSave();
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={courseSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form
          name="course"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <h3>{courseId ? "Edit Course" : "Create Course"}</h3>

          <Form.Item
            label="Name"
            validateStatus={errors.name && touched.name ? "error" : ""}
            help={touched.name && errors.name}
          >
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={
              errors.description && touched.description ? "error" : ""
            }
            help={touched.description && errors.description}
          >
            <TextArea
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Number of Lessons"
            validateStatus={
              errors.lessonCount && touched.lessonCount ? "error" : ""
            }
            help={touched.lessonCount && errors.lessonCount}
          >
            <InputNumber
              min={1}
              name="lessonCount"
              value={values.lessonCount}
              onChange={(value) => setFieldValue("lessonCount", value)}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Start Date"
            validateStatus={
              errors.startDate && touched.startDate ? "error" : ""
            }
            help={touched.startDate && errors.startDate}
          >
            <DatePicker
              name="startDate"
              value={values.startDate}
              onChange={(date) => setFieldValue("startDate", date)}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
}
