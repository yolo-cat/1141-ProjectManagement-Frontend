<template>
  <div class="jump-container nb-brutal">
    <h2 class="jump-title">用戶名稱跳轉</h2>
    <div class="jump-box nb-brutal">
      <input v-model="inputName" class="jump-input nb-brutal" placeholder="請輸入用戶名稱" @keyup.enter="handleJump" />
      <button class="jump-btn nb-brutal" @click="handleJump">跳轉</button>
      <div v-if="error" class="jump-error nb-brutal">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsers } from '@/api/users';

const inputName = ref('');
const error = ref('');
const router = useRouter();
const allUsers = ref([]);

async function loadUsers() {
  try {
    const { data } = await fetchAllUsers();
    allUsers.value = data;
  } catch (e) {
    error.value = '無法載入用戶資料';
  }
}

function handleJump() {
  error.value = '';
  const name = inputName.value.trim();
  if (!name) {
    error.value = '請輸入用戶名稱';
    return;
  }
  const user = allUsers.value.find(u => u.displayName === name);
  if (!user) {
    error.value = '查無此用戶';
    return;
  }
  if (user.role === 'STUDENT') {
    router.push(`/student/profile/${user.id}`);
  } else if (user.role === 'TEACHER') {
    router.push(`/teacher/profile/${user.id}`);
  } else {
    error.value = '僅支援學生或教師跳轉';
  }
}

loadUsers();
</script>

<style scoped>
.jump-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: inherit;
  color: inherit;
}
.jump-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 32px;
  color: inherit;
  text-align: center;
}
.jump-box {
  border: 3px solid #000;
  border-radius: 16px;
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 6px 6px 0 #000, 0 4px 12px rgba(0,0,0,0.10);
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 320px;
}
.jump-input {
  width: 220px;
  padding: 12px 16px;
  font-size: 1.1rem;
  border: 3px solid #000;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #000;
  background: inherit;
  color: inherit;
  margin-bottom: 8px;
}
.jump-btn {
  min-width: 120px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: bold;
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.jump-btn:hover {
  background: #fff;
  color: #181818;
}
.jump-error {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  text-align: center;
  border-radius: 8px;
}
</style>

