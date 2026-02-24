import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, MoreVertical, Calendar, Heart, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCatStore } from "@/store/useCatStore";
import { getCats, deleteCat, updateCat } from "@/utils/supabaseApi";
import { calculateAge } from "@/utils/calculateAge";
import { calculateNextDate } from "@/utils/calculateNextDate";
import { CatData } from "@/types/cat";

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cats, setCats } = useCatStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const { data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: ["cats", user?.id],
    queryFn: () => getCats(user?.id || ""),
    enabled: !!user?.id,
  });

  // 데이터가 성공적으로 로드되면 cats 상태 업데이트
  useEffect(() => {
    if (isSuccess && data) {
      console.log("MyPage: Setting cats data:", data);
      setCats(data);
    }
  }, [data, isSuccess, setCats]);

  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-menu")) {
          setShowMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // 디버깅용 로그
  useEffect(() => {
    console.log("MyPage: Current cats state:", cats);
    console.log("MyPage: Query data:", data);
    console.log("MyPage: Query isLoading:", isLoading);
    console.log("MyPage: Query isSuccess:", isSuccess);

    // 각 고양이의 medical_logs 확인
    cats.forEach((cat, index) => {
      console.log(`MyPage: Cat ${index} (${cat.name}) medical_logs:`, cat.medical_logs);
    });
  }, [cats, data, isLoading, isSuccess]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // 삭제 함수
  const handleDeleteCat = async (catId: string) => {
    if (window.confirm("정말로 이 반려묘를 삭제하시겠습니까?")) {
      try {
        await deleteCat(catId);
        // 삭제 후 데이터 새로고침
        await refetch();
        setShowMenu(null);
      } catch (error) {
        console.error("Error deleting cat:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 수정 함수
  const handleEditCat = async (catId: string) => {
    const cat = cats.find((c) => c.id === catId);
    if (cat) {
      const newName = prompt("반려묘 이름을 수정하세요:", cat.name);
      if (newName && newName.trim() !== "" && newName !== cat.name) {
        try {
          console.log("수정 중...", { catId, newName });
          await updateCat(catId, { name: newName.trim() });
          // 수정 후 데이터 새로고침
          await refetch();
          alert("반려묘 이름이 수정되었습니다.");
        } catch (error) {
          console.error("Error updating cat:", error);
          alert("수정 중 오류가 발생했습니다.");
        }
      }
    }
    setShowMenu(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-wePeep"></div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto">
      <section className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{user?.name}님의 반려묘</h1>
          <button
            onClick={() => navigate("/create-cat")}
            className="p-2 text-white transition-colors rounded-lg bg-wePeep hover:bg-wePeep/90"
          >
            <Plus size={20} />
          </button>
        </div>

        {cats && cats.length > 0 ? (
          <div className="space-y-6">
            {cats.map((cat: CatData) => (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-gray-200 shadow-sm bg-snow rounded-xl"
              >
                <div className="flex items-start space-x-4">
                  {/* Cat Image */}
                  <div className="flex items-center justify-center flex-shrink-0 w-24 h-24 rounded-full bg-wePeep">
                    <span className="text-4xl">🐱</span>
                  </div>

                  {/* Cat Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold text-gray-800">{cat.name}</h2>
                        <span className="text-gray-600">
                          {cat.birth_date ? `${calculateAge(cat.birth_date)}살` : "나이 미상"}
                        </span>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === cat.id ? null : cat.id)}
                          className="p-2 text-gray-500 transition-colors hover:text-gray-700"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {showMenu === cat.id && (
                          <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px] dropdown-menu">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("수정 버튼 클릭됨:", cat.id);
                                handleEditCat(cat.id);
                                setShowMenu(null);
                              }}
                              className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                            >
                              <Edit size={16} />
                              <span>수정</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("삭제 버튼 클릭됨:", cat.id);
                                handleDeleteCat(cat.id);
                                setShowMenu(null);
                              }}
                              className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-left text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              <span>삭제</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Medical Logs */}
                    {cat.medical_logs ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-gray-600">건강검진 다녀온 날:</span>
                          <span className="text-gray-800">
                            {cat.medical_logs.health_checkup_date}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-gray-600">다음 건강검진:</span>
                          <span
                            className={
                              calculateNextDate(
                                cat.medical_logs.health_checkup_date,
                                cat.medical_logs.health_cycle,
                              ) > 0
                                ? "text-gray-800"
                                : "text-red-600"
                            }
                          >
                            {calculateNextDate(
                              cat.medical_logs.health_checkup_date,
                              cat.medical_logs.health_cycle,
                            ) > 0
                              ? `D-${calculateNextDate(
                                  cat.medical_logs.health_checkup_date,
                                  cat.medical_logs.health_cycle,
                                )}`
                              : "예정일이 지났습니다"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Heart size={16} className="text-gray-500" />
                          <span className="text-gray-600">심장사상충 약 바른 날:</span>
                          <span className="text-gray-800">{cat.medical_logs.heart_worm}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Heart size={16} className="text-gray-500" />
                          <span className="text-gray-600">다음 심장사상충:</span>
                          <span
                            className={
                              calculateNextDate(
                                cat.medical_logs.heart_worm,
                                cat.medical_logs.heart_worm_cycle,
                              ) > 0
                                ? "text-gray-800"
                                : "text-red-600"
                            }
                          >
                            {calculateNextDate(
                              cat.medical_logs.heart_worm,
                              cat.medical_logs.heart_worm_cycle,
                            ) > 0
                              ? `D-${calculateNextDate(
                                  cat.medical_logs.heart_worm,
                                  cat.medical_logs.heart_worm_cycle,
                                )}`
                              : "예정일이 지났습니다"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="mb-4 text-gray-500">건강검진 기록이 없습니다.</p>
                        <button
                          onClick={() => navigate(`/medical-log/${cat.id}`)}
                          className="px-4 py-2 text-white transition-colors rounded-lg bg-wePeep hover:bg-wePeep/90"
                        >
                          건강검진 기록하러가기 →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <span className="text-4xl" aria-hidden="true">
                🐱
              </span>
            </div>
            <p className="mb-6 text-gray-500">등록된 반려묘가 없습니다.</p>
            <button
              onClick={() => navigate("/create-cat")}
              className="px-6 py-3 text-white transition-colors rounded-lg bg-wePeep hover:bg-wePeep/90"
            >
              반려묘를 등록해주세요
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyPage;
