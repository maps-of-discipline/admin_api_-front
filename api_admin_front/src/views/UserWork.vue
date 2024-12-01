<template>
  <div class="user-management-background">
    <v-container max-width="1000">
      <v-card
        class="pa-5"
        outlined
      >
        <v-card-title class="text-h5 justify-center">
          Управление пользователями
        </v-card-title>
  
        <!-- Таблица пользователей -->
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="users"
          item-value="id"
          class="elevation-1"
          dense
          @row-click="editUser"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Список пользователей</v-toolbar-title>
              <v-spacer />
              <v-btn
                color="primary"
                @click="showCreateDialog"
              >
                Добавить пользователя
              </v-btn>
            </v-toolbar>
          </template>
  
          <template #body="props">
            <tr
              v-for="user in props.items"
              :key="user.id"
            >
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <v-btn
                  icon
                  @click.stop="editUser(user)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click.stop="confirmDeleteUser(user.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  
    <!-- Диалог создания/редактирования пользователя -->
    <v-dialog
      v-model="dialogVisible"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span v-if="editingUser">Редактировать пользователя</span>
          <span v-else>Добавить нового пользователя</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="userForm.name"
            label="ФИО"
            required
          />
          <v-text-field
            v-model="userForm.email"
            label="Почта"
            type="email"
            required
          />
          <v-select
            v-model="userForm.role"
            :items="roles"
            label="Роль"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            @click="dialogVisible = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            @click="saveUser"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Диалог подтверждения удаления пользователя -->
    <v-dialog
      v-model="deleteDialogVisible"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h5">
          Подтверждение удаления
        </v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить пользователя {{ userToDelete?.name }}?
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            @click="deleteDialogVisible = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="red"
            @click="deleteUser(userToDelete.id)"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'UserManagementPage',
    setup() {
      const dialogVisible = ref(false);
      const deleteDialogVisible = ref(false);
      const editingUser = ref(false);
      const userToDelete = ref<any>(null);
      const userForm = ref({
        id: null as number | null,
        name: '',
        email: '',
        role: ''
      });
  
      const users = ref([
        { id: 1, name: 'Иванов Иван', email: 'ivanov@example.com', role: 'Администратор' },
        { id: 2, name: 'Петров Петр', email: 'petrov@example.com', role: 'Пользователь' },
        { id: 3, name: 'Петров Петр', email: 'petrov@example.com', role: 'Пользователь' },
        { id: 4, name: 'Петров Петр', email: 'petrov@example.com', role: 'Пользователь' },
        { id: 5, name: 'Петров Петр', email: 'petrov@example.com', role: 'Пользователь' },
        { id: 6, name: 'Петров Петр', email: 'petrov@example.com', role: 'Пользователь' },
        { id: 7, name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
        { id: 8, name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
        { id: 9, name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
        { id: 10, name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
        { id: 11    , name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
      ]);
  
      const roles = ['Администратор', 'Пользователь', 'Менеджер'];
  
      const headers = [
        { text: 'ID', value: 'id' },
        { text: 'ФИО', value: 'name' },
        { text: 'Почта', value: 'email' },
        { text: 'Роль', value: 'role' },
        { text: 'Действия', value: 'actions', sortable: false }
      ];
  
      const itemsPerPage = ref(5);
  
      const showCreateDialog = () => {
        dialogVisible.value = true;
        editingUser.value = false;
        userForm.value = { id: null, name: '', email: '', role: '' };
      };
  
      const editUser = (user: any) => {
        dialogVisible.value = true;
        editingUser.value = true;
        userForm.value = { ...user };
      };
  
      const saveUser = () => {
        if (editingUser.value) {
          const index = users.value.findIndex(u => u.id === userForm.value.id);
          if (index !== -1) {
            users.value[index] = { ...userForm.value };
          }
        } else {
          const newUser = { ...userForm.value, id: users.value.length + 1 };
          users.value.push(newUser);
        }
        dialogVisible.value = false;
      };
  
      const confirmDeleteUser = (userId: number) => {
        userToDelete.value = users.value.find(user => user.id === userId);
        deleteDialogVisible.value = true;
      };
  
      const deleteUser = (userId: number) => {
        users.value = users.value.filter(user => user.id !== userId);
        deleteDialogVisible.value = false;
      };
  
      return {
        dialogVisible,
        deleteDialogVisible,
        editingUser,
        userForm,
        users,
        roles,
        headers,
        itemsPerPage,
        showCreateDialog,
        editUser,
        saveUser,
        confirmDeleteUser,
        deleteUser,
        userToDelete
      };
    }
  });
  </script>
  
  <style scoped>
  .user-management-background {
    background-color: #3a3a3a;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  
  .v-card {
    background-color: #2e2e2e;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .v-data-table {
    margin-top: 20px;
  }
  
  .v-btn {
    margin-left: 5px;
  }
  </style>
  