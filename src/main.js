import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import router from './router'
import apiClient from '@/api/axios'
import useAuthStore from '@/store/auth'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// ★ MDI を読み込む
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)
// グローバルなエラーハンドラーを設定
// VUeコンポーネントのライフサイクル内で発生した補足されないエラーを威厳的に管理
app.config.errorHandler = (err, instance, info)=>{
  console.error('Global Vue Error Handler Caught:', err);
  console.error('Component Instanse:', instance);
  console.error('Info:', info);

  // 本番環境では、エラー追跡サービス（例：Sentry）にエラーを報告する
  // Sentry.captureException(err, { extra: {info, component: instance?$._file}});

  //ユーザーにエラーが発生したことを示すUIを表示するなどの処理
  //例：グローバルなエラー通知ストアにエラー情報を渡す
  //useNotificationStore().showNotification('予期しないエラーが発生しました。'.'error')
};

const pinia = createPinia()
app.use(pinia)
app.use(router)
//app.use(store)
app.use(vuetify)

const authstore = useAuthStore();
authstore.checkAuth();// localStrogeから認証状態を復元

app.mount('#app')

//　アプリケーション起動後の処理（例：checkAuthが非同期の場合や、初回ロード時のユーザー情報所得など）
//router.isReady().then(()=>{
//  const authStore = useAuthStore();
//  if(authStore.isAuthenticated && !authStore.getUserName){
//    authStore.fetchUserProfile();// ユーザー情報を呼び出し
//  }
//});
