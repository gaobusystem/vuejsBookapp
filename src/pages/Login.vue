<template>
    <div>
        <h1>ログイン</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">メールアドレス：</label>
                <input type="email" id="email" v-model="credentials.email" required>
            </div>
            <div>
                <label for="password">パスワード：</label>
                <input type="password" id="password" v-model="credentials.password" required>
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading? 'ログイン中...':'ログイン' }}
            </button>
            <p v-if="error" class="error-message">
                {{ error.message||'ログインに失敗しました。' }}
            </p>
        </form>
    </div>
</template>
<script setup>
import { reactive,ref } from 'vue';
import apiClient from '@/api/axios';
import { useAuthStore } from '@store/auth';
// ログイン成功後のリダイレクトに使用
import { useRouter, useRoute } from 'vue-router';

const credentials = reactive({
    email: ''
    password:''
});

const isLoading = ref(false);
const error = ref(null);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleLogin(){
    isLoading.value = true;
    error.value = null;
    try{
        const response = await apiClient.post('/token', credential);
        const { access_token, user_info } = response.data;
        authStore.setAuth({
            use: user_info,
            token: access_token
        });
        console.log('Login.successful!');
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
    } catch(err){
        console.log('Login.Login failed:!', err);
        error.value = err;
        // authStore.clearAuth();
    } finally{
        isLoading.value = false;
    }
}
</script>

<style scoped>
.error-massqge{
    color: red;
    margin-top: 10px;
}
</style>
