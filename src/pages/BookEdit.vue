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
                  <v-text-field
                    v-model.number="book.maxVolume"
                    type="number"
                    label="最新巻"
                    :error-messages="v$.maxVolume.$errors.map(e => e.$message)"
                    density="compact"
                    style="max-width: 150px"
                  />
                </div>
                <div class="mt-2">
                  <v-text-field
                    v-model.number="book.readVolume"
                    type="number"
                    label="読んだ巻"
                    :error-messages="v$.readVolume.$errors.map(e => e.$message)"
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
import { ref, reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, numeric, minValue, maxValue, helpers } from '@vuelidate/validators'
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
    const original = props.books.find(b => b.id === id)

    const book = reactive({
      ...original
    })

    const date = ref(book.readDate ?? new Date().toISOString().substr(0, 10))
    const menu = ref(false)
    const { formatDate } = useDateFormatter()
    // --- Vuelidate rules ---
const rules = computed(() => ({
  maxVolume: {
    required: helpers.withMessage('最新巻は必須です', required),
    minValue: helpers.withMessage('1以上の数値を入力してください', minValue(1)),
  },
  readVolume: {
    required: helpers.withMessage('読んだ巻は必須です', required),
    minValue: helpers.withMessage('1以上の数値を入力してください', minValue(0)),
    maxValue: helpers.withMessage(
      () => `読んだ巻は最新巻（${book.maxVolume}）以下で入力してください`,
      maxValue(Number(book.maxVolume))
    ),
  },
}))


    const v$ = useVuelidate(computed(() => rules), book)

    return {
      book,
      date,
      menu,
      formatDate,
      statusList,
      evalList,
      v$,
    }
  },
  methods:{
    async updateBookInfo() {
      const isValid = await this.v$.$validate()
      if (!isValid) {
        console.log("入力に誤りがあります")
        return
      }
      let endVolume = 0
      if(this.book.status == "完読"){
        endVolume= this.book.maxVolume
      }

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
