# 開發紀錄

## 2025-08-25: Teacher 資料庫管理功能

### 後端 (`1133-Database-SpringData-JPA`)

- **`TeacherService.java`**
  - 新增 `getTeacherById(int id)` 方法，用於透過 ID 查詢單一老師資料，利用 `findById` 提高效率。

- **`TeacherController.java`**
  - 更新 `getTeacherById` 方法，改為呼叫 `TeacherService.getTeacherById`。
  - 在 Controller 層級加上 `@CrossOrigin(origins = "*")`，解決前後端分離的跨域請求問題。
  - 在 `updateTeacher` 方法中增加回傳值是否為 `null` 的判斷，如果找不到對應的老師，回傳 404 Not Found。

### 前端 (`1133-database-courseweb`)

- **`api/teachers.js`**
  - 修正所有 API 的請求路徑，從 `/api/Teachers` 改為 `/api/teachers`，以符合後端 Controller 的設定。
  - 將方法名稱從 `...Student` 改為 `...Teacher` (例如 `createStudent` -> `createTeacher`)，提高程式碼可讀性。

- **`views/TeacherList.vue`**
  - 將頁面標題、按鈕文字、表格欄位等從「學生」改為「老師」。
  - 更新表格內容，使其正確顯示老師的資料 (`teacherId`, `name`, `email`, `age`)。
  - 修正呼叫的 API 方法名稱，例如 `fetchteachers` -> `fetchTeachers`。

- **`views/TeacherForm.vue`**
  - 將頁面標題、表單欄位等從「學生」改為「老師」。
  - 更新表單，使其對應老師的資料欄位 (`name`, `email`, `age`)。
  - 修正呼叫的 API 方法名稱。

- **`App.vue`**
  - 移除直接載入 `TeacherList` 和 `TeacherForm` 元件的寫法。
  - 改為使用 `<router-view />`，讓路由統一管理頁面的呈現。

- **`main.js`**
  - 啟用 Vue Router (`app.use(router)`)。
  - 重新引入 `main.css`，確保全域樣式生效。
