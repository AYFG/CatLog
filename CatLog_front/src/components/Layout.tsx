import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, User, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "@/utils/supabaseApi";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/calendar", icon: Calendar, label: "캘린더" },
    { path: "/mypage", icon: User, label: "마이페이지" },
  ];

  return (
    <div className="min-h-screen bg-snow">
      {/* Header */}
      <header className="bg-azalea shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">CatLog</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/settings")}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center py-2 px-4 ${
                    isActive ? "text-wePeep" : "text-gray-500"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs mt-1">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;

