<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="$emit('toggleTheme')" class="theme-btn nb-brutal">
        {{ $attrs.theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">課程列表</h1>

    <div class="toolbar">
      <router-link class="btn nb-brutal" to="/courses/new">+ 新增課程</router-link>
    </div>

    <table class="table nb-brutal">
      <thead>
      <tr>
        <th>ID</th>
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
          <router-link :to="`/courses/${course.courseId}/edit`" class="btn nb-brutal">編輯</router-link>
          <button class="btn danger nb-brutal" @click="remove(course.courseId)">刪除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error nb-brutal">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCourses, deleteCourse } from '@/api/courses';

const courses = ref([]);
const error = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchCourses();
    courses.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function remove(id) {
  if (!confirm('確定要刪除這門課程嗎?')) return;
  try {
    await deleteCourse(id);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(load);
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
.toolbar {
  margin-bottom: 24px;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background: inherit;
  color: inherit;
}
.table th, .table td {
  border: 3px solid #000;
  padding: 12px;
  text-align: left;
}
.table th {
  background: inherit;
  color: inherit;
}
.table tr:nth-child(even) {
  background: inherit;
}
.btn {
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  padding: 8px 16px;
  font-weight: bold;
  box-shadow: 4px 4px 0 #000;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  margin-right: 8px;
}
.btn:hover {
  background: #fff;
  color: #181818;
}
.danger {
  background: #c00;
  color: #fff;
}
.error {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  margin-top: 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
}
</style>
