
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursePage';
import ProfilePage from './pages/ProfilePage';
import MyLearningPage from './pages/MyLearningPage';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentLayout from './layouts/StudentLayout';
 import { useAuthStore } from './store/useAuthStore';
function App() {
    //const { user, isLogin, login, logout, switchRole } = useAuthStore();
  
  // 临时测试函数
  /*const testLogin = () => {
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
};*/
  return (
   <>
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