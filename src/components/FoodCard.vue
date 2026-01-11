<script setup>
defineProps({
  name: String,
  emoji: String
})
</script>

<template>
  <v-card class="mx-auto" variant="tonal">
    <v-card-text class="text-h4">{{ emoji }}</v-card-text>
    <v-card-title>{{ name }}</v-card-title>
  </v-card>
</template>


<style scoped>
.card {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  font-size: 2rem;
  padding: 16px;
  cursor: pointer;
}
</style>
