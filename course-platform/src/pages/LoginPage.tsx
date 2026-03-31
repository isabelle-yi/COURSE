import { Card, Form, Input, Button, Select, message, Tabs } from 'antd';
import { loginUser, registerUser } from'../api/users';
import { useAuthStore } from '../store/useAuthStore';
function LoginPage() {
  const { login } = useAuthStore();

  const onFinishLogin= async (values: any) =>{
    const { email, password, role } =values;

    const user =await loginUser(email,password);

    if(user && user.role === role){
      login(user);
      message.success('登录成功');
      window.location.href='/';
    }else{
      message.error('邮箱或密码错误，或角色不匹配');
    }
  };

  const onFinishRegister = async (values: any) => {
    const { email, password, name, role } = values;

    try {
      const newUser = await registerUser({ email, password, name, role });
      message.success('注册成功，正在自动登录...');
      login(newUser);
      window.location.href ='/';
    }catch(error: any){
      message.error(error.message ||'注册失败，请稍候重试');
    }
  };

  return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}>
            <Card title="欢迎登录" style={{ width: 450}}>
            <Tabs defaultActiveKey="login">
             <Tabs.TabPane tab="登录" key="login">

             <Form layout="vertical" onFinish={onFinishLogin}>
                <Form.Item 
                  label="邮箱" 
                  name="email"
                  rules={[{ required: true, message: '请输入邮箱' }]}
                >
                  <Input placeholder="请输入邮箱"/>
                </Form.Item>

                <Form.Item 
                 label="密码" 
                 name="password"
                 rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input placeholder="请输入密码"/>
                </Form.Item>

                <Form.Item 
                 label="角色"
                 name="role"
                 rules={[{ required: true, message: '请选择角色'}]}
                 >
                  <Select placeholder="请选择角色">
                    <Select.Option value="student">学生</Select.Option>
                    <Select.Option value="instructor">教师</Select.Option>
                    <Select.Option value="admin">管理员</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    登录
                  </Button>
                </Form.Item>
               </Form>
             </Tabs.TabPane>

             <Tabs.TabPane tab="注册" key="register">
               <Form layout="vertical" 
                 onFinish={onFinishRegister}
                 initialValues={{ role: 'student' }}
            >
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true,message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址'}
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item 
                  label="真实姓名" 
                  name="name"
                  rules={[{ required: true, message: '请输入真实姓名' }]}
              >
                  <Input placeholder="请输入真实姓名" />
                </Form.Item>

                <Form.Item
                  label="昵称"
                  name="nickname"
                  tooltip="不填则默认使用真实姓名"
                >
                  <Input placeholder="选填，用于显示" />
                </Form.Item>

                <Form.Item
                  label="密码"
                  name="password" 
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位' }
                  ]}
                >
                  <Input.Password placeholder="请输入密码（至少六位）" />
                </Form.Item>
                
                <Form.Item 
                    label="确认密码" 
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                  },}),
                  ]}
                >
                    <Input.Password placeholder="请再次输入密码" />
                </Form.Item>
                
                <Form.Item
                  label="角色"
                  name="role"
                  rules={[
                    {required:true,message:'请选择'}]}
                >
                  <Select placeholder="请选择角色">
                    <Select.Option value="student">学生</Select.Option>
                    <Select.Option value="instructor">讲师</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      注册
                    </Button>
                </Form.Item>
               </Form>
             </Tabs.TabPane>
            </Tabs>
            </Card>
          </div>
  );
}

export default LoginPage; 