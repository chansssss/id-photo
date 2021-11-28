<template>
  <div class="aoe-cut-pic-box">
    <div class="cut-box">
      <vueCropper
        ref="cropper"
        :img="picObj"
        :high="false"
        :fixed="true"
        :enlarge="option.enlarge"
        :autoCrop="true"
        :fixedBox="true"
        :infoTrue="true"
        :canMoveBox="false"
        :outputSize="option.size"
        :outputType="option.outputType"
        :fixedNumber="fixedNumber"
      ></vueCropper>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 待裁切的图片对象，可以是url blob base64
    picObj:{
      type: [ String, Object ],
      required: true
    },
    // 输出图片的宽度（像素）
    outputWidth:{
      type: Number,
      default: 750
    },
    // 输出图片的类型 base64 file url
    outputType:{
      type: String,
      default: 'file'
    },
    // 裁切框的比例
    fixedNumber: {
      type: Array,
      default: ()=>{
        return [9,16];
      }
    }
  },
  data() {
    return {
      loading: true,
      loadMsg: '初始化中',
      interval: null,
      option:{
        url: require('@/assets/test.jpg'),
        size: 0.9,
        outputType: 'png',
        enlarge: 1
      }
    };
  },
  mounted(){
    this.interval = setInterval(() => {
      if (this.$refs.cropper.cropW) {
        this.option.enlarge = (this.outputWidth / this.$refs.cropper.cropW).toFixed(10);
        this.loading = false;
        clearInterval(this.interval);
        this.interval = null;
      }
    }, 100);
  },
  beforeDestroy(){
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    blobToFile(theBlob, fileName,fileType) {
      let files = new window.File([theBlob], fileName, {type: fileType});
      return files;
    },
    async clip() {
      this.loadMsg = '裁切中';
      this.loading = true;
      if (this.outputType === 'base64') {
        this.$refs.cropper.getCropData(data => {
          this.loading = false;
          this.$emit('getCutPic',data);
        });
      }

      if (this.outputType === 'file') {
        this.$refs.cropper.getCropBlob(blob => {
          this.loading = false;
          let file = this.blobToFile(blob, `pic-${new Date().getTime()}.jpg`, blob.type);
          this.$emit('getCutPic',file);
        });
      }
    }
  }
};
</script>
<style scoped>
.cut-box {
  height: 100%;
}
.aoe-cut-pic-box {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
