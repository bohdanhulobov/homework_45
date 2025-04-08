import { Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../store/features/currentUserSlice";
import { UserOutlined } from "@ant-design/icons";

export default function AccountInfo() {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(signOut());
  };

  return (
    <Space size={16}>
      <span style={{ color: "white" }}>
        <UserOutlined style={{ marginRight: 6 }} />
        {user.login}
      </span>
      <Button
        type="text"
        onClick={logout}
        style={{
          color: "white",
          padding: "0 8px",
          height: "32px",
          opacity: 0.9,
        }}
      >
        Sign out
      </Button>
    </Space>
  );
}
