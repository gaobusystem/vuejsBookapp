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
              <div class="">
                <v-card-title>
                    タイトル：
                  <!-- 表示モード -->
                  <span v-if="!isEditingTitle" @click="isEditingTitle = true" style="cursor: pointer;">
                    {{ book.title }}
                    <v-icon size="16" class="ml-1">mdi-pencil</v-icon>
                    <!-- ★ここにエラー表示を追加 -->
                      <div v-if="v$.title.$error" style="color: red; font-size: 12px;">
                        {{ v$.title.$errors[0].$message }}
                      </div>
                  </span>

                  <!-- 編集モード -->
                  <div v-else>
                    <v-text-field
                      v-model="book.title"
                      density="compact"
                      :error-messages="v$.title.$errors.map(e => e.$message)"
                      style="max-width: 250px"
                      @keyup.enter="isEditingTitle = false"
                    />
                    <v-btn size="small" color="primary" @click="isEditingTitle = false">OK</v-btn>
                    <v-btn size="small" @click="isEditingTitle = false">キャンセル</v-btn>
                  </div>
                </v-card-title>
              </div>

            <div>id：{{ book.id }}　isbn：{{ book.isbn }}</div>
            <div>シリーズ：{{ book.titleKana }}</div>
            <div>出版社：{{ book.publisher }}</div>
            <div>発売日：{{ book.publishedDate }}</div>

            <v-row class="mt-2" align="center">
              <v-col cols="6">
                <v-text-field
                  v-model.number="book.maxVolume"
                  type="number"
                  label="最新巻"
                  :error-messages="v$.maxVolume.$errors.map(e => e.$message)"
                  density="compact"
                  style="max-width: 150px"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model.number="book.readVolume"
                  type="number"
                  label="読んだ巻"
                  :error-messages="v$.readVolume.$errors.map(e => e.$message)"
                  density="compact"
                  style="max-width: 150px"
                />
              </v-col>
            </v-row>

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
 // バリデーションメッセージ
import { requiredMessage, minValMessage } from '@/plugins/validatorMessage.js';
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
    const isEditingTitle = ref(false)

    const book = reactive({
      ...original
    })

    const date = ref(book.readDate ?? new Date().toISOString().substr(0, 10))
    const menu = ref(false)
    const { formatDate } = useDateFormatter()
    // --- Vuelidate rules ---
    const rules = computed(() => ({
      title: {
        required: helpers.withMessage(requiredMessage("タイトル"), required),
      },
      maxVolume: {
        required: helpers.withMessage(requiredMessage("最新巻"), required),
        minValue: helpers.withMessage(minValMessage('最新巻',1), minValue(1)),
      },
      readVolume: {
        required: helpers.withMessage('読んだ巻は必須です', required),
        minValue: helpers.withMessage(minValMessage('読んだ巻',0), minValue(0)),
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
      isEditingTitle,
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
