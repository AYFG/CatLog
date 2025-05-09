<p align="center">
    <img src="https://github.com/user-attachments/assets/c04d24f8-6f21-484a-b866-1fbfac0096d3" align="center" width="30%">
	<p align="center"><h1 align="center">캣로그 (CatLog)</h1>
		<p align='center'>당신의 소중한 반려묘를 위한 건강 다이어리</p>
	</p>
 
</p>



## 🔗 목차

1. [📱 앱 소개](#-앱-소개)
2. [✨ 기능](#-기능)
3. [📁 프로젝트 구조](#-프로젝트-구조)
4. [🚀 시작하기](#-시작하기)
---

## 📱 앱 소개

캣로그는 반려묘의 건강과 일상을 체계적으로 관리하기 위한 모바일 앱입니다.<br/>
고양이의 건강 기록, 진료 일정, 일상 기록 등을 캘린더 기반 UI로 기록하고 확인할 수 있어, 기억에 의존하던 관리 방식에서 벗어나<br/>
데이터 기반으로 케어가 가능합니다.<br/>
또한, 여러 마리 고양이의 정보를 각각 등록 및 관리할 수 있어 다묘 가정에서도 효율적인 건강 관리가 가능하며, 각 고양이의 개별 상태를 장기적으로 추적하고 비교할 수 있는 맞춤형 반려묘 관리 도구로 활용할 수 있습니다.


---

## 👾 기능

| 캣로그 앱 진입 | 회원가입 | 로그인 |
|----------|----------|----------|
| <img src="https://github.com/user-attachments/assets/8affecb2-c7ca-4acf-aa0c-59dbb815f010" width="200" /> | <img src="https://github.com/user-attachments/assets/fb9c7200-2918-46f4-9759-31197d79293a" width="200" /> | <img src="https://github.com/user-attachments/assets/33c3f8ba-d072-4a0c-835d-444c0b94304c" width="200" /> |


| 반려묘 정보 생성 | 건강검진 기록 생성 | 건강검진 기록 수정 |
|----------|----------|----------|
| <img src="https://github.com/user-attachments/assets/cc29c1cc-797c-4750-9970-3fcceeaff3db" width="200" /> | <img src="https://github.com/user-attachments/assets/def98a64-4f7d-4e82-94b9-7bc7d61dee06" width="200" /> | <img src="https://github.com/user-attachments/assets/3b0c6e7e-030b-4589-a1f8-7a722671148a" width="200" /> |


| 일일 건강 기록 생성 | 일일 건강 기록 수정 | 일일 건강 기록 삭제 |
|----------|----------|----------|
| <img src="https://github.com/user-attachments/assets/86f42fef-3574-4e65-a8a6-e0cd20d768ec" width="200" /> | <img src="https://github.com/user-attachments/assets/2bcb654a-ae18-44d5-8baa-b254dd67d8ff" width="200" /> | <img src="https://github.com/user-attachments/assets/d126fd75-e357-40d5-8b5e-2e37b45070ec" width="200" /> |


| 반려묘 정보 수정 | 반려묘 정보 삭제 | 로그아웃 |
|-----------|-----------|-----------|
| <img src="https://github.com/user-attachments/assets/8ead7b13-e802-4459-90d4-3e437a8c3047" width="200" /> | <img src="https://github.com/user-attachments/assets/54072dc4-6bc3-46e6-a6aa-b9d5930efa8e" width="200" /> | <img src="https://github.com/user-attachments/assets/44acab9e-7ab6-4fa4-8cc0-6636e55e05cb" width="200" /> |


---

## 📁 프로젝트 구조

```sh
└── CatLog/
    ├── CatLog_back
    │   ├── .gitignore
    │   ├── app.ts
    │   ├── bruno
    │   │   └── CatLog
    │   ├── bun.lock
    │   ├── controllers
    │   │   ├── auth.ts
    │   │   ├── cat.ts
    │   │   ├── dailyLog.ts
    │   │   └── medicalLog.ts
    │   ├── dist
    │   │   ├── app.js
    │   │   ├── controllers
    │   │   ├── middleware
    │   │   ├── models
    │   │   ├── routes
    │   │   └── types
    │   ├── middleware
    │   │   ├── authChecker.ts
    │   │   └── error.ts
    │   ├── models
    │   │   ├── cat.ts
    │   │   ├── dailyLog.ts
    │   │   ├── medicalLog.ts
    │   │   └── user.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   │   ├── auth.ts
    │   │   ├── cat.ts
    │   │   ├── dailyLog.ts
    │   │   └── medicalLog.ts
    │   ├── tsconfig.json
    │   └── types
    │       ├── error.ts
    │       └── request.ts
    └── CatLog_front
        ├── .gitignore
        ├── README.md
        ├── android
        │   ├── .gitignore
        │   ├── app
        │   ├── build.gradle
        │   ├── gradle
        │   ├── gradle.properties
        │   ├── gradlew
        │   ├── gradlew.bat
        │   └── settings.gradle
        ├── app
        │   ├── (tabs)
        │   ├── +not-found.tsx
        │   ├── ChangeCat
        │   ├── CreateCat.tsx
        │   ├── DailyLog
        │   ├── DeleteCalendarModal.tsx
        │   ├── DeleteCatModal.tsx
        │   ├── EditCalendarModal.tsx
        │   ├── EditCatModal.tsx
        │   ├── Login.tsx
        │   ├── LogoutModal.tsx
        │   ├── MedicalLog.tsx
        │   ├── ReLogin.tsx
        │   ├── Signup.tsx
        │   └── _layout.tsx
        ├── app.json
        ├── assets
        │   ├── fonts
        │   ├── images
        │   └── whitecat.riv
        ├── babel.config.js
        ├── bun.lock
        ├── components
        │   ├── RouteButton.tsx
        │   ├── SubmitButton.tsx
        │   └── socialButton.tsx
        ├── eas.json
        ├── global.css
        ├── ios
        │   ├── .gitignore
        │   ├── .xcode.env
        │   ├── CatLog
        │   ├── CatLog.xcodeproj
        │   ├── CatLog.xcworkspace
        │   ├── Podfile
        │   ├── Podfile.lock
        │   ├── Podfile.properties.json
        │   └── catlog.riv
        ├── metro.config.js
        ├── nativewind-env.d.ts
        ├── package-lock.json
        ├── package.json
        ├── store
        │   └── useCatStore.ts
        ├── tailwind.config.js
        ├── tsconfig.json
        ├── types
        │   ├── auth.ts
        │   ├── cat.ts
        │   ├── dailyLog.ts
        │   ├── error.ts
        │   ├── import-image.d.ts
        │   ├── medicalLog.ts
        │   └── rive-react-native.d.ts
        └── utils
            ├── calculateAge.ts
            ├── calculateNextDate.ts
            ├── fetchApi.ts
            └── storage.ts
```


---
## 🚀 시작하기

1. Google Play에서 '캣로그' 검색 후 다운로드 <br/>
2. 회원가입 후 로그인 <br/>
3. 반려묘 정보 등록 (이름, 나이) <br/>
4. 캘린더에서 기록을 시작하세요!


