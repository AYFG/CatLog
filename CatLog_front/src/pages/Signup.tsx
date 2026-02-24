import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/utils/supabaseApi";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      signUp(email, password, name),
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      // 이메일 확인이 필요한 경우 안내 메시지 표시
      if (data.data?.user && !data.data.user.email_confirmed_at) {
        alert(
          "회원가입이 완료되었습니다!\n\n이메일 확인 링크를 발송했습니다. 이메일을 확인해주세요.",
        );
      } else {
        alert("회원가입이 완료되었습니다!");
      }
      navigate("/login");
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      setErrors({ general: error.message || "회원가입 중 오류가 발생했습니다." });
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) {
      newErrors.name = "이름을 입력해주세요";
    }
    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else {
      // 이메일 형식 검증
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "올바른 이메일 형식이 아닙니다";
      }
    }
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
    if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate({ email, password, name });
    }
  };

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-wePeep">
            <span className="text-2xl">🐱</span>
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h1>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep focus:z-10 sm:text-sm`}
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
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
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep focus:z-10 sm:text-sm`}
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wePeep focus:border-wePeep focus:z-10 sm:text-sm`}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {errors.general && (
            <div
              className="text-red-600 text-sm text-center p-3 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              <strong>회원가입 실패:</strong> {errors.general}
              <div className="mt-2 text-xs text-red-500">
                문제가 지속되면 브라우저 개발자 도구(F12)의 Console 탭을 확인해주세요.
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wePeep hover:bg-wePeep/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wePeep disabled:opacity-50"
            >
              {mutation.isPending ? "가입 중..." : "회원가입"}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="font-medium text-wePeep hover:text-wePeep/80">
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
