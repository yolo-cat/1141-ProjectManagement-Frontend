<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯課程資訊' : '新增課程' }}</h1>
    <form @submit.prevent="submit">
      <label>課程名稱</label>
      <input v-model.trim="form.courseName" required maxlength="100" />

      <label>課程描述</label>
      <textarea v-model.trim="form.courseDescription" rows="3"></textarea>

      <label>學分</label>
      <input v-model.trim="form.credits" type="number" required />

      <label>授課教師</label>
      <select v-model="form.teacher" required>
        <option :value="null" disabled>-- 請選擇一位教師 --</option>
        <option v-for="teacher in teachers" :key="teacher.teacherId" :value="teacher">
          {{ teacher.name }}
        </option>
      </select>

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <router-link class="btn" to="/courses">返回</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse, createCourse, updateCourse } from '@/api/courses';
import { fetchTeachers } from '@/api/teachers';

const route = useRoute();
const router = useRouter();

const id = route.params.id;
const isEdit = computed(() => !!id);

const form = ref({
  courseName: '',
  courseDescription: '',
  credits: 0,
  teacher: null,
});
const teachers = ref([]);
const error = ref('');

onMounted(async () => {
  // Fetch all teachers for the dropdown
  try {
    const { data } = await fetchTeachers();
    teachers.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }

  // If editing, fetch the course data
  if (isEdit.value) {
    try {
      const { data: courseData } = await getCourse(id);
      form.value = courseData;
    } catch (e) {
      error.value = e?.response?.data?.message || e.message;
    }
  }
});

async function submit() {
  error.value = '';
  try {
    if (isEdit.value) {
      await updateCourse(id, form.value);
    } else {
      await createCourse(form.value);
    }
    router.push('/courses');
  } catch (e) {
    if (e?.response?.data?.fields) {
      const msgs = Object.entries(e.response.data.fields).map(([k, v]) => `${k}: ${v}`);
      error.value = msgs.join(' | ');
    } else {
      error.value = e?.response?.data?.message || e.message;
    }
  }
}
</script>

<style scoped>
/* Styles are copied from StudentForm.vue and should be sufficient */
.container {
  max-width: 640px;
  margin: 24px auto;
  padding: 0 12px;
}
.title {
  margin-bottom: 12px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label {
  font-weight: 600;
}
input, select, textarea {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  padding: 6px 10px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}
.error {
  color: #c33;
}
</style>
