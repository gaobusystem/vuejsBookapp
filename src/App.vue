<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/global/Header.vue'
import Footer from '@/global/Footer.vue'

const STORAGE_KEY = 'books'
const router = useRouter()

// -------------------------
// state
// -------------------------
const books = ref([])
const newBook = ref(null)

// -------------------------
// lifecycle
// -------------------------
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      books.value = JSON.parse(saved)
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})

// -------------------------
// methods
// -------------------------
function addBook(e) {
  books.value.push({
    id: e.id,
    title: e.title,
    publisher: e.publisher,
    publishedDate: e.publishedDate,
    image: e.image,
    description: e.description,
    readDate: '',
    memo: '',
    status:'',
  })

  saveBooks()

  // 最後に追加したIDへ遷移
  const lastId = books.value.slice(-1)[0].id
  goToEditPage(lastId)
}

function removeBook(index) {
  books.value.splice(index, 1)
  saveBooks()
}

function saveBooks() {
  const parsed = JSON.stringify(books.value)
  localStorage.setItem(STORAGE_KEY, parsed)
}

function updateBookInfo(e) {
  const updateInfo = {
    id: e.id,
    readDate: e.readDate,
    memo: e.memo,
    title: books.value[e.id].title,
    image: books.value[e.id].image,
    description: books.value[e.id].description
  }

  books.value.splice(e.id, 1, updateInfo)
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
</script>

<template>
  <v-app>
    <Header
    @delete-local-storage="deleteLocalStorage"
    @download-conf="downloadConf"
    />
    <v-main>
      <v-container>
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :books="books"
            @add-book-list="addBook"
            @update-book-info="updateBookInfo"
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
