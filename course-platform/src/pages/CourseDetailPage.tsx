import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCourseById } from '../api/courses';
import type { Course } from '../types';
import { Card, Button, Tag } from 'antd';
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
        return <div style={{ padding:'50px', textAlign:'center'}}>加载中...</div>
    }
    if(!course){
        return <div style={{ padding:'50px', textAlign: 'center'}}>课程不存在</div>
    }

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            message.success('链接已复制，可分享给好友');
        });
    }

    return (
        <div style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
            {/* 标题 */}
            <h1 style={{ fontSize: 28, textAlign: 'center', marginBottom: 12 }}>
                {course.title}
            </h1>
            
            {/* 讲师和分类 */}
            <div style={{ textAlign: 'center', marginBottom: 24, color: '#666' }}>
                <span>👨‍🏫 {course.instructorName}</span>
                <span style={{ margin: '0 12px' }}>·</span>
                <Tag color="blue">{course.category}</Tag>
            </div>

            {/* 信息卡片 - 价格、人数、按钮横向排列 */}
            <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '24px 32px',
                marginBottom: '32px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '32px'
            }}>
                {/* 价格 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>课程价格</div>
                    <span style={{ fontSize: 28, color: '#f50', fontWeight: 600 }}>¥{course.price}</span>
                </div>
                
                {/* 学习人数 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>学习人数</div>
                    <span style={{ fontSize: 18, color: '#333' }}>👥 {course.watchCount || 0} 人</span>
                </div>
                
                {/* 按钮组 */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button type="primary" size="large">加入购物车</Button>
                    <Button onClick={handleCopyLink} size="large">分享课程</Button>
                </div>
            </div>

            {/* 课程简介 */}
            <Card title="📖 课程简介" style={{ marginTop: 16 }}>
                <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: '#555' }}>
                    {course.description}
                </p>
            </Card>
        </div>
    );
};

export default CourseDetailPage;