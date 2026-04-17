import { useState, useEffect } from 'react';
import { Table, Tag, Button, message } from 'antd';
import { getCoursesByInstructor } from '../api/courses';
import { useAuthStore } from '../store/useAuthStore';
import type { Course } from '../types';

const InstructorCourses = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'instructor') {
      fetchCourses();
    }
  }, [user]);

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
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </div>
      ),
    },
  ];

  if (!user || user.role !== 'instructor') {
    return <div style={{ padding: '50px', textAlign: 'center' }}>暂无权限访问</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 0 }}>我的课程</h1>
        <Button type="primary" style={{ marginTop: 0 }}>上传课程</Button>
    </div>
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default InstructorCourses;