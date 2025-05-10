<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        {{ service.verbose_name }}
        <div class="px-2">
          <v-btn icon @click="openCreateRoleDialog" color="success" density="comfortable">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-data-table-server :items-length="String(totalItems)" :headers="headers" :items="filteredRoles"
        :loading="loading" :items-per-page="itemsPerPage" :page="page" @update:page="onPageChange"
        @update:items-per-page="onItemsPerPageChange" items-per-page-text="Элементов на странице"
        :items-per-page-options="[5, 10, 100]" class="elevation-1">
        <template #item.actions="{ item }">
          <td class="actions-cell">
            <v-btn icon @click="openEditRoleDialog(item)" density="comfortable">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="openDeleteRoleDialog(item)" color="error" density="comfortable">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template #no-data>
          <v-alert type="info">Нет ролей для отображения.</v-alert>
        </template>
      </v-data-table-server>

    </v-card>
  </v-container>

  <!-- Диалог создания роли -->
  <v-dialog v-model="createDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Создание новой роли</v-card-title>
      <v-card-text>
        <v-form ref="createForm" v-model="createFormValid">
          <v-text-field v-model="newRole.role" label="Название" outlined :rules="[nameRule]" />
          <v-text-field v-model="newRole.verbose_name" label="Отображаемое имя" outlined :rules="[verboseNameRule]" />
        </v-form>
      </v-card-text>
      <!-- Кнопки -->
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!createFormValid" @click="submitCreateForm">Создать</v-btn>
        <v-btn @click="createDialog = false">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Диалог редактирования роли -->
  <v-dialog v-model="editDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h6">Редактирование роли</v-card-title>
      <v-container class="pt-0">
        <v-form ref="editForm" v-model="editFormValid" class="pl-4">
          <div class="d-flex flex-row" style="gap: 16px;">
            <v-text-field v-model="editedRole.role" label="Название" outlined :rules="[nameRule]" class="flex-grow-1" />
            <v-text-field v-model="editedRole.verbose_name" label="Отображаемое имя" outlined :rules="[verboseNameRule]"
              class="flex-grow-1" />
            <!-- Кнопки -->
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" :disabled="!editFormValid" @click="submitEditForm">Сохранить</v-btn>
              <v-btn @click="editDialog = false">Отмена</v-btn>
            </v-card-actions>
          </div>
        </v-form>
        <p class="text-subtitle-1 font-weight-bold pb-2 ">Права доступа:</p>
        <!-- Поиск по правам доступа -->
        <v-text-field v-model="permissionSearch" label="Поиск прав" prepend-inner-icon="mdi-magnify" outlined dense
          class="mb-2 px-4" />
        <v-skeleton-loader v-if="loadingPermissions" type="list-item-three-line" />
        <div v-else style="max-height: 300px; overflow-y: auto;" class="px-4">
          <div v-for="perm in filteredPermissions" :key="perm.id">
            <!-- Разделитель -->
            <v-divider></v-divider>
            <div class="ml-4 d-flex align-center">
              <!-- Название -->
              <span class="text-body-1" style="flex-grow: 1; display: flex; align-items: center;">
                {{ perm.verbose_name || perm.title }}
              </span>
              <!-- переключатель -->
              <v-switch style="height: 56px;" :model-value="rolePermissions[perm.id!]"
                @update:model-value="(val) => handlePermissionToggle(perm.id!, val!)" color="primary" />
            </div>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>

  <!-- Диалог удаления роли -->
  <v-dialog v-model="deleteDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Подтвердите удаление</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить роль:
        <strong>{{ roleToDelete?.verbose_name }}</strong>?
      </v-card-text>
      <!-- Кнопки -->
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="deleteRoleConfirmed">Удалить</v-btn>
        <v-btn @click="deleteDialog = false">Отмена</v-btn>
      </v-card-actions>
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
import { getServiceRoles } from '../services/role';
import { useToast } from "../composable/useToast";
import type { Service } from '../interfaces/service';
import type { Role } from '../interfaces/role';
import type { Permission } from '../interfaces/permission';
import type { RolePermission } from '../interfaces/rolePermission';
import {
  createServiceRole,
  updateServiceRole,
  deleteServiceRole,
} from '../services/role';
import {
  getServicePermissions,
  getServiceRolePermissions,
  assingServiceRolePermission,
  revokeServiceRolePermission,
} from '../services/permission';

export default defineComponent({
  name: 'RolesTab',
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
      roles: [] as Role[],
      loading: false,
      headers: [
        { title: 'Название', value: 'verbose_name', sortable: true },
        { title: 'Роль', value: 'role', sortable: true },
        { title: 'Действия', value: 'actions', sortable: false, width: '150px' },
      ],
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      createFormValid: false,
      editFormValid: false,
      newRole: {} as Role,
      editedRole: {} as Role,
      roleToDelete: null as Role | null,
      permissions: [] as Permission[],
      rolePermissions: {} as Record<string, boolean>,
      loadingPermissions: false,
      permissionSearch: '',
      page: 1,
      itemsPerPage: 5,
      totalItems: 0 as Number,
      ...useToast(),

    };
  },
  computed: {
    nameRule() {
      return (v: string) => /^[A-Za-z0-9_]+$/.test(v) || 'Только латинские символы и цифры';
    },
    verboseNameRule() {
      return (v: string) => /^[А-Яа-яЁё\s]+$/.test(v) || 'Только кириллица';
    },
    filteredRoles(): Role[] {
      if (!this.search.trim()) return this.roles;
      const term = this.search.toLowerCase();
      return this.roles.filter(role =>
        role.role.toLowerCase().includes(term) ||
        role.verbose_name.toLowerCase().includes(term)
      );
    },
    filteredPermissions() {
      if (!this.permissionSearch.trim()) return this.permissions;
      const term = this.permissionSearch.toLowerCase();
      return this.permissions.filter(p =>
        p.verbose_name.toLowerCase().includes(term) ||
        p.title?.toLowerCase().includes(term)
      );
    },
  },
  watch: {
    'service': {
      handler: 'getServiceRolesData',
      immediate: true,
    },
  },
  methods: {
    onPageChange(page: number) {
      this.page = page;
      this.getServiceRolesData();
    },
    onItemsPerPageChange(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.page = 1
      this.getServiceRolesData();
    },
    async getServiceRolesData() {
      if (!this.service.name) {
        return;
      }
      try {
        const response = await getServiceRoles({ id: "", name: this.service.name, verbose_name: "" },
          this.page,
          this.itemsPerPage);
        if (response.success) {
          this.roles = (response.data as Role[])
          this.totalItems = response.total as Number
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
    },
    openCreateRoleDialog() {
      this.newRole = { service_id: this.service.id, role: '', verbose_name: '' };
      this.createDialog = true;
    },
    async createRole() {
      try {
        const response = await createServiceRole(this.newRole);
        if (response.success) {
          this.showToast("Роль создана", "success");
          this.createDialog = false;
          await this.getServiceRolesData();
        } else {
          this.showToast(response.error || "Ошибка создания", "error");
        }
      } catch {
        this.showToast("Ошибка при запросе", "error");
      }
    },
    submitCreateForm() {
      const form = this.$refs.createForm as any;
      if (form.validate()) {
        this.createRole();
      }
    },
    async openEditRoleDialog(role: Role) {
      this.editedRole = { ...role };
      this.editDialog = true;
      await this.loadServicePermissions();
      await this.loadRolePermissions();
    },
    async loadServicePermissions() {
      this.loadingPermissions = true;
      if (!this.service.name) return;
      try {
        const response = await getServicePermissions({ id: "", name: this.service.name, verbose_name: "" },
          1,
          100);
        if (response.success) {
          this.permissions = response.data as Permission[];
        } else {
          this.showToast(response.error || 'Ошибка получения данных.', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе.', 'error');
      } finally {
        this.loadingPermissions = false;
      }
    },
    async loadRolePermissions() {
      this.loadingPermissions = true;
      try {
        const response = await getServiceRolePermissions(this.editedRole);
        if (response.success) {
          const assigned = response.data as RolePermission[];
          const assignedIds = new Set(assigned.map(p => p.permission_id));
          const permissionsState: Record<string, boolean> = {};
          for (const perm of this.permissions) {
            permissionsState[perm.id!] = assignedIds.has(perm.id!);
          }
          this.rolePermissions = permissionsState;
        } else {
          this.showToast(response.error || 'Ошибка загрузки прав роли', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе прав роли', 'error');
      } finally {
        this.loadingPermissions = false;
      }
    },
    async handlePermissionToggle(permissionId: string, value: boolean) {
      // Сохраняем локальное состояние сразу
      this.rolePermissions[permissionId] = value;

      try {
        if (value) {
          const response = await assingServiceRolePermission({
            id: this.editedRole.id, service_id: '', role: '', verbose_name: ''
          }, { id: permissionId, title: '', verbose_name: '', service_id: '' });
          if (!response.success) {
            this.showToast(response.error || 'Ошибка назначения права', 'error');
            this.rolePermissions[permissionId] = false;
          }
        } else {
          const response = await revokeServiceRolePermission({
            id: this.editedRole.id, service_id: '', role: '', verbose_name: ''
          }, { id: permissionId, title: '', verbose_name: '', service_id: '' });
          if (!response.success) {
            this.showToast(response.error || 'Ошибка удаления права', 'error');
            this.rolePermissions[permissionId] = true;
          }
        }
      } catch (error) {
        this.showToast('Ошибка при выполнении запроса', 'error');
        this.rolePermissions[permissionId] = !value;
      }
    },
    async updateRole() {
      try {
        const response = await updateServiceRole(this.editedRole);
        if (response.success) {
          this.showToast("Роль обновлена", "success");
          this.editDialog = false;
          await this.getServiceRolesData();
        } else {
          this.showToast(response.error || "Ошибка обновления", "error");
        }
      } catch {
        this.showToast("Ошибка при запросе", "error");
      }
    },
    submitEditForm() {
      const form = this.$refs.editForm as any;
      if (form.validate()) {
        this.updateRole();
      }
    },
    openDeleteRoleDialog(role: Role) {
      this.roleToDelete = role;
      this.deleteDialog = true;
    },
    async deleteRoleConfirmed() {
      if (!this.roleToDelete) return;
      try {
        const response = await deleteServiceRole(this.roleToDelete);
        if (response.success) {
          this.showToast("Роль удалена", "success");
          this.deleteDialog = false;
          await this.getServiceRolesData();
        } else {
          this.showToast(response.error || "Ошибка удаления", "error");
        }
      } catch {
        this.showToast("Ошибка при запросе", "error");
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
