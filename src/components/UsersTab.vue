<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">{{ service.verbose_name }}
        <div class="px-2">
          <v-btn icon @click="return" color="success" density="comfortable">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-data-table-server :items-length="String(totalItems)" :headers="headers" :items="filteredUsers"
        :loading="loading" :items-per-page="itemsPerPage" :page="page" @update:page="onPageChange"
        @update:items-per-page="onItemsPerPageChange" items-per-page-text="Элементов на странице"
        :items-per-page-options="[5, 10, 100]" class="elevation-1">
        <template #item.fio="{ item }">
          {{ item.surname }} {{ item.name }} {{ item.patronymic }}
        </template>
        <template #item.actions="{ item }">
          <td class="actions-cell">
            <v-btn icon @click="openEditUserDialog(item)" density="comfortable">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="return" color="error" density="comfortable">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template #no-data>
          <v-alert type="info">
            Нет пользователей для отображения.
          </v-alert>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>

  <!-- Диалог редактирования ролей у пользователя -->
  <v-dialog v-model="editDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h6">Редактирование пользовательских ролей</v-card-title>
      <v-container class="pt-0">
        <p class="text-subtitle-1 font-weight-bold pb-2 ">Роли:</p>
        <!-- Поиск по правам доступа -->
        <v-text-field v-model="roleSearch" label="Поиск ролей" prepend-inner-icon="mdi-magnify" outlined dense
          class="mb-2 px-4" />
        <v-skeleton-loader v-if="loadingRoles" type="list-item-three-line" />
        <div v-else style="max-height: 300px; overflow-y: auto;" class="px-4">
          <div v-for="role in filteredRoles" :key="role.id">
            <!-- Разделитель -->
            <v-divider></v-divider>
            <div class="ml-4 d-flex align-center">
              <!-- Название -->
              <span class="text-body-1" style="flex-grow: 1; display: flex; align-items: center;">
                {{ role.verbose_name || role.role }}
              </span>
              <!-- переключатель -->
              <v-switch style="height: 56px;" :model-value="userRoles[role.id!]"
                @update:model-value="(val) => handleRoleToggle(role.id!, val!)" color="primary" />
            </div>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>

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
import { getServiceUsers, getServiceUserRoles, assingServiceUserRole, revokeServiceUserRole } from '../services/user';
import { getServiceRoles } from '../services/role';
import { useToast } from "../composable/useToast";
import type { Service } from '../interfaces/service';
import type { User } from '../interfaces/user';
import type { Role } from '../interfaces/role';
import type { UserRole } from '../interfaces/user_role';

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
        { title: 'Статус', value: 'role', sortable: true },
        { title: 'Действия', value: 'actions', sortable: false, width: '150px' },
      ],
      roleSearch: '',
      roles: [] as Role[],
      userRoles: {} as Record<string, boolean>,
      userRoleMap: {} as Record<string, string>,
      editDialog: false,
      editedUser: {} as User,
      loadingRoles: false,
      page: 1,
      itemsPerPage: 5,
      totalItems: 0 as Number,
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
        user.login!.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    },
    filteredRoles() {
      if (!this.roleSearch.trim()) return this.roles;
      const term = this.roleSearch.toLowerCase();
      return this.roles.filter(role =>
        role.role.toLowerCase().includes(term) ||
        role.verbose_name.toLowerCase().includes(term)
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
      this.page = 1
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
          this.totalItems = response.total as Number
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
    },
    async openEditUserDialog(user: User) {
      this.editedUser = { ...user };
      this.editDialog = true;
      await this.loadServiceRoles();
      await this.loadUserRoles();
    },
    async loadServiceRoles() {
      this.loadingRoles = true;
      if (!this.service.name) return;
      try {
        const response = await getServiceRoles({ id: "", name: this.service.name, verbose_name: "" },
          1,
          100);
        if (response.success) {
          this.roles = response.data as Role[];
        } else {
          this.showToast(response.error || 'Ошибка получения данных.', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе.', 'error');
      } finally {
        this.loadingRoles = false;
      }
    },
    async loadUserRoles() {
      this.loadingRoles = true;
      try {
        const response = await getServiceUserRoles(this.editedUser, this.service);
        if (response.success) {
          const assigned = response.data as UserRole[];
          const assignedIds = new Set(assigned.map(r => r.service_roles_id));
          const rolesState: Record<string, boolean> = {};
          const roleMap: Record<string, string> = {};
          for (const role of this.roles) {
            rolesState[role.id!] = assignedIds.has(role.id!);
          }
          for (const r of assigned) {
            roleMap[r.service_roles_id] = r.id;
          }
          this.userRoles = rolesState;
          this.userRoleMap = roleMap;
        } else {
          this.showToast(response.error || 'Ошибка загрузки ролей пользователя', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе ролей пользователя', 'error');
      } finally {
        this.loadingRoles = false;
      }
    },
    async handleRoleToggle(service_roles_id: string, value: boolean) {
      this.userRoles[service_roles_id] = value;
      try {
        if (value) {
          const response = await assingServiceUserRole({ id: service_roles_id, role: '', verbose_name: '', service_id: '' }, { id: this.editedUser.id, email: '', name: '', patronymic: '', role: '', surname: '' });
          if (response.success) {
            const newUserRole = response.data as UserRole | undefined;
            if (newUserRole && newUserRole.id) {
              this.userRoleMap[service_roles_id] = newUserRole.id;
            } else {
              await this.loadUserRoles();
            }
          } else {
            this.showToast(response.error || 'Ошибка назначения роли', 'error');
            this.userRoles[service_roles_id] = false;
          }
        } else {
          const userRoleId = this.userRoleMap[service_roles_id];
          if (!userRoleId) {
            this.showToast('Не найдена роль для удаления', 'error');
            this.userRoles[service_roles_id] = true;
            return;
          }
          const response = await revokeServiceUserRole({ id: userRoleId, service_roles_id: '', user_id: '' });
          if (!response.success) {
            this.showToast(response.error || 'Ошибка удаления роли', 'error');
            this.userRoles[service_roles_id] = true;
          }
        }
      } catch (error) {
        this.showToast('Ошибка при выполнении запроса', 'error');
        this.userRoles[service_roles_id] = !value;
      }
    },
  }
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
