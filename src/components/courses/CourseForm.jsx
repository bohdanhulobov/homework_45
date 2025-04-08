import { Button, Form, Input, DatePicker, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { addItem, editItem } from "../../store/features/coursesSlice";
import { selectById } from "../../store/selectors/coursesSelectors";
import dayjs from "dayjs";

export default function CourseForm({ onSave, courseId }) {
  const dispatch = useDispatch();

  const currentCourse = useSelector((state) => selectById(state, courseId));

  const handleCourseSaveNew = (values) => {
    const id = Date.now();
    const formattedValues = {
      ...values,
      startDate: values.startDate
        ? values.startDate.format("YYYY-MM-DD")
        : null,
    };
    dispatch(addItem({ ...formattedValues, id }));
    onSave();
  };

  const handleCourseSaveEdit = (values) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate
        ? values.startDate.format("YYYY-MM-DD")
        : null,
    };
    dispatch(editItem({ ...formattedValues, id: courseId }));
    onSave();
  };

  return (
    <Form
      name="course"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={!courseId ? handleCourseSaveNew : handleCourseSaveEdit}
      autoComplete="off"
      className="course-form"
      initialValues={{
        name: currentCourse?.name,
        description: currentCourse?.description,
        lessonCount: currentCourse?.lessonCount,
        startDate: currentCourse?.startDate
          ? dayjs(currentCourse.startDate)
          : null,
      }}
    >
      <h3>{courseId ? "Edit Course" : "Create Course"}</h3>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input the course name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: false }]}
      >
        <TextArea />
      </Form.Item>

      <Form.Item
        label="Number of Lessons"
        name="lessonCount"
        rules={[
          { required: true, message: "Please input the number of lessons!" },
        ]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Please select the start date!" }]}
      >
        <DatePicker />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
}
