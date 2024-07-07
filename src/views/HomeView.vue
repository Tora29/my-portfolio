<template>
  <MainLayout>
    <template v-slot>
      <div>ホームページのコンテンツ</div>
    </template>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/layouts/MainLayout.vue';

export default {
  name: 'Home',
  components: {
    MainLayout,
  },
};
</script>
