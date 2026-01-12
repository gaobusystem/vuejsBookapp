<template>
  <v-app-bar color="gray accent-4" dark>

    <!-- ホーム -->
    <v-btn icon color="primary" to="/">
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-toolbar-title>漫画管理</v-toolbar-title>

    <div class="flex-grow-1"></div>

    <!-- ハート -->
    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <!-- 検索 -->
    <v-btn icon color="primary" to="/search">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <!-- メニュー -->
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon color="primary">
          <SvgIcon type="mdi" :path="path" />
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="onMenuClick(index)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMenu } from '@mdi/js'

const router = useRouter()

// メニューアイコン
const path = mdiMenu

// メニュー項目
const items = ref([
  { title: 'Click Me' },
  { title: '設定をダウンロード' },
  { title: '初期データインポート' },
  { title: '登録データをクリア' },
])

// emit
const emit = defineEmits(['delete-local-storage', 'download-conf'])

// メニュークリック処理
function onMenuClick(index) {
  if (items.value[index].title === '登録データをクリア') {
    emit('delete-local-storage')
  }
  if (items.value[index].title === '設定をダウンロード') {
    emit('download-conf')
  }
  if (items.value[index].title === '初期データインポート') {
    router.push('/conf-download')
  }
}
</script>

<style scoped>
</style>
