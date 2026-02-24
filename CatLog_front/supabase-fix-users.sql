-- 기존 테이블이 있는 경우를 위한 업데이트 스크립트
-- 이 스크립트는 기존 테이블을 건드리지 않고 필요한 정책과 트리거만 추가합니다

-- 1. users 테이블에 INSERT 정책 추가
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. 트리거 함수 업데이트 (ON CONFLICT 처리 추가)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 트리거 재생성 (기존 트리거가 있으면 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS 활성화 확인
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_logs ENABLE ROW LEVEL SECURITY;
