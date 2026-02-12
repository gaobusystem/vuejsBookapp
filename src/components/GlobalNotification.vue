<template>
  <div v-if="notificationStore.isVisible" :class="['notification', notificationStore.type]">
    {{ notificationStore.message }}
    <button @click="notificationStore.hideNotification()">×</button>
  </div>
</template>

<script setup>
    import { useNotificationStore } from '@/stores/notification';
    const notificationStore = useNotificationStore();
 </script>

<style>
    .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    z-index: 9999; /* 他の要素の上に表示 */
    }
    .notification.info { background-color: #2196F3; }
    .notification.success { background-color: #4CAF50; }
    .notification.error { background-color: #f44336; }
    .notification.warning { background-color: #ff9800; }
</style>

// 使い方
// import { useNotificationStore } from '@/stores/notification'
// const notificationStore = useNotificationStore()
// notificationStore.showNotification('保存しました！', 'success')


