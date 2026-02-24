import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Calendar from "react-calendar";
import { motion } from "framer-motion";
import { Plus, MoreVertical, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getDailyLogs, getDailyLogsByRange, deleteDailyLog } from "@/utils/supabaseApi";
import { DailyLogData } from "@/types/dailyLog";
import "react-calendar/dist/Calendar.css";

const CalendarPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesWithLogs, setDatesWithLogs] = useState<Set<string>>(new Set());
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // 로컬 시간을 사용하여 날짜 문자열 생성
  const formatDateToLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [logDate, setLogDate] = useState(formatDateToLocal(new Date()));

  const { data: dailyLogs, isLoading } = useQuery({
    queryKey: ["dailyLogs", logDate, user?.id],
    queryFn: () => getDailyLogs(logDate, user?.id || ""),
    enabled: !!user?.id,
  });

  // 모든 기록이 있는 날짜를 가져오는 쿼리 (최근 3개월)
  const { data: allLogs } = useQuery({
    queryKey: ["allDailyLogs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const today = new Date();
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      const startDate = formatDateToLocal(threeMonthsAgo);
      const endDate = formatDateToLocal(today);

      console.log("Fetching logs from", startDate, "to", endDate);

      try {
        const logs = await getDailyLogsByRange(startDate, endDate, user.id);
        // 고유한 날짜만 추출
        const uniqueDates = [...new Set(logs.map((log) => log.log_date))];
        console.log("Found logs on dates:", uniqueDates);
        return uniqueDates;
      } catch (error) {
        console.error("Error fetching logs by range:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  });

  // allLogs 데이터를 datesWithLogs 상태에 설정
  useEffect(() => {
    if (allLogs) {
      console.log("Calendar: Dates with logs:", allLogs);
      setDatesWithLogs(new Set(allLogs));
    }
  }, [allLogs]);

  // 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (logId: string) => deleteDailyLog(logId),
    onSuccess: () => {
      // 관련 쿼리들 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", logDate, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["allDailyLogs", user?.id] });
      setShowMenu(null);
    },
    onError: (error) => {
      console.error("Error deleting log:", error);
      alert("삭제 중 오류가 발생했습니다.");
    },
  });

  // 삭제 핸들러
  const handleDeleteLog = (logId: string) => {
    if (window.confirm("정말로 이 건강 기록을 삭제하시겠습니까?")) {
      deleteMutation.mutate(logId);
    }
  };

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

  const handleDateChange = (date: Date) => {
    console.log("Calendar: Selected date:", date);
    const formattedDate = formatDateToLocal(date);
    console.log("Calendar: Formatted date:", formattedDate);

    setSelectedDate(date);
    setLogDate(formattedDate);
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDateToLocal(date);
    const hasLogs = datesWithLogs.has(dateStr);

    if (hasLogs) {
      return (
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-wePeep rounded-full"></div>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="max-w-4xl mx-auto">
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">캘린더</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <section>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full"
              locale="ko-KR"
              formatDay={(locale, date) => date.getDate().toString()}
            />
          </section>

          {/* Daily Logs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{logDate} 기록</h2>
              <button
                onClick={() => navigate(`/daily-log/${logDate}`)}
                className="p-2 bg-wePeep text-white rounded-lg hover:bg-wePeep/90 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wePeep"></div>
              </div>
            ) : dailyLogs && dailyLogs.length > 0 ? (
              <div className="space-y-4">
                {dailyLogs.map((log: DailyLogData) => (
                  <motion.article
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{log.cat_name}의 건강 기록</h3>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowMenu(showMenu === log.id ? null : log.id);
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {showMenu === log.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px] dropdown-menu">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteLog(log.id!);
                                setShowMenu(null);
                              }}
                              className="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              <span>삭제</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">대변상태:</span>
                        <span className={log.defecation ? "text-green-600" : "text-red-600"}>
                          {log.defecation ? "좋았어요" : "좋지 않았어요"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">영양제:</span>
                        <span className={log.vitamin ? "text-green-600" : "text-red-600"}>
                          {log.vitamin ? "먹었어요" : "안먹었어요"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">체중:</span>
                        <span className="text-gray-800">{log.weight}kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">특이사항:</span>
                        <span className="text-gray-800">{log.etc || "없었어요"}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">오늘의 반려묘 건강을 기록해보세요</p>
                <button
                  onClick={() => navigate(`/daily-log/${logDate}`)}
                  className="px-4 py-2 bg-wePeep text-white rounded-lg hover:bg-wePeep/90 transition-colors"
                >
                  반려묘 건강 기록하기
                </button>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default CalendarPage;
