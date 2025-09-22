<template>
  <div class="container">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">開發者登入</h1>
    <p>請點擊一個使用者以模擬登入</p>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="users.length > 0" class="user-list">
      <div v-for="user in users" :key="user.username" class="user-card" @click="handleLoginAs(user.username)">
        <div class="user-name">{{ getLastFirst(user.displayName) }}</div>
        <div class="user-role">{{ user.role }}</div>
        <div class="user-username">({{ user.username }})</div>
      </div>
    </div>
    <p v-else-if="!error">正在載入使用者列表...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsers, loginAs } from '@/api/users';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const router = useRouter();
const users = ref([]);
const error = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

async function loadUsers() {
  try {
    const { data } = await fetchAllUsers();
    // 預設 displayName 為 lastname firstname
    users.value = data.map(user => ({
      ...user,
      displayName: `${user.lastName || ''} ${user.firstName || ''}`.trim()
    }));
  } catch (e) {
    error.value = e?.response?.data?.message || '無法載入使用者列表。';
  }
}

async function handleLoginAs(username) {
  error.value = '';
  try {
    const { data } = await loginAs(username);
    authStore.setToken(data.jwt);
    
    const role = authStore.userRole.value;
    if (role === 'ADMIN') {
      router.push('/students');
    } else if (role === 'TEACHER') {
      router.push('/teacher/dashboard');
    } else if (role === 'STUDENT') {
      router.push('/student/dashboard');
    } else {
      router.push('/');
    }
  } catch (e) {
    error.value = e?.response?.data?.message || '模擬登入失敗。';
  }
}

function getLastFirst(displayName) {
  if (!displayName) return '';
  const parts = displayName.trim().split(' ');
  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }
  return displayName;
}

onMounted(loadUsers);
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
.user-list {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 200px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.user-name {
  font-size: 1.2rem;
  font-weight: 600;
}
.user-role {
  font-style: italic;
  color: #555;
  margin: 8px 0;
}
.user-username {
  font-family: monospace;
  color: #777;
}
.error {
  color: #c33;
  margin-top: 1rem;
}
</style>