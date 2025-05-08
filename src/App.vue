<script setup lang="ts">
</script>

<template>
  <div class="container">
    <!-- Логотип -->
    <div class="logo">
      <img src="/mospolytech_logo.png" alt="Мосполитех Логотип" />
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  background-color: #fff;
  min-height: 100vh;
  padding-left: 8%;
  padding-right: 8%;
}
.logo {
  position: fixed;
  top: 10px;
  left: 20px;
}
.logo img {
  width: 180px;
  /* Ширина логотипа, можно настроить под нужный размер */
  height: auto;
}
</style>
