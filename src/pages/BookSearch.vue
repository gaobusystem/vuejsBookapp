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
                {{ book.titleKana }}　著者：{{ book.author }}　出版社：{{ book.publisher }}　
              </div>
              <div class="mb-2">
               発売日：{{ book.publishedDate }}
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
import { ref,  nextTick } from 'vue'
import { useLoaderStore } from '@/stores/loader'
const loader = useLoaderStore()



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
  loader.show()
  // UI 更新を待つ（これが重要）
  //await nextTick()


  const baseUrl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?'
  const params = {
    applicationId:"1081189654826734250",
    title: `${keyword.value}`,
    hits: 30,
    page: 1,
    sort:"-releaseDate",
    formatVersion: 2
  }
  await new Promise(resolve => setTimeout(resolve, 3000))

  loader.hide()

  const queryParams = new URLSearchParams(params)
  console.log("url: " + baseUrl + queryParams)

  // fetch
  const response = await fetch(baseUrl + queryParams)
    .then(res => res.json())

  console.log(response.Items)

  // push results
  for (let book of response.Items) {
    const isbn = book.isbn
    const title = book.title
    const titleKana = book.titleKana
    const author = book.author
    const publisher = book.publisherName
    const publishedDate = book.salesDate
    const img = book.mediumImageUrl
 //   const description = book.itemCaption

    searchResults.value.push({
      isbn: isbn,
      title: title || '',
      titleKana: titleKana || '',
      author: author || '',
      publisher: publisher || '',
      publishedDate: publishedDate || '',
      image: img  || '',
  //    description: description ? description.slice(0, 40) : ''
    })
  }
  console.log("searchResults.value")
  console.log(searchResults.value)
}
</script>

<style>
</style>
