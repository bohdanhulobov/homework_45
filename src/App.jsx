import { useSelector } from "react-redux";
import { Layout, Menu, Typography, theme } from "antd";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

import "./App.scss";
import Auth from "./components/Auth";
import CoursesPage from "./components/courses/CoursesPage";
import StudentsPage from "./components/StudentsPage";

function App() {
  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const items = [
    {
      key: "courses",
      label: "Courses",
    },
    {
      key: "students",
      label: "Students",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(`/${key}`);
  };

  // Get current selected menu item based on location path
  const getSelectedKey = () => {
    const path = location.pathname.split("/")[1];
    return path ? [path] : ["courses"];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: token.colorPrimary,
        }}
      >
        <Title level={3} style={{ margin: 0, color: "white" }}>
          Course Management System
        </Title>
        <Auth />
      </Header>

      <Layout>
        {user.isAuth && (
          <Sider width={200} style={{ background: token.colorBgContainer }}>
            <Menu
              onClick={handleMenuClick}
              selectedKeys={getSelectedKey()}
              mode="inline"
              items={items}
              style={{ height: "100%" }}
            />
          </Sider>
        )}

        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
            }}
          >
            {!user.isAuth ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Title level={3}>Welcome to the Course Management System</Title>
                <p>Please sign in to continue</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/courses" replace />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="*" element={<Navigate to="/courses" replace />} />
              </Routes>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
