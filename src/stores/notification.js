import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('')
  const type = ref('info')
  const isVisible = ref(false)

  function showNotification(msg, t = 'info') {
    message.value = msg
    type.value = t
    isVisible.value = true
console.log('showNotification',msg)
    // 3秒後に自動で消す
    setTimeout(() => {
      isVisible.value = false
    }, 10000)
  }

  function hideNotification() {
    isVisible.value = false
  }

  return {
    message,
    type,
    isVisible,
    showNotification,
    hideNotification
  }
})


