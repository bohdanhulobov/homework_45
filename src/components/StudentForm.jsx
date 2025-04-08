import { Button, Form, Input, Select, DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, editStudent } from "../store/features/studentsSlice";
import { selectById } from "../store/selectors/studentsSelectors";
import dayjs from "dayjs";

export default function StudentForm({ studentId, onSave }) {
  const dispatch = useDispatch();
  const student = useSelector((state) => selectById(state, studentId));

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : null,
    };

    if (studentId) {
      dispatch(editStudent({ ...formattedValues, id: studentId }));
    } else {
      dispatch(addStudent({ ...formattedValues, id: Date.now() }));
    }
    onSave();
  };

  return (
    <Form
      initialValues={{
        ...student,
        dateOfBirth: student?.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      }}
      onFinish={handleFinish}
      layout="vertical"
    >
      <Form.Item
        label="Full Name"
        name="fullname"
        rules={[{ required: true, message: "Please input the full name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[{ required: true, message: "Please input the date of birth!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: "Please select the gender!" }]}
      >
        <Select>
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
          <Select.Option value="other">Other</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="City"
        name="city"
        rules={[{ required: true, message: "Please input the city!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Social Network Links"
        name="socialNetworkLinks"
        rules={[{ required: false }]}
      >
        <Input.TextArea
          placeholder="Enter social network links (e.g., Facebook: https://facebook.com/profile, LinkedIn: https://linkedin.com/in/profile)"
          rows={4}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onSave}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
