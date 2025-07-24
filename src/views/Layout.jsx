import { Layout, Grid } from "antd";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useTheme } from "../context/useTheme";
import { Toaster } from "react-hot-toast";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

const layoutStyle = {
  minHeight: "100vh",
};

const PageLayout = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md; // true if screen is < 768px
  const { theme } = useTheme();

  const layoutStyle = {
    minHeight: "100vh",
    backgroundColor: theme === "light" ? "#ffffff" : "#111827",
    color: theme === "light" ? "#000" : "#fff",
  };

  const contentStyle = {
    flex: 1,
    padding: "16px",
    backgroundColor: theme === "light" ? "#fff" : "#111827",
    overflowY: "auto",
  };

  const siderStyle = {
    backgroundColor: theme === "light" ? "#fff" : "#111827",
    borderRight: "1px solid #e8e8e8",
    overflow: "hidden",
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  };

  const headerStyle = {
    backgroundColor: theme === "light" ? "#fff" : "#111827",
    color: theme === "light" ? "#000" : "#fff",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
  };

  const footerStyle = {
    backgroundColor: theme === "light" ? "#fff" : "#111827",
    color: theme === "light" ? "#000" : "#fff",
    padding: "12px 16px",
  };

  return (
    <Layout style={layoutStyle}>
      <Toaster />
      {!isMobile && (
        <Sider width={240} style={siderStyle}>
          <SideBar />
        </Sider>
      )}

      <Layout
        style={{
          marginLeft: !isMobile ? 240 : 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {isMobile && (
          <Header style={headerStyle}>
            <HeaderComponent />
          </Header>
        )}

        <Content style={contentStyle}>
          <Outlet />
        </Content>

        <Footer style={footerStyle}>
          <FooterComponent />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
