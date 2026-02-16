<template>
    <button @click="handleLogout">ログアウト</button>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from '@/vue-router';

const authStore = useAuthStore();
const router = useRouter();

function handleLogout(){
    useAuthStore.logout();
    console.log('Logged out');
    router.push('/login');
}
</script>
