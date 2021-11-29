<template>
  <div class="home">
    <cut-pic
      class="aoe-cut-pic-box"
      ref="cutPic"
      v-if="picFile"
      :outputWidth="photoOptions.width"
      :fixedNumber="[photoOptions.width, photoOptions.height]"
      :picObj="picFile"
      @getCutPic="getCutPic"
    ></cut-pic>
    <div class="setting">
      <div class="doc-block__title">背景</div>
      <van-radio-group v-model="outputOption.background" direction="horizontal">
        <van-radio :name="1">红底</van-radio>
        <van-radio :name="2">蓝底</van-radio>
        <van-radio :name="3">白底</van-radio>
      </van-radio-group>
    </div>
    <div class="bottom-wrap">
      <!-- <van-button color="#7232dd" plain @click="openPreviewModel"
        >预览</van-button
      > -->
      <van-button
        color="#7232dd"
        plain
        class="margin-left-10"
        @click="openSelectFile"
        >上传图片</van-button
      >
      <input
        v-show="false"
        type="file"
        name="file"
        id="fileSelect"
        accept="image/*"
        @change="fileChange"
      />
      <van-button
        class="margin-left-10"
        style="flex: 1"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="clipPic('confirm')"
      >
        确认
      </van-button>
    </div>
    <Pupop
      position="right"
      class="padding-30-0"
      background="#2c3e50"
      :show="previewVisible"
    >
      <div
        class="preview-box"
        :style="{
          width: photoOptions.width + 'px',
          height: photoOptions.height + 'px',
          background: backgroundMapper[outputOption.background],
        }"
      >
        <img class="preview-img" :src="output" alt="" srcset="" />
      </div>
    </Pupop>
    <Pupop
      position="right"
      class="padding-30-0"
      background="#2c3e50"
      :show="resultVisible"
    >
      <div
        class="preview-box"
        :style="{
          width: photoOptions.width + 'px',
          height: photoOptions.height + 'px',
        }"
      >
        <img class="preview-img" :src="resultUrl" alt="" srcset="" />
      </div>
    </Pupop>
    <van-overlay class="row-center" style="text-align: center" :show="loading">
      <van-loading size="24px" style="text-align: center; width: 100vw"
        >{{ loadMsg }}...</van-loading
      >
    </van-overlay>
  </div>
</template>

<script>
const LIMIT1M = 1 * 1024 * 1024;
export default {
  name: "Home",
  data() {
    return {
      outputOption: {
        background: 1,
        size: 10,
      },
      backgroundMapper:['','#FF0000','#438EDB','#FFFFFF'],
      picture: "",
      picFile: null,
      output: null,
      previewVisible: false,
      cameraVisible: false,
      resultVisible: false,
      photoOptions: {},
      loadMsg: "图片生成中",
      setting: {},
      loading: false,
      resultUrl: null,
      action: "preview",
    };
  },
  beforeRouteEnter(to, from, next) {
    if (localStorage.getItem("PHOTO_OPTION")) {
      next();
    } else {
      next("/photo");
    }
  },
  created() {
    this.picFile =
      localStorage.getItem("LAST_URL") || require("@/assets/test.png");
    this.photoOptions = JSON.parse(localStorage.getItem("PHOTO_OPTION"));
    document.title = this.photoOptions.name;
    this.setting = JSON.parse(localStorage.getItem("SETTING"));
  },
  mounted() {
    if (window.history && window.history.pushState) {
      window.addEventListener("popstate", this.closePopup, false);
    }
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.closePopup, false);
  },
  methods: {
    openSelectFile() {
      let dom = document.getElementById("fileSelect");
      dom.click();
    },
    async drawPicToCanvas(url) {
      // eslint-disable-next-line no-unused-vars
      let that = this;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = this.photoOptions.width;
      canvas.height = this.photoOptions.height;
      ctx.fillStyle = this.backgroundMapper[this.outputOption.background];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = async function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        that.resultUrl = canvas.toDataURL({ pixelRatio: 1 });
        that.loading = false;
        that.openResultModel();
      };
    },
    openCameraModel() {
      document.title = "拍照";
      history.pushState(null, null, document.URL);
      this.cameraVisible = true;
    },
    openPreviewModel() {
      document.title = "预览图";
      history.pushState(null, null, document.URL);
      this.clipPic("preview");
      this.previewVisible = true;
    },
    openResultModel() {
      document.title = "结果图";
      history.pushState(null, null, document.URL);
      this.resultVisible = true;
    },
    closePopup() {
      document.title = "生成证件照";
      if (this.previewVisible) {
        this.previewVisible = false;
        return;
      }
      if (this.resultVisible) {
        this.resultVisible = false;
        return;
      }
      if (this.cameraVisible) {
        this.cameraVisible = false;
        return;
      }
      this.$router.go(-1);
    },
    clipPic(action) {
      this.action = action;
      this.$refs.cutPic.clip();
    },
    async getCutPic(file) {
      this.output = await this.$file2Base64(file);
      if (this.action === "confirm") {
        this.loading = true;
        this.drawPicToCanvas(this.output);
      }
    },
    async fileChange() {
      this.loadMsg = "正在处理图片";
      this.loading = true;
      let dom = document.getElementById("fileSelect");
      if (dom.files[0]) {
        if (dom.files[0] >= LIMIT1M) {
          let tempFile = await this.$picCompressor(dom.files[0], 1);
          this.removeBg(tempFile);
        } else {
          this.removeBg(dom.files[0]);
        }
        dom.value = "";
      }
    },
    async removeBg(file) {
      let that = this;
      const formData = new FormData();
      formData.append("file", file, "test.jpg");
      let response = await this.axios({
        method: "post",
        url: "/removebg",
        data: formData,
        responseType: "arraybuffer",
        encoding: null,
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
      const byteArray = new Uint8Array(response.data);
      var reader = new FileReader();
      reader.readAsDataURL(new Blob([byteArray]));
      reader.onloadend = function () {
        that.picFile = reader.result;
        localStorage.setItem("LAST_URL", that.picFile);
        that.loading = false;
      };
    },
  },
};
</script>

<style scoped>
.row-center {
  display: flex;
  align-items: center;
}
.aoe-cut-pic-box {
  height: calc(100vh - 220px) !important;
}
.preview-box {
  margin: 50px auto;
  border: 1px solid gray;
}
.preview-img {
  width: 100%;
  height: 100%;
}
.setting {
  padding: 10px 30px;
}
.doc-block__title {
  padding: 15px 0 !important;
}
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #ee0a24;
  border-radius: 100px;
}
</style>
