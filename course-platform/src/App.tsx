
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
import CourseDetailPage from './pages/CourseDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'


function App() {
  return (
   <>
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />}/>
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/cart' element={<CartPage />}/>
        <Route path="/checkout" element={<CheckoutPage />}/>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/instructor/*" element={<InstructorDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

export default App;