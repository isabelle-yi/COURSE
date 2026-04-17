import { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Form, Input, Select, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCoursesByInstructor, createCourse } from '../api/courses';
import { useAuthStore } from '../store/useAuthStore';
import type { Course } from '../types';
import { updateCourse, deleteCourse } from '../api/courses';

const { TextArea } = Input;
const { Option } = Select;
const DRAFT_KEY = 'course_draft';

const InstructorCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editForm] = Form.useForm();

  // 获取课程列表
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCoursesByInstructor(user!.id);
      setCourses(data);
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'instructor') {
      fetchCourses();
    }
  }, [user]);

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

  // 提交表单
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const progressInterval = simulateProgress();
    
    try {
      const newCourse = {
        title: values.title,
        description: values.description,
        instructorId: user?.id || 0,
        instructorName: user?.nickname || user?.name || '',
        category: values.category,
        price: Number(values.price),
        coverImage: 'https://picsum.photos/300/200?random=' + Date.now(),
        videoUrl: values.videoUrl,
        status: 'pending' as const,
        createdAt: new Date().toISOString().split('T')[0],
        watchCount: 0,
        purchaseCount: 0,
        chapters: []
      };
      
      await createCourse(newCourse);
      setUploadProgress(100);
      setTimeout(() => {
        message.success('课程上传成功，等待审核');
        localStorage.removeItem(DRAFT_KEY); 
        setModalVisible(false);
        form.resetFields();
        setShowProgress(false);
        fetchCourses(); // 刷新列表
      }, 500);
      
    } catch (error) {
      message.error('上传失败，请稍后重试');
      setShowProgress(false);
    } finally {
      clearInterval(progressInterval);
      setSubmitting(false);
    }
  };
  

// 加载草稿
useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      Modal.confirm({
        title: '发现未完成的课程草稿',
        content: '是否恢复上次未完成的课程信息？',
        onOk: () => {
          const draftData = JSON.parse(draft);
          form.setFieldsValue(draftData);
        },
        onCancel: () => {
          localStorage.removeItem(DRAFT_KEY);
        },
      });
    }
  }, []);
  
  // 打开编辑弹窗
const handleEdit = (course: Course) => {
  setEditingCourse(course);
  editForm.setFieldsValue({
    title: course.title,
    category: course.category,
    price: course.price,
    videoUrl: course.videoUrl,
    description: course.description,
  });
  setEditModalVisible(true);
};

// 提交编辑
const handleEditSubmit = async (values: any) => {
  try {
    await updateCourse(editingCourse!.id, {
      title: values.title,
      category: values.category,
      price: Number(values.price),
      videoUrl: values.videoUrl,
      description: values.description,
    });
    message.success('编辑成功');
    setEditModalVisible(false);
    setEditingCourse(null);  
    fetchCourses();
  } catch (error) {
    message.error('编辑失败');
  }
};

// 删除课程（带二次确认）
const handleDelete = (course: Course) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除课程「${course.title}」吗？删除后无法恢复。`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteCourse(course.id);
        message.success('删除成功');
        fetchCourses(); // 刷新列表
      } catch (error) {
        message.error('删除失败');
      }
    },
  });
};
  const columns = [
  {
    title: '课程ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '课程封面',
    dataIndex: 'coverImage',
    key: 'coverImage',
    width: 100,
    render: (cover: string) => (
      <img
        src={cover || 'https://via.placeholder.com/60x40?text=No+Image'}
        alt="封面"
        style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
      />
    ),
  },
  {
    title: '课程名称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    render: (price: number) => `¥${price}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => {
      const statusMap: Record<string, { color: string; text: string }> = {
        pending: { color: 'orange', text: '待审核' },
        approved: { color: 'green', text: '已发布' },
        rejected: { color: 'red', text: '已拒绝' },
      };
      const { color, text } = statusMap[status] || { color: 'default', text: status };
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: (_: any, record: Course) => (
    <div>
      <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
      <Button type="link" size="small" danger onClick={() => handleDelete(record)}>删除</Button>
    </div>
    ),
  },
];

  if (!user || user.role !== 'instructor') {
    return <div style={{ padding: '50px', textAlign: 'center' }}>暂无权限访问</div>;
  }

return (
  <div style={{ padding: '0 24px 24px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h1 style={{ marginTop: 0, marginBottom: 0 }}>我的课程</h1>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        上传课程
      </Button>
    </div>

    <Table
      columns={columns}
      dataSource={courses}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />

    {/* 上传课程弹窗 */}
    <Modal
      title="上传新课程"
      open={modalVisible}
      onCancel={() => {
        setModalVisible(false);
        form.resetFields();
        setShowProgress(false);
        setUploadProgress(0);
        localStorage.removeItem(DRAFT_KEY);
      }}
      footer={null}
      width={600}
    >
      <Form
    form={form}
    layout="vertical"
    onFinish={handleSubmit}
    onValuesChange={(_, allValues) => {
      if (allValues.title || allValues.description || allValues.price) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(allValues));
      }
    }}
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
        { pattern: /^\d+$/, message: '请输入数字' }
      ]}
    >
      <Input type="number" placeholder="例如：199" suffix="元" />
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
      <Button type="primary" htmlType="submit" loading={submitting} block>
        提交审核
      </Button>
    </Form.Item>
  </Form>
    </Modal>

    {/* 编辑课程弹窗 */}
    <Modal
      title="编辑课程"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      width={600}
    >
     <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
    <Form.Item label="课程标题" name="title" rules={[{ required: true }]}>
      <Input placeholder="课程标题" />
    </Form.Item>

    <Form.Item label="课程分类" name="category" rules={[{ required: true }]}>
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

    <Form.Item label="课程价格" name="price" rules={[{ required: true }]}>
      <Input type="number" addonAfter="元" />
    </Form.Item>

    <Form.Item label="视频链接" name="videoUrl" rules={[{ required: true }]}>
      <Input placeholder="https://example.com/video.mp4" />
    </Form.Item>

    <Form.Item label="课程简介" name="description" rules={[{ required: true }]}>
      <TextArea rows={4} />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" block>
        保存修改
      </Button>
    </Form.Item>
  </Form>
    </Modal>
  </div>
);
}
export default InstructorCourses;