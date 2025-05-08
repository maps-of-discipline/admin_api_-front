<template>
  <div class="splash-screen" :class="{ fadeOut: isFadingOut }">
    <img
      src="/mospolytech_sublogo.png"
      alt="Логотип"
      class="logo"
      :class="{ nod: isNodding }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'SplashScreen',
  emits: ['finished'],
  setup(_, { emit }) {
    const isFadingOut = ref(false);
    const isNodding = ref(false);

    onMounted(() => {
      // ждать 1.5 сек
      setTimeout(() => {
        isNodding.value = true;

        // подождать пока "кивок" выполнится (0.5 сек)
        setTimeout(() => {
          isFadingOut.value = true;

          // подождать ещё 0.5 сек на fadeOut
          setTimeout(() => {
            emit('finished');
          }, 200);
        }, 500);
      }, 500);
    });

    return { isFadingOut, isNodding };
  },
});
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  background-color: var(--v-theme);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: opacity 0.5s ease;
  z-index: 9999;
}

.splash-screen.fadeOut {
  opacity: 0;
}

.logo {
  width: 80px;
  height: auto;
  transition: transform 0.3s ease;
}

.nod {
  animation: nodDownUp 0.5s ease-out;
}

@keyframes nodDownUp {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
