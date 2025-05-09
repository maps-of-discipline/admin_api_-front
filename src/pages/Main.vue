<template>
  <SplashScreen v-if="showSplash" @finished="onSplashFinished" />
  <div v-else class="container">
    <div class="search-wrapper">
      <v-text-field ref="searchInput" v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Поиск"
        density="comfortable" variant="solo" flat rounded hide-details class="search-field mt-3">
        <!-- ctrl+k -->
      </v-text-field>
    </div>

    <!-- Список проектов -->
    <v-container fluid>
      <h2 class="section-title mt-4 mb-8 ml-3">ВАШИ ПРОЕКТЫ</h2>
      <v-row>
        <v-col v-for="service in filteredServices" :key="service.id" cols="6" sm="4" md="4" lg="3"
          @click="handleServiceClick(service)">
          <v-card class="service-card" rounded="xl">
            <v-card-text class="text-center">
              <v-avatar class="mb-3" size="48" color="primary" variant="tonal">
                <v-icon>mdi-briefcase-outline</v-icon>
              </v-avatar>
              <div class="service-title">{{ service.verbose_name }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Toast -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="left" multi-line>
      {{ snackbarMessage }}
      <template #actions>
        <v-progress-linear color="black" height="2" absolute bottom />
      </template>
    </v-snackbar>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import SplashScreen from "@/components/SplashScreen.vue";
import { type Service } from "../interfaces/service";
import { useToast } from "../composable/useToast";
import { getServices } from "../services/service";

export default defineComponent({
  name: "UserManagementPage",
  components: {
    SplashScreen,
  },
  data() {
    return {
      showSplash: true,
      search: "",
      services: [] as Service[],
      ...useToast(),
    };
  },
  computed: {
    filteredServices(): Service[] {
      const query = this.search.toLowerCase().trim();
      return this.services.filter(service =>
        service.verbose_name.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.fetchServices();
  },
  methods: {
    async fetchServices() {
      try {
        const response = await getServices();
        if (response.success) {
          this.services = (response.data as Service[]).map((service) => ({
            id: service.id,
            name: service.name,
            verbose_name: service.verbose_name,
          }));
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
    },
    onSplashFinished() {
      this.showSplash = false;
    },
    handleServiceClick(service: Service) {
      this.$router.push(`/service/${service.id}`);
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
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  line-height: normal;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  color: #000000;
  --v-btn-size: 0.875rem;
  --v-btn-height: 36px;
  font-size: var(--v-btn-size);
}


.service-card {
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
  background-color: var(--v-theme);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.153);
}

.service-card:hover {
  background-image: linear-gradient(to bottom, #66a1e56c, white);
}

.service-card .v-card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  transition: transform 0.3s;
}

.service-card:hover .v-avatar {
  box-shadow: 0 2px 8px rgba(216, 215, 215, 0.153);
}

.service-card .v-avatar,
.service-card .service-title {
  transition: transform 0.3s;
}

.service-card:hover .v-avatar,
.service-card:hover .service-title {
  transform: translateY(18px);
}

.service-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--v-theme);
  word-break: break-word;
}

.service-card .v-avatar {
  transition: transform 0.3s ease, background-color 0.3s ease;
}
</style>
