
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursePage';
import ProfilePage from './pages/ProfilePage';
import MyLearningPage from './pages/MyLearningPage';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentLayout from './layouts/StudentLayout';


function App() {
    const { user, isLogin, login, logout, switchRole } = useAuthStore();
  
  // 临时测试函数
  const testLogin = () => {
    login({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      password: '123456',
      role: 'instructor',
      nickname: '小明同学'
    });
    console.log('登录成功', useAuthStore.getState());
  };
  
  const testLogout = () => {
    logout();
    console.log('退出登录', useAuthStore.getState());
  };

  const testSwitchToInstructor = () => {
    switchRole('instructor');
    console.log('切换到讲师角色');
};

  const testSwitchToAdmin = () => {
    switchRole('admin');
    console.log('切换到管理员角色');
};

  const testSwitchToStudent = () => {
  switchRole('student');
  console.log('切换到学生角色');
};
  return (
   <>
      {/* 临时测试面板 - 测试完成后删掉 */}
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
        border: '1px solid #ddd'
      }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>测试面板</div>
        <button onClick={testLogin} style={{ marginRight: '8px' }}>登录</button>
        <button onClick={testLogout}>退出</button>
        <div style={{ marginTop: '8px'}}>用户：{user?.name || '未登录'}</div>
        <div style={{ marginBottom: '8px'}}>状态：{isLogin ?'已登录' : '未登录'}</div>
        <button onClick={testSwitchToStudent} style={{ marginRight: '8px' }}>学生</button>
        <button onClick={testSwitchToInstructor} style={{ marginRight: '8px' }}>讲师</button>
        <button onClick={testSwitchToAdmin}>管理员</button>
        <div style={{ marginTop: '8px'}}>当前角色：{user?.role || '无'}</div>  
      </div>
  
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/instructor/*" element={<InstructorDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
    </>
  );
}

export default App;