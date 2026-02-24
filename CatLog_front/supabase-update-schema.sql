-- 기존 테이블 확인 및 필요한 정책만 추가
-- 이미 테이블이 존재하는 경우를 위한 스크립트

-- 1. users 테이블에 INSERT 정책 추가 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile" ON public.users
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- 2. 기존 정책들이 있는지 확인하고 없으면 생성
DO $$
BEGIN
    -- SELECT 정책 확인
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON public.users
        FOR SELECT USING (auth.uid() = id);
    END IF;

    -- UPDATE 정책 확인
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.users
        FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- 3. 트리거가 있는지 확인하고 없으면 생성
DO $$
BEGIN
    -- 트리거 함수 확인
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'handle_new_user'
    ) THEN
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.users (id, email, name)
          VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
          ON CONFLICT (id) DO NOTHING;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;

    -- 트리거 확인
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- 4. RLS가 활성화되어 있는지 확인
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_logs ENABLE ROW LEVEL SECURITY;
