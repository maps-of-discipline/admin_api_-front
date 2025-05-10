<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ service.verbose_name }}</v-card-title>
      <v-data-table :headers="headers" :items="users" :loading="loading" items-per-page-text="Элементов на странице"
        class="elevation-1">
        <template #item.fio="{ item }">
          {{ item.surname }} {{ item.name }} {{ item.patronymic }}
        </template>
        <template #no-data>
          <v-alert type="info">
            Нет пользователей для отображения.
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
import { getServiceUsers } from '../services/user';
import { useToast } from "../composable/useToast";
import type { Service } from '../interfaces/service';
import type { User } from '../interfaces/user';

export default defineComponent({
  name: 'UsersTab',
  props: {
    service: {
      type: Object as () => Service,
      required: true,
    },
  },
  data() {
    return {
      users: [] as User[],
      loading: false,
      headers: [
        { title: 'ФИО', value: 'fio', sortable: false },
        { title: 'Логин', value: 'login', sortable: true },
        { title: 'Почта', value: 'email', sortable: true },
        { title: 'Роль', value: 'role', sortable: true },
      ],
      ...useToast(),

    };
  },
  watch: {
    'service': {
      handler: 'getServiceUsersData',
      immediate: true,
    },
  },
  methods: {
    async getServiceUsersData() {
      if (!this.service.name) {
        return;
      }
      try {
        const response = await getServiceUsers({ id: "", name: this.service.name, verbose_name: "" });
        if (response.success) {
          this.users = (response.data as User[]).map((user) => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            login: user.login,
            email: user.email,
            role: user.role,
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
