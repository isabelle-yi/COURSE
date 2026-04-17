import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Image, Skeleton, Progress, Button } from 'antd';
import { getOrdersByUser } from '../api/orders';
import { getCourseById, getCoursesByInstructor } from '../api/courses';
import { useAuthStore } from '../store/useAuthStore';
import { getCourseProgress } from '../utils/progress';
import type { Course } from '../types';

interface PurchasedCourse extends Course {
  orderId: number;
  purchasedAt: string;
}

const MyLearningPage = () => {
  const navigate = useNavigate();
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<number[]>([]);
  const { user } =useAuthStore();
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

// 在 fetchPurchasedCourses 函数中
const fetchPurchasedCourses = async () => {
  setLoading(true);
  try {
    // 1. 获取购买的课程
    const orders = await getOrdersByUser(user.id);
    const purchasedPromises = orders.map(async (order) => {
      const course = await getCourseById(order.courseId);
      return { ...course, orderId: order.id, purchasedAt: order.createdAt };
    });
    const purchasedCourses = await Promise.all(purchasedPromises);
    
    // 2. 如果是讲师，获取自己创建的课程
    let instructorCourses: PurchasedCourse[] = [];
    if (user.role === 'instructor') {
      const ownCourses = await getCoursesByInstructor(user.id);
      instructorCourses = ownCourses.map(course => ({
        ...course,
        orderId: 0,
        purchasedAt: course.createdAt,
      }));
    }
    
    // 3. 合并去重（避免重复）
    const allCourses = [...purchasedCourses, ...instructorCourses];
    const uniqueCourses = allCourses.filter((course, index, self) => 
      index === self.findIndex(c => c.id === course.id)
    );
    
    setCourses(uniqueCourses);
  } catch (error) {
    console.error('获取课程失败', error);
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
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span>{course.title}</span>
                      {purchasedCourseIds.includes(course.id) && (
                        <span style={{ background: '#52c41a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: 12 }}>
                          已购买
                        </span>
                      )}
                    </div>
                  }
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