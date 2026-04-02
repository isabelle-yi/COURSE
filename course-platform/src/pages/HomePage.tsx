import { useState, useEffect } from 'react';
import { Input, Card, Row, Col } from 'antd';
import { getCourses } from '../api/courses';
import type { Course } from '../types';

const HomePage = () => {
  const [courses,setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getCourses().then(data=>setCourses(data));
  },[])

  const recommendedCourses = courses.slice(0, 4);

  return(
    <>
    <div style={{
      background: 'linear-gradient(135deg,#667eea 0%, #764ba2 100%)',
      padding: '60px 40px',
      borderRadius: '16px',
      marginBottom: '32px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: 'white',marginBottom:'24px'}}>
        发现好课程，提升自己
      </h1>
       <Input.Search
          placeholder="搜索课程、讲师..."
          allowClear
          size="large"
          style={{ maxWidth: 600, margin: '0 auto' }}
          onSearch={(value) => window.location.href = `/courses?search=${value}`}
        />
    </div>
    <div>
       <h2 style={{ marginBottom: '16px' }}>推荐课程</h2>
      <Row gutter={[16, 16]}>
        {recommendedCourses.map(course => (
          <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <Card.Meta title={course.title} description={`讲师：${course.instructorName}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </>
  )
}
export default HomePage;