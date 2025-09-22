<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">選課紀錄列表</h1>

    <table class="table">
      <thead>
      <tr>
        <th>學生</th>
        <th>課程</th>
        <th>選課日期</th>
        <th>成績</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="`${enrollment.id.studentId}-${enrollment.id.courseId}`">
        <td>{{ enrollment.student?.firstName }} {{ enrollment.student?.lastName }}</td>
        <td>{{ enrollment.course?.courseName }}</td>
        <td>{{ enrollment.enrollmentDate }}</td>
        <td>
          <template v-if="canEdit()">
            <template v-if="editing[`${enrollment.id.studentId}-${enrollment.id.courseId}`]">
              <input v-model="editing[`${enrollment.id.studentId}-${enrollment.id.courseId}`].grade" class="nb-brutal" style="width: 60px; text-align: center; font-weight: bold;" />
              <button @click="saveEdit(enrollment)" :disabled="saving[`${enrollment.id.studentId}-${enrollment.id.courseId}`]" class="theme-btn nb-brutal" style="margin-left: 4px;">儲存</button>
              <button @click="cancelEdit(enrollment)" class="theme-btn nb-brutal" style="margin-left: 4px;">取消</button>
            </template>
            <template v-else>
              <span>{{ enrollment.grade }}</span>
              <button @click="startEdit(enrollment)" class="theme-btn nb-brutal" style="margin-left: 4px;">編輯</button>
            </template>
          </template>
          <template v-else>
            {{ enrollment.grade }}
          </template>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchEnrollments, updateEnrollment } from '@/api/enrollments';
import { themeStore } from '@/stores/theme';
import { authStore } from '@/stores/auth';

const enrollments = ref([]);
const error = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

const editing = ref({}); // { 'studentId-courseId': { grade, enrollmentDate } }
const saving = ref({}); // { 'studentId-courseId': true/false }

const canEdit = () => {
  return authStore.userRole.value === 'ADMIN' || authStore.userRole.value === 'TEACHER';
};

function startEdit(enrollment) {
  const key = `${enrollment.id.studentId}-${enrollment.id.courseId}`;
  editing.value[key] = {
    grade: enrollment.grade,
    enrollmentDate: enrollment.enrollmentDate
  };
}
function cancelEdit(enrollment) {
  const key = `${enrollment.id.studentId}-${enrollment.id.courseId}`;
  editing.value[key] = undefined;
}
async function saveEdit(enrollment) {
  const key = `${enrollment.id.studentId}-${enrollment.id.courseId}`;
  saving.value[key] = true;
  error.value = '';
  try {
    await updateEnrollment({
      id: { studentId: enrollment.id.studentId, courseId: enrollment.id.courseId },
      grade: editing.value[key].grade,
      enrollmentDate: editing.value[key].enrollmentDate
    });
    await load();
    editing.value[key] = undefined;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  } finally {
    saving.value[key] = false;
  }
}

async function load() {
  error.value = '';
  try {
    const { data } = await fetchEnrollments();
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
  margin-bottom: 12px;
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
.table th,
.table td {
  border: 1.5px solid var(--nb-border);
  padding: 12px 16px;
  font-size: 1.08rem;
  background: inherit;
  color: inherit;
  font-weight: 500;
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
.error {
  color: #c33;
}
</style>
