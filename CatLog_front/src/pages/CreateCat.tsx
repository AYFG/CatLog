import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCatStore } from "@/store/useCatStore";
import { createCat } from "@/utils/supabaseApi";
import { CatData } from "@/types/cat";

const catTypes = [
  { id: "WhiteCat", name: "흰고양이", emoji: "🐱" },
  { id: "BlackCat", name: "검은고양이", emoji: "🐈‍⬛" },
  { id: "CheeseCat", name: "치즈고양이", emoji: "🧀" },
  { id: "MackerelCat", name: "고등어고양이", emoji: "🐟" },
  { id: "SphynxCat", name: "스핑크스", emoji: "🦁" },
];

const CreateCat = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addCat } = useCatStore();
  const [formData, setFormData] = useState({
    name: "",
    cat_type: "WhiteCat",
    birth_date: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const mutation = useMutation({
    mutationFn: (cat: Omit<CatData, "id" | "created_at" | "updated_at">) => createCat(cat),
    onSuccess: (data) => {
      addCat(data);
      navigate("/mypage");
    },
    onError: (error: any) => {
      setErrors({ general: error.message });
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }
    if (!formData.birth_date) {
      newErrors.birth_date = "생년월일을 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && user?.id) {
      mutation.mutate({
        name: formData.name,
        cat_type: formData.cat_type,
        birth_date: formData.birth_date,
        owner_id: user.id,
      });
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800 ml-4">반려묘 등록</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cat Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep`}
              placeholder="반려묘 이름을 입력해주세요"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Cat Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">고양이 종류</label>
            <div className="grid grid-cols-2 gap-4">
              {catTypes.map((type) => (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, cat_type: type.id })}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    formData.cat_type === type.id
                      ? "border-wePeep bg-wePeep/10"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <div className="text-sm font-medium">{type.name}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
              생년월일
            </label>
            <input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.birth_date ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep`}
            />
            {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="text-red-600 text-sm text-center" role="alert">
              {errors.general}
            </div>
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
                <span>등록 중...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>반려묘 등록하기</span>
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateCat;
