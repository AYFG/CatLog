<p align="center">
    <img src="https://github.com/user-attachments/assets/c04d24f8-6f21-484a-b866-1fbfac0096d3" align="center" width="30%">
	<p align="center"><h1 align="center">캣로그 (CatLog)</h1>
		<p align='center'>당신의 소중한 반려묘를 위한 건강 다이어리</p>
	</p>
 
</p>



## 🔗 목차

1. [📱 앱 소개](#-앱-소개)
2. [✨ 기능](#-기능)
3. [📁 폴더 구조](#-폴더-구조)
4. [🔎 프로젝트 다이어그램](#-프로젝트-다이어그램)
5. [🚀 시작하기](#-시작하기)
---

## 📱 앱 소개

캣로그는 반려묘의 건강과 일상을 체계적으로 관리하기 위한 모바일 앱입니다.<br/>
고양이의 건강 기록, 진료 일정, 일상 기록 등을 캘린더 기반 UI로 기록하고 확인할 수 있어, 기억에 의존하던 관리 방식에서 벗어나
데이터 기반으로 케어가 가능합니다.<br/>
또한, 여러 마리 고양이의 정보를 각각 등록 및 관리할 수 있어 다묘 가정에서도 효율적인 건강 관리가 가능하며, 각 고양이의 개별 상태를 장기적으로 추적하고 비교할 수 있는 맞춤형 반려묘 관리 도구로 활용할 수 있습니다.




![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)
![Rive](https://img.shields.io/badge/Rive-000000?style=for-the-badge&logo=rive&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

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
## 🔎 프로젝트 다이어그램

![diagram](https://github.com/user-attachments/assets/f72a997c-fcdc-4697-977b-fdf892396691)

---
## 🚀 시작하기

[![앱 구글스토어 링크 이미지](https://github.com/user-attachments/assets/2d4759d8-28e9-4bb8-9255-e76a27630d77)](https://play.google.com/store/apps/details?id=com.anonymous.CatLog)
Google Play에서 앱을 다운로드해 사용해 보세요.





