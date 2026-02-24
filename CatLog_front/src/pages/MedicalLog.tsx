import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCatStore } from "@/store/useCatStore";
import { getCats, getMedicalLogs, createMedicalLog, updateMedicalLog } from "@/utils/supabaseApi";
import { MedicalLogData } from "@/types/medicalLog";

const MedicalLogPage = () => {
  const { catId } = useParams<{ catId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cats } = useCatStore();
  const [formData, setFormData] = useState({
    health_checkup_date: "",
    health_cycle: 12,
    heart_worm: "",
    heart_worm_cycle: 1,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedCat = cats.find((cat) => cat.id === catId);

  // Get existing medical log
  const { data: existingLog } = useQuery({
    queryKey: ["medicalLog", catId],
    queryFn: () => getMedicalLogs(catId || ""),
    enabled: !!catId,
  });

  // Update form data when existing log is loaded
  useEffect(() => {
    if (existingLog) {
      setFormData({
        health_checkup_date: existingLog.health_checkup_date,
        health_cycle: existingLog.health_cycle,
        heart_worm: existingLog.heart_worm,
        heart_worm_cycle: existingLog.heart_worm_cycle,
      });
    }
  }, [existingLog]);

  // Create/Update medical log mutation
  const mutation = useMutation({
    mutationFn: (logData: Omit<MedicalLogData, "id" | "created_at" | "updated_at">) => {
      if (existingLog) {
        return updateMedicalLog(existingLog.id!, formData);
      } else {
        return createMedicalLog(logData);
      }
    },
    onSuccess: () => {
      navigate("/mypage");
    },
    onError: (error: any) => {
      setErrors({ general: error.message });
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.health_checkup_date) {
      newErrors.health_checkup_date = "건강검진 날짜를 선택해주세요";
    }
    if (!formData.heart_worm) {
      newErrors.heart_worm = "심장사상충 약을 바른 날짜를 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && catId) {
      mutation.mutate({
        cat_id: catId,
        health_checkup_date: formData.health_checkup_date,
        health_cycle: formData.health_cycle,
        heart_worm: formData.heart_worm,
        heart_worm_cycle: formData.heart_worm_cycle,
      });
    }
  };

  if (!selectedCat) {
    return (
      <main className="max-w-2xl mx-auto">
        <section className="p-6 text-center bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">고양이 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/mypage")}
            className="px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-wePeep hover:bg-wePeep/90"
          >
            마이페이지로 돌아가기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto">
      <section className="p-6 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <header className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 transition-colors hover:text-gray-800"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="ml-4 text-2xl font-bold text-gray-800">{selectedCat.name}의 의료 기록</h1>
        </header>

        {/* Cat Info */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 rounded-lg bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-wePeep">
              <span className="text-2xl" aria-hidden="true">
                🐱
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{selectedCat.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedCat.birth_date
                  ? `${new Date().getFullYear() - new Date(selectedCat.birth_date).getFullYear()}살`
                  : "나이 미상"}
              </p>
            </div>
          </div>
        </motion.aside>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Health Checkup Date */}
          <div>
            <label
              htmlFor="health_checkup_date"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              건강검진 다녀온 날
            </label>
            <input
              id="health_checkup_date"
              type="date"
              value={formData.health_checkup_date}
              onChange={(e) => setFormData({ ...formData, health_checkup_date: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.health_checkup_date ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep`}
            />
            {errors.health_checkup_date && (
              <p className="mt-1 text-sm text-red-600">{errors.health_checkup_date}</p>
            )}
          </div>

          {/* Health Cycle */}
          <div>
            <label htmlFor="health_cycle" className="block mb-2 text-sm font-medium text-gray-700">
              건강검진 주기 (개월)
            </label>
            <select
              id="health_cycle"
              value={formData.health_cycle}
              onChange={(e) => setFormData({ ...formData, health_cycle: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep"
            >
              <option value={6}>6개월</option>
              <option value={12}>12개월</option>
              <option value={18}>18개월</option>
              <option value={24}>24개월</option>
            </select>
          </div>

          {/* Heart Worm Date */}
          <div>
            <label htmlFor="heart_worm" className="block mb-2 text-sm font-medium text-gray-700">
              심장사상충 약 바른 날
            </label>
            <input
              id="heart_worm"
              type="date"
              value={formData.heart_worm}
              onChange={(e) => setFormData({ ...formData, heart_worm: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.heart_worm ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep`}
            />
            {errors.heart_worm && <p className="mt-1 text-sm text-red-600">{errors.heart_worm}</p>}
          </div>

          {/* Heart Worm Cycle */}
          <div>
            <label
              htmlFor="heart_worm_cycle"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              심장사상충 약 주기 (개월)
            </label>
            <select
              id="heart_worm_cycle"
              value={formData.heart_worm_cycle}
              onChange={(e) =>
                setFormData({ ...formData, heart_worm_cycle: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep"
            >
              <option value={1}>1개월</option>
              <option value={3}>3개월</option>
              <option value={6}>6개월</option>
              <option value={12}>12개월</option>
            </select>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="text-sm text-center text-red-600">{errors.general}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-semibold text-white transition-colors rounded-lg bg-wePeep hover:bg-wePeep/90 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>의료 기록 저장하기</span>
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default MedicalLogPage;
