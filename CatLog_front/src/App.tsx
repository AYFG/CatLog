import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { UserData } from "@/types/auth";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import MyPage from "@/pages/MyPage";
import CreateCat from "@/pages/CreateCat";
import DailyLog from "@/pages/DailyLog";
import MedicalLog from "@/pages/MedicalLog";
import Settings from "@/pages/Settings";

function App() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // 로딩 타임아웃 설정 (5초 후 강제로 로딩 해제)
    const loadingTimeout = setTimeout(() => {
      console.warn("App: Loading timeout, forcing loading to false");
      setLoading(false);
    }, 5000);

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log("App: Initial session:", session);
        if (session?.user) {
          console.log("App: Setting user from session:", session.user);
          setUser(session.user as UserData);
        }
        clearTimeout(loadingTimeout);
        setLoading(false);
      })
      .catch((error) => {
        console.error("App: Error getting session:", error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("App: Auth state change:", { event: _event, session });
      if (session?.user) {
        console.log("App: Setting user from auth change:", session.user);
        setUser(session.user as UserData);
      } else {
        console.log("App: Clearing user");
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [setUser, setLoading]);

  if (useAuthStore.getState().isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-wePeep"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Home />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="create-cat" element={<CreateCat />} />
        <Route path="daily-log/:logDate" element={<DailyLog />} />
        <Route path="medical-log/:catId" element={<MedicalLog />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
