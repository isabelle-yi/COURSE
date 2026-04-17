import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Table, Progress, Tag, Tabs, Rate, Select, Button, Space, message } from 'antd';
import { DollarOutlined, BookOutlined, ShoppingCartOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { getCoursesByInstructor } from '../api/courses';
import { getCommentsByCourse, deleteComment } from '../api/comments';
import { getAllOrders } from '../api/orders';
import { getUsers } from '../api/users';
import type { Course, Order, User, Comment } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const InstructorData = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterCourse, setFilterCourse] = useState<number | null>(null);
  // 统计数据
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [trendData, setTrendData] = useState<{ date: string; income: number }[]>([]);
  const { TabPane } = Tabs;
  const { Option } = Select;

  useEffect(() => {
    if (user && user.role === 'instructor') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. 获取讲师的课程
      const instructorCourses = await getCoursesByInstructor(user!.id);
      setCourses(instructorCourses);
      setTotalCourses(instructorCourses.length);

      // 2. 获取所有订单
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      
      // 3. 获取所有用户（学生）
      const allUsers = await getUsers();
      const studentsList = allUsers.filter(u => u.role === 'student');
      setStudents(studentsList);
      setTotalStudents(studentsList.length);

      // 4. 计算讲师的收入（只计算已发布课程的订单）
      const instructorCourseIds = instructorCourses.map(c => c.id);
      const instructorOrders = allOrders.filter(order => 
        instructorCourseIds.includes(order.courseId)
      );
      setTotalOrders(instructorOrders.length);
      
      const income = instructorOrders.reduce((sum, order) => sum + order.price, 0);
      setTotalIncome(income);

      // 5. 生成近7天收入趋势
      const last7Days = getLast7Days();
      const trend = last7Days.map(day => {
        const dayOrders = instructorOrders.filter(order => 
          order.createdAt.startsWith(day)
        );
        const dayIncome = dayOrders.reduce((sum, order) => sum + order.price, 0);
        return { date: day.substring(5), income: dayIncome };
      });
      setTrendData(trend);

      // 6. 获取所有评论
      const allCommentsList: Comment[] = [];
      for (const course of instructorCourses) {
      const comments = await getCommentsByCourse(course.id);
      allCommentsList.push(...comments.map(c => ({ ...c, courseTitle: course.title })));
    }
      setAllComments(allCommentsList);
      setFilteredComments(allCommentsList);

    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取最近7天的日期数组
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  if (!user || user.role !== 'instructor') {
    return <div style={{ padding: '50px', textAlign: 'center' }}>暂无权限访问</div>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  const applyFilter = () => {
  let filtered = [...allComments];
  if (filterRating !== null) {
    filtered = filtered.filter(c => c.rating === filterRating);
  }
  if (filterCourse !== null) {
    filtered = filtered.filter(c => c.courseId === filterCourse);
  }
  setFilteredComments(filtered);
};

const resetFilter = () => {
  setFilterRating(null);
  setFilterCourse(null);
  setFilteredComments(allComments);
};

const handleDeleteComment = async (commentId: number) => {
  try {
    await deleteComment(commentId);
    message.success('删除成功');
    const updatedComments = allComments.filter(c => c.id !== commentId);
    setAllComments(updatedComments);
    setFilteredComments(updatedComments);
  } catch (error) {
    message.error('删除失败');
  }
};
  
  // 课程表格列定义
const courseColumns = [
  {
    title: '课程ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
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
    title: '观看次数',
    dataIndex: 'watchCount',
    key: 'watchCount',
    width: 100,
    render: (count: number) => count || 0,
  },
  {
    title: '购买次数',
    dataIndex: 'purchaseCount',
    key: 'purchaseCount',
    width: 100,
    render: (count: number) => count || 0,
  },
  {
    title: '观看进度',
    key: 'progress',
    width: 200,
    render: (_: any, record: Course) => {
      const watchCount = record.watchCount || 0;
      const purchaseCount = record.purchaseCount || 0;
      let progress = 0;
      if (purchaseCount > 0) {
        // 假设每个购买用户平均观看10次为100%
        progress = Math.min(100, Math.floor((watchCount / (purchaseCount * 10)) * 100));
      }
      return (
        <div>
          <Progress percent={progress} size="small" />
          <span style={{ fontSize: 12, color: '#666' }}>
            观看 {watchCount} 次 / 购买 {purchaseCount} 人
          </span>
        </div>
      );
    },
  },
]; 

const commentColumns = [
  {
    title: '课程名称',
    dataIndex: 'courseTitle',
    key: 'courseTitle',
    width: 150,
  },
  {
    title: '学生',
    dataIndex: 'userName',
    key: 'userName',
    width: 100,
  },
  {
    title: '评分',
    dataIndex: 'rating',
    key: 'rating',
    width: 120,
    render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />,
  },
  {
    title: '评论内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '评论时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    render: (_: any, record: Comment) => (
      <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteComment(record.id)} />
    ),
  },
];

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <h1 style={{ marginBottom: 16 }}>数据看板</h1>
       <Tabs defaultActiveKey="overview">
      {/* 数据概览标签页 */}
      <TabPane tab="数据概览" key="overview">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={totalIncome}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="课程总数"
              value={totalCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学生总数"
              value={totalStudents}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 收入趋势图表 */}
      <Card title="近7天收入趋势" style={{ marginTop: 24 }}>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`¥${value}`, '收入']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#1890ff"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="收入"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
            暂无收入数据
          </div>
        )}
      </Card>

       {/* 课程详情表格 */}
        <Card title="课程详情" style={{ marginTop: 24 }}>
          <Table columns={courseColumns} dataSource={courses} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
        </Card>
      </TabPane>

      {/* 评论管理标签页 */}
      <TabPane tab="评论管理" key="comments">
        <Card title="学生评论">
          {/* 筛选栏 */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>评分筛选：</span>
              <Select placeholder="全部评分" allowClear value={filterRating} onChange={setFilterRating} style={{ width: 120 }}>
                <Option value={5}>5星</Option>
                <Option value={4}>4星及以上</Option>
                <Option value={3}>3星及以上</Option>
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>课程筛选：</span>
              <Select placeholder="全部课程" allowClear value={filterCourse} onChange={setFilterCourse} style={{ width: 180 }}>
                {courses.map(course => (
                  <Option key={course.id} value={course.id}>{course.title}</Option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button type="primary" onClick={applyFilter}>查询</Button>
              <Button onClick={resetFilter}>重置</Button>
            </div>
          </div>

          {/* 评论列表 */}
          <Table columns={commentColumns} dataSource={filteredComments} rowKey="id" pagination={{ pageSize: 10 }} />
        </Card>
      </TabPane>
    </Tabs>
    </div>
  );
};

export default InstructorData;