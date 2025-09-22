<template>
  <div class="container nb-brutal" :class="themeClass">
    <div class="add-btn-box">
      <button @click="showAddModal = true" class="add-btn nb-brutal">新增成員</button>
    </div>
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
      <button @click="handleLogout" class="logout-btn nb-brutal">Logout</button>
    </div>
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal nb-brutal">
        <h2>新增成員</h2>
        <div class="modal-type-group">
          <label>
            <input type="radio" value="STUDENT" v-model="addType" /> 新增學生
          </label>
          <label>
            <input type="radio" value="TEACHER" v-model="addType" /> 新增教師
          </label>
        </div>
        <form @submit.prevent="handleAddMember">
          <template v-if="addType === 'STUDENT'">
            <div class="form-group">
              <label>名字</label>
              <input v-model="addForm.firstName" required placeholder="請輸入名字" />
            </div>
            <div class="form-group">
              <label>姓氏</label>
              <input v-model="addForm.lastName" required placeholder="請輸入姓氏" />
            </div>
            <div class="form-group">
              <label>帳號</label>
              <input v-model="addForm.username" required placeholder="請輸入帳號" />
            </div>
            <div class="form-group">
              <label>密碼</label>
              <input v-model="addForm.password" required type="password" placeholder="請輸入密碼" />
            </div>
            <div class="form-group">
              <label>電子郵件</label>
              <input v-model="addForm.email" required type="email" placeholder="請輸入電子郵件" />
            </div>
            <div class="form-group">
              <label>生日</label>
              <input v-model="addForm.dateOfBirth" required type="date" placeholder="請選擇生日" />
            </div>
          </template>
          <template v-else>
            <div class="form-group">
              <label>姓名</label>
              <input v-model="addForm.name" required placeholder="請輸入姓名" />
            </div>
            <div class="form-group">
              <label>帳號</label>
              <input v-model="addForm.username" required placeholder="請輸入帳號" />
            </div>
            <div class="form-group">
              <label>密碼</label>
              <input v-model="addForm.password" required type="password" placeholder="請輸入密碼" />
            </div>
            <div class="form-group">
              <label>電子郵件</label>
              <input v-model="addForm.email" required type="email" placeholder="請輸入電子郵件" />
            </div>
            <div class="form-group">
              <label>年齡</label>
              <input v-model="addForm.age" required type="number" min="18" placeholder="請輸入年齡" />
            </div>
          </template>
          <div class="modal-actions">
            <button type="submit" class="add-btn nb-brutal">送出</button>
            <button type="button" class="cancel-btn nb-brutal" @click="closeAddModal">取消</button>
          </div>
        </form>
        <div v-if="addError" class="error nb-brutal">{{ addError }}</div>
      </div>
    </div>
    <!-- stack在body上方，以下為原本內容 -->
    <div class="center-content">
      <h1 class="title">校園管理員系統</h1>
      <div v-if="error" class="error nb-brutal">{{ error }}</div>
      <div class="login-section">
        <h2>管理老師</h2>
        <div v-if="teachers.length > 0" class="user-list">
          <div v-for="user in teachers" :key="user.id" class="user-card" @click="handleLogin(user)">
            <div class="user-name">{{ getLastFirst(user.displayName) }}</div>
            <div class="user-role">{{ user.role }}</div>
            <div class="user-username">({{ user.username }})</div>
            <button class="delete-btn nb-brutal" @click.stop="handleDelete(user)">刪除</button>
          </div>
        </div>
        <p v-else>沒有老師資料</p>
      </div>
      <div class="login-section">
        <h2>管理學生</h2>
        <div v-if="students.length > 0" class="user-list">
          <div v-for="user in students" :key="user.id" class="user-card" @click="handleLogin(user)">
            <div class="user-name">{{ getLastFirst(user.displayName) }}</div>
            <div class="user-role">{{ user.role }}</div>
            <div class="user-username">({{ user.username }})</div>
            <button class="delete-btn nb-brutal" @click.stop="handleDelete(user)">刪除</button>
          </div>
        </div>
        <p v-else>沒有學生資料</p>
      </div>
      <p v-if="loading && !error">正在載入使用者列表...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsers, loginAsId } from '@/api/users';
import { deleteStudent } from '@/api/students';
import { deleteTeacher } from '@/api/teachers';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';
import { createStudent } from '@/api/students';
import { createTeacher } from '@/api/teachers';

const router = useRouter();
const allUsers = ref([]);
const error = ref('');
const loading = ref(true);
const quickRole = ref(null);
const showAddModal = ref(false);
const addType = ref('STUDENT');
const addForm = ref({
  // 學生欄位
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  dateOfBirth: '',
  // 老師欄位
  name: '',
  age: '',
});
const addError = ref('');

const teachers = computed(() => allUsers.value.filter(u => u.role === 'TEACHER'));
const students = computed(() => allUsers.value.filter(u => u.role === 'STUDENT'));
const roleLabel = {
  ADMIN: '管理員',
  TEACHER: '教師',
  STUDENT: '學生'
};

const theme = themeStore.theme;
const themeClass = themeStore.themeClass;
function toggleTheme() {
  themeStore.toggleTheme();
}

async function loadUsers() {
  loading.value = true;
  try {
    const { data } = await fetchAllUsers();
    console.log('API users data:', data); // 調試用，觀察資料結構
    allUsers.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || '無法載入使用者列表。';
  } finally {
    loading.value = false;
  }
}

async function handleLogin(user) {
  error.value = '';
  try {
    const { data } = await loginAsId(user.id, user.role);
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

// 刪除 API 根據角色分流
async function handleDelete(user) {
  if (!confirm(`確定要刪除 ${user.displayName} (${user.username}) 嗎？`)) return;
  error.value = '';
  try {
    if (user.role === 'TEACHER') {
      await deleteTeacher(user.id);
    } else if (user.role === 'STUDENT') {
      await deleteStudent(user.id);
    } else {
      throw new Error('僅能刪除老師或學生');
    }
    allUsers.value = allUsers.value.filter(u => u.id !== user.id);
    error.value = `${user.displayName} 已刪除。`;
  } catch (e) {
    error.value = e?.response?.data?.message || '刪除失敗。';
  }
}

function handleLogout() {
  authStore.logout();
  router.push({ name: 'campus-login' });
}

function closeAddModal() {
  showAddModal.value = false;
  addType.value = 'STUDENT';
  addForm.value = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    dateOfBirth: '',
    name: '',
    age: '',
  };
  addError.value = '';
}
async function handleAddMember() {
  addError.value = '';
  // 前端檢查帳號唯一性
  const usernameExists = allUsers.value.some(u => u.username === addForm.value.username);
  if (usernameExists) {
    addError.value = '帳號已存在，請更換帳號';
    return;
  }
  try {
    if (addType.value === 'STUDENT') {
      if (!addForm.value.firstName || !addForm.value.lastName || !addForm.value.username || !addForm.value.password || !addForm.value.email || !addForm.value.dateOfBirth) {
        addError.value = '所有欄位必填';
        return;
      }
      await createStudent({
        firstName: addForm.value.firstName,
        lastName: addForm.value.lastName,
        username: addForm.value.username,
        password: addForm.value.password,
        email: addForm.value.email,
        dateOfBirth: addForm.value.dateOfBirth,
        role: 'STUDENT',
      });
    } else if (addType.value === 'TEACHER') {
      if (!addForm.value.name || !addForm.value.username || !addForm.value.password || !addForm.value.email || !addForm.value.age) {
        addError.value = '所有欄位必填';
        return;
      }
      await createTeacher({
        name: addForm.value.name,
        username: addForm.value.username,
        password: addForm.value.password,
        email: addForm.value.email,
        age: Number(addForm.value.age),
        role: 'TEACHER',
      });
    }
    await loadUsers();
    closeAddModal();
  } catch (e) {
    addError.value = e?.response?.data?.message || '新增失敗。';
  }
}

// function quickSelectRole(role) {
//   quickRole.value = role;
//   if (role === 'ADMIN') {
//     // 管理員顯示全部
//     loadUsers();
//   } else if (role === 'TEACHER') {
//     // 只顯示教師名單
//     allUsers.value = teachers.value;
//   } else if (role === 'STUDENT') {
//     // 只顯示學生名單
//     allUsers.value = students.value;
//   } else {
//     allUsers.value = [];
//   }
// }

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
  padding: 32px 0; /* 左右不留白 */
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
.add-btn-box {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 11;
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
  .add-btn-box {
    position: static;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;
    top: auto;
    left: auto;
  }
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
.role-selector-stack {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px auto;
  padding: 24px 0 16px 0;
  border: 3px solid #000;
  border-radius: 16px;
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 6px 6px 0 #000, 0 4px 12px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.role-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: inherit;
  text-align: center;
}
.role-btn-group {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 8px;
}
.role-btn {
  min-width: 120px;
  padding: 16px 0;
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
.role-btn:hover {
  background: #fff;
  color: #181818;
}
.selected-msg {
  text-align: center;
  font-size: 1rem;
  margin-top: 12px;
  font-weight: bold;
}
.center-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: inherit;
  text-align: center;
}
.login-section {
  margin-top: 32px;
  width: 100%;
}
.login-section h2 {
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 16px;
  text-align: center;
}
.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center; /* 置中 */
}
.user-card {
  border: 3px solid var(--color-border);
  border-radius: 12px;
  padding: 20px 16px;
  width: 220px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.77,0,.175,1);
  text-align: center;
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 6px 6px 0 #000, 0 4px 12px rgba(0,0,0,0.10);
  position: relative;
  font-family: 'IBM Plex Sans', 'Arial', sans-serif;
}
.user-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 12px 12px 0 #000, 0 8px 24px rgba(0,0,0,0.18);
  background: var(--color-background);
  border-color: var(--color-nav-link-active);
  z-index: 2;
}
.user-card:active {
  box-shadow: 2px 2px 0 #000;
  transform: scale(0.98);
}
.user-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.user-role {
  font-style: italic;
  color: var(--color-nav-link);
  margin: 8px 0;
  font-weight: 600;
}
.user-username {
  font-family: monospace;
  color: var(--color-nav-link-active);
  font-size: 0.95rem;
  background: var(--color-background-mute);
  border-radius: 6px;
  padding: 2px 8px;
  box-shadow: 2px 2px 0 #000;
  display: inline-block;
}
.error {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  margin-top: 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  text-align: center;
}
.theme-btn {
  padding: 8px 20px;
  font-weight: bold;
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  cursor: pointer;
}
.theme-btn:hover {
  background: #fff;
  color: #181818;
}
.logout-btn {
  margin-left: 12px;
  padding: 8px 20px;
  font-weight: bold;
  background: #c00;
  color: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.logout-btn:hover {
  background: #fff;
  color: #c00;
}
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #c00;
  border: 2px solid #c00;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
  box-shadow: 2px 2px 0 #000;
}
.delete-btn:hover {
  background: #c00;
  color: #fff;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: var(--color-background);
  color: var(--color-text);
  padding: 32px;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #000;
  width: 90%;
  max-width: 500px;
  position: relative;
}
.modal h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.8rem;
  text-align: center;
}
.modal-type-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}
.modal-type-group label {
  cursor: pointer;
  font-size: 1.1rem;
  color: inherit;
}
.modal-type-group input {
  margin-right: 8px;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-mute);
  color: var(--color-text);
  font-size: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.add-btn {
  padding: 8px 16px;
  font-weight: bold;
  background: #4caf50;
  color: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.add-btn:hover {
  background: #fff;
  color: #4caf50;
}
.cancel-btn {
  padding: 8px 16px;
  font-weight: bold;
  background: #f44336;
  color: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.cancel-btn:hover {
  background: #fff;
  color: #f44336;
}
</style>