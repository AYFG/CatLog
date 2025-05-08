<p align="center">
    <img src="https://github.com/user-attachments/assets/c04d24f8-6f21-484a-b866-1fbfac0096d3" align="center" width="30%">
</p>
<p align="center"><h1 align="center">캣로그</h1></p>
<p align="center">
</p>
<p align="center">Built with the tools and technologies:</p>
<p align="center">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=plastic&logo=TypeScript&logoColor=white" alt="TypeScript">
 <img src="https://img.shields.io/badge/Node.js-339933.svg?style=plastic&logo=Node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express-000000.svg?style=plastic&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=plastic&logo=MongoDB&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/React_Native-61DAFB.svg?style=plastic&logo=React&logoColor=black" alt="React Native">
<img src="https://img.shields.io/badge/Expo-000020.svg?style=plastic&logo=Expo&logoColor=white" alt="Expo">
<img src="https://img.shields.io/badge/TanStack_Query-FF4B4B.svg?style=plastic&logo=ReactQuery&logoColor=white" alt="TanStack Query">
<img src="https://img.shields.io/badge/Zustand-007ACC.svg?style=plastic&logo=React&logoColor=white" alt="Zustand">
<img src="https://img.shields.io/badge/NativeWind-38B2AC.svg?style=plastic&logo=React&logoColor=white" alt="NativeWind">




</p>
<br>

## 🔗 Table of Contents

1. [개요](#-개요)
2. [기능](#-기능)
3. [프로젝트 구조](#-프로젝트-구조)
4. [🚀 Getting Started](#-getting-started)
  4.1. [☑️ Prerequisites](#-prerequisites)
  4.2. [⚙️ Installation](#-installation)
  4.3. [🤖 Usage](#🤖-usage)
  4.4. [🧪 Testing](#🧪-testing)
5. [📌 Project Roadmap](#-project-roadmap)
6. [🔰 Contributing](#-contributing)
7. [🎗 License](#-license)
8. [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 개요

<code>❯ REPLACE-ME</code>

---

## 👾 기능

<code>❯ REPLACE-ME</code>

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
## 🚀 Getting Started

### ☑️ 사전 요구사항

Before getting started with CatLog, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm, Gradle
- **Container Runtime:** Podman


### ⚙️ Installation

Install CatLog using one of the following methods:

**Build from source:**

1. Clone the CatLog repository:
```sh
❯ git clone https://github.com/AYFG/CatLog
```

2. Navigate to the project directory:
```sh
❯ cd CatLog
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```


**Using `gradle`** &nbsp; [<img align="center" src="" />]()

```sh
❯ echo 'INSERT-INSTALL-COMMAND-HERE'
```


**Using `podman`** &nbsp; [<img align="center" src="" />]()

```sh
❯ echo 'INSERT-INSTALL-COMMAND-HERE'
```


