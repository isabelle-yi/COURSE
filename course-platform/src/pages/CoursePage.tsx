import { Input, Card, Row, Col, Image,Skeleton } from 'antd';
import { useState, useEffect, useMemo } from 'react';  
import { getCourses } from '../api/courses';
import type { Course } from '../types';

const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchKeyword,setSearchKeyword] = useState('');
  const filteredCourses = useMemo(()=>{
    if(!searchKeyword) return courses;
      return courses.filter(course =>
        course.title.toLowerCase().includes(searchKeyword.toLowerCase())||
        course.instructorName.toLowerCase().includes(searchKeyword.toLowerCase())
      
    );
  },[courses, searchKeyword]);

  const hotKeywords=[...new Set(filteredCourses.map(course=>course.category))].slice(0,5);
  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
    getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, 1000);
  },[]);
  
  const [searchHistory,setSearchHistory] =useState<string[]>([]);
  useEffect(() => {
  const history =localStorage.getItem('searchHistory');
  if (history) {
    setSearchHistory(JSON.parse(history));
  }
  },[]);

  const saveToHistory =(keyword:string) => {
    if(!keyword.trim()) return;
    const newHistory =[keyword,...searchHistory.filter(h=>h!==keyword)].slice(0,5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory',JSON.stringify(newHistory));
  }
  
  const [showHistory,setShowHistory] = useState(false);
  const[suggestions,setSuggestions] = useState<Course[]>([]);

  const searchSuggestions = useMemo(()=>{
    if(!searchKeyword.trim()) return [];
    return courses.filter(course=>
      course.title.toLowerCase().includes(searchKeyword.toLowerCase())||
      course.instructorName.toLowerCase().includes(searchKeyword.toLowerCase())
    ).slice(0,10);
  },[courses, searchKeyword])
  return (
    <>
      <div style={{ 
        background:'linear-gradient(90deg, #1890ff,#95de64)',
        padding:'75px 40px',
        borderRadius:'16px',
        marginBottom:'32px',
        textAlign:'center',
        position:'relative'
      }}>
        <h1 style={{ color: 'white', marginBottom: '30px' }}>
        发现好课程，提升自己
      </h1>
        <Input.Search
        placeholder="搜索课程、讲师..."
        allowClear
        size="large"
        onChange={(e) => setSearchKeyword(e.target.value)}
        onFocus={() => setShowHistory(true)}
        onBlur={()=>setTimeout(() => setShowHistory(false), 200)}
        onSearch={(value) => {
          saveToHistory(value);
          setShowHistory(false);
        }}
        style={{ maxWidth: 600, margin: '0 auto' }}
        />
      </div>
     
      

      <div style={{ marginTop: '20px',marginBottom: '30px'}}>
        <span style={{ marginRight: '8px',color: '#666'}}>热门搜索：</span>
        {hotKeywords.map(tag=>(<a
          key={tag}
          onClick={()=> setSearchKeyword(tag)}
          style={{ color: '#666', marginRight: '12px', cursor: 'pointer' }}>
          {tag}
        </a>))}
      </div>

      {loading ? (
        <Row gutter={[16,16]}>
       {[...Array(8)].map((_,i)=>(
        <Col key={i} xs={24} sm={12} md={18} lg={6}>
          <Card>
            <Skeleton active avatar paragraph={{rows:2}}/>
          </Card>
        </Col>
       ))}
        </Row>
      ):
      filteredCourses.length === 0?(
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
                  <Image
                    alt={course.title}
                    src={course.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                    fallback="https://via.placeholder.com/300x200?text=加载失败"
                    width="100%"
                    style={{ height:150,objectFit: 'cover' }}
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
          ))}
        </Row>
      )}
    </>
  );
}

export default CoursePage;