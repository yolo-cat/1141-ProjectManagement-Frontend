<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">課程目錄</h1>
    <h2>所有可選課程</h2>

    <table class="table nb-brutal">
      <thead>
      <tr>
        <th>課程ID</th>
        <th>課程名稱</th>
        <th>描述</th>
        <th>學分</th>
        <th>授課教師</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="course in courses" :key="course.courseId">
        <td>{{ course.courseId }}</td>
        <td>{{ course.courseName }}</td>
        <td>{{ course.courseDescription }}</td>
        <td>{{ course.credits }}</td>
        <td>{{ course.teacher?.name }}</td>
        <td>
          <div class="action-btns">
            <button
              class="btn nb-brutal"
              @click="enroll(course.courseId)"
              :disabled="enrolledCourseIds.includes(course.courseId)"
            >
              {{ enrolledCourseIds.includes(course.courseId) ? '已選' : '選課' }}
            </button>
            <button
              v-if="enrolledCourseIds.includes(course.courseId)"
              class="btn nb-brutal"
              @click="drop(course.courseId)"
            >退選</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error nb-brutal">{{ error }}</p>
    <p v-if="successMessage" class="success nb-brutal">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCourses } from '@/api/courses';
import { createEnrollment, fetchStudentEnrollments, deleteEnrollment } from '@/api/enrollments';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const studentId = authStore.userId.value;
const courses = ref([]);
const error = ref('');
const successMessage = ref('');
const theme = themeStore.theme;
const enrolledCourseIds = ref([]);

function toggleTheme() {
  themeStore.toggleTheme();
}

async function loadCourses() {
  error.value = '';
  try {
    const { data } = await fetchCourses();
    courses.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function loadEnrollments() {
  try {
    const { data } = await fetchStudentEnrollments(studentId);
    enrolledCourseIds.value = data.map(e => e.course.courseId);
  } catch (e) {
    // 不影響主流程
  }
}

async function enroll(courseId) {
  error.value = '';
  successMessage.value = '';
  if (enrolledCourseIds.value.includes(courseId)) {
    error.value = '已選過此課程';
    return;
  }
  const enrollmentData = {
    id: { studentId, courseId }, // 加入 id 欄位
    student: { studentId },
    course: { courseId },
    enrollmentDate: new Date().toISOString().slice(0, 10)
  };
  try {
    await createEnrollment(enrollmentData);
    successMessage.value = '選課成功';
    await loadEnrollments();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function drop(courseId) {
  error.value = '';
  successMessage.value = '';
  try {
    await deleteEnrollment({ studentId, courseId });
    successMessage.value = '退選成功';
    await loadEnrollments();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(async () => {
  await loadCourses();
  await loadEnrollments();
});
</script>

<style scoped>
.container {
  background: inherit;
  color: inherit;
  padding: 32px 0;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #000;
  min-height: 80vh;
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.theme-btn-box {
  position: absolute;
  top: 16px;
  right: 16px;
  left: auto;
  z-index: 10;
  width: auto;
  max-width: none;
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 900px) {
  .theme-btn-box {
    position: static;
    width: 100%;
    justify-content: center;
    margin-bottom: 12px;
    top: auto;
    right: auto;
  }
  .container {
    padding-top: 56px;
  }
}
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: inherit;
}
.table {
  width: 95%; /* 向內縮5% */
  border-collapse: collapse;
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: var(--nb-border-thick) solid var(--nb-border);
  box-shadow: var(--nb-shadow);
  border-radius: 16px;
}
.table th, .table td {
  border: 1.5px solid var(--nb-border);
  padding: 12px 24px; /* 增加左右 padding */
  font-size: 1.08rem;
  background: inherit;
  color: inherit;
  font-weight: 500;
}
.table td:last-child {
  min-width: 180px;
  /* 移除 display: flex; align-items: center; */
}
.action-btns {
  display: flex;
  align-items: center;
}
.table th {
  background: var(--color-background-mute);
  color: var(--color-heading);
}
.table tr {
  transition: background 0.2s;
}
.table tr:hover {
  background: #ffe066;
  color: #181818;
}
.btn.nb-brutal {
  background: inherit;
  color: inherit;
  border: var(--nb-border-thick) solid var(--nb-border);
  padding: 8px 16px;
  font-weight: bold;
  box-shadow: var(--nb-shadow);
  cursor: pointer;
  border-radius: 8px;
  margin-right: 8px;
  margin-bottom: 8px; /* 疊放時增加下方距離 */
  transition: background 0.2s, color 0.2s;
}
.btn.nb-brutal + .btn.nb-brutal {
  margin-left: 12px; /* 按鈕間距更大，橫向排列時也適用 */
}
.btn.nb-brutal:hover {
  background: #ffe066;
  color: #181818;
}
.error.nb-brutal {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  border: var(--nb-border-thick) solid var(--nb-border);
  box-shadow: var(--nb-shadow);
  text-align: center;
  border-radius: 8px;
  margin-top: 16px;
}
.success.nb-brutal {
  color: #181818;
  background: #ffe066;
  padding: 8px 16px;
  border: var(--nb-border-thick) solid var(--nb-border);
  box-shadow: var(--nb-shadow);
  text-align: center;
  border-radius: 8px;
  margin-top: 16px;
}
</style>
