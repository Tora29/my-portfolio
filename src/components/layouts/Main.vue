<template>
  <div class="main">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Main'
}
</script>

<style scoped>
.main {
  background-color: #b0f8b0;
  grid-column: span 12;
  padding: 20px;
}
</style>
