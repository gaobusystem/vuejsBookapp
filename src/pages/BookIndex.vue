<script>
import { ref } from 'vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useBookStatus } from '@/composables/useBookStatus'
import { useBookEvaluation } from '@/composables/useBookEvaluation'

export default {
  props:{
    books:Array
  },
 setup(props, { emit }) {
  const { formatDate, isFutureDate } = useDateFormatter()
  const { getStatusLabel } = useBookStatus()
  const { getEvaluationLabel } = useBookEvaluation()

  const deleteDialog = ref(false)
  const targetBook = ref(null)

  const confirmDelete = (book) => {
    targetBook.value = book
    deleteDialog.value = true
  }

  const deleteBook = () => {
    emit('delete-book', targetBook.value.id)
    deleteDialog.value = false
  }



  return {
    books: props.books,   // ← これが重要
    formatDate,
    isFutureDate,
    getStatusLabel,
    getEvaluationLabel,
    deleteDialog,
    targetBook,
    confirmDelete,
    deleteBook,
  }
}
}
</script>
<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-btn color="primary" to="/search">検索する</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" v-for="book in books" :key="book.id">
        <v-card>
          <v-row>
            <v-col cols="4">
              <v-img :src="book.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title class="no-ellipsis">{{ book.title }}</v-card-title>
              <v-card-text>
              id：{{book.id}}　isbn：{{book.isbn}}<br>
               出版社：{{book.publisher}}<br>
              発売日：{{book.publishedDate}} <v-chip   v-if="isFutureDate(book.publishedDate)"
                                              color="red"
                                              text-color="white"
                                              size="small"
                                              class="ml-2"
                                            >
                                              発売予定
                                            </v-chip>
              <br>
              最新巻：{{book.maxVolume}}<br>
              読んだ巻：{{book.readVolume}}　読んだ日：{{ formatDate(book.readDate, 'yyyy/MM/dd') }}<br>
              状態：{{ getStatusLabel(book.status) }}　評価：{{ getEvaluationLabel(book.evaluation) }}
              </v-card-text>
              <v-card-actions>
                <v-btn :to="{name: 'BookEdit', params: {id: book.id}}"
                color="indigo" fab small dark
                >
                <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="indigo"
                  fab
                  small
                  dark
                  @click="confirmDelete(book)"
                >
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          本当に削除しますか？
        </v-card-title>

        <v-card-text>
          <div>タイトル：{{ targetBook?.title }}</div>
          <div>読んだ日：{{ formatDate(targetBook?.readDate) }}</div>
          <div>状態：{{ getStatusLabel(targetBook?.status) }}</div>

          <div class="mt-4 text-red">
            ※ この操作は取り消せません
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey" text @click="deleteDialog = false">
             <v-icon>mdi-close</v-icon>キャンセル
          </v-btn>

          <v-btn color="red" text @click="deleteBook">
            <v-icon>mdi-check-bold</v-icon>削除する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<style>
.v-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
