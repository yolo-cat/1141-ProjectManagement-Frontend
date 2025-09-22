<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">教師儀表板</h1>
    <h2>我的課程</h2>
    <table class="table nb-brutal">
      <thead>
      <tr>
        <th>課程ID</th>
        <th>課程名稱</th>
        <th>描述</th>
        <th>學分</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="course in courses" :key="course.courseId">
        <td>{{ course.courseId }}</td>
        <td>{{ course.courseName }}</td>
        <td>{{ course.courseDescription }}</td>
        <td>{{ course.credits }}</td>
        <td>
          <router-link :to="`/teacher/course/${course.courseId}/manage`" class="btn nb-brutal">管理學生與成績</router-link>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-if="error" class="error nb-brutal">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCoursesByTeacher } from '@/api/teachers';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const teacherId = authStore.userId.value;
const courses = ref([]);
const error = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

async function load() {
  error.value = '';
  try {
    const { data } = await fetchCoursesByTeacher(teacherId);
    courses.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(load);
</script>

<style scoped>
.container {
  background: inherit;
  color: var(--color-text);
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
@media (max-width: 900px) {
  .container {
    padding-top: 56px;
  }
}
.title, h2, th, td {
  color: var(--color-text);
}
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
}
.table {
  width: 95%;
  border-collapse: collapse;
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  background: inherit;
  color: inherit;
}
.table th, .table td {
  border: 3px solid #000;
  padding: 12px;
  text-align: left;
  color: var(--color-text);
}
.table th {
  background: inherit;
}
.table tr:nth-child(even) {
  background: inherit;
}
.btn, .logout-btn {
  background: var(--color-nav-bg);
  color: var(--color-text);
  border: 3px solid #000;
  padding: 8px 16px;
  font-weight: bold;
  box-shadow: 4px 4px 0 #000;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.btn:hover, .logout-btn:hover {
  background: var(--color-text);
  color: var(--color-nav-bg);
}
.error {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  margin-top: 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
}
.theme-btn-box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.theme-btn {
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;
}
.theme-btn:hover {
  background: #fff;
  color: #181818;
}
</style>
