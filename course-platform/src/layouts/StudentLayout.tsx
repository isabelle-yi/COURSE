import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
const { Header, Content } = Layout;

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
         <div>
            <span>购物车|头像</span>
         </div>
      </Header>

      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        内容区域
        {}<Outlet />
      </Content>
    </Layout>
  );
};

export default StudentLayout;