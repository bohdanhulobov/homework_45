import { useDispatch } from "react-redux";
import { signIn } from "../store/features/currentUserSlice";
import { Button, Form, Input } from "antd";

import "./LoginForm.scss";

export default function LoginForm() {
  const dispatch = useDispatch();

  const signIntoSite = (values) => {
    dispatch(signIn({ login: values.username }));
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      onFinish={signIntoSite}
      autoComplete="off"
      className="login-form"
      requiredMark={false}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="Username" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Password" size="large" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large">
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}
