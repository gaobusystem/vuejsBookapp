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
    id: books.value.length,
    title: e.title,
    image: e.image,
    description: e.description,
    readDate: '',
    memo: ''
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
</script>

<template>
  <v-app>
    <Header
    @delete-local-storage="deleteLocalStorage"
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
