<template>
  <div class="header">
    <h1>tora29</h1>
    <nav>
      <ul>
        <li>
          <HomeIcon />
          <router-link to="/"> Home </router-link>
        </li>
        <li>
          <ProfileIcon />
          <router-link to="/profile"> Profile </router-link>
        </li>
        <li>
          <ContactIcon />
          <router-link to="/contact"> Contact </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import HomeIcon from "../icon/HomeIcon.vue";
import ProfileIcon from "../icon/ProfileIcon.vue";
import ContactIcon from "../icon/ContactIcon.vue";

export default {
  name: "Header",
  components: {
    HomeIcon,
    ProfileIcon,
    ContactIcon,
  },
};
</script>

<style scoped>
.header {
  /* グリッドデザイン設定 */
  grid-column: span 12;

  /* ヘッダー内の要素配置 */
  display: flex;
  align-items: center;

  /* ヘッダーの位置固定 */
  position: sticky;
  top: 0;
  z-index: 1;

  /* 要素の余白調整 */
  padding: 20px;

  background-color: #f8b0b0;
}

a:hover {
  /* router-link to="" は<a> でレンダリングされる */
  text-decoration: none;
}

.header nav {
  /* Header 内の要素を右寄せに */
  margin-left: auto;
}

.header ul {
  /* Header 内の要素を横並びに */
  display: flex;
}

.header ul li {
  /* li 要素の間隔調整 */
  margin-left: 20px;

  /* アイコンと文字を横並びに */
  display: flex;
}

ul {
  /* ul の点削除 */
  list-style: none;
}
</style>
