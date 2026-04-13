import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCourseById } from '../api/courses';
import type { Course } from '../types';
import { Card, Row, Col, Image, Descriptions, Button, Tag } from 'antd';
import { message } from 'antd';

const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(id) {
            getCourseById(Number(id)).then(data => {
                setCourse(data);
                setLoading(false);
            });
        }
    }, [id])   
    
    if(loading){
        return <div style={{ padding:'50px',textAlign:'center'}}>加载中</div>
    }
    if(!course){
        return <div style={{ padding:'50px',textAlign: 'center'}}>课程不存在</div>
    }

const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        message.success('链接已复制，可分享复制给好友');
    })
}

    return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto'}}>
       <Row gutter={[32,32]}>
       <Col xs={24} md={14}>
         <h1 style={{ fontSize: 28, marginBottom: 16}}>{course.title}</h1>
         <Descriptions.Item label="讲师">{course.instructorName}</Descriptions.Item>
         <Descriptions.Item label="分类">
            <Tag color="blue">{course.category}</Tag>
         </Descriptions.Item>
         <Descriptions.Item label="价格">
            <span style={{ fontSize: 24, color: '#f50'}}>¥{course.price}</span>
         </Descriptions.Item>
         <Descriptions.Item label="学习人数">
            👁️ {course.watchCount || 0} 人学习
         </Descriptions.Item>
         <Button onClick={handleCopyLink}>分享课程</Button>
       </Col>

       {/* 底部：课程简介 */}
       <Col xs={24}>
        <Card title="课程简介">
            <p style={{ fontSize:16,lineHeight: 1.6}}>{course.description}</p>
        </Card>
       </Col>
       </Row>
    </div>
   );
};

export default CourseDetailPage;

