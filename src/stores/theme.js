import { ref, computed } from 'vue';

const theme = ref('light');

function applyThemeVars(themeValue) {
  const root = document.documentElement;
  if (themeValue === 'light') {
    root.style.setProperty('--color-background', '#fff');
    root.style.setProperty('--color-background-soft', '#f8f8f8');
    root.style.setProperty('--color-background-mute', '#f2f2f2');
    root.style.setProperty('--color-border', 'rgba(60, 60, 60, 0.12)');
    root.style.setProperty('--color-border-hover', 'rgba(60, 60, 60, 0.29)');
    root.style.setProperty('--color-heading', '#2c3e50');
    root.style.setProperty('--color-text', '#2c3e50');
    root.style.setProperty('--color-nav-bg', '#f8f9fa');
    root.style.setProperty('--color-nav-link', '#007bff');
    root.style.setProperty('--color-nav-link-active', '#0056b3');
  } else {
    root.style.setProperty('--color-background', '#181818');
    root.style.setProperty('--color-background-soft', '#222222');
    root.style.setProperty('--color-background-mute', '#282828');
    root.style.setProperty('--color-border', 'rgba(84, 84, 84, 0.48)');
    root.style.setProperty('--color-border-hover', 'rgba(84, 84, 84, 0.65)');
    root.style.setProperty('--color-heading', '#fff');
    root.style.setProperty('--color-text', 'rgba(235, 235, 235, 0.64)');
    root.style.setProperty('--color-nav-bg', '#222222');
    root.style.setProperty('--color-nav-link', '#66aaff');
    root.style.setProperty('--color-nav-link-active', '#ffffff');
  }
}

export const themeStore = {
  theme,
  themeClass: computed(() => theme.value === 'light' ? 'nb-theme-light' : 'nb-theme-dark'),
  toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyThemeVars(theme.value);
  }
};

// 頁面初次載入時也要套用一次主題
applyThemeVars(theme.value);
