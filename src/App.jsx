import { useSelector } from "react-redux";
import { Layout, Menu, Typography, theme, Button } from "antd";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import {
  BookOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

import "./App.scss";
import AccountInfo from "./components/AccountInfo";
import LoginForm from "./components/LoginForm";
import CoursesPage from "./components/courses/CoursesPage";
import StudentsPage from "./components/StudentsPage";

function App() {
  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      if (newIsMobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = [
    {
      key: "courses",
      label: "Courses",
      icon: <BookOutlined />,
    },
    {
      key: "students",
      label: "Students",
      icon: <UserOutlined />,
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

  if (!user.isAuth) {
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
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
          }}
        >
          <div className="header-logo">
            <Title
              level={isMobile ? 5 : 3}
              style={{ margin: 0, color: "white" }}
            >
              <BookOutlined style={{ marginRight: "10px" }} />
              {!isMobile && "Course Management System"}
              {isMobile && "CMS"}
            </Title>
          </div>
        </Header>

        <Layout style={{ padding: isMobile ? "12px" : "24px" }}>
          <Content
            style={{
              padding: isMobile ? 16 : 24,
              margin: 0,
              background: token.colorBgContainer,
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="login-container">
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                  padding: isMobile ? "16px 0" : "24px 0",
                }}
              >
                <Title level={isMobile ? 4 : 3}>
                  Welcome to the Course Management System
                </Title>
                <p style={{ marginTop: "8px", color: "rgba(0, 0, 0, 0.65)" }}>
                  Sign in to access your courses
                </p>
              </div>
              <LoginForm />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  // Layout for authenticated users with sidebar
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
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div className="header-logo">
          <Title level={isMobile ? 5 : 3} style={{ margin: 0, color: "white" }}>
            <BookOutlined style={{ marginRight: "10px" }} />
            {!isMobile && "Course Management System"}
            {isMobile && "CMS"}
          </Title>
        </div>

        <div className="header-right">
          <AccountInfo />
        </div>
      </Header>

      <Layout>
        {/* Side menu only for authenticated users */}
        <Sider
          width={200}
          style={{
            background: token.colorBgContainer,
            boxShadow: "inset -1px 0 0 rgba(0, 0, 0, 0.05)",
            position: "relative",
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={isMobile ? 0 : 80}
          trigger={null}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Menu
              onClick={handleMenuClick}
              selectedKeys={getSelectedKey()}
              mode="inline"
              items={menuItems}
              style={{
                flex: 1,
                borderRight: "none",
                paddingTop: "20px",
                paddingBottom: "50px",
              }}
            />

            <Button
              type="primary"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "40px",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            >
              {!collapsed && "Collapse"}
            </Button>
          </div>
        </Sider>

        <Layout style={{ padding: isMobile ? "12px" : "24px" }}>
          <Content
            style={{
              padding: isMobile ? 16 : 24,
              margin: 0,
              background: token.colorBgContainer,
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/courses" replace />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="*" element={<Navigate to="/courses" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
