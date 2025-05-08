<template>
  <SplashScreen v-if="showSplash" @finished="onSplashFinished" />
  <div v-else class="container">
    <div class="search-wrapper">
      <v-text-field ref="searchInput" v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Поиск"
        density="comfortable" variant="solo" flat rounded hide-details class="search-field mt-2">
        <!-- ctrl+k -->
      </v-text-field>
    </div>

    <!-- список проектов -->
    <v-container class="projects-section" fluid>
      <h2 class="section-title">Ваши проекты</h2>
      <v-row>
        <v-col v-for="project in filteredProjects" :key="project.id" cols="6" sm="4" md="4" lg="3"
          @click="handleProjectClick(project)">
          <v-card class="project-card" rounded="xl">
            <v-card-text class="text-center">
              <v-avatar class="mb-3" size="48" color="primary" variant="tonal">
                <v-icon>mdi-briefcase-outline</v-icon>
              </v-avatar>
              <div class="project-title">{{ project.verbose_name }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import SplashScreen from "@/components/SplashScreen.vue";

interface Project {
  id: string | number;
  name: string;
  verbose_name: string;
}

export default defineComponent({
  name: "UserManagementPage",
  components: {
    SplashScreen,
  },
  data() {
    return {
      showSplash: true,
      search: "",
      projects: [] as Project[],
    };
  },
  computed: {
    filteredProjects(): Project[] {
      const query = this.search.toLowerCase().trim();
      return this.projects.filter(project =>
        project.verbose_name.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/services/filters`, {});
        this.projects = response.data.data.map((project: { id: any; name: any; verbose_name: any; }) => ({
          id: project.id,
          name: project.name,
          verbose_name: project.verbose_name,
        }));
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
        alert("Ошибка загрузки данных! Пожалуйста, попробуйте снова.");
      }
    },
    onSplashFinished() {
      this.showSplash = false;
    },
    handleProjectClick(project: Project) {
      this.$router.push(`/project/${project.id}`);
    },
  }
});
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100vh;
  /* padding-top: 80px; */
}

.search-wrapper {
  width: 100%;
  max-width: 600px;
  padding: 0 18px;
}

.search-field {
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.153);
  border-radius: 18px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
  padding-left: 12px;
}

/* для ctrl+k */
/* .shortcut {
  display: flex;
  gap: 4px;
  align-items: center;
  padding-right: 8px;
}
.key {
  font-size: 12px;
  padding: 2px 6px;
  background: #f3f3f3;
  border-radius: 4px;
  font-weight: 500;
  color: #444;
  border: 1px solid #ddd;
} */

.project-card {
  min-height: 180px;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.153);
}

.project-card:hover {
  background-image: linear-gradient(to bottom, #66a1e56c, white);
}

.project-card .v-card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  transition: transform 0.3s;
}

.project-card:hover .v-avatar {
  box-shadow: 0 2px 8px rgba(216, 215, 215, 0.153);
}

.project-card .v-avatar,
.project-card .project-title {
  transition: transform 0.3s;
}

.project-card:hover .v-avatar,
.project-card:hover .project-title {
  transform: translateY(18px);
}

.project-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  word-break: break-word;
}

.project-card .v-avatar {
  transition: transform 0.3s ease, background-color 0.3s ease;
}
</style>
