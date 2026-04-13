import { Input, Card, Row, Col, Image, Skeleton, Select, Pagination } from 'antd';
import { useState, useEffect, useMemo, useRef } from 'react';  
import { getCourses } from '../api/courses';
import type { Course } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

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
    getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
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

  const [historyLoaded, setHistoryLoaded] =useState(true);
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if(history){
      setSearchHistory(JSON.parse(history));
    }
  },[]);

  const highlightKeyword = (text: string,keyword: string) => {
    if(!keyword.trim())return text;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
    regex.test(part)?(
      <span key={i} style={{color: '#1890ff', fontWeight: 500 }}>{part}</span>
    ):(
       <span key={i}>{part}</span>
    )
   );
  };

  const inputRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (e : MouseEvent) => {
      const inputElement =inputRef.current?.input;
      const panelElement=document.querySelector('.search-dropdown-panel');

      if(inputElement && !inputElement.contains(e.target as Node)){
        if(panelElement && panelElement.contains(e.target as Node)){
          return;
        }
        setShowHistory(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click',handleClickOutside);
  },[]);

  const location =useLocation();
  useEffect(() => {
    setShowHistory(true);
    setTimeout(() => {
      if(inputRef.current){
      inputRef.current?.focus();
      }
    },100);
  },[location.pathname]);
  
  const [isClickingSuggestion,setIsClickingSuggestion] = useState(false);

 const mainCategories = [
  '编程与开发',
  '数据与AI',
  '设计与创意',
  '语言学习',
  '职场与软技能',
  '考研与考证',
  '兴趣爱好'
];

const [sortBy, setSortBy] = useState('default');
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 8;

const sortedCourses = useMemo(() => {
  let sorted = [...filteredCourses];
  if (sortBy === 'prize_asc') {
    sorted.sort((a,b) => a.price -b.price);
  } else if (sortBy === 'prize_desc') {
    sorted.sort((a,b) => b.price - a.price);
  } else if (sortBy === 'watchCount') {
    sorted.sort((a,b) => (b.watchCount || 0) - (a.watchCount || 0));
  } else if (sortBy === 'rating') {
    sorted.sort((a,b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
  }
  return sorted;
},[filteredCourses, sortBy]);

const paginatedCourses =sortedCourses.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize  
);

 const navigate = useNavigate();
const handleCategoryClick = (cat: string) => {
  navigate(`/category/${encodeURIComponent(cat)}`);
};
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
      <h1 style={{ color: 'white', marginBottom: '16px', fontSize: '28px' }}>
       探索好课程
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
      从海量课程中找到适合你的那一个
      </p>
      <Input.Search
        key={location.pathname}
        ref={inputRef}
        placeholder="搜索课程、讲师..."
        allowClear
        size="large"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onFocus={() => setShowHistory(true)}
        onSearch={(value) => {
          saveToHistory(value);
          setShowHistory(false);
        }}
        style={{ maxWidth: 600, margin: '0 auto' }}
         enterButton="搜索"
      />

      {/* 搜索下拉面板（搜索历史 + 搜索建议） */}
      {(showHistory || searchKeyword) && historyLoaded && (
        <div
          className="search-dropdown-panel"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            marginTop: '8px',
            overflow: 'visible'
          }}
        >
          {/* 情况1：有输入关键词 → 显示搜索建议 */}
          {searchKeyword && searchSuggestions.length > 0 && (
            <div>
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 12 }}>
                搜索建议
              </div>
              {searchSuggestions.map(course => (
                <div
                  key={course.id}
                  onClick={() => {
                    setIsClickingSuggestion(true);
                    const selectedTitle=course.title;
                    setSearchKeyword(selectedTitle);
                    saveToHistory(selectedTitle);
                    setTimeout(() => {
                       setShowHistory(false);
                    },150);
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderTop: '1px solid #f0f0f0',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ fontWeight: 500 }}>
                    {highlightKeyword(course.title, searchKeyword)}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    讲师：{highlightKeyword(course.instructorName, searchKeyword)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 情况2：没有输入关键词 → 显示搜索历史 */}
          {!searchKeyword && searchHistory.length > 0 && (
            <div>
              <div style={{ 
                padding: '8px 12px', 
                color: '#999', 
                fontSize: 12, 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                <span>最近搜索</span>
                <span
                  onClick={() => {
                    localStorage.removeItem('searchHistory');
                    setSearchHistory([]);
                  }}
                  style={{ cursor: 'pointer', color: '#1890ff' }}
                >
                  清空全部
                </span>
              </div>
              <div style={{ 
                padding: '8px 12px 16px 12px',
                display: 'flex', 
                flexWrap:'wrap',
                gap: '8px'
                }}>
                {searchHistory.map(term => (
                  <div
                    key={term}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: '#f5f5f5',
                      borderRadius: '20px',
                      padding: '4px 8px 4px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e6f7ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  >
                    <span
                      onClick={() => {
                        setIsClickingSuggestion(true);
                        setSearchKeyword(term);
                        saveToHistory(term);
                        setShowHistory(false);
                      }}>
                        {term}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          e.stopPropagation();
                          const newHistory =searchHistory.filter(h => h !== term);
                          setSearchHistory(newHistory);
                          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                        }}
                        style={{
                          marginLeft: '6px',
                          color: '#999',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color ='#ff4d4f'}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#999"}
                      >
                        ✕
                      </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 情况3：有输入关键词但无匹配结果（不显示任何内容，让下面的课程区域显示空状态） */}
          {searchKeyword && searchSuggestions.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              没有找到相关课程
            </div>
          )}

          {/* 情况4：没有输入关键词且无搜索历史 */}
          {!searchKeyword && searchHistory.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              暂无搜索记录
            </div>
          )}
        </div>
      )}
    </div>
<div style={{ marginBottom: '32px', padding: '0 24px' }}>
  <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>课程分类</h2>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
    {mainCategories.map(cat => (
      <div
        key={cat}
        onClick={() => handleCategoryClick(cat)}
        style={{
          padding: '8px 20px',
          background: '#f0f2f5',
          color: searchKeyword === cat ? '#1890ff' : '#666',
          borderRadius: '30px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          fontWeight: searchKeyword === cat ? 500 : 'normal'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.color = '#69c0ff';
        }}
        onMouseLeave={(e) => {
          if (searchKeyword !== cat) {
            e.currentTarget.style.color = '#666';
          } else {
            e.currentTarget.style.color = '#1890ff';
          }
        }}
      >
        {cat}
      </div>
    ))}
  </div>
</div>

<div style={{
   marginBottom: '24px',
   display: 'flex', 
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: '0 24px'
  }}>
  <span>排序方式：</span>
  <Select value={sortBy} onChange={setSortBy} style={{ width: 180 }}>
    <Select.Option value="default">默认排序</Select.Option>
    <Select.Option value="price_asc">按价格升序</Select.Option>
    <Select.Option value="price_desc">按价格降序</Select.Option>
    <Select.Option value="watchCount">观看人数最多</Select.Option>
    <Select.Option value="rating">评分最高</Select.Option>
  </Select>
</div>

    {/* 课程列表 */}
    {loading ? (
      <Row gutter={[16, 16]}>
        {[...Array(8)].map((_, i) => (
          <Col key={i} xs={24} sm={12} md={18} lg={6}>
            <Card>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    ) : filteredCourses.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        没有找到相关课程
      </div>
    ) : (
      <Row gutter={[16, 16]}>
        {paginatedCourses.map(course => (
          <Col key={course.id} xs={24} sm={12} md={18} lg={6}>
            <Card
              hoverable
              cover={
                <Image
                  alt={course.title}
                  src={course.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                  fallback="https://via.placeholder.com/300x200?text=加载失败"
                  width="100%"
                  style={{ height: 150, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={course.title}
                description={
                  <div>
                    <div>讲师: {course.instructorName}</div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
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
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    )}
    {!loading && filteredCourses.length > 0 && (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
    <Pagination
      current={currentPage}
      total={filteredCourses.length}
      pageSize={pageSize}
      onChange={setCurrentPage}
      showSizeChanger={false}
    />
  </div>
)}
  </>
);
}
export default CoursePage;