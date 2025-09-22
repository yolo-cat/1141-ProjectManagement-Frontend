<template>
  <div class="container">
    <h1 class="title">學生列表</h1>

    <div class="toolbar">
      <router-link class="btn" to="/students/new">+ 新增學生</router-link>
    </div>

    <div class="search-bar">
      <input v-model="lastName" placeholder="姓" class="search-input" />
      <input v-model="firstName" placeholder="名" class="search-input" />
      <button class="btn" @click="search">搜尋</button>
      <button class="btn" @click="reset">重置</button>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>學號</th>
        <th>姓名</th>
        <th>電子郵件</th>
        <th>生日</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="student in students" :key="student.studentId">
        <td>{{ student.studentId }}</td>
        <td class="user-name">{{ getLastFirst(student.displayName) }}</td>
        <td>{{ student.email }}</td>
        <td>{{ student.dateOfBirth }}</td>
        <td>
          <router-link :to="`/students/${student.studentId}/edit`" class="btn">編輯</router-link>
          <button class="btn danger" @click="remove(student.studentId)">刪除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchStudents, deleteStudent, searchStudentsByFirstName, searchStudentsByLastName, searchStudentsByFullName } from '@/api/students';

const students = ref([]);
const error = ref('');
const lastName = ref('');
const firstName = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchStudents();
    students.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function search() {
  error.value = '';
  try {
    if (lastName.value && firstName.value) {
      const { data } = await searchStudentsByFullName(lastName.value, firstName.value);
      students.value = data;
    } else if (lastName.value) {
      const { data } = await searchStudentsByLastName(lastName.value);
      students.value = data;
    } else if (firstName.value) {
      const { data } = await searchStudentsByFirstName(firstName.value);
      students.value = data;
    } else {
      await load();
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

function reset() {
  lastName.value = '';
  firstName.value = '';
  load();
}

async function remove(id) {
  if (!confirm('Delete this student?')) return;
  try {
    await deleteStudent(id);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

function getLastFirst(displayName) {
  if (!displayName) return '';
  const parts = displayName.trim().split(' ');
  if (parts.length === 2) {
    // 假設 displayName 格式為「名 姓」或「姓 名」，都轉為「姓 名」
    // 若 displayName 為「宇航 張」，則 parts[0]=宇航, parts[1]=張
    // 這裡假設 parts[1] 為姓
    return `${parts[1]} ${parts[0]}`;
  }
  return displayName;
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

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.search-input {
  padding: 6px;
  margin-right: 6px;
  border: 1px solid #999;
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
