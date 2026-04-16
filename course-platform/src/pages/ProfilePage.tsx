import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { updateUser } from '../api/users';
import { getCommentsByUser, updateComment } from '../api/comments';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser: updateUserStore } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        nickname: user.nickname || user.name,
        email: user.email,
      });
    }
  }, [user, form]);

 const handleSubmit = async (values: any) => {
  if (!user) return;
  
  setLoading(true);
  try {
    const newNickname = values.nickname;
    const currentNickname = user.nickname || user.name;
    
    console.log('=== 开始保存 ===');
    console.log('新昵称:', newNickname);
    console.log('当前昵称:', currentNickname);
    console.log('当前用户ID:', user.id);
    
    // 1. 更新用户信息
    if (newNickname !== currentNickname) {
      console.log('更新用户信息...');
      await updateUser(user.id, { nickname: newNickname });
      updateUserStore({ nickname: newNickname });
    }
    
    // 2. 获取该用户的所有评论
    console.log('获取用户评论...');
    const comments = await getCommentsByUser(user.id);
    console.log('找到评论数量:', comments.length);
    console.log('评论详情:', comments);
    
    // 3. 更新每条评论
    for (const comment of comments) {
      console.log(`更新评论 ID ${comment.id} 的用户名...`);
      await updateComment(comment.id, { userName: newNickname });
    }
    
    console.log('=== 保存完成 ===');
    message.success('保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败，请稍后重试');
  } finally {
    setLoading(false);
  }
};

  if (!user) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>请先登录</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <Card title="个人中心">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={100} src={user?.avatar} icon={<UserOutlined />} />
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;