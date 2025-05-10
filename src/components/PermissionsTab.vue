<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        {{ service.verbose_name }}
        <div class="px-2">
          <v-btn icon @click="openCreatePermissionDialog" color="success" density="comfortable">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-data-table-server :items-per-page="itemsPerPage" :headers="headers" :items="filteredPermissions"
        :items-length="totalItems" :loading="loading" :page="page" @update:page="onPageChange"
        @update:items-per-page="onItemsPerPageChange" items-per-page-text="Элементов на странице" class="elevation-1">
        <template #item.actions="{ item }">
          <td class="actions-cell">
            <v-btn icon @click="openEditPermissionDialog(item)" density="comfortable">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="openDeletePermissionDialog(item)" color="error" density="comfortable">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template #no-data>
          <v-alert type="info">Нет прав доступа для отображения.</v-alert>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>

  <!-- Диалог создания -->
  <v-dialog v-model="createDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Создание нового права доступа</v-card-title>
      <v-card-text>
        <v-form ref="createForm" v-model="createFormValid">
          <v-text-field v-model="newPermission.title" label="Название" outlined :rules="[nameRule]" />
          <v-text-field v-model="newPermission.verbose_name" label="Отображаемое имя" outlined
            :rules="[verboseNameRule]" />
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

  <!-- Диалог редактирования -->
  <v-dialog v-model="editDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Редактирование права доступа</v-card-title>
      <v-card-text>
        <v-form ref="editForm" v-model="editFormValid">
          <v-text-field v-model="editedPermission.title" label="Название" outlined :rules="[nameRule]" />
          <v-text-field v-model="editedPermission.verbose_name" label="Отображаемое имя" outlined
            :rules="[verboseNameRule]" />
        </v-form>
      </v-card-text>
      <!-- Кнопки -->
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!editFormValid" @click="submitEditForm">Сохранить</v-btn>
        <v-btn @click="editDialog = false">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Диалог удаления -->
  <v-dialog v-model="deleteDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Подтвердите удаление</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить право доступа:
        <strong>{{ permissionToDelete?.title }}</strong>?
      </v-card-text>
      <!-- Кнопки -->
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="deleteServicePermissionData">Удалить</v-btn>
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
import {
  getServicePermissions,
  createServicePermission,
  updateServicePermission,
  deleteServicePermission,
} from '../services/permission';
import { useToast } from '../composable/useToast';
import type { Service } from '../interfaces/service';
import type { Permission } from '../interfaces/permission';

export default defineComponent({
  name: 'PermissionsTab',
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
      permissions: [] as Permission[],
      loading: false,
      headers: [
        { title: 'Название', value: 'verbose_name', sortable: true },
        { title: 'Параметр', value: 'title', sortable: true },
        { title: 'Действия', value: 'actions', sortable: false, width: '150px' },
      ],
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      createFormValid: false,
      editFormValid: false,
      newPermission: {} as Permission,
      editedPermission: {} as Permission,
      permissionToDelete: null as Permission | null,
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
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
    filteredPermissions(): Permission[] {
      if (!this.search.trim()) return this.permissions;
      const term = this.search.toLowerCase();
      return this.permissions.filter(permission =>
        permission.title.toLowerCase().includes(term) ||
        permission.verbose_name.toLowerCase().includes(term)
      );
    },
  },
  watch: {
    service: {
      handler: 'getServicePermissionsData',
      immediate: true,
    },
  },
  methods: {
    onPageChange(page: number) {
      this.page = page;
      this.getServicePermissionsData();
    },
    onItemsPerPageChange(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.page = 1
      this.getServicePermissionsData();
    },
    async getServicePermissionsData() {
      this.loading = true;
      if (!this.service.name) return;
      try {
        const response = await getServicePermissions({ id: "", name: this.service.name, verbose_name: "" },
          this.page,
          this.itemsPerPage);
        if (response.success) {
          this.permissions = response.data as Permission[];
          this.totalItems = response.total
        } else {
          this.showToast(response.error || 'Ошибка получения данных.', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе.', 'error');
      } finally {
        this.loading = false;
      }
    },
    openCreatePermissionDialog() {
      this.newPermission = {} as Permission;
      this.createDialog = true;
    },
    async createServicePermissionData() {
      try {
        const response = await createServicePermission({
          service_id: this.service.id,
          title: this.newPermission.title,
          verbose_name: this.newPermission.verbose_name,
        });
        if (response.success) {
          this.showToast('Право доступа создано', 'success');
          this.createDialog = false;
          await this.getServicePermissionsData();
        } else {
          this.showToast(response.error || 'Ошибка создания.', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе.', 'error');
      }
    },
    submitCreateForm() {
      const form = this.$refs.createForm as any;
      if (form.validate()) {
        this.createServicePermissionData();
      }
    },
    openEditPermissionDialog(permission: Permission) {
      this.editedPermission = { ...permission };
      this.editDialog = true;
    },
    async updateServicePermissionData() {
      try {
        const response = await updateServicePermission(this.editedPermission);
        if (response.success) {
          this.showToast('Право доступа обновлено', 'success');
          this.editDialog = false;
          await this.getServicePermissionsData();
        } else {
          this.showToast(response.error || 'Ошибка обновления.', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе.', 'error');
      }
    },
    submitEditForm() {
      const form = this.$refs.editForm as any;
      if (form.validate()) {
        this.updateServicePermissionData();
      }
    },
    openDeletePermissionDialog(permission: Permission) {
      this.permissionToDelete = permission;
      this.deleteDialog = true;
    },
    async deleteServicePermissionData() {
      try {
        const response = await deleteServicePermission({
          id: this.permissionToDelete!.id,
          service_id: this.permissionToDelete!.service_id,
          title: this.permissionToDelete!.title,
          verbose_name: this.permissionToDelete!.verbose_name,
        });
        if (response.success) {
          this.showToast('Право доступа удалено', 'success');
          this.deleteDialog = false;
          await this.getServicePermissionsData();
        } else {
          this.showToast(response.error || 'Ошибка удаления.', 'error');
        }
      } catch {
        this.showToast('Ошибка при запросе.', 'error');
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
