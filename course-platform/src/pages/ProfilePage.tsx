import { Typography } from 'antd';

const { Title } = Typography;

const ProfilePage = () => {
  return (
    <div>
      <Title level={2}>个人中心</Title>
      <p>这里是个人资料页面，后面会实现修改昵称和头像</p>
    </div>
  );
};

export default ProfilePage;