<template>
  <div class="container nb-brutal">
    <h1 class="title">選擇身份</h1>
    <div class="role-btn-group">
      <button class="role-btn nb-brutal" @click="selectRole('ADMIN')">管理員</button>
      <button class="role-btn nb-brutal" @click="selectRole('TEACHER')">教師</button>
      <button class="role-btn nb-brutal" @click="selectRole('STUDENT')">學生</button>
    </div>
    <p v-if="selectedRole" class="selected-msg nb-brutal">已選擇身份：{{ roleLabel[selectedRole] }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const selectedRole = ref('');
const roleLabel = {
  ADMIN: '管理員',
  TEACHER: '教師',
  STUDENT: '學生'
};
function selectRole(role) {
  selectedRole.value = role;
  // 可在此處觸發登入流程或跳轉
}
</script>

<style scoped>
.container {
  background: inherit;
  color: inherit;
  padding: 48px 0;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #000;
  min-height: 60vh;
  width: 100%;
  max-width: 480px;
  margin: 48px auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 32px;
  color: inherit;
}
.role-btn-group {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}
.role-btn.nb-brutal {
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.role-btn.nb-brutal:hover {
  background: #fff;
  color: #181818;
}
.selected-msg.nb-brutal {
  color: #181818;
  background: #fff;
  padding: 12px 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 8px;
  font-weight: bold;
}
</style>

