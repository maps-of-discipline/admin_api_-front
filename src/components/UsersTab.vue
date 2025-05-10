<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">{{ service.verbose_name }}
        <div class="px-2">
          <v-btn icon @click="return" color="success">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-data-table :headers="headers" :items="filteredUsers" :loading="loading" :items-per-page="itemsPerPage"
        :page="page" :total-items="totalItems" @update:page="onPageChange" @update:items-per-page="onItemsPerPageChange"
        items-per-page-text="Элементов на странице" class="elevation-1">
        <template #item.fio="{ item }">
          {{ item.surname }} {{ item.name }} {{ item.patronymic }}
        </template>
        <template #item.actions="{ item }">
          <td class="actions-cell">
            <v-btn icon @click="openEditUserDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="return" color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
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
    search: {
      type: String,
      default: "",
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
        { title: 'Действия', value: 'actions', sortable: false, width: '150px' },
      ],
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      ...useToast(),

    };
  },
  computed: {
    filteredUsers(): User[] {
      if (!this.search.trim()) return this.users;
      const term = this.search.toLowerCase();
      return this.users.filter(user =>
        user.surname.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.login.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    },
  },
  watch: {
    'service': {
      handler: 'getServiceUsersData',
      immediate: true,
    },
  },
  methods: {
    onPageChange(page: number) {
      this.page = page;
      this.getServiceUsersData();
    },
    onItemsPerPageChange(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.getServiceUsersData();
    },
    async getServiceUsersData() {
      if (!this.service.name) {
        return;
      }
      try {
        const response = await getServiceUsers({ id: "", name: this.service.name, verbose_name: "" },
          this.page,
          this.itemsPerPage);
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

<style scoped>
.actions-cell {
  white-space: nowrap;
  display: flex;
  gap: 8px;
}

.v-data-table td {
  padding: 8px;
}
</style>
