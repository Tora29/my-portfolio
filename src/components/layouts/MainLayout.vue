<template>
  <div class="container">
    <Header />
    <div class="grid">
      <Main>
        <slot></slot>
      </Main>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header.vue';
import Main from './Main.vue';
import Footer from './Footer.vue';

export default {
  name: 'MainLayout',
  components: {
    Header,
    Main,
    Footer
  }
}
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
}
</style>
