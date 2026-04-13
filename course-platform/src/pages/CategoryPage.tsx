import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, Row, Col, Image, Skeleton, Pagination, Select } from 'antd';
import { getCourses } from '../api/courses';
import type { Course } from '../types';



const CategoryPage = () =>{
    const { category } =useParams<{ category: string }>();
    const [courses,setCourses] = useState<Course[]>([]);
    const [filteredCourses,setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] =useState(true);
    const [sortBy, setSortBy] =useState('default');
    const [currentPage, setCurrentPage] =useState(1);
    const pageSize = 8;

    useEffect(() => {
        setLoading(true);
        getCourses().then(data => {
            const categoryCourses =data.filter(c => c.category === category);
            setCourses(categoryCourses);
            setFilteredCourses(categoryCourses);
            setLoading(false);
        });
    }, [category]);

    useEffect(() => {
        let sorted = [...courses];
        if (sortBy === 'price_asc'){
            sorted.sort((a,b) => a.price - b.price);
        } else if (sortBy === 'price_desc'){
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'watchCount'){
            sorted.sort((a,b) => (b.watchCount || 0) - (a.watchCount || 0));
        } else if (sortBy === 'rating'){
            sorted.sort((a,b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
        }
        setFilteredCourses(sorted);
        setCurrentPage(1);
    },[sortBy, courses]);

    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const decodedCategory = decodeURIComponent(category || '');
    const { Option } =Select;
    return (
        <div style={{ padding: '16px 24px' }}>
            <h1 style={{ marginBottom: '4px'}}>{decodedCategory}</h1>
            <p style={{ color:'#666', marginBottom: '24px'}}>
                共 {filteredCourses.length} 门课程
            </p>

            <div style={{ 
                marginBottom: '24px',
                 display: 'flex', 
                 justifyContent: 'space-between',
                 alignItems: 'center'}}>
                    <span>排序方式：</span>
                    <Select value={sortBy} onChange={setSortBy} style={{ width: 180}}>
                        <Option value="default">默认排序</Option>
                        <Option value='price_asc'>按价格升序</Option>
                        <Option value='price_desc'>按价格降序</Option>
                        <Option value='watchCount'>观看人数最多</Option>
                        <Option value='rating'>评分最高</Option>
                    </Select>
            </div>
            {loading ? (
                <Row gutter={[16,16]}>
                    {[...Array(8)].map((_, i) => (
                        <Col key={i} xs={24} sm={12} md={8} lg={6}>
                           <Card>
                                <Skeleton active avatar paragraph={{ rows:2 }}/>
                           </Card>
                        </Col>
                    ))}
                </Row>
            ): paginatedCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px'}}>
                    暂无课程
                </div>
            ) : (
                <>
                <Row gutter={[16,16]}>
                    {paginatedCourses.map(course => {
                        return (
                            <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                  hoverable
                                  cover={
                                    <Image
                                    alt={course.title}
                                    src={course.coverImage || 'https://via.placeholder.com/300x200?text=Np+Image'}
                                    fallback="https://via.placeholder.com/300x200?text=加载失败"
                                    width="100%"
                                    style={{ height: 150, objectFit: 'cover'}}
                                    preview={false}
                                    />
                                  }
                                >
                                    <Card.Meta
                                      title={course.title}
                                      description={
                                        <div>
                                            <div>讲师：{course.instructorName}</div>
                                            <div style={{
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: 8 }}>
                                                <span style={{ 
                                                    fontSize: 12,
                                                    color: '#888'}}>
                                                        👁️ {course.watchCount || 0} 人学习
                                                    </span>
                                                <span style={{
                                                    color: '#f50', 
                                                    fontSize: 16,
                                                    fontWeight:500}}>
                                                        ¥{course.price}
                                                </span>
                                            </div>
                                        </div>
                                      }
                                    />
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center', marginTop: '32px'}}>
                    <Pagination
                       current={currentPage}
                       total={filteredCourses.length}
                       pageSize={pageSize}
                       onChange={setCurrentPage}
                       showSizeChanger={false}
                       />
                </div>
                </>
            )
        }
        </div>
    );
}; 

export default CategoryPage;