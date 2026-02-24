import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Shield, HelpCircle, AlertTriangle, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut, deleteUserAccount } from "@/utils/supabaseApi";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // 회원 탈퇴 뮤테이션
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("사용자 정보를 찾을 수 없습니다.");
      console.log("Starting account deletion process...");
      await deleteUserAccount(user.id);
    },
    onSuccess: () => {
      console.log("Account deletion successful, logging out...");
      logout();
      navigate("/login");
      alert("회원 탈퇴가 완료되었습니다. 모든 데이터가 삭제되었습니다.");
    },
    onError: (error: any) => {
      console.error("Account deletion error:", error);
      let errorMessage = "회원 탈퇴 중 오류가 발생했습니다.";

      if (error.message?.includes("사용자 정보를 찾을 수 없습니다")) {
        errorMessage = "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.";
      } else if (error.message?.includes("permission denied")) {
        errorMessage = "권한이 없습니다. 관리자에게 문의해주세요.";
      } else if (error.message?.includes("network")) {
        errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
      }

      alert(errorMessage);
    },
  });

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = () => {
    if (deleteConfirmText === "탈퇴") {
      deleteAccountMutation.mutate();
    } else {
      alert("정확히 '탈퇴'라고 입력해주세요.");
    }
  };

  const settingsItems = [
    {
      icon: User,
      title: "프로필 관리",
      description: "개인정보 및 계정 설정",
      onClick: () => console.log("프로필 관리"),
    },
    {
      icon: Bell,
      title: "알림 설정",
      description: "알림 및 알림 시간 설정",
      onClick: () => console.log("알림 설정"),
    },
    {
      icon: Shield,
      title: "개인정보 보호",
      description: "데이터 보호 및 개인정보 설정",
      onClick: () => console.log("개인정보 보호"),
    },
    {
      icon: HelpCircle,
      title: "도움말 및 지원",
      description: "FAQ 및 고객 지원",
      onClick: () => console.log("도움말"),
    },
    {
      icon: AlertTriangle,
      title: "회원 탈퇴",
      description: "계정 및 모든 데이터 삭제",
      onClick: () => setShowDeleteModal(true),
      isDanger: true,
    },
  ];

  return (
    <main className="max-w-2xl mx-auto">
      <section className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <header className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">설정</h1>
        </header>

        {/* User Info */}
        <aside className="p-4 bg-gray-50 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-wePeep rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </aside>

        {/* Settings Items */}
        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={item.onClick}
              className={`w-full p-4 bg-white border rounded-lg transition-colors text-left ${
                item.isDanger
                  ? "border-red-200 hover:bg-red-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${item.isDanger ? "bg-red-100" : "bg-gray-100"}`}>
                  <item.icon
                    size={20}
                    className={item.isDanger ? "text-red-600" : "text-gray-600"}
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${item.isDanger ? "text-red-800" : "text-gray-800"}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${item.isDanger ? "text-red-600" : "text-gray-600"}`}>
                    {item.description}
                  </p>
                </div>
                <div className="text-gray-400">
                  <ArrowLeft size={16} className="rotate-180" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Notification Toggle */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-800">알림 받기</h3>
                <p className="text-sm text-gray-600">사냥 놀이 알림 및 건강 기록 알림</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? "bg-wePeep" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Info */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>CatLog v1.0.0</p>
          <p className="mt-1">고양이와 함께하는 건강한 일상</p>
        </footer>
      </section>

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-800">회원 탈퇴</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">삭제되는 데이터:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 반려묘 정보 및 건강 기록</li>
                  <li>• 일일 로그 및 의료 기록</li>
                  <li>• 계정 정보 및 개인정보</li>
                </ul>
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>참고:</strong> 앱 데이터는 완전히 삭제되며, 인증 계정은 비활성화됩니다.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                탈퇴를 진행하려면 아래에 <strong>"탈퇴"</strong>라고 입력해주세요.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="탈퇴"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteAccountMutation.isPending ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default Settings;
