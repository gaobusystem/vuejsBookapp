<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-row>
            <v-col cols="4">
              <v-img :src="book.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title>
                タイトル：{{ book.title }}
              </v-card-title>
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
                    v-model="date"
                    readonly
                    v-bind="props"
                  />
                </template>

                <v-date-picker
                  v-model="date"
                  @update:model-value="menu = false"
                  locale="jp-ja"
                  :day-format="d => new Date(d).getDate()"
                />
              </v-menu>
              感想：<v-textarea
              class="mx-2" v-model="book.memo">
              {{book.memo }}
              </v-textarea>

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

export default {
  name:'BookEdit',
  props:{
    books:Array
  },
  setup(props) {
    const route = useRoute()
    const id = Number(route.params.id)

    const book = ref(props.books.find(b => b.id === id))

    const date = ref(book.value?.readDate ?? new Date().toISOString().substr(0, 10))
    const menu = ref(false)

    const updateBookInfo = () => {
      // emit は setup では使えないので Options API に移すか defineEmits を使う
    }

    return {
      book,
      date,
      menu,
    }
  },
  methods:{
    updateBookInfo(){
      this.$emit('update-book-info',{
        id: this.$route.params.id,
        readDate: this.date,
        memo: this.book.memo
      })
    }
  },

}
</script>

<style>

</style>
