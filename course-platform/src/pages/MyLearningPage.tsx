import { Typography } from 'antd';

const { Title } = Typography;

const MyLearningPage = () => {
  return (
    <div>
      <Title level={2}>我的学习</Title>
      <p>这里是已购课程列表，后面会实现课程学习和评论</p>
    </div>
  );
};

export default MyLearningPage;