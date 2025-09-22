<template>
  <div class="container">
    <h1 class="title">老師列表</h1>

    <div class="toolbar">
      <router-link class="btn" to="/teachers/new">+ 新增老師</router-link>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>姓名</th>
        <th>電子郵件</th>
        <th>年齡</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="teacher in teachers" :key="teacher.teacherId">
        <td>{{ teacher.teacherId }}</td>
        <td>{{ teacher.name }}</td>
        <td>{{ teacher.email }}</td>
        <td>{{ teacher.age }}</td>
        <td>
          <router-link :to="`/teachers/${teacher.teacherId}/edit`" class="btn">編輯</router-link>
          <button class="btn danger" @click="remove(teacher.teacherId)">刪除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchTeachers, deleteTeacher } from '@/api/teachers';

const teachers = ref([]);
const error = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchTeachers();
    teachers.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function remove(id) {
  if (!confirm('確定要刪除這位老師嗎?')) return;
  try {
    await deleteTeacher(id);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(load);
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
}

.title {
  margin-bottom: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.spacer {
  flex: 1;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.btn {
  padding: 6px 10px;
  margin-right: 6px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.btn.danger {
  border-color: #c33;
}

.pager {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.error {
  color: #c33;
}
</style>