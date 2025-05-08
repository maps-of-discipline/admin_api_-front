<template>
  <div>
    <h1>Проект ID: {{ projectId }}</h1>
    <!-- Здесь можно отображать информацию о проекте -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProjectDetailsPage",
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  mounted() {
    console.log("Проект ID:", this.projectId);
    // Здесь вы можете использовать projectId, чтобы загрузить данные проекта
  },
});
</script>
