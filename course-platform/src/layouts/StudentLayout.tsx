import { Layout, Menu, Badge, Dropdown, Modal, message, Button } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined,BookOutlined} from '@ant-design/icons';
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppBreadcrumb from '../components/layout/AppBreadcrumb';
import { useCartStore } from '../store/useCartStore';

const { Header, Content } = Layout;

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutModalVisible, setLogoutModalVisible] =useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount()) || 0;
  const[profileModalVisible,setProfileModalVisible]=useState(false)

  const menuItems=[
    {key:'/',label:'首页'},
    {key:'/courses',label:'课程广场'},
    {key:'/my-learning',label:'我的学习'},
  ]
  const selectedKey=menuItems.some(item=>item.key===location.pathname)?location.pathname:'/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' ,display: 'flex', alignItems: 'center'}}>
       {/*Logo*/}
       <div
       style={{ fontSize: '18px', fontWeight: 'bold' ,marginRight:'40px',color:'#1890ff',cursor:'pointer'}}
       onClick={()=>navigate('/')}
       >
        在线课程平台
        </ div>

       {/*导航菜单*/}
       <Menu
       mode="horizontal"
       selectedKeys={[selectedKey]}
       items={menuItems}
       onClick={({ key }:{key:string}) => navigate(key)}
       style={{flex:1,borderBottom:'none'}}
       />

         {/*右侧区域（购物车头像等）*/}
        <div style={{ display:'flex', alignItems:'center', gap:'20px'}}>
          <Badge count={cartItemCount} style={{marginRight:'16px'}}>
            <ShoppingCartOutlined 
              style={{fontSize:'20px',cursor:'pointer'}}
              onClick={() => navigate('/cart')}  
            />
          </Badge>

          <Dropdown
           menu={{
            items:[
              {
                key:'profile',
                icon:<UserOutlined />,
                label:'个人中心',
                onClick:() => navigate('/profile'),
              },
             {
              key:'logout',
              icon:<LogoutOutlined />,
              label:'退出登录',
              onClick:()=>setLogoutModalVisible(true),
             }
            ]
           }} >
            <div style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
              <UserOutlined style={{fontSize:'20px'}}/>
              <span>学生用户</span>
            </div>
          </Dropdown>
          <Modal
          title="退出登录"
          open={logoutModalVisible}
          onOk={() => {
            message.success('已退出登录');
            setLogoutModalVisible(false);
            navigate('login');
          }}
          onCancel={()=>setLogoutModalVisible(false)}
          okText="确认"
          cancelText="取消"
          >
          <p>确定要退出登录吗？</p>
          </Modal>
        </div>
        </Header>
        <Content style={{ padding: '24px', background:'#f0f2f5'}}>
          <AppBreadcrumb />
          <Outlet />
        </Content>
    </Layout>
  );
};

export default StudentLayout;