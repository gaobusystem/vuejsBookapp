<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/global/Header.vue'
import Footer from '@/global/Footer.vue'
import Loader from '@/components/Loader.vue'
import { useDateFormatter } from '@/composables/useDateFormatter'

const STORAGE_KEY = 'books'
const router = useRouter()
const { toISO } = useDateFormatter()

// -------------------------
// state
// -------------------------
const books = ref([])
const snackbar = ref(false)
const snackbarMessage = ref('')

// -------------------------
// lifecycle
// -------------------------

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const loaded = JSON.parse(saved)

      // ★ ソート処理を追加
      loaded.sort((a, b) => {
        // ① status 昇順
        if (a.evaluation !== b.evaluation) {
          return b.evaluation - a.evaluation
        }

        // ② publishedDate 降順
        return new Date(toISO(b.publishedDate)) - new Date(toISO(a.publishedDate))
      })

      books.value = loaded

    } catch (e) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})

const sortedBooks = computed(() => {
  if (!books.value) return []

  return [...books.value].sort((a, b) => {
    if (a.evaluation !== b.evaluation) {
      return b.evaluation - a.evaluation
    }
    return new Date(toISO(b.publishedDate)) - new Date(toISO(a.publishedDate))
  })
})

// -------------------------
// methods
// -------------------------
function addBook(e) {
  // 現在の最大IDを取得（books が空なら 0）
  const newId = Math.max(0, ...books.value.map(b => b.id)) + 1

  books.value.push({
    id: newId,
    isbn: e.isbn,
    title: e.title,
    titleKana: e.titleKana,
    author: e.author,
    publisher: e.publisher,
    publishedDate: e.publishedDate,
    image: e.image,
    readDate: '',
    readVolume: 0,
    endVolume: 0,
    maxVolume: 0,
    memo: '',
    status:1,
    evaluation:1,
  })

  saveBooks()

  // 最後に追加したIDへ遷移
  goToEditPage(newId)
}

function removeBook(index) {
  books.value.splice(index, 1)
  saveBooks()
}

function saveBooks() {

  const parsed = JSON.stringify(books.value)
  localStorage.setItem(STORAGE_KEY, parsed)
}
function updateBookNewInfo(e) {
  console.log(e)
  const index = books.value.findIndex(b => b.id === e.id)
  if (index === -1) {
    console.error("Book not found:", e.id)
    return
  }

  const updateInfo = {
    id: Number(e.id),
    isbn: books.value[index].isbn,
    title: books.value[index].title,
    titleKana: books.value[index].titleKana,
    publisher: books.value[index].publisher,
    publishedDate: e.publishedDate,
    memo: books.value[index].memo,
    readDate: books.value[index].readDate,
    readVolume: books.value[index].readVolume,
    endVolume: books.value[index].endVolume,
    maxVolume: e.maxVolume,
    image: books.value[index].image,
    status: books.value[index].status,
    evaluation: books.value[index].evaluation,
  }

  books.value.splice(index, 1, updateInfo)
  saveBooks()
}
function updateBookInfo(e) {
  console.log(e)
  const index = books.value.findIndex(b => b.id === e.id)
  if (index === -1) {
    console.error("Book not found:", e.id)
    return
  }

  const updateInfo = {
    id: Number(e.id),
    isbn: books.value[index].isbn,
    title: e.title,
    titleKana: books.value[index].titleKana,
    publisher: books.value[index].publisher,
    publishedDate: books.value[index].publishedDate,
    memo: e.memo,
    readDate: e.readDate,
    readVolume: e.readVolume,
    endVolume: e.endVolume,
    maxVolume: e.maxVolume,
    image: books.value[index].image,
    status: e.status,
    evaluation: e.evaluation,
  }

  books.value.splice(index, 1, updateInfo)
  saveBooks()
  router.push('/')
}

function goToEditPage(id) {
  router.push(`/edit/${id}`)
}

function deleteLocalStorage() {
  const isDeleted = 'LocalStorageのデータを削除してもいいですか？'
  if (window.confirm(isDeleted)) {
    localStorage.removeItem(STORAGE_KEY)
    books.value = []
    window.location.reload()
  }
}

function downloadConf() {
  console.log(books.value);
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    alert('保存データがありません')
    return
  }
// Blob に変換
  const blob = new Blob([saved], { type: 'application/json' })

  // ダウンロード用 URL を作成
  const url = URL.createObjectURL(blob)

  // 仮の <a> タグを作ってクリック
  const a = document.createElement('a')
  a.href = url
  a.download = 'books.json'
  a.click()

  // 後片付け
  URL.revokeObjectURL(url)

}
function deleteBook(id) {
  const index = books.value.findIndex(b => b.id === id)
  if (index !== -1) {
    const title = books.value[index].title   // ← これが必要

    console.log(`削除: id=${id}, title=${title}`)
    books.value.splice(index, 1)
    saveBooks()

    snackbarMessage.value = `「${title}」を削除しました`
    snackbar.value = true
  }
}

</script>

<template>
  <v-app>
    <Header
    @delete-local-storage="deleteLocalStorage"
    @download-conf="downloadConf"
    />
    <!-- グローバルローダー -->
    <Loader />
    <v-snackbar v-model="snackbar" timeout="2000" color="green">
      {{ snackbarMessage }}
    </v-snackbar>
    <v-main>
      <v-container>
        <router-view v-slot="route">
          <component
            :is="route.Component"
            :books="sortedBooks"
            v-bind="route.routeProps"
            @add-book-list="addBook"
            @update-book-info="updateBookInfo"
            @delete-book="deleteBook"
            @update-book-new-info="updateBookNewInfo"
          />
        </router-view>
      </v-container>
    </v-main>
    <v-footer>
      <Footer/>
    </v-footer>
  </v-app>
</template>



<style scoped>

.title {
  margin-bottom: 60px;
}
</style>
