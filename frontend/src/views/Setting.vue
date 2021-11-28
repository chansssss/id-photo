<template>
  <div>
    <div class="doc-block__title">抠图API key</div>
    <van-field v-model="options.apiKey" label="API_KEY" />
    <div class="bottom-wrap">
      <van-button
        style="flex: 1"
        @click="save"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
      >
        保存
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        apiKey: "",
      },
    };
  },
  created() {
    if (localStorage.getItem("SETTING")) {
      this.options = JSON.parse(localStorage.getItem("SETTING"));
    }
  },
  methods: {
    save() {
      if (!this.options.apiKey) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "缺少API_KEY将不会调用api进行抠图处理",
          })
          .then(() => {
            // on close
            localStorage.setItem("SETTING", JSON.stringify(this.options));
            this.$router.push('/')
          })
          .catch(() => {
            // on cancel
          });
      }else{
          localStorage.setItem("SETTING", JSON.stringify(this.options));
          this.$router.push('/')
      }
    },
  },
};
</script>