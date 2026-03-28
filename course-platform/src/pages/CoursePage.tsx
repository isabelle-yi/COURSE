import { Typography } from 'antd';

const { Title } = Typography;

const CoursesPage = () => {
  return (
    <div>
      <Title level={2}>课程广场</Title>
      <p>这里是所有课程列表，后面会实现搜索和筛选功能</p>
    </div>
  );
};

export default CoursesPage;