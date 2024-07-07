<template>
  <MainLayout>
    <template v-slot>
      <div>コンタクトのコンテンツ</div>
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
