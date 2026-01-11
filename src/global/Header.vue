<template>
  <v-app-bar
    color="gray accent-4"
    dark
  >
  <v-btn icon color="primary" to="/">
    <v-icon>mdi-home</v-icon>
  </v-btn>
  <v-toolbar-title>漫画管理</v-toolbar-title>
  <div class="flex-grow-1"></div>

  <v-btn icon>
    <v-icon>mdi-heart</v-icon>
  </v-btn>

  <v-btn icon color="primary" to="/search">
    <v-icon>mdi-magnify</v-icon>
  </v-btn>
  <div class="d-flex justify-space-around">

    <v-btn
      id="menu-activator"
      color="primary"

    >

            <svg-icon type="mdi" :path="path"></svg-icon>


    </v-btn>

    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
  </v-app-bar>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu } from '@mdi/js'
export default {
  name:'Header',
  components: { SvgIcon },

  methods:{
    deleteLocalStorage(){
      this.$emit('delete-local-storage')
    }
  },
  data: () => ({
    path: mdiMenu,
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: '初期データインポート' },
      { title: '登録データをクリア' },
    ],
  }),
}
</script>

<style></style>
