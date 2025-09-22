<template>
  <div class="container nb-brutal">
    <h1 class="title">管理課程</h1>
    <h2 v-if="course">{{ course.courseName }}</h2>
    <h3>學生列表與成績</h3>
    <table class="table nb-brutal">
      <thead>
      <tr>
        <th>學生ID</th>
        <th>學生姓名</th>
        <th>選課日期</th>
        <th>成績</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="enrollment.id.studentId">
        <td>{{ enrollment.student?.studentId }}</td>
        <td>{{ enrollment.student?.lastName }}{{ enrollment.student?.firstName }}</td>
        <td>{{ enrollment.enrollmentDate }}</td>
        <td>
          <input v-model="enrollment.grade" class="grade-input nb-brutal" />
        </td>
        <td>
          <button class="btn nb-brutal" @click="updateGrade(enrollment)">更新成績</button>
        </td>
      </tr>
      </tbody>
    </table>
    <router-link class="btn nb-brutal" to="/teacher/dashboard">返回儀表板</router-link>
    <p v-if="error" class="error nb-brutal">{{ error }}</p>
    <p v-if="successMessage" class="success nb-brutal">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCourse } from '@/api/courses';
import { fetchEnrollmentsByCourse } from '@/api/courses';
import { updateEnrollment } from '@/api/enrollments';

const route = useRoute();
const courseId = route.params.id;

const course = ref(null);
const enrollments = ref([]);
const error = ref('');
const successMessage = ref('');

async function load() {
  error.value = '';
  try {
    const { data: courseData } = await getCourse(courseId);
    course.value = courseData;

    const { data: enrollmentData } = await fetchEnrollmentsByCourse(courseId);
    enrollments.value = enrollmentData;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function updateGrade(enrollment) {
  error.value = '';
  successMessage.value = '';
  try {
    const data = {
      id: {
        studentId: enrollment.id.studentId,
        courseId: enrollment.id.courseId
      },
      grade: enrollment.grade,
      enrollmentDate: enrollment.enrollmentDate
    };
    await updateEnrollment(data);
    successMessage.value = `已成功更新 ${enrollment.student.firstName} 的成績！`;
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
  max-width: 960px;
  margin: 24px auto;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  margin-bottom: 12px;
}
.table {
  width: 95%; /* 向內縮5% */
  border-collapse: collapse;
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
.grade-input.nb-brutal {
  width: 100px;
  border: var(--nb-border-thick) solid var(--nb-border);
  border-radius: 8px;
  box-shadow: var(--nb-shadow);
  background: inherit;
  color: inherit;
  font-weight: bold;
  text-align: center;
  padding: 8px 12px;
}
.btn.nb-brutal {
  padding: 8px 16px;
  border: var(--nb-border-thick) solid var(--nb-border);
  background: inherit;
  color: inherit;
  box-shadow: var(--nb-shadow);
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 8px;
  transition: background 0.2s, color 0.2s;
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
