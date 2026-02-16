import { defineStore } from 'pinia';
import  axios  from 'axios'
import  apiClient  from '@/api/axios'

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
        setAuth({ user, token}){
            this.user = user;
            this.token = token;
            localStorage.getItem('authToken', token);
            if(user){
                localStorage.getItem('authUser', JSON.stringify(user));
            }
        },
        checkAuth(){
            const token = localStorage.getItem('authToken');
            const userJson = localStorage.getItem('authUser');
            if(token && userJson){
                try{
                    const user = JSON.parse(userJson);
                    this.user = user;
                    this.token = token;
                    console.log('Auth state restored from localStroge')
                } catch(e){
                    console.log('Login failed:', e)
                    this.logout();
                }finally{
                    this.logout();
                }
            }
        },
        async login(credentials){ // {{email, password}
            this.isLoading = true;
            this.error = null;
            try{
                const response = await apiClient.post('/token', credentials);
                // FastAPIのOAuth2では　{access_token:'...',tokentype:'bearer',...,user_info:{...}}
                const { access_token, user_info} = response.data;
                this.setAuth({user:user_info, token:access_token})

             //   localStorage.setItem('authToken', access_token)

                console.log('Login successful!')
                return true;
            } catch(err){
                console.log('Login failed:', err)
                this.error = err;
                this.logout();
                // 保存したトークンがあれば削除
             //   localStorage.removeItem('authToken')
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
            localStorage.removeItem('authUser');
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
