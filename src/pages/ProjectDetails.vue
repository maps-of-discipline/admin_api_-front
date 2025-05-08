<template>
  <div class="container">
    <div class="search-wrapper">
      <v-text-field ref="searchInput" v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Поиск"
        density="comfortable" variant="solo" flat rounded hide-details class="search-field mt-2">
        <!-- ctrl+k -->
      </v-text-field>
    </div>
    <h1 class="mt-2">Проект ID: {{ projectId }}</h1>
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
  data() {
    return {
      search: "",
    }
  },
  mounted() {
    console.log("Проект ID:", this.projectId);
    // Здесь вы можете использовать projectId, чтобы загрузить данные проекта
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100vh;
}

.search-wrapper {
  width: 100%;
  max-width: 600px;
  padding: 0 18px;
}

.search-field {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.153);
  border-radius: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
  padding-left: 12px;
}
</style>
