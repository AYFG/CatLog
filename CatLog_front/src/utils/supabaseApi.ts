import { supabase } from "@/lib/supabase";
import { CatData } from "@/types/cat";
import { DailyLogData } from "@/types/dailyLog";
import { MedicalLogData } from "@/types/medicalLog";

// 이메일 유효성 검증 함수 (더 엄격한 검증)
const isValidEmail = (email: string): boolean => {
  // 더 엄격한 이메일 검증
  const emailRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

  // 추가 검증: 이메일 길이와 특수 문자 확인
  if (email.length > 254) return false;
  if (email.includes("..")) return false; // 연속된 점 금지
  if (email.startsWith(".") || email.endsWith(".")) return false;

  return emailRegex.test(email);
};

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  console.log("Attempting sign up with:", email); // 디버깅용

  // 이메일 유효성 검증
  if (!isValidEmail(email)) {
    throw new Error("올바른 이메일 형식이 아닙니다.");
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(), // 소문자로 변환 및 공백 제거
      password: password.trim(),
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    console.log("Sign up result:", { data, error }); // 디버깅용

    if (error) {
      console.error("Supabase signup error:", error);

      // 더 구체적인 에러 메시지 제공
      let errorMessage = "회원가입에 실패했습니다.";
      if (error.message.includes("User already registered")) {
        errorMessage = "이미 등록된 이메일입니다.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "올바른 이메일 형식이 아닙니다.";
      } else if (error.message.includes("email_address_invalid")) {
        errorMessage = "이메일 주소가 유효하지 않습니다. 다른 이메일을 시도해보세요.";
      } else if (error.message.includes("Email address")) {
        errorMessage = "이메일 주소 검증에 실패했습니다. 수파베이스 프로젝트 설정을 확인해주세요.";
      } else if (error.message.includes("Invalid API key")) {
        errorMessage = "API 키가 유효하지 않습니다. 환경 변수를 확인해주세요.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
      }

      throw new Error(errorMessage);
    }

    // 사용자가 성공적으로 생성된 경우, public.users 테이블에 데이터 삽입
    if (data.user) {
      console.log("Creating user profile in public.users table...");

      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name.trim(),
        },
      ]);

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // 프로필 생성 실패는 치명적이지 않으므로 계속 진행
      } else {
        console.log("User profile created successfully");
      }
    }

    return { data, error };
  } catch (err) {
    console.error("Sign up catch error:", err);
    throw err;
  }
};

export const signIn = async (email: string, password: string) => {
  console.log("Attempting sign in with:", email); // 디버깅용

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), // 소문자로 변환 및 공백 제거
      password: password.trim(),
    });

    console.log("Sign in result:", { data, error }); // 디버깅용

    if (error) {
      console.error("Supabase auth error:", error);

      // 더 구체적인 에러 메시지 제공
      let errorMessage = "로그인에 실패했습니다.";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "이메일 인증이 완료되지 않았습니다.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      }

      throw new Error(errorMessage);
    }

    return { data, error };
  } catch (err) {
    console.error("Sign in catch error:", err);
    throw err;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Cat functions
export const getCats = async (userId: string): Promise<CatData[]> => {
  console.log("getCats: Fetching cats for userId:", userId);

  const { data, error } = await supabase
    .from("cats")
    .select(
      `
      *,
      medical_logs (*)
    `,
    )
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  console.log("getCats: Supabase response:", { data, error });

  if (error) {
    console.error("getCats: Error fetching cats:", error);
    throw error;
  }

  // medical_logs를 단일 객체로 변환 (각 고양이당 하나의 medical_log만 있다고 가정)
  const catsWithMedicalLogs =
    data?.map((cat) => ({
      ...cat,
      medical_logs: cat.medical_logs?.[0] || null,
    })) || [];

  console.log("getCats: Returning cats with medical logs:", catsWithMedicalLogs);
  return catsWithMedicalLogs;
};

export const createCat = async (cat: Omit<CatData, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("cats").insert([cat]).select().single();

  if (error) throw error;
  return data;
};

export const updateCat = async (id: string, updates: Partial<CatData>) => {
  const { data, error } = await supabase
    .from("cats")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCat = async (id: string) => {
  const { error } = await supabase.from("cats").delete().eq("id", id);

  if (error) throw error;
};

// Daily Log functions
export const getDailyLogs = async (logDate: string, userId: string): Promise<DailyLogData[]> => {
  const { data, error } = await supabase
    .from("daily_logs")
    .select(
      `
      *,
      cats!inner(name)
    `,
    )
    .eq("log_date", logDate)
    .eq("cats.owner_id", userId);

  if (error) throw error;
  return (
    data?.map((log) => ({
      ...log,
      cat_name: log.cats.name,
    })) || []
  );
};

// 범위로 일일 로그 가져오기 (캘린더용)
export const getDailyLogsByRange = async (
  startDate: string,
  endDate: string,
  userId: string,
): Promise<DailyLogData[]> => {
  const { data, error } = await supabase
    .from("daily_logs")
    .select(
      `
      *,
      cats!inner(name)
    `,
    )
    .gte("log_date", startDate)
    .lte("log_date", endDate)
    .eq("cats.owner_id", userId);

  if (error) throw error;
  return (
    data?.map((log) => ({
      ...log,
      cat_name: log.cats.name,
    })) || []
  );
};

export const createDailyLog = async (
  log: Omit<DailyLogData, "id" | "created_at" | "updated_at" | "cat_name">,
) => {
  const { data, error } = await supabase.from("daily_logs").insert([log]).select().single();

  if (error) throw error;
  return data;
};

export const updateDailyLog = async (id: string, updates: Partial<DailyLogData>) => {
  const { data, error } = await supabase
    .from("daily_logs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteDailyLog = async (id: string) => {
  const { error } = await supabase.from("daily_logs").delete().eq("id", id);

  if (error) throw error;
};

// Medical Log functions
export const getMedicalLogs = async (catId: string): Promise<MedicalLogData | null> => {
  const { data, error } = await supabase
    .from("medical_logs")
    .select("*")
    .eq("cat_id", catId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
  return data;
};

export const createMedicalLog = async (
  log: Omit<MedicalLogData, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase.from("medical_logs").insert([log]).select().single();

  if (error) throw error;
  return data;
};

export const updateMedicalLog = async (id: string, updates: Partial<MedicalLogData>) => {
  const { data, error } = await supabase
    .from("medical_logs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 사용자 계정 삭제 (모든 관련 데이터 삭제)
export const deleteUserAccount = async (userId: string) => {
  try {
    console.log("Starting account deletion for user:", userId);

    // 1. 사용자의 모든 반려묘 ID 가져오기
    const { data: cats, error: catsFetchError } = await supabase
      .from("cats")
      .select("id")
      .eq("owner_id", userId);

    if (catsFetchError) {
      console.error("Error fetching cats:", catsFetchError);
      throw catsFetchError;
    }

    const catIds = cats?.map((cat) => cat.id) || [];
    console.log("Found cats to delete:", catIds);

    // 2. 사용자의 모든 일일 로그 삭제
    if (catIds.length > 0) {
      const { error: dailyLogsError } = await supabase
        .from("daily_logs")
        .delete()
        .in("cat_id", catIds);

      if (dailyLogsError) {
        console.error("Error deleting daily logs:", dailyLogsError);
        throw dailyLogsError;
      }
      console.log("Daily logs deleted successfully");

      // 3. 사용자의 모든 의료 기록 삭제
      const { error: medicalLogsError } = await supabase
        .from("medical_logs")
        .delete()
        .in("cat_id", catIds);

      if (medicalLogsError) {
        console.error("Error deleting medical logs:", medicalLogsError);
        throw medicalLogsError;
      }
      console.log("Medical logs deleted successfully");
    }

    // 4. 사용자의 모든 반려묘 삭제
    const { error: catsError } = await supabase.from("cats").delete().eq("owner_id", userId);

    if (catsError) {
      console.error("Error deleting cats:", catsError);
      throw catsError;
    }
    console.log("Cats deleted successfully");

    // 5. 사용자 계정 비활성화 (선택사항)
    // 실제로는 사용자 데이터만 삭제하고 auth 계정은 비활성화하는 것이 안전
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          account_status: "deleted",
          deleted_at: new Date().toISOString(),
        },
      });

      if (updateError) {
        console.warn("Could not update user metadata:", updateError);
      }
    } catch (error) {
      console.warn("User metadata update failed:", error);
    }

    // 6. 로그아웃 처리
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Error signing out:", signOutError);
      // 로그아웃 에러는 치명적이지 않으므로 계속 진행
    }

    console.log("Account deletion completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
};
