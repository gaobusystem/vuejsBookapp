import axios from 'axios';

// import router from '@/router'; // リダイレクトに使用
import { useNotificationStore}} from '@/stores/notification'; // 通知に使用
// import { useAuthStore} from '@/stores/auth'; // 認証ストアに使用

const apiClient = axios.create({
    baseURL: 'Your api url',
    headers:{
        'Content-Type':'application/json',
    },
});

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

axios.interceptors.response.use(
    response => {
    // 2xx 成功時の共通処理
    console.log("Response Interceptor: Received response from", response.config.url, 'Status:', response.status)
    return response;
    },
    async error => {
    // 4xx 5xx
    console.error("Response Interceptor Error: ", error.response ? error.response.status : error.message)
    const status = error.response ? error.response.status : null;
    const notificationStore = useNotificationStore();

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
        notificationStore.showNotification('セッションの有効期限が切れました。再度ログインしてください', 'warning')
        break;

        case 403:
        console.warn('Forbidden(403)');
        notificationStore.showNotification('この操作を行う権限がありません', 'error')
        break;

        case 404:
        console.warn('Not Found(404)');
        notificationStore.showNotification('リソースが見つかりませんでした', 'error')
        break;

        case 419:
        console.warn('CSRF Token Expired');
        // 例: ページリロード
        // window.location.reload();
        break;

        case 422:
        console.warn('Validation Error(422)');
        const validationErrors = error.response.data.detail;
        if(validationErrors && Array.isArray(validationErrors)){
            const messages = validationErrors.map(err => `${err.loc.join(' > ')}: ${err.msg}`).join('\n');
             notificationStore.showNotification(`入力エラー:\n${messages}`, 'error', 5000); // 少し長く表示
             console.error('Validation details:', validationErrors);
        } else {
             notificationStore.showNotification('入力内容に問題があります。', 'error');
        }

        case 500:
        console.error('Server Error');
        notificationStore.showNotification('サーバーで問題が発生しました。時間をおいて再度お試しください。', 'error');
        break;

        default:
        console.error('Unknown Error');
        if (error.request) {
        // レスポンスがない場合 (ネットワークエラーなど)
        console.error('API Error: No response received', error.message);
        notificationStore.showNotification('ネットワークエラーが発生しました。接続を確認してください。', 'error');

        } else {
        // その他の予期しないエラー
        console.error('API Error: Unexpected error', error.message);
        notificationStore.showNotification('予期しないエラーが発生しました。', 'error');
        }
    }

    // 個別の catch にも流す
    return Promise.reject(error);
    }
);

export default apiClient;

// 使い方
// <script setup>
//import { ref, onMounted } from 'vue';
//import apiClient from '../api/axios'; // 作成した apiClient をインポート
//import { useNotificationStore } from '../stores/notification';

//const data = ref(null);
//const isLoading = ref(true);
// エラーハンドリングはインターセプターで行われるため、ここでは個別のエラー状態は不要な場合も多い
// const error = ref(null);

//const notificationStore = useNotificationStore();

//async function fetchData() {
//  isLoading.value = true;
  // error.value = null; // インターセプターで通知が表示されるため不要

//  try {
    // apiClient を使って API リクエスト
//    const response = await apiClient.get('/some-data');
//    data.value = response.data;
    // 成功時の通知は不要な場合が多いが、必要ならここで表示
    // notificationStore.showNotification('データの取得に成功しました！', 'success');
//  } catch (err) {
     // インターセプターでエラー通知やリダイレクトが行われるため、
     // ここでは特別な個別処理が必要な場合のみ catch する
//     console.log('Error caught in component (after interceptor):', err);
     // 例: 特定のデータがない場合の UI ハンドリングなど
     // error.value = err; // 個別エラー状態の更新
//  } finally {
//    isLoading.value = false;
//  }
//}

//onMounted(fetchData);
//</script>


