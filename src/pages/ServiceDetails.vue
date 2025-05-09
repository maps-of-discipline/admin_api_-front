<template>
  <div class="container">
    <div class="search-wrapper">
      <v-text-field ref="searchInput" v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Поиск"
        density="comfortable" variant="solo" flat rounded hide-details class="search-field mt-3">
        <!-- ctrl+k -->
      </v-text-field>
    </div>

    <!-- Информация о проекте-->
    <v-container fluid>
      <!-- Меню -->
      <v-tabs v-model="selectedTab" background-color="transparent" grow>
        <v-tab @click="goBack">
          <v-icon start>mdi-arrow-left</v-icon>
          Назад
        </v-tab>
        <v-tab value="users">Пользователи</v-tab>
        <v-tab value="roles">Роли</v-tab>
        <v-tab value="permissions">Права доступа</v-tab>
        <v-tab value="settings">Настройки</v-tab>
        <v-tab value="requests">Заявки</v-tab>
      </v-tabs>

      <!-- Динамический контент по табу -->
      <div class="content">
        <component :is="currentTabComponent" :service="service" @update:service="updateServiceData" />
      </div>
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
import { type Service } from "../interfaces/service";
import { getServiceDataForm } from "../forms/serviceForms";
import { useToast } from "../composable/useToast";
import { getService } from "../services/service";
import UsersTab from "../components/UsersTab.vue";
import RolesTab from "../components/RolesTabs.vue";
import PermissionsTab from "../components/PermissionsTab.vue";
import SettingsTab from "../components/SettingsTab.vue";

export default defineComponent({
  name: "ProjectDetailsPage",
  props: {
    serviceId: {
      type: String,
      required: true,
    },
  },
  components: {
    UsersTab,
    RolesTab,
    PermissionsTab,
    SettingsTab,
    // RequestsTab,
  },
  data() {
    return {
      search: "",
      selectedTab: "users",
      service: getServiceDataForm(),
      ...useToast(),
    }
  },
  computed: {
    currentTabComponent() {
      const map: Record<string, string> = {
        users: "UsersTab",
        roles: "RolesTab",
        permissions: "PermissionsTab",
        settings: "SettingsTab",
        requests: "RequestsTab",
      };
      return map[this.selectedTab] || "UsersTab";
    },
  },
  mounted() {
    this.getServiceData()
  },
  methods: {
    async getServiceData() {
      try {
        const response = await getService({ id: this.serviceId, name: "", verbose_name: "" });
        if (response.success) {
          this.service = response.data as Service
          document.title = `${this.service.verbose_name} | Админ API`
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
    },
    updateServiceData(updatedService: Service) {
      this.service = updatedService;
    },
    goBack() {
      this.$router.push('/')
    },
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
</style>
