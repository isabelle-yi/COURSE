import { Layout, Menu, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { BookOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const InstructorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/instructor/courses',
      icon: <BookOutlined />,
      label: '课程管理',
    },
    {
      key: '/instructor/data',
      icon: <BarChartOutlined />,
      label: '数据中心',
    },
  ];

  const selectedKey = menuItems.some(item => item.key === location.pathname) 
    ? location.pathname 
    : '/instructor/courses';

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    if (path.includes('/instructor/courses')) {
      return [{ title: <Link to="/instructor/courses">课程管理</Link> }];
    }
    if (path.includes('/instructor/data')) {
      return [{ title: <Link to="/instructor/data">数据中心</Link> }];
    }
    return [{ title: '讲师中心' }];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
          讲师中心
        </div>
      </Header>
      <Layout>
        <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px 24px' }}>
          <Breadcrumb items={getBreadcrumbItems()} style={{ margin: '16px 0' }} />
          <Content style={{ background: '#f0f2f5' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default InstructorLayout;