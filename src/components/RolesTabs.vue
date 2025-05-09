<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ service.verbose_name }}</v-card-title>
      <v-data-table :headers="headers" :items="roles" :loading="loading" items-per-page-text="Элементов на странице"
        class="elevation-1">
        <template #no-data>
          <v-alert type="info">
            Нет ролей для отображения.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Toast -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="left" multi-line>
    {{ snackbarMessage }}
    <template #actions>
      <v-progress-linear color="black" height="2" absolute bottom />
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getServiceRoles } from '../services/role';
import { useToast } from "../composable/useToast";
import type { Service } from '../interfaces/service';
import type { Role } from '../interfaces/role';

export default defineComponent({
  name: 'RolesTab',
  props: {
    service: {
      type: Object as () => Service,
      required: true,
    },
  },
  data() {
    return {
      roles: [] as Role[],
      loading: false,
      headers: [
        { title: 'Название', value: 'verbose_name' },
        { title: 'Роль', value: 'role' },
      ],
      ...useToast(),

    };
  },
  watch: {
    'service': {
      handler: 'getServiceRolesData',
      immediate: true,
    },
  },
  methods: {
    async getServiceRolesData() {
      if (!this.service.name) {
        return;
      }
      try {
        const response = await getServiceRoles({ id: "", name: this.service.name, verbose_name: "" });
        if (response.success) {
          this.roles = (response.data as Role[]).map((role) => ({
            role: role.role,
            verbose_name: role.verbose_name,
          }));
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
    },
  },
});
</script>
