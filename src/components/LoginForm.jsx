import { useDispatch } from "react-redux";
import { signIn } from "../store/features/currentUserSlice";
import { Button, Form, Input } from "antd";
import * as Yup from "yup";
import { Formik } from "formik";

import "./LoginForm.scss";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(signIn({ login: values.username }));
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
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
        <Form
          name="basic"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className="login-form"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            validateStatus={errors.username && touched.username ? "error" : ""}
            help={touched.username && errors.username}
          >
            <Input
              placeholder="Username"
              size="large"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            name="password"
            validateStatus={errors.password && touched.password ? "error" : ""}
            help={touched.password && errors.password}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
}
