<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯老師資訊' : '新增老師' }}</h1>
    <form @submit.prevent="submit">
      <label>姓名</label>
      <input v-model.trim="form.name" required maxlength="100" />

      <label>電子郵件</label>
      <input v-model.trim="form.email" type="email" required maxlength="150" />

      <label>年齡</label>
      <input v-model.trim="form.age" type="number" required />

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <router-link class="btn" to="/teachers">返回</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTeacher, createTeacher, updateTeacher } from '@/api/teachers';

const route = useRoute();
const router = useRouter();

const id = route.params.id;
const isEdit = computed(() => !!id);
const form = ref({ name: '', email: '', age: '' });
const error = ref('');

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await getTeacher(id);
      form.value = { name: data.name, email: data.email, age: data.age };
    } catch (e) {
      error.value = e?.response?.data?.message || e.message;
    }
  }
});

async function submit() {
  error.value = '';
  try {
    if (isEdit.value) {
      await updateTeacher(id, form.value);
    } else {
      await createTeacher(form.value);
    }
    router.push('/teachers');
  } catch (e) {
    // 顯示後端驗證訊息
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

input {
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