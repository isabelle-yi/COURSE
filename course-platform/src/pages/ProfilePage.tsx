import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Form, Input, Button, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { updateUser } from '../api/users';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser: updateUserStore } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [nickname, setNickname] = useState('');
  const debounceTimerRef = useRef<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

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
      setAvatarPreview(user.avatar || '');  // ← 改成 setAvatarPreview
    }
  }, [user, form]);

  const handleAvatarChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      message.success('头像预览成功，请点击保存');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const updateData: any = {};
      if (values.nickname !== (user?.nickname || user?.name)) {
        updateData.nickname = values.nickname;
      }
      if (avatarPreview && avatarPreview !== user?.avatar) {
        updateData.avatar = avatarPreview;
      }
      
      if (Object.keys(updateData).length > 0 && user) {
        await updateUser(user.id, updateData);
        updateUserStore(updateData);
        message.success('保存成功');
      } else {
        message.info('没有修改任何信息');
      }
    } catch (error) {
      message.error('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const debounceSaveNickname = useCallback((newNickname: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      if (user && newNickname !== (user.nickname || user.name)) {
        try {
          await updateUser(user.id, { nickname: newNickname });
          updateUserStore({ nickname: newNickname });
          message.success('昵称已保存');
        } catch (error) {
          message.error('保存失败');
        }
      }
    }, 500);
  }, [user, updateUserStore]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    debounceSaveNickname(value);
  };

  if (!user) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>请先登录</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <Card title="个人中心">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={100} src={avatarPreview || user?.avatar} icon={<UserOutlined />} />
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
              更换头像
            </Button>
          </Upload>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="昵称" name="nickname">
            <Input 
              placeholder="请输入昵称" 
              value={nickname}
              onChange={handleNicknameChange}
            />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input disabled placeholder="邮箱" />
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