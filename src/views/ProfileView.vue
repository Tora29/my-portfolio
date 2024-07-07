<template>
  <MainLayout>
    <template v-slot>
      <h3>Profile</h3>
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
import MainLayout from "../components/layouts/MainLayout.vue";
import LeftImageCard from "../components/modules/LeftImageCard.vue";
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
      formattedDescription: ""
    };
  },
  mounted() {
    this.formattedDescription = this.description.replace(/\n/g, '<br>');
  }
};
</script>

<style scoped>
h3 {
  text-align: center;
  padding-bottom: 12px;
}
</style>
