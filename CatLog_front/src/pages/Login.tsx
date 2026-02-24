import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/utils/supabaseApi";
import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: (data) => {
      console.log("Login response:", data); // 디버깅용
      if (data.data && data.data.user) {
        setUser(data.data.user as any);
        navigate("/");
      } else {
        setErrors({ general: "로그인에 실패했습니다. 다시 시도해주세요." });
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error); // 디버깅용
      setErrors({ general: error.message || "로그인 중 오류가 발생했습니다." });
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    }
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate({ email, password });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-snow sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-wePeep">
            <span className="text-2xl">🐱</span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-center text-gray-900">로그인</h1>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep focus:z-10 sm:text-sm`}
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep focus:z-10 sm:text-sm`}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {errors.general && (
            <div className="text-sm text-center text-red-600" role="alert">
              {errors.general}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-wePeep hover:bg-wePeep/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wePeep disabled:opacity-50"
              aria-describedby={errors.general ? "general-error" : undefined}
            >
              {mutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </div>

          <div className="text-center">
            <Link to="/signup" className="font-medium text-wePeep hover:text-wePeep/80">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
