# 課程管理系統開發提案

## 1. 專案目標

基於現有的 Spring Boot 後端、Vue.js 前端以及指定的資料庫結構，擴充開發一個功能完整的課程管理系統。此系統將為不同角色（教務管理員、教師、學生）提供專屬的操作介面與權限，實現全面的教務管理功能。

## 2. 技術棧

- **後端**: Java 17, Spring Boot, Spring Data JPA, MariaDB
- **前端**: Vue.js 3, Vite, Vue Router, Axios

## 3. 資料庫模型分析

根據提供的資料庫結構圖，系統將圍繞以下四個核心實體進行開發：

1.  **`Student` (學生)**: 存儲學生基本資料。
2.  **`Teacher` (教師)**: 存儲教師基本資料 (已部分實現)。
3.  **`Course` (課程)**: 存儲課程資訊，並透過 `teacher_id` 與教師關聯。
4.  **`Enrollment` (選課紀錄)**: 作為 `Student` 和 `Course` 之間的多對多關聯表，記錄學生的選課情況、註冊日期及成績。

## 4. 開發規劃

### 第一階段：後端 API 開發 (Spring Boot)

#### 4.1 資料模型 (Models)

- **`Student.java`**: 取消註解並完善現有 `Student` 模型，確保欄位與資料庫一致。
- **`Course.java`**: 建立新的 `Course` JPA 實體，包含 `course_id`, `course_name`, `course_description`, `credits` 以及與 `Teacher` 的 `ManyToOne` 關聯。
- **`Enrollment.java`**: 建立新的 `Enrollment` JPA 實體，包含 `enrollment_date`, `grade` 以及與 `Student` 和 `Course` 的複合主鍵與 `ManyToOne` 關聯。

#### 4.2 資料存取層 (Repositories)

- 為 `Student`, `Course`, `Enrollment` 建立對應的 Spring Data JPA Repository 介面。

#### 4.3 服務層 (Services)

- **`StudentService.java`**: 啟用並完善對學生的 CRUD (建立、讀取、更新、刪除) 業務邏輯。
- **`CourseService.java`**: 建立新的服務，處理課程的 CRUD 操作，以及查詢特定教師開設的課程等邏輯。
- **`EnrollmentService.java`**: 建立新的服務，處理學生選課、退選、教師登錄成績等核心業務邏輯。

#### 4.4 控制器 (Controllers)

- 建立對應的 `StudentController`, `CourseController`, `EnrollmentController`，並設計 RESTful API 端點供前端呼叫。
- 例如：
  - `GET /api/students`：獲取所有學生
  - `POST /api/courses`：新增課程
  - `GET /api/teachers/{id}/courses`：獲取某位老師的所有課程
  - `POST /api/enrollments`：學生選課
  - `PUT /api/enrollments/{id}`：更新成績

#### 4.5 安全性 (Security) - (建議)

- 引入 Spring Security，實作基於 JWT (JSON Web Token) 的使用者認證機制。
- 根據不同 API 端點設定角色權限，例如只有管理員能新增課程、只有對應的教師能登錄成績。

### 第二階段：前端介面開發 (Vue.js)

#### 4.6 通用功能

- **登入頁面**: 建立使用者登入介面。
- **導覽列**: 設計一個動態導覽列，根據登入使用者的角色（管理員、教師、學生）顯示不同的功能選單。
- **API Services**: 在 `src/api/` 目錄下，建立 `students.js`, `courses.js`, `enrollments.js` 來管理對後端 API 的請求。
- **路由管理**: 在 `src/router/index.js` 中，為所有新頁面設定路由，並加入路由守衛 (Navigation Guards) 以保護需要特定權限才能存取的頁面。

#### 4.7 教務管理員視圖

- **學生管理**: 建立學生列表及表單頁面，提供完整的 CRUD 功能。
- **教師管理**: (已完成) 可基於現有功能進行優化。
- **課程管理**: 建立課程列表及表單頁面，提供課程的 CRUD 功能，包含指派授課教師。
- **選課總覽**: 建立一個頁面，讓管理員可以查看所有學生的選課紀錄與成績。

#### 4.8 教師視圖

- **我的課程**: 顯示該教師所有授課中的課程列表。
- **學生名單與成績管理**: 點擊特定課程後，可以查看該課程的修課學生名單，並能夠為每位學生登錄或修改成績。

#### 4.9 學生視圖

- **我的課表**: 顯示該學生已選修的課程列表及成績。
- **課程目錄**: 瀏覽所有可選修的課程，包含課程名稱、描述、學分、授課教師等資訊。
- **個人資料**: 允許學生查看並修改自己的基本資料。

## 5. 開發步驟一覽

1.  完成後端所有 Models, Repositories, Services, and Controllers 的開發與單元測試。
2.  完成前端通用功能開發（登入、導覽列、路由、API Services）。
3.  完成教務管理員所有視圖與功能的開發。
4.  完成教師視圖與功能的開發。
5.  完成學生視圖與功能的開發。
6.  系統整合測試、錯誤修復與部署。

## 6. 結論

本提案旨在將現有專案擴充為一個功能完整、角色分明的課程管理系統。透過前後端分離的架構，我們可以分階段、有系統地完成開發，最終交付一個穩定且易於維護的應用程式。
