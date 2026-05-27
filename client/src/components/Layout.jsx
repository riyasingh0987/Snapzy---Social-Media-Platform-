import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="hidden xl:flex xl:w-80 shrink-0 fixed left-0 top-0 h-screen bg-white border-r border-slate-200 shadow-sm">
        <Sidebar />
      </div>

      <div className="flex-1 xl:ml-80">
        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default Layout;