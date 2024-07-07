<template>
  <div class="footer">© tora29</div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  /* グリッドデザイン設定 */
  grid-column: span 12;

  /* 要素の余白調整 */
  padding: 4px;

  /* 要素の位置調整 */
  text-align: center;

  /* フッターの位置固定 */
  position: sticky;
  bottom: 0;
  z-index: 1;

  background-color: #d3d3d3;
}
</style>
