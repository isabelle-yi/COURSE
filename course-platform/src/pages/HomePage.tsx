import { Input, Card, Row, Col } from 'antd';
import { useState, useEffect } from 'react';  
import { getCourses } from '../api/courses';
import type { Course } from '../types';

const HomePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchKeyword,setSearchKeyword] = useState('');
  const filteredCourses = courses.filter(course=>{
    if(!searchKeyword)return true;
    return(
      course.title.toLowerCase().includes(searchKeyword.toLowerCase())||
      course.instructorName.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  })
  useEffect(() => {
    getCourses().then(data => setCourses(data));
  },[]);

  return (
    <>
      <div style={{ marginBottom:'24px' }}>
        <Input.Search
        placeholder="搜索课程、讲师..."
        allowClear
        size="large"
        onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div style={{ marginTop: '12px'}}>
        <span style={{ marginRight: '8px',color: '#666'}}>热门搜索：</span>
        {['React', 'Vue ,Typescript', 'Node.js'].map(tag=>(<a
          key={tag}
          onClick={()=> setSearchKeyword(tag)}
          style={{ marginRight:'12px',cursor:'pointer'}}
        ></a>))}
      </div>

      {/*课程列表*/}
      {filteredCourses.length === 0?(
        <div style={{ textAlign:'center', padding: '50px'}}>
          没有找到相关课程
        </div>
      ):(
        <Row gutter={[16,16]}>
          {filteredCourses.map(course =>(
            <Col key={course.id} xs={24} sm={12} md={18} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={course.title}
                    src={course.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height:150,objectFit: 'cover' }}
                    />
              }>
                <Card.Meta
                  title={course.title}
                  description={
                    <div>
                      <div>讲师: {course.instructorName}</div>
                      <div style ={{ color: '#f50', marginTop: 8}}>¥{course.price}</div>
                    </div>
                  }/>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default HomePage;