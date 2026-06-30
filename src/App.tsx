import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import { LanguageProvider } from './contexts/LanguageContext'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import หน้าต่างๆ
import Home from './pages/Home' // <-- 1. นำเข้าหน้า Home ที่เพิ่งสร้างใหม่
import Profile from './pages/Profile'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardOverview from './pages/admin/DashboardOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminShowcases from './pages/admin/AdminShowcases'
import AdminEvents from './pages/admin/AdminEvents'
import AdminReports from './pages/admin/AdminReports'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'
import Events from './pages/Events'
import AllEvents from './pages/AllEvents'
import CreateBlog from './pages/CreateBlog'
import BlogDetail from './pages/BlogDetail'
import AllBlogs from './pages/AllBlogs'
import CreateShowcase from './pages/CreateShowcase'
import AllShowcases from './pages/AllShowcases'
import SearchPage from './pages/SearchPage';
import UpdatePassword from './pages/UpdatePassword'
import CreateResource from './pages/CreateResource'
import Resources from './pages/AllResource'
import AdminResources from './pages/admin/AdminResources'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="max-w-full min-h-screen mx-auto bg-slate-50 flex flex-col"> 
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* 2. เรียกใช้หน้า Home ตัวใหม่ตรงนี้ */}
              <Route path="/" element={<Home />} />
              
              {/* สร้างหน้าอื่นๆ ไว้ชั่วคราว (Placeholder) */}
              <Route path="/events" element={<Events />} />
              <Route path="/blogs" element={<AllBlogs />} />
              
              <Route path="/showcases" element={<AllShowcases />} />
              <Route path="/about" element={<div className="px-16 py-10 text-2xl font-bold">นี่คือหน้า เกี่ยวกับเรา</div>} />
              
              <Route path='/profile' element={<Profile />} />
              <Route path="/create/blog" element={<CreateBlog />} />
              <Route path="/edit/blog/:id" element={<CreateBlog />} /> {/* แยกไว้สำหรับการแก้ไขบล็อก */}

              <Route path="/create/event" element={<CreateEvent />} />
              <Route path="/edit/event/:id" element={<CreateEvent />} />

              <Route path="/create/showcase" element={<CreateShowcase />} />
              <Route path="/edit/showcase/:id" element={<CreateShowcase />} />

              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/events/all" element={<AllEvents />} />

              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/update-password" element={<UpdatePassword />} />

              <Route path="/resources" element={<Resources />} />
              <Route path="/create-resource" element={<CreateResource />} />
              <Route path="/edit/resource/:id" element={<CreateResource />} />
              

              
              
              {/* Route สำหรับ Admin Dashboard */}
              <Route path="/admin-dashboard" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path='blogs' element={<AdminBlogs />} />
                <Route path='events' element={<AdminEvents />} />
                <Route path='showcases' element={<AdminShowcases />} />
                <Route path='resources' element={<AdminResources />} />
                <Route path='reports' element={<AdminReports />} />
                <Route path='users' element={<AdminUsers />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App