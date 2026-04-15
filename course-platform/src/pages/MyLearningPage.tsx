import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Image, Skeleton, Progress, Button } from 'antd';
import { getOrdersByUser } from '../api/orders';
import { getCourseById } from '../api/courses';
import { useAuthStore } from '../store/useAuthStore';
import { getCourseProgress } from '../utils/progress';
import type { Course } from '../types';

interface PurchasedCourse extends Course {
  orderId: number;
  purchasedAt: string;
}

const MyLearningPage = () => {
  const navigate = useNavigate();
  const { user } =useAuthStore();
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPurchasedCourses = async () => {
      setLoading(true);
      try {
        const orders = await getOrdersByUser(user.id);
        const coursePromises = orders.map(async (order) => {
          const course = await getCourseById(order.courseId);
          return {
            ...course,
            orderId: order.id,
            purchasedAt: order.createdAt,
          };
        });

        const purchasedCourses =await Promise.all(coursePromises);
        setCourses(purchasedCourses);
      } catch (error) {
        console.error('获取已购课程失败',error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  },[user]);

  const handleCourseClick= (courseId: number) => {
    navigate(`/course/${courseId}?purchased=true`);
  };

  if (loading) {
    return(
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>我的学习</h1>
        <Row gutter={[16,16]}>
        {[...Array(4)].map((_,i)=>(
          <Col key={i} xs={12} md={8} lg={6}>
            <Card>
              <Skeleton active avatar paragraph={{ rows: 2}}/>
            </Card>
          </Col>
        ))}
        </Row>
      </div>
    );
  }
  if (courses.length === 0){
    return (
      <div style={{ padding: '50px', textAlign:'center'}}>
        <h2>暂无已购课程</h2>
        <p>去课程广场挑选感兴趣的课程吧</p>
        <Button type="primary" onClick={()=> navigate('/courses')}>
          去逛逛
        </Button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24}}>
        我的学习
      </h1>
      <Row gutter={[16,16]}>
        {courses.map(course => {
          const progress = getCourseProgress(course.id);
          return (
            <Col key={course.id} xs={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => handleCourseClick(course.id)}
                cover={
                  <img
                    alt={course.title}
                    src={course.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: 150, objectFit:'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={course.title}
                  description={
                    <div>
                      <div>讲师：{course.instructorName}</div>
                      <div style={{ marginTop : 12}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                          <span style={{ fontSize: 12, color: '#666'}}>学习进度</span>
                          <span style={{ fontSize: 12, color:'#1890ff' }}>{progress}%</span>
                        </div>
                        <Progress percent={progress} size='small' showInfo={false}/>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};


export default MyLearningPage;