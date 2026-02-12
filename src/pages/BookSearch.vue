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
import { useLoaderStore } from '@/stores/loader'
import { useNotificationStore } from '@/stores/notification'

import axios from 'axios'
import { ref } from 'vue'

const loader = useLoaderStore()
const notificationStore = useNotificationStore()
// -------------------------
// state
// -------------------------
const keyword = ref('')
const searchResults = ref([])
const items = ref([])
const error = ref(null)
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

  loader.hide()
  const queryParams = new URLSearchParams(params)
  console.log("url: " + baseUrl + queryParams)
  let res = null;
  try{
    // リクエスト インターセプターを追加します
    axios.interceptors.request.use(config=> {
        // リクエストが送信される前の処理
        const authToken = localStorage.getItem('authToken');
        if(authToken){
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        console.log("Request Interceptor:Sending request to", config.url)
        return config;
    }, error=> {
        // リクエスト エラーの処理
        console.error("Request Interceptor Error", error)
        return Promise.reject(error);
      },
    );

    // レスポンス インターセプターを追加します
    axios.interceptors.response.use(function onFulfilled(response) {
        // ステータスコードが 2xx の範囲にある場合、この関数が起動します
        // レスポンス データの処理
        return response;
      }, function onRejected(error) {
        // ステータスコードが 2xx の範囲外の場合、この関数が起動します
        // レスポンス エラーの処理
        return Promise.reject(error);
      });

    axios.interceptors.response.use(
      response => {
        // 2xx 成功時の共通処理
        console.log("Response Interceptor: Received response from", response.config.url, 'Status:', response.status)
        return response;
      },
      error => {
        // 4xx 5xx
        console.error("Response Interceptor Error: ", error.response ? error.response.status : error.message)
        const status = error.response ? error.response.status : null;

        switch (status) {
          case 400:
            console.warn('Bad Request');
            break;

          case 401:
            console.warn('Unauthorized');
            //認証トークンを削除する処理
            // const authStore = useAuthStore();
            // authStore.logout();
            localStorage.removeItem('authToken');
            // 例: ログインページへリダイレクト
            // window.location.href = '/login';
            // router.push('/login')
            // return Promise.reject(error);
            break;

          case 403:
            console.warn('Forbidden');
            break;

          case 404:
            console.warn('Not Found');
            break;

          case 419:
            console.warn('CSRF Token Expired');
            // 例: ページリロード
            // window.location.reload();
            break;

          case 422:
            console.warn('Validation Error');
            break;

          case 500:
            console.error('Server Error');
            break;

          default:
            console.error('Unknown Error');
        }

        // 個別の catch にも流す
        return Promise.reject(error);
      }
    );
    const response = await axios.get(baseUrl + queryParams)
    res = response.data;
    if(response.status === 200){
      console.log("データ取得成功(200 OK)", response.data)
    }else if(response.status === 204){
      console.log("データ取得成功 コンテンツなし(204 No Content)")
    }
  }catch(err){
    console.error('Failed to fetch items: ', err)
    if(axios.isAxiosError(error)&& error.response){
      const statusCode = error.response.status;
      const errorData = error.response.data;// バックエンドからのエラー詳細
      if(statusCode === 404){
        console.warn('リソースが見つかりません(404 Not Found)')
        alert('探しているデータは見つかりませんでした')
      }else if(statusCode === 403){
        console.warn('アクセス権限がありません(403 Forbidden)')
        alert('この操作を行う権限がありません')
      }else if(statusCode === 422){
        console.warn('入力値バリデーションエラー(422 Unprocessable)')
        alert('入力値バリデーションエラー', errorData.detail)
      }else if(statusCode >= 500){
        console.warn('サーバーエラーが発生しました', statusCode, errorData)
        alert('現在サービスに問題が発生しています。お時間をおいてサイドお試しください')
      }else{
        //その他の4xx　エラーなど
        console.warn('Client error: ', statusCode, errorData)
        alert('リクエストに失敗しました')
      }
    }else{
      //ネットワークエラーなど、レスポンスがない場合
      console.warn('Network or other error', error)
      alert('ネットワークエラーが発生しました')
    }
  }finally{
    loader.hide()
    notificationStore.showNotification('検索しました', 'info')
  }


  for (let book of res.Items) {
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
