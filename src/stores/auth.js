import { defineStore } from 'pinia';
import  axios  from 'axios'

export const useAuthStore = defineStore('auth',  {
    state:() =>({
        user: null,
        token: null,
        isLoading: false,
        error: null, //認証エラー情報
    }),
    getters: {
        isAuthenticated: (state)=> !!state.user, // ログイン済みかどうか
        getUserName: (state)=> !!state.user?.name,//ユーザーがいなければnull
        getAuthToken: (state) => state.token,
    },
    actions: {
        checkAuth(){
            const token = localStorage.getItem('authToken');
            if(token){
                // トークンを使ってユーザー情報を取得または検証するAPI呼び出しなど
                // 例：this.fetchUserProfile(token)
                this.token = token; // 刈りでトークンをセット
                // 実際には、トークンが有効か確認し、ユーザー情報を取得する必要がある
                // this.user = { name: '復元ユーザー'};
                // 仮でユーザーをセット
                console.log('Auth state restored from localStroge')
            }
        },
        async login(credentials){ // {{email, password}
            this.isLoading = true;
            this.error = null;
            try{
                const response = await axios.post(baseUrl, credentials);
                const { access_token, user} = response.data;
                this.user = user;
                this.token = access_token;
                localStorage.setItem('authToken', access_token)

                console.log('Login successful!')
            } catch(err){
                console.log('Login failed:', err)
                this.error = err;
                this.user = null;
                this.token = null;
                // 保存したトークンがあれば削除
                localStorage.removeItem('authToken')
                throw err; // エラーを呼び出し元に伝える
            }finally{
                this.isLoading = false;
            }
        },
        logout(){
            this.user = null;
            this.token = null;
            // 保存したトークンがあれば削除
            localStorage.removeItem('authToken');
            console.log('Logged out')
        },
    },
});

// 使い方
// アプリケーション初期化でauthStore.checkAuth()を呼ぶ出して
// 以前のセッションからトークンを復元し、ログイン状態を再現できる
// べっだーや特定ぺージではauthStore.isAuthenticatedゲッターを使って表示を切り替える
// authStore.userからユーザー情報を表示
// ログインが必要なルートへのアクセス制限は、Vue Routerのナビゲーションガードと連携して行う
