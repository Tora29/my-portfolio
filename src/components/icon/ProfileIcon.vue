<template>
  <svg-icon type="mdi" class="icon" :path="path"></svg-icon>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiInformation } from "@mdi/js";

export default {
  name: "ProfileIcon",
  components: {
    SvgIcon,
  },
  data() {
    return {
      path: mdiInformation,
    };
  },
};
</script>

<style>
.icon {
  /* 微妙な位置調整 */
  margin: -1px 4px 0px 0px;
}
</style>
