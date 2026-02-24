import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kotbqttfmonlhtshnuxs.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdGJxdHRmbW9ubGh0c2hudXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MDAsImV4cCI6MjA1MDU1MDgwMH0.example_key_replace_with_real_key";

console.log("Supabase URL:", supabaseUrl); // 디버깅용
console.log("Supabase Key exists:", !!supabaseAnonKey); // 디버깅용

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// 수파베이스 클라이언트 옵션 (기본 설정으로 단순화)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 수파베이스 연결 상태 확인 함수
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("Supabase connection check:", { data, error });
    return !error;
  } catch (err) {
    console.error("Supabase connection error:", err);
    return false;
  }
};

// 수파베이스 프로젝트 상태 확인 함수
export const checkSupabaseProjectStatus = async () => {
  try {
    // 간단한 API 호출로 프로젝트 상태 확인
    const { data, error } = await supabase.from("_supabase_migrations").select("*").limit(1);
    console.log("Supabase project status check:", { data, error });

    if (error && error.code === "PGRST301") {
      console.log("Project might be paused or not accessible");
      return false;
    }

    return true;
  } catch (err) {
    console.error("Supabase project status error:", err);
    return false;
  }
};
