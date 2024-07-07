<template>
  <MainLayout>
    <template v-slot>
      <h3>Profile</h3>

      <!-- LeftImageCard コンポーネントにデータを渡す -->
      <LeftImageCard
        :imageSrc="tigerIcon"
        imageAlt="虎のアイコン"
        title="tora29"
        :description="formattedDescription"
      />
    </template>
  </MainLayout>
</template>

<script>
// コンポーネントのインポート
import MainLayout from "../components/layouts/MainLayout.vue";
import LeftImageCard from "../components/modules/LeftImageCard.vue";

// 定数インポート
import { PROFILE_DESCRIPTION } from "../constants/texts";

export default {
  name: "Home",
  components: {
    MainLayout,
    LeftImageCard,
  },
  data() {
    return {
      tigerIcon: require("@/assets/img/tiger_icon.png"),
      description: PROFILE_DESCRIPTION,

      // 改行を含むフォーマットされた説明文
      formattedDescription: "",
    };
  },
  mounted() {
    // description内の改行を<br>タグに変換してformattedDescription に設定
    this.formattedDescription = this.description.replace(/\n/g, "<br>");
  },
};
</script>

<style scoped>
h3 {
  text-align: center;
  padding-bottom: 12px;
}
</style>
