<template functional>
  <transition :name="'van-slide-'+props.position">
    <div class="pupop" :style="{background:props.background?props.background:'#fff'}" v-show="props.show">
      <slot></slot>
    </div>
  </transition>
</template>

<style scoped>
.pupop{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: #fff;
}
</style>