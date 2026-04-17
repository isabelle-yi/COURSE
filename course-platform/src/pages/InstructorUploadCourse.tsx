import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { createCourse } from '../api/courses';

const { TextArea } = Input;
const { Option } = Select;

const InstructorUploadCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // 表单草稿的 localStorage key
  const DRAFT_KEY = 'course_draft';

  // 保存草稿到 localStorage
  const saveDraft = (values: any) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  };

  // 从 localStorage 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const draftData = JSON.parse(draft);
      form.setFieldsValue(draftData);
      message.info('已加载上次未完成的课程草稿');
    }
  }, []);

  // 监听表单变化，自动保存草稿
  const handleFormChange = () => {
    const values = form.getFieldsValue();
    if (values.title || values.category || values.price || values.description) {
      saveDraft(values);
    }
  };

  // 模拟上传进度
  const simulateProgress = () => {
    setShowProgress(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const progressInterval = simulateProgress();
    
    try {
      const newCourse = {
      title: values.title,
      description: values.description,
      instructorId: user?.id || 0,  // 确保是数字
      instructorName: user?.nickname || user?.name || '',
      category: values.category,
      price: Number(values.price),  // 转成数字
      coverImage: 'https://picsum.photos/300/200?random=' + Date.now(),
      videoUrl: values.videoUrl,
      status: 'pending' as const,
      createdAt: new Date().toISOString().split('T')[0],
      watchCount: 0,
      purchaseCount: 0,
      chapters: []
    };
      
      await createCourse(newCourse);
      
      // 进度到100%
      setUploadProgress(100);
      setTimeout(() => {
        message.success('课程上传成功，等待审核');
        // 清除草稿
        localStorage.removeItem(DRAFT_KEY);
        // 跳转到课程列表
        navigate('/instructor/courses');
      }, 500);
      
    } catch (error) {
      message.error('上传失败，请稍后重试');
      setShowProgress(false);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  if (!user || user.role !== 'instructor') {
    return <div style={{ padding: '50px', textAlign: 'center' }}>暂无权限访问</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card title="上传新课程">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          initialValues={{ category: '编程与开发' }}
        >
          <Form.Item
            label="课程标题"
            name="title"
            rules={[{ required: true, message: '请输入课程标题' }]}
          >
            <Input placeholder="例如：React 从入门到精通" />
          </Form.Item>

          <Form.Item
            label="课程分类"
            name="category"
            rules={[{ required: true, message: '请选择课程分类' }]}
          >
            <Select placeholder="请选择分类">
              <Option value="编程与开发">编程与开发</Option>
              <Option value="数据与AI">数据与AI</Option>
              <Option value="设计与创意">设计与创意</Option>
              <Option value="语言学习">语言学习</Option>
              <Option value="职场与软技能">职场与软技能</Option>
              <Option value="考研与考证">考研与考证</Option>
              <Option value="兴趣爱好">兴趣爱好</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="课程价格"
            name="price"
            rules={[
              { required: true, message: '请输入课程价格' },
              { type: 'number', transform: (value) => Number(value), message: '请输入数字' }
            ]}
          >
            <Input type="number" placeholder="例如：199" addonAfter="元" />
          </Form.Item>

          <Form.Item
            label="视频链接"
            name="videoUrl"
            rules={[{ required: true, message: '请输入视频链接' }]}
          >
            <Input placeholder="https://example.com/video.mp4" />
          </Form.Item>

          <Form.Item
            label="课程简介"
            name="description"
            rules={[{ required: true, message: '请输入课程简介' }]}
          >
            <TextArea rows={4} placeholder="介绍课程内容、适合人群等" />
          </Form.Item>

          {showProgress && (
            <Form.Item>
              <Progress percent={uploadProgress} status={uploadProgress === 100 ? 'success' : 'active'} />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              提交审核
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InstructorUploadCourse;