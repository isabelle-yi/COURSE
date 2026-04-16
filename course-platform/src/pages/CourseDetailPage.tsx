import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCourseById } from '../api/courses';
import type { Course, Comment } from '../types';
import { Card, Button, Tag, Collapse, List, Avatar, Rate, Input, Pagination, message } from 'antd';
import { LockOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUser } from '../api/orders';
import { createComment, getCommentsByCourse } from '../api/comments';
import { useCartStore } from '../store/useCartStore';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const commentPageSize = 5;

  // 获取课程详情
  useEffect(() => {
    if (id) {
      getCourseById(Number(id)).then(data => {
        setCourse(data);
        setLoading(false);
      });
    }
  }, [id]);

  // 获取评论列表
  useEffect(() => {
    if (id) {
      getCommentsByCourse(Number(id)).then(data => {
        setComments(data);
      });
    }
  }, [id]);

  const { user } = useAuthStore();
  const [isPurchased, setIsPurchased] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const [searchParams] = useSearchParams();
  const isPurchasedFromUrl = searchParams.get('purchased') === 'true';
  const finalIsPurchased = isPurchased || isPurchasedFromUrl;

  // 检查是否已购买
  useEffect(() => {
    if (user && id) {
      getOrdersByUser(user.id).then(orders => {
        const purchased = orders.some(order => order.courseId === Number(id));
        setIsPurchased(purchased);
      });
    }
  }, [user, id]);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>;
  }
  if (!course) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>课程不存在</div>;
  }

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success('链接已复制，可分享给好友');
    });
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    if (!commentContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    setSubmitting(true);
    try {
      const newComment = {
        userId: user.id,
        userName: user.nickname || user.name,
        courseId: Number(id),
        content: commentContent,
        rating: commentRating,
        createdAt: new Date().toISOString().split('T')[0],
      };
      await createComment(newComment);
      message.success('评论成功');
      setCommentContent('');
      setCommentRating(5);
      const updatedComments = await getCommentsByCourse(Number(id));
      setComments(updatedComments);
      setCommentPage(1);
    } catch (error) {
      message.error('评论失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染章节列表
  const renderChapter = () => {
    if (!course.chapters || course.chapters.length === 0) {
      return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无章节</div>;
    }

    const collapseItems = (course.chapters ?? []).map((chapter, chapterIndex) => ({
      key: chapterIndex,
      label: <span style={{ fontWeight: 500 }}>{chapter.chapterTitle}</span>,
      children: (
        <List
          size="small"
          dataSource={chapter.sections}
          renderItem={(section, sectionIndex) => {
            const isFree = section.isFree || false;
            const canWatch = finalIsPurchased || isFree;

            return (
              <List.Item
                style={{
                  cursor: canWatch ? 'pointer' : 'not-allowed',
                  opacity: canWatch ? 1 : 0.6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '8px 12px',
                }}
                onClick={() => {
                  if (canWatch) {
                    window.location.href = `/course/${course.id}/learn?chapter=${chapterIndex}&section=${sectionIndex}`;
                  } else {
                    message.warning('请先购买课程');
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PlayCircleOutlined style={{ color: canWatch ? '#1890ff' : '#ccc' }} />
                  <span>{section.title}</span>
                </div>
                <div style={{ minWidth: 50, textAlign: 'center' }}>
                  {!canWatch && <LockOutlined style={{ color: '#ccc' }} />}
                  {isFree && !finalIsPurchased && <Tag color="green">试听</Tag>}
                </div>
              </List.Item>
            );
          }}
        />
      ),
    }));

    return <Collapse items={collapseItems} defaultActiveKey={[0]} />;
  };

  // 渲染评论区
  const renderComments = () => {
    const start = (commentPage - 1) * commentPageSize;
    const end = start + commentPageSize;
    const paginatedComments = comments.slice(start, end);

    return (
      <div>
        {/* 评论列表标题 */}
        <h3 style={{ marginTop: 0 }}>同学评价 ({comments.length})</h3>

        {/* 评论列表 */}
        {paginatedComments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            暂无评论，快来抢沙发～
          </div>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={paginatedComments}
              renderItem={(comment) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{comment.userName?.[0] || 'U'}</Avatar>}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span>{comment.userName}</span>
                        <Rate disabled defaultValue={comment.rating} style={{ fontSize: 12 }} />
                      </div>
                    }
                    description={
                      <div>
                        <p style={{ margin: '8px 0' }}>{comment.content}</p>
                        <span style={{ fontSize: 12, color: '#999' }}>{comment.createdAt}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            {/* 分页 */}
            {comments.length > commentPageSize && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <Pagination
                  current={commentPage}
                  total={comments.length}
                  pageSize={commentPageSize}
                  onChange={setCommentPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}

        {/* 发表评论表单 - 只有已购买的用户才能看到，放在评论列表下面 */}
        {finalIsPurchased && (
          <div style={{ marginTop: 32 }}>
            <h3>发表评论</h3>
            <div style={{ marginBottom: 12 }}>
              <span style={{ marginRight: 8 }}>评分：</span>
              <Rate value={commentRating} onChange={setCommentRating} />
            </div>
            <Input.TextArea
              rows={4}
              placeholder="请输入你的评论..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" loading={submitting} onClick={handleSubmitComment}>
                提交评论
              </Button>
            </div>
          </div>
        )}

        {/* 未购买时显示提示 */}
        {!finalIsPurchased && (
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, textAlign: 'center', color: '#666' }}>
            💬 购买后可发表评论
          </div>
        )}
      </div>
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

      {/* 信息卡片 */}
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>课程价格</div>
          <span style={{ fontSize: 28, color: '#f50', fontWeight: 600 }}>¥{course.price}</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>学习人数</div>
          <span style={{ fontSize: 18, color: '#333' }}>👥 {course.watchCount || 0} 人</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!finalIsPurchased ? (
            <Button
              type="primary"
              size="large"
              onClick={() => {
                if (!course || !course.id) {
                  message.error('课程信息错误，无法添加');
                  return;
                }
                if (isPurchased) {
                  message.warning('您已购买该课程，无需添加');
                  return;
                }
                try {
                  const success = addToCart(course);
                  if (success) {
                    message.success('已添加到购物车');
                  } else {
                    message.info('课程已在购物车中');
                  }
                } catch (error) {
                  message.error('网络错误，添加失败，请稍候重试');
                }
              }}
            >
              加入购物车
            </Button>
          ) : (
            <Button type="primary" size="large">
              已购买
            </Button>
          )}
          <Button onClick={handleCopyLink} size="large">
            分享课程
          </Button>
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