<template>
  <div class="card">
    <img :src="imageSrc" :alt="imageAlt" class="card-image">
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p v-html="description"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftImageCard',
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    imageAlt: {
      type: String,
      default: 'Card image'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  /* グリッドデザイン設定 */
  display: grid;
  grid-template-columns: 4fr 8fr;
  
  /* 枠線設定 */
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
}

.card-image {
  width: 90%;
  height: auto;
}

.card-content {
  padding: 16px;
}

.card-content h3 {
  margin: 0;
  font-size: 1.5em;
}

.card-content p {
  margin: 8px 0 0;
}
</style>
