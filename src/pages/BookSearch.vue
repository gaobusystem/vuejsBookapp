<template>
  <div>
    <!-- 検索フォーム -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="本のタイトルを検索"
          v-model="keyword"
        />
      </v-col>
    </v-row>

    <!-- ボタン行 -->
    <v-row>
      <v-col cols="4">
        <v-btn
          color="primary"
          @click="search"
        >
          検索する
        </v-btn>
      </v-col>

      <v-col cols="5">
        <v-btn
          color="secondary"
          to="/"
        >
          一覧に戻る
        </v-btn>
      </v-col>
    </v-row>

    <!-- 検索結果 -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(book, index) in searchResults"
        :key="index"
      >
        <v-card class="mx-auto pa-2">

          <v-row>
            <!-- 画像 -->
            <v-col cols="4">
              <v-img :src="book.image" height="120" cover />
            </v-col>

            <!-- 本の情報 -->
            <v-col cols="8">
              <v-card-title class="text-h6">
                {{ book.title }}
              </v-card-title>

              <div class="mb-2">
                {{ book.description }}
              </div>

              <v-spacer />

              <v-card-actions>
                <v-btn
                  icon
                  color="indigo"
                  @click="addBookList(index)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>



<script setup>
import { ref } from 'vue'

// -------------------------
// state
// -------------------------
const keyword = ref('')
const searchResults = ref([])

// -------------------------
// emit
// -------------------------
const emit = defineEmits(['add-book-list'])

// -------------------------
// methods
// -------------------------
function addBookList(index) {
  emit('add-book-list', searchResults.value[index])
}

async function search() {
  searchResults.value = []

  const baseUrl = 'https://www.googleapis.com/books/v1/volumes?'
  const params = {
    q: `intitle:${keyword.value}`,
    maxResults: 40
  }

  const queryParams = new URLSearchParams(params)
  console.log("url: " + baseUrl + queryParams)

  // fetch
  const response = await fetch(baseUrl + queryParams)
    .then(res => res.json())

  console.log(response.items)

  // push results
  for (let book of response.items) {
    const title = book.volumeInfo.title
    const img = book.volumeInfo.imageLinks
    const description = book.volumeInfo.description

    searchResults.value.push({
      title: title || '',
      image: img ? img.thumbnail : '',
      description: description ? description.slice(0, 40) : ''
    })
  }
}
</script>

<style>
</style>
