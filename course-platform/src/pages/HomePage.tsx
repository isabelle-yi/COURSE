import { useState, useEffect } from 'react';
import { Input, Card, Row, Col, Carousel, Image, Skeleton } from 'antd';
import { getCourses } from '../api/courses';
import type { Course } from '../types';

const HomePage = () => {
  const [courses,setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
    getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, 1000);
  },[])

  const recommendedCourses = [...courses]
  .sort((a,b)=>{
    const aValue=a.purchaseCount||a.watchCount||0;
    const bValue=b.purchaseCount||b.watchCount||0;
    return bValue-aValue;
  })
  .slice(0,4);

  const [loading,setLoading] = useState(true)
  return(
    <>
    <div style={{marginBottom:'32px'}}>
      <Carousel autoplay arrows>
        <div>
          <div style={{
            background:'linear-gradient(90deg, #1890ff,#95de64)',
            padding:'75px 40px',
            borderRadius:'16px',
            textAlign:'center',
            color:'white',
            cursor:'pointer',
            minHeight:'240px',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center'
          }}
            onClick={()=>window.location.href='/course/1'}>
              <h2>React从入门到精通</h2>
              <p>全网最入门的前端框架课程</p>
            </div>
        </div>
        <div>
          <div style={{
            background:'linear-gradient(90deg, #1890ff,#95de64)',
            padding:'75px 40px',
            borderRadius:'16px',  
            textAlign:'center',
            color:'white',
            cursor:'pointer',
            minHeight:'240px',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center'
          }}
            onClick={()=>window.location.href='/course/2'}>
              <h2>TypeScript 实战指南</h2>
              <p>类型安全，大厂必备</p>
            </div>
        </div>
        <div>
          <div style={{
            background:'linear-gradient(90deg, #1890ff,#95de64)',
            padding:'75px 40px',
            borderRadius:'16px',  
            textAlign:'center',
            color:'white',
            cursor:'pointer',
            minHeight:'240px',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center'
          }}
            onClick={()=>window.location.href='/course/3'}>
              <h2>Vue3 核心原理</h2>
              <p>理解 Vue3 核心概念，掌握最新技术</p>
            </div>
        </div>
    </Carousel>
    </div>
    <div style={{ marginBottom:'32px',padding:'0 24px' }}>
      <h2 style={{ marginBottom:'16px',textAlign:'left' }}>热门分类</h2>
      <div style={{ display:'flex',flexWrap:'wrap',gap:'12px' }}>
      {['前端开发','后端开发','数据科学','人工智能','云计算'].map(cat=>(
        <div
        key={cat}
        onClick={()=>window.location.href=`/courses?category=${cat}`}
        style={{
          padding:'8px 20px',
          background:'#f0f2f5',
          borderRadius:'20px',
          cursor:'pointer',
          transition:'all 0.3s',
          color:'inherit',
        }}
        onMouseEnter={(e)=>{
          e.currentTarget.style.background='#f0f2f5';
          e.currentTarget.style.color='#1890ff';
        }
        }
        onMouseLeave={(e)=>{
          e.currentTarget.style.background='#f0f2f5';
          e.currentTarget.style.color=''
        }}>
          {cat}
        </div>
      ))}
      </div>
    </div>
    <div style={{padding:'0 24px'}}>
       <h2 style={{ marginBottom: '32px',textAlign:'left' }}>推荐课程</h2>
      <Row gutter={[16,16]}>
        {loading?(
          [...Array(4)].map((_, i)=>(
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Skeleton active avatar paragraph={{rows:2}}/>
              </Card>
            </Col>
          )
          )
        ):(
         recommendedCourses.map(course =>(
            <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={course.title}
                    src={course.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                    fallback="https://via.placeholder.com/300x200?text=加载失败"
                    width="100%"
                    style={{ height:150,objectFit: 'cover' }}
                    preview={false}
                    />
              }>
                <Card.Meta
                  title={course.title}
                  description={
                    <div>
                      <div>讲师: {course.instructorName}</div>
                      <div style={{ 
                        display: 'flex',           // 使用 flex 布局
                        justifyContent: 'space-between',  // 两端对齐
                        alignItems: 'center',      // 垂直居中
                        marginTop: 8 
                      }}>
                    <span style={{ fontSize: 12, color: '#888' }}>
                      👁️ {course.watchCount || course.purchaseCount || 0} 人学习
                    </span>
                    <span style={{ color: '#f50', fontSize: 16, fontWeight: 500 }}>
                      ¥{course.price}
                    </span>
                    </div>
                    </div>
                  }/>
              </Card>
            </Col>
         ))
        )}
        </Row>
    </div>
    </>
  )
}
export default HomePage;