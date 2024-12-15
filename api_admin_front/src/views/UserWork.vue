<template>
  <v-app>
    <header class="header">
      <v-app-bar dark>
        <v-select
          v-model="selectedProject"
          :items="projects"
          label="Выберите проект"
          class="project-select"
          outlined
        ></v-select>
      </v-app-bar>
    </header>

    <div class="user-management-background">
      <v-container max-width="1000">
        <v-card class="pa-5" outlined>
          <v-card-title class="text-h5 justify-center">
            Управление пользователями
          </v-card-title>
          
          <!-- Переключатель режима -->
          <v-switch
            v-model="isEditMode"
            label="Режим редактирования"
            class="mt-4"
          ></v-switch>

          <!-- Таблица пользователей -->
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="filteredUsers"
            item-value="id"
            class="elevation-1"
            dense
          >
            <!-- Заголовки таблицы -->
            <template v-slot:thead>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Логин</th>
                  <th>Почта</th>
                  <th>Роли</th>
                  <th>Доступ к Администрированию</th>
                  <th></th>
                </tr>
              </thead>
            </template>

            <!-- Верхняя панель с кнопками -->
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Список пользователей</v-toolbar-title>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="showCreateDialog"
                  :disabled="!isEditMode"
                >
                  Добавить пользователя
                </v-btn>
              </v-toolbar>
            </template>

            <!-- Тело таблицы -->
            <template #body="props">
              <tr v-for="user in props.items" :key="user.id">
                <td>{{ user.id }}</td>

                <!-- Имя пользователя -->
                <td>
                  <v-text-field
                    v-if="isEditMode"
                    v-model="user.name"
                    dense
                    hide-details
                    class="wide-input"
                  />
                  <span v-else>{{ user.name }}</span>
                </td>

                <!-- Логин пользователя -->
                <td>
                  <v-text-field
                    v-if="isEditMode"
                    v-model="user.login"
                    dense
                    hide-details
                    class="wide-input"
                  />
                  <span v-else>{{ user.login }}</span>
                </td>

                <!-- Почта пользователя -->
                <td>
                  <v-text-field
                    v-if="isEditMode"
                    v-model="user.email"
                    type="email"
                    dense
                    hide-details
                    class="wide-input"
                  />
                  <span v-else>{{ user.email }}</span>
                </td>

                <!-- Роли пользователя -->
                <td>
                  <v-select
                    v-if="isEditMode"
                    v-model="user.roles"
                    :items="roles"
                    multiple
                    dense
                    hide-details
                    class="wide-input"
                  />
                  <span v-else>{{ user.roles.join(', ') }}</span>
                </td>

                <!-- Доступ к Администрированию -->
                <td>
                  <v-checkbox
                    v-if="isEditMode"
                    v-model="user.adminAccess"
                    dense
                    hide-details
                  />
                  <span v-else>{{ user.adminAccess ? 'Да' : 'Нет' }}</span>
                </td>

                <!-- Действия -->
                <td>
                  <v-btn
                    v-if="isEditMode"
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
      <v-dialog v-model="dialogVisible" max-width="500px">
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
              class="wide-input"
            />
            <v-text-field
              v-model="userForm.login"
              label="Логин"
              required
              class="wide-input"
            />
            <v-text-field
              v-model="userForm.email"
              label="Почта"
              type="email"
              required
              class="wide-input"
            />
            <v-select
              v-model="userForm.roles"
              :items="roles"
              label="Роли"
              multiple
              required
              class="wide-input"
            />
            <v-checkbox
              v-model="userForm.adminAccess"
              label="Доступ к системе администрирования"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="dialogVisible = false">
              Отмена
            </v-btn>
            <v-btn color="primary" @click="saveUser">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог подтверждения удаления пользователя -->
      <v-dialog v-model="deleteDialogVisible" max-width="400px">
        <v-card>
          <v-card-title class="text-h5">
            Подтверждение удаления
          </v-card-title>
          <v-card-text>
            Вы уверены, что хотите удалить пользователя {{ userToDelete?.name }}?
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="deleteDialogVisible = false">
              Отмена
            </v-btn>
            <v-btn color="red" @click="deleteUser(userToDelete.id)">
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'UserManagementPage',
  setup() {
    const dialogVisible = ref(false);
    const deleteDialogVisible = ref(false);
    const editingUser = ref(false);
    const isEditMode = ref(false);
    const userToDelete = ref<any>(null);
    const selectedProject = ref<string | null>(null);

    const userForm = ref({
      id: null as number | null,
      name: '',
      login: '',
      email: '',
      roles: [] as string[],
      adminAccess: false,
    });

    const users = ref([
      { id: 1, name: 'Иванов Иван', login: 'ivanov', email: 'ivanov@example.com', roles: ['Администратор'], adminAccess: true, project: 'Проект A' },
      { id: 2, name: 'Петров Петр', login: 'petrov', email: 'petrov@example.com', roles: ['Пользователь'], adminAccess: false, project: 'Проект B' },
      { id: 3, name: 'Сидоров Сидор', login: 'sidorov', email: 'sidorov@example.com', roles: ['Менеджер'], adminAccess: true, project: 'Проект A' },
    ]);

    const projects = ref(['Проект A', 'Проект B', 'Проект C']);
    const roles = ['Администратор', 'Пользователь', 'Менеджер'];

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Имя', value: 'name' },
      { text: 'Логин', value: 'login' },
      { text: 'Почта', value: 'email' },
      { text: 'Роли', value: 'roles' },
      { text: 'Доступ к Администрированию', value: 'adminAccess', sortable: false },
      { text: 'Действия', value: 'actions', sortable: false },
    ];

    const itemsPerPage = ref(5);

    const filteredUsers = computed(() =>
      selectedProject.value
        ? users.value.filter(user => user.project === selectedProject.value)
        : users.value
    );

    const showCreateDialog = () => {
      dialogVisible.value = true;
      editingUser.value = false;
      userForm.value = { id: null, name: '', login: '', email: '', roles: [], adminAccess: false };
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
        const newUser = { ...userForm.value, id: users.value.length + 1, project: selectedProject.value || 'Проект A' };
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
      isEditMode,
      userForm,
      users,
      filteredUsers,
      roles,
      headers,
      itemsPerPage,
      projects,
      selectedProject,
      showCreateDialog,
      editUser,
      saveUser,
      confirmDeleteUser,
      deleteUser,
      userToDelete,
    };
  },
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
  margin-top: 200px;
}

.v-data-table {
  margin-top: 20px;
}

.v-btn {
  margin-left: 5px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
}

.v-app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.project-select {
  max-width: 300px;
}

/* Убираем ограничение по ширине для контейнера */
.v-container {
  max-width: 100% !important; /* Это убирает ограничение по ширине */
}

/* Класс для расширения полей ввода */
.wide-input {
  min-width: 200px;
}
</style>
