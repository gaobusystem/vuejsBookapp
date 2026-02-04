<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-row>
            <!-- 左側：画像 -->
            <v-col cols="4">
              <v-img :src="book.image"></v-img>
            </v-col>
            <!-- 右側：情報 -->
            <v-col cols="8">
              <v-card-title>

                <div class="mt-2">
                  タイトル：{{ book.title }}
                  <v-text-field
                    v-model="book.title"
                    density="compact"
                    style="max-width: 150px"
                  />
                </div>
              </v-card-title>
                <div>id：{{ book.id }}　isbn：{{ book.isbn }}</div>
                <div>シリーズ：{{ book.titleKana }}</div>
                <div>出版社：{{ book.publisher }}</div>
                <div>発売日：{{ book.publishedDate }}</div>

                <div class="mt-2">
                  最新巻：
                  <v-text-field
                    v-model="book.maxVolume"
                    density="compact"
                    style="max-width: 150px"
                  />
                </div>
                <div class="mt-2">
                  読んだ巻：
                  <v-text-field
                    v-model="book.readVolume"
                    density="compact"
                    style="max-width: 150px"
                  />
                </div>
              読んだ日：
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :offset="[0, 10]"
                min-width="290px"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="book.readDate"
                    readonly
                    v-bind="props"
                  />
                </template>

                <v-date-picker
                  v-model="date"
                  @update:model-value="onDateSelected"
                  locale="jp-ja"
                  :day-format="d => new Date(d).getDate()"
                />
              </v-menu>
              <div class="mt-2">
                状態：
                <v-select
                  v-model="book.status"
                  :items="statusList"
                  item-title="label"
                  item-value="code"
                  density="compact"
                  style="max-width: 200px"
                />
              </div>
              <div class="mt-2">
                評価：
                <v-select
                  v-model="book.evaluation"
                  :items="evalList"
                  item-title="label"
                  item-value="code"
                  density="compact"
                  style="max-width: 200px"
                />
              </div>
              <div class="mt-4">
              感想：<v-textarea
              class="mx-2" v-model="book.memo">
              {{book.memo }}
              </v-textarea>
              </div>
              <v-card-actions>
                <v-btn color="secondary" to="/">一覧に戻る</v-btn>
                <v-btn color="info"
                @click="updateBookInfo">保存する</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useBookStatus } from '@/composables/useBookStatus'
import { useBookEvaluation } from '@/composables/useBookEvaluation'

export default {
  name:'BookEdit',
  props:{
    books:Array
  },
  setup(props) {
    const route = useRoute()
    const id = Number(route.params.id)
    const { statusList } = useBookStatus()
    const { evalList } = useBookEvaluation()
    const book = ref(props.books.find(b => b.id === id))

    const date = ref(book.value?.readDate ?? new Date().toISOString().substr(0, 10))
    const menu = ref(false)
    const { formatDate } = useDateFormatter()
    return {
      book,
      date,
      menu,
      formatDate,
      statusList,
      evalList,
    }
  },
  methods:{
    updateBookInfo(){
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
    },

    onDateSelected(value) {
      this.menu = false
      this.book.readDate = this.formatDate(value)
      this.date = this.book.readDate
    },
  },

}
</script>

<style>

</style>
