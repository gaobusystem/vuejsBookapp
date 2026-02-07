<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-4">最新刊を検索</h1>

    <!-- ボタン行 -->
    <v-row>
      <v-col cols="4">
        <v-btn
          color="primary"
          @click="search"
        >
          再検索
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
import { ref, onMounted, nextTick  } from 'vue'
import { useLoaderStore } from '@/stores/loader'
const loader = useLoaderStore()

const props = defineProps({
  books: {
    type: Array,
    required: true
  }
})

onMounted(async () => {
  await nextTick()
  search()
})
function updateBookInfo() {
  let endVolume = 0
  if(this.status == "完読"){
    endVolume= this.maxVolume
  }
  console.log("this.date")
  console.log(this.date)
  this.$emit('update-book-info',{
    id: Number(this.$route.params.id),
    title: this.book.title,
    readVolume: this.book.readVolume,
    readDate: this.date,
    endVolume: endVolume,
    maxVolume: this.book.maxVolume,
    memo: this.book.memo,
    status: this.book.status,
    evaluation: this.book.evaluation,
  })
}

// -------------------------
// state
// -------------------------
const searchResults = ref([])

// -------------------------
// emit
// -------------------------
const emit = defineEmits(['add-book-list'], 'update-book-new-info')

// -------------------------
// methods
// -------------------------
function addBookList(index) {
  emit('add-book-list', searchResults.value[index])
}

function parseSalesDate(dateStr) {
  if (!dateStr) return null

  // "2021年04月30日頃" → "2021-04-30"
  const cleaned = dateStr
    .replace("頃", "")
    .replace("年", "-")
    .replace("月", "-")
    .replace("日", "")

  const d = new Date(cleaned)
  return isNaN(d.getTime()) ? null : d
}

function isWithinSixMonths(date) {
  if (!date) return false

  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(now.getMonth() - 6)

  return date >= sixMonthsAgo
}

async function search() {

  searchResults.value = []
  if (props.books.length <= 0 ){
    console.log("props.books.length <= 0")
    return ""
  }

  loader.show()

 for (let book of props.books) {

  const baseUrl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?'
  const params = {
    applicationId:"1081189654826734250",
    title: `${book.title}`,
    hits: 5,
    page: 1,
    sort:"-releaseDate",
    formatVersion: 2
  }
  await new Promise(resolve => setTimeout(resolve, 500))
  const queryParams = new URLSearchParams(params)


  // fetch
  const response = await fetch(baseUrl + queryParams)
    .then(res => res.json())

  console.log(response.Items)
  // push results
  for (let bookSr of response.Items) {
    const publishedDate = bookSr.salesDate
    console.log(publishedDate)
    const parsedDate = parseSalesDate(publishedDate)
    console.log("parsedDate")
    console.log(parsedDate)
    console.log("book.publishedDate")
    console.log(book.publishedDate)
    // 過去1年以内だけ追加
    if (isWithinSixMonths(parsedDate)) {
        console.log("target")
      if (parsedDate > parseSalesDate(book.publishedDate)){
          console.log("最新")
        const isbn = bookSr.isbn
        const title = bookSr.title
        const titleKana = bookSr.titleKana
        const author = bookSr.author
        const publisher = bookSr.publisherName
        const img = bookSr.mediumImageUrl

        searchResults.value.push({
          isbn: isbn,
          title: title || '',
          titleKana: titleKana || '',
          author: author || '',
          publisher: publisher || '',
          publishedDate: publishedDate || '',
          image: img  || '',
        })
        let newVol = title
          .replace(book.title, "")
          .replace("（", "")
          .replace("）", "")
          .replace(" ", "")
        console.log("newVol")
        console.log(newVol)
        if (!isNaN(newVol)){
          emit('update-book-new-info',{
            id: book.id,
            publishedDate: publishedDate,
            maxVolume: newVol,
          })
        }
      }
    }
  }

 }

  loader.hide()

  console.log("searchResults.value")
  console.log(searchResults.value)
}
</script>

<style>
</style>
