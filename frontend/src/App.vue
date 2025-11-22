<template>
  <router-view />
  <Toast position="top-right" />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
</script>

<style>
/* Toast 样式 */
.p-toast {
  opacity: 1;
  z-index: 9999;
}

.p-toast-message {
  margin: 0 0 1rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
}

.p-toast-message-content {
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: flex-start;
}

.p-toast-message-success {
  background-color: #10b981;
  border: 1px solid #059669;
  color: white;
}

.p-toast-message-error {
  background-color: #ef4444;
  border: 1px solid #dc2626;
  color: white;
}

.p-toast-message-info {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.p-toast-message-warn {
  background-color: #f59e0b;
  border: 1px solid #d97706;
  color: white;
}

.p-toast-message-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.p-toast-message-text {
  flex: 1;
}

.p-toast-summary {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.p-toast-detail {
  margin: 0;
}

.p-toast-icon-close {
  margin-left: 0.75rem;
  cursor: pointer;
  opacity: 0.8;
}

.p-toast-icon-close:hover {
  opacity: 1;
}
</style>

<style scoped>
</style>
