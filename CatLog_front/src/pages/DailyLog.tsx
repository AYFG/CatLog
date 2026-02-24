import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCatStore } from "@/store/useCatStore";
import { getCats, createDailyLog, updateDailyLog, getDailyLogs } from "@/utils/supabaseApi";
import { DailyLogData } from "@/types/dailyLog";

const DailyLogPage = () => {
  const { logDate } = useParams<{ logDate: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cats } = useCatStore();
  const [selectedCatId, setSelectedCatId] = useState("");
  const [formData, setFormData] = useState({
    defecation: false,
    weight: "",
    vitamin: false,
    etc: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get cats
  const { data: catsData } = useQuery({
    queryKey: ["cats", user?.id],
    queryFn: () => getCats(user?.id || ""),
    enabled: !!user?.id,
  });

  // Get existing daily logs for the date
  const { data: existingLogs } = useQuery({
    queryKey: ["dailyLogs", logDate, user?.id],
    queryFn: () => getDailyLogs(logDate || "", user?.id || ""),
    enabled: !!user?.id && !!logDate,
  });

  // Create/Update daily log mutation
  const mutation = useMutation({
    mutationFn: (logData: Omit<DailyLogData, "id" | "created_at" | "updated_at" | "cat_name">) => {
      const existingLog = existingLogs?.find((log) => log.cat_id === selectedCatId);
      if (existingLog) {
        return updateDailyLog(existingLog.id!, formData);
      } else {
        return createDailyLog(logData);
      }
    },
    onSuccess: () => {
      navigate("/calendar");
    },
    onError: (error: any) => {
      setErrors({ general: error.message });
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedCatId) {
      newErrors.cat = "고양이를 선택해주세요";
    }
    if (!formData.weight.trim()) {
      newErrors.weight = "체중을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && logDate) {
      const selectedCat = cats.find((cat) => cat.id === selectedCatId);
      if (selectedCat) {
        mutation.mutate({
          cat_id: selectedCatId,
          defecation: formData.defecation,
          weight: formData.weight,
          vitamin: formData.vitamin,
          etc: formData.etc,
          log_date: logDate,
        });
      }
    }
  };

  const selectedCat = cats.find((cat) => cat.id === selectedCatId);

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
          <h1 className="text-2xl font-bold text-gray-800 ml-4">{logDate} 건강 기록</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cat Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">고양이 선택</label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.cat ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep`}
            >
              <option value="">고양이를 선택해주세요</option>
              {cats.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.cat && <p className="mt-1 text-sm text-red-600">{errors.cat}</p>}
          </div>

          {selectedCat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-wePeep rounded-full flex items-center justify-center">
                  <span className="text-2xl">🐱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedCat.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCat.birth_date
                      ? `${
                          new Date().getFullYear() - new Date(selectedCat.birth_date).getFullYear()
                        }살`
                      : "나이 미상"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Defecation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">대변상태</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="defecation"
                  checked={formData.defecation === true}
                  onChange={() => setFormData({ ...formData, defecation: true })}
                  className="mr-2"
                />
                <span className="text-green-600">좋았어요</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="defecation"
                  checked={formData.defecation === false}
                  onChange={() => setFormData({ ...formData, defecation: false })}
                  className="mr-2"
                />
                <span className="text-red-600">좋지 않았어요</span>
              </label>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              체중 (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.weight ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep`}
              placeholder="체중을 입력해주세요"
            />
            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
          </div>

          {/* Vitamin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">영양제</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vitamin"
                  checked={formData.vitamin === true}
                  onChange={() => setFormData({ ...formData, vitamin: true })}
                  className="mr-2"
                />
                <span className="text-green-600">먹었어요</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vitamin"
                  checked={formData.vitamin === false}
                  onChange={() => setFormData({ ...formData, vitamin: false })}
                  className="mr-2"
                />
                <span className="text-red-600">안먹었어요</span>
              </label>
            </div>
          </div>

          {/* Etc */}
          <div>
            <label htmlFor="etc" className="block text-sm font-medium text-gray-700 mb-2">
              특이사항
            </label>
            <textarea
              id="etc"
              value={formData.etc}
              onChange={(e) => setFormData({ ...formData, etc: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep"
              placeholder="특이사항을 입력해주세요"
            />
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="text-red-600 text-sm text-center">{errors.general}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 px-4 bg-wePeep text-white font-semibold rounded-lg hover:bg-wePeep/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {mutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>건강 기록 저장하기</span>
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default DailyLogPage;
