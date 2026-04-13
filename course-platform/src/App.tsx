
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursePage';
import ProfilePage from './pages/ProfilePage';
import MyLearningPage from './pages/MyLearningPage';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentLayout from './layouts/StudentLayout';
import CategoryPage from './pages/CategoryPage';
function App() {
  return (
   <>
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/instructor/*" element={<InstructorDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
    </>
  );
}

export default App;