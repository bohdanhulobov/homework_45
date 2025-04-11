import { Button, Form, Input, Select, DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, editStudent } from "../store/features/studentsSlice";
import { selectById } from "../store/selectors/studentsSelectors";
import dayjs from "dayjs";
import * as Yup from "yup";
import { Formik } from "formik";

const studentSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Full name should only contain letters and spaces",
    ),
  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female", "other"], "Invalid gender selected"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  socialNetworkLinks: Yup.string()
    .optional()
    .test(
      "valid-links",
      "Please enter valid URLs with http:// or https://",
      function (value) {
        if (!value) return true; // Skip validation if empty

        const urls = value
          .split(/[,\n]/)
          .map((url) => url.trim())
          .filter((url) => url !== "");
        const urlRegex =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        return urls.every((url) => urlRegex.test(url));
      },
    ),
});

export default function StudentForm({ studentId, onSave }) {
  const dispatch = useDispatch();
  const student = useSelector((state) => selectById(state, studentId));

  const initialValues = {
    fullname: student?.fullname || "",
    dateOfBirth: student?.dateOfBirth ? dayjs(student.dateOfBirth) : null,
    gender: student?.gender || "",
    city: student?.city || "",
    socialNetworkLinks: student?.socialNetworkLinks || "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
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

    setSubmitting(false);
    onSave();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={studentSchema}
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
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Full Name"
            validateStatus={errors.fullname && touched.fullname ? "error" : ""}
            help={touched.fullname && errors.fullname}
          >
            <Input
              name="fullname"
              value={values.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            validateStatus={
              errors.dateOfBirth && touched.dateOfBirth ? "error" : ""
            }
            help={touched.dateOfBirth && errors.dateOfBirth}
          >
            <DatePicker
              style={{ width: "100%" }}
              name="dateOfBirth"
              value={values.dateOfBirth}
              onChange={(date) => setFieldValue("dateOfBirth", date)}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            validateStatus={errors.gender && touched.gender ? "error" : ""}
            help={touched.gender && errors.gender}
          >
            <Select
              name="gender"
              value={values.gender}
              onChange={(value) => setFieldValue("gender", value)}
              onBlur={handleBlur}
            >
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="City"
            validateStatus={errors.city && touched.city ? "error" : ""}
            help={touched.city && errors.city}
          >
            <Input
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Social Network Links"
            validateStatus={
              errors.socialNetworkLinks && touched.socialNetworkLinks
                ? "error"
                : ""
            }
            help={touched.socialNetworkLinks && errors.socialNetworkLinks}
          >
            <Input.TextArea
              name="socialNetworkLinks"
              value={values.socialNetworkLinks}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter social network links (e.g., Facebook: https://facebook.com/profile, LinkedIn: https://linkedin.com/in/profile)"
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save
              </Button>
              <Button onClick={onSave}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
}
