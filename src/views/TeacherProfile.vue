<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">我的個人資料</h1>
    <form v-if="form" @submit.prevent="submit" class="nb-brutal">
      <label>姓名</label>
      <input v-model.trim="form.name" required maxlength="100" class="input nb-brutal" />

      <label>電子郵件</label>
      <input v-model.trim="form.email" type="email" required maxlength="150" class="input nb-brutal" />

      <label>年齡</label>
      <input v-model.trim="form.age" type="number" required class="input nb-brutal" />

      <div class="actions">
        <button class="btn nb-brutal" type="submit">更新資料</button>
        <router-link class="btn nb-brutal" to="/teacher/dashboard">返回儀表板</router-link>
      </div>

      <p v-if="error" class="error nb-brutal">{{ error }}</p>
      <p v-if="successMessage" class="success nb-brutal">{{ successMessage }}</p>
    </form>
    <p v-else-if="error" class="error nb-brutal">{{ error }}</p>
    <p v-else>正在載入資料...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTeacher, updateTeacher } from '@/api/teachers';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const teacherId = authStore.userId.value;
const form = ref(null);
const error = ref('');
const successMessage = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

onMounted(async () => {
  if (teacherId) {
    try {
      const { data } = await getTeacher(teacherId);
      form.value = { 
        name: data.name, 
        email: data.email, 
        age: data.age 
      };
    } catch (e) {
      error.value = e?.response?.data?.message || '無法載入教師資料。';
    }
  }
});

async function submit() {
  error.value = '';
  successMessage.value = '';
  try {
    await updateTeacher(teacherId, form.value);
    successMessage.value = '個人資料已成功更新！';
  } catch (e) {
    if (e?.response?.data?.fields) {
      const msgs = Object.entries(e.response.data.fields).map(([k, v]) => `${k}: ${v}`);
      error.value = msgs.join(' | ');
    } else {
      error.value = e?.response?.data?.message || '更新失敗。';
    }
  }
}
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

form.nb-brutal {
  background: inherit;
  color: inherit;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #000;
  border: 3px solid #000;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: block;
  margin-top: 16px;
  margin-bottom: 4px;
  color: inherit;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
}

.btn.nb-brutal {
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  padding: 8px 16px;
  font-weight: bold;
  box-shadow: 4px 4px 0 #000;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.btn.nb-brutal:hover {
  background: #fff;
  color: #181818;
}

.error.nb-brutal {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  margin-top: 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
}

.success.nb-brutal {
  color: #181818;
  background: #fff;
  padding: 8px 16px;
  margin-top: 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
}
</style>
