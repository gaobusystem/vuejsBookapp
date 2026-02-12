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
    },
    actions: {
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
