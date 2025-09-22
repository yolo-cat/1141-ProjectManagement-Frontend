<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">學生儀表板</h1>
    <h2>我選修的課程</h2>
    <table class="table nb-brutal">
      <thead>
      <tr>
        <th>課程ID</th>
        <th>課程名稱</th>
        <th>授課教師</th>
        <th>學分</th>
        <th>成績</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="enrollment.id.courseId">
        <td>{{ enrollment.course?.courseId }}</td>
        <td>{{ enrollment.course?.courseName }}</td>
        <td>{{ enrollment.course?.teacher?.name }}</td>
        <td>{{ enrollment.course?.credits }}</td>
        <td>{{ enrollment.grade }}</td>
      </tr>
      </tbody>
    </table>
    <p v-if="error" class="error nb-brutal">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchEnrollmentsByStudent } from '@/api/students';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const studentId = authStore.userId.value;
const enrollments = ref([]);
const error = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

async function load() {
  error.value = '';
  try {
    const { data } = await fetchEnrollmentsByStudent(studentId);
    enrollments.value = data;
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
.table {
  width: 95%;
  border-collapse: collapse;
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
}
.table th, .table td {
  border: 3px solid #000;
  padding: 12px;
  text-align: left;
  color: var(--color-text);
}
.table th {
  background: inherit;
  color: inherit;
}
.table tr:nth-child(even) {
  background: inherit;
}
.table tr:hover {
  background: var(--color-table-hover-bg, #ffe066);
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
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
.theme-btn {
  background: #000;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}
.theme-btn:hover {
  background: #333;
}
</style>
