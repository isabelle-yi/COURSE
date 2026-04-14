import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCourseById } from '../api/courses';
import type { Course, Comment } from '../types';
import { Card, Button, Tag, Collapse, List, Avatar, Rate, Divider } from 'antd';
import { LockOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUser } from '../api/orders';
import { getCommentsByCourse } from '../api/comments';


const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if(id) {
            getCourseById(Number(id)).then(data => {
                setCourse(data);
                setLoading(false);
            });
        }
    }, [id])   

    useEffect(() => {
        if (id) {
            getCommentsByCourse(Number(id)).then(data => {
                setComments(data);
            });
        }
    },[id]);

    const { user } =useAuthStore();
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        if (user&& id){
            getOrdersByUser(user.id).then(orders =>{
                const purchased =orders.some(order => order.courseId === Number(id));
                setIsPurchased(purchased);
            });
        }
    },[user, id]);
    
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

   

    const renderChapter = () => {
        if (!course.chapters || course.chapters.length === 0){
           return <div style={{ textAlign: 'center',padding: 40,color: '#999'}}>暂无章节</div>;
        }
    
    const collapseItems = (course.chapters ?? []).map((chapter, chapterIndex) => ({
        key: chapterIndex,
        label: <span style={{ fontWeight: 500 }}>{chapter.chapterTitle}</span>,
        children:(
            <List
               size="small"
               dataSource={chapter.sections}
               renderItem={(section, sectionIndex) => {
                const isFree = section.isFree || false;
                const canWatch = isPurchased || isFree;

                return (
                    <List.Item
                        style={{ 
                           cursor: canWatch ? 'pointer' : 'not-allowed',
                           opacity: canWatch ? 1:0.6
                        }}
                        onClick={() => {
                            if (canWatch) {
                                window.location.href=`/course/${course.id}/learn?chapter=${chapterIndex}&section=${sectionIndex}`;
                            } else {
                                message.warning('请先购买课程');
                            }
                        }}                    
                    >
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12}}>
                           <PlayCircleOutlined style={{ color: canWatch ? '#1890ff':'#ccc'}}/>
                           <span>{section.title}</span>
                       </div>
                       {!canWatch && <LockOutlined style={{ color: '#ccc'}}/>}
                       {isFree && !isPurchased && (
                        <Tag color="green" style={{ margin: 8 }}>试听</Tag>
                       )}
                    </List.Item>
                );
               }}
            />
        )
    }));

    return <Collapse items={collapseItems} defaultActiveKey={[0]}/>

  };
  

    const renderComments = () => {
    if(!comments || comments.length === 0){
        return<div style={{textAlign: 'center', padding: 40,color: '#999'}}>暂无评论，快来抢沙发～</div>;
    }

    return(
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#87d068'}}>{comment.userName?.[0] || 'U'}</Avatar>}
                  title={
                    <div style={{ display: 'flex',alignItems: 'center', gap: 12}}>
                        <span>{comment.userName}</span>
                        <Rate disabled defaultValue={comment.rating} style={{ fontSize: 12 }}/>
                    </div>
                  }
                  description={
                    <div>
                        <p style={{ margin: '8px 0' }}>{comment.content}</p>
                        <span style={{ fontSize: 12,color: '#999'}}>{comment.createdAt}</span>
                    </div>
                  }
                />
            </List.Item>
          )}
        />
    );
   };


    return (
        <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
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
                   {!isPurchased ? (
                    <Button type="primary" size="large">加入购物车</Button>
                   ):(
                    <Button type="primary" size="large">已购买</Button>
                   )}
                   <Button onClick={handleCopyLink} size="large">分享课程</Button>
                </div>
            </div>

            {/* 课程简介 */}
            <Card title="📖 课程简介" style={{ marginTop: 16 }}>
                <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: '#555' }}>
                    {course.description}
                </p>
            </Card>
            
            {/* 章节列表 */}
            <Card title="📚 章节列表" style={{ marginTop: 24 }}>
                {renderChapter()}
            </Card>

            {/* 评论 */}
            <Card title="💬 评论" style={{ marginTop: 16 }}>
                {renderComments()}
            </Card>
        </div>
    );
};

export default CourseDetailPage;