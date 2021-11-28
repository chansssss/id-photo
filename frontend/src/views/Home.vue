<template>
  <div class="home-box">
    <div class="header-filter">
      <van-field v-model="keyWords" placeholder="输入关键字检索"  @input="$delay(() => {search()}, 500)"/>
    </div>
    <div class="photo-list">
      <div
        class="photo-item row-between-center"
        v-for="(item, index) in list"
        :key="index"
        @click="genPhoto(item)"
      >
        <div class="left">
          <p class="title">{{ item.name }}</p>
        </div>
        <div class="right">
          <p class="desc">{{ item.width }} * {{ item.height }}</p>
        </div>
      </div>
    </div>
    <div class="bottom-wrap">
      <van-button color="#7232dd" plain>声明</van-button>
      <van-button
        color="#7232dd"
        plain
        @click="openSetting"
        class="margin-left-10"
      >
        设置
      </van-button>
      <van-button
        class="margin-left-10"
        style="flex: 1;"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
      >
        自定义
      </van-button>
    </div>
  </div>
</template>

<script>
import id_photos from "@/config/id_photos";
export default {
  data() {
    return {
      inputApiKeyVisible: true,
      cameraVisible: false,
      removeBgKey: "",
      keyWords: "",
      list: id_photos,
    };
  },
  created() {
    if (!localStorage.getItem("SETTING")) {
      let options = {
        apiKey: "",
      };
      localStorage.setItem("SETTING", JSON.stringify(options));
    }
  },
  methods: {
    search(){
      if (!this.keyWords) {
        this.list = id_photos
        return
      }
      this.list = this.list.filter(item=>{
        return item.name.indexOf(this.keyWords) !== -1
      })
    },
    genPhoto(option) {
      localStorage.setItem("PHOTO_OPTION", JSON.stringify(option));
      this.$router.push("/photo");
    },
    openSetting() {
      this.$router.push("/setting");
    },
    open(){
      this.$router.push("/compressor");
    }
  },
};
</script>

<style scoped>
.home-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.photo-list {
  height: calc(100vh - 100px);
  overflow: auto;
}
.photo-item {
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}
.title {
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
.desc {
  font-size: 12px;
  color: #9b9b9b;
}
.header-filter {
  border-radius: 5px;
}
</style>