import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar'; // ดึง Sidebar มาใช้

const AdminLayout = () => {
  return (
    <div className="flex-1 h-auto bg-[#f4f7fa] ">
      {/* Container หลัก */}
      <div className="w-full mx-auto px-5.5 lg:px-14 py-8 flex flex-col lg:flex-row items-start gap-8">
        {/* Sidebar ทางซ้าย */}
        <AdminSidebar />
        {/* เนื้อหาทางขวา(Dashboard) */}
        <div className="flex-1 flex-1 w-full min-w-0 overflow-x-hidden">
          <Outlet /> 
        </div>
        
      </div>
    </div>
  );
};

export default AdminLayout;