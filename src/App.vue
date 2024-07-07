<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeView from "./views/HomeView.vue";

export default defineComponent({
  components: {
    HomeView,
  },
});
</script>
