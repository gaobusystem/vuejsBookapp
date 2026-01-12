<template>
  <v-btn color="primary" @click="openFile">
    JSON をインポート
  </v-btn>

  <!-- 隠しファイル入力 -->
  <input
    ref="fileInput"
    type="file"
    accept="application/json"
    style="display:none"
    @change="onFileSelected"
  />
</template>

<script setup>
import { ref } from 'vue'

const STORAGE_KEY = 'books'
const fileInput = ref(null)

// ファイル選択ダイアログを開く
function openFile() {
  fileInput.value.click()
}

// ファイルが選択されたとき
function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result)

      // localStorage を更新
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json))

      alert('books.json を読み込みました')
      window.location.reload()   // 必要なら画面更新
    } catch (e) {
      alert('JSON の形式が正しくありません')
    }
  }

  reader.readAsText(file)
}
</script>

