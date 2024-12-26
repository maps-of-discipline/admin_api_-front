<template>
  <v-app>
    <header class="header">
      <v-app-bar dark class="header-bar">
        <div class="header-content">
          <v-select
            v-model="selectedProject"
            :items="projects"
            item-title="name"
            item-value="name"
            label="Выберите проект"
            class="project-select"
            outlined
            @input="fetchRoles"  
          ></v-select>
          <v-btn 
            color="success" 
            class="header-btn" 
            @click="fetchUsers"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn 
            color="primary" 
            class="header-btn" 
            @click="openCreateProjectDialog"
            :disabled="creatingProject" 
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-btn color="red" class="header-btn" @click="confirmDeleteProject(selectedProject)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <v-btn color="red" class="header-btn-logout" @click="logout">
          Выйти
        </v-btn>
      </v-app-bar>
    </header>

    <div class="user-management-background">
      <v-container max-width="1000">
        <v-card class="pa-5" outlined>
          <v-card-title class="text-h5 justify-center">
            Управление пользователями
            <v-btn icon @click="toggleEditMode">
              <v-icon>{{ isEditMode ? 'mdi-eye' : 'mdi-pencil' }}</v-icon>
            </v-btn>
            <v-btn
              v-if="isEditMode"
              color="blue"
              class="header-btn"
              @click="submitChanges"
            >
              <v-icon>mdi-database</v-icon> Внести изменения
            </v-btn>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="users"
            item-value="id"
            class="elevation-1"
            dense
          >
            <template v-slot:[`item.role`]="{ item }">
              <div v-if="isEditMode">
                <v-select
                  v-model="item.role"
                  :items="roles.length > 0 ? roles : ['Загрузка...']"
                  multiple
                  outlined
                  dense
                  @change="(newRoles) => updateRoles(item.id, newRoles)"
                ></v-select>
              </div>
              <div v-else>{{ item.role }}</div>
            </template>
          </v-data-table>
        </v-card>
      </v-container>

      <!-- Диалог создания проекта -->
      <v-dialog v-model="createProjectDialogVisible" max-width="400px">
        <v-card>
          <v-card-title>Создать проект</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newProjectName"
              label="Название проекта"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="createProjectDialogVisible = false">
              Отмена
            </v-btn>
            <v-btn color="primary" @click="createProject">
              Создать
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог подтверждения удаления проекта -->
      <v-dialog v-model="deleteProjectDialogVisible" max-width="400px">
        <v-card>
          <v-card-title>Удаление проекта</v-card-title>
          <v-card-text>
            Вы уверены, что хотите удалить проект "{{ projectToDeleteName }}"?
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="deleteProjectDialogVisible = false">
              Отмена
            </v-btn>
            <v-btn color="red" @click="deleteProject">
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'UserManagementPage',
  setup() {
    const projects = ref<any[]>([]);
    const users = ref<any[]>([]);
    const roles = ref<string[]>([]);
    const selectedProject = ref<string>('');
    const isEditMode = ref(false);

    const createProjectDialogVisible = ref(false);
    const deleteProjectDialogVisible = ref(false);
    const newProjectName = ref('');
    const projectToDelete = ref<string | null>(null);
    const projectToDeleteName = ref<string | null>(null);

    const creatingProject = ref(false);

    const headers = [
      { text: 'Имя', value: 'first_name' },
      { text: 'Фамилия', value: 'last_name' },
      { text: 'Отчество', value: 'middle_name' },
      { text: 'Логин', value: 'login' },
      { text: 'Почта', value: 'email' },
      { text: 'Роль', value: 'role' },
    ];

    const fetchProjects = async () => {
      try {
        const response = await axios.post('http://188.120.229.36:8001/api/v1/services/filters', {});
        projects.value = response.data.data.map((project: any) => ({
          id: project.id,
          name: project.name,
        }));
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
      }
    };

    const fetchRoles = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.post('http://188.120.229.36:8001/api/v1/service-roles/filters', {
          service_name: selectedProject.value,
        });
        if (response.data && response.data.data) {
          console.log('Роли получены:', response.data.data);
          roles.value = response.data.data.map((role: any) => role.role);
        } else {
          console.error('Роли не найдены');
        }
      } catch (error) {
        console.error('Ошибка при загрузке ролей:', error);
      }
    };

    const fetchUsers = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.post('http://188.120.229.36:8001/api/v1/users/filters', { service_name: selectedProject.value });
        users.value = response.data.data.map((user: any) => ({
          first_name: user.name,
          last_name: user.surname,
          middle_name: user.patronymic || '',
          login: user.login,
          email: user.email,
          role: user.role || 'Не указано',  // Обработка пустых ролей
        }));
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    };

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
      if (isEditMode.value && selectedProject.value) {
        fetchRoles();  // Запрос ролей при переходе в режим редактирования
      }
    };

    const openCreateProjectDialog = () => {
      createProjectDialogVisible.value = true;
    };

    const createProject = async () => {
      if (creatingProject.value) return;
      creatingProject.value = true;

      try {
        await axios.post('http://188.120.229.36:8001/api/v1/services', { name: newProjectName.value });
        createProjectDialogVisible.value = false;
        newProjectName.value = '';
        fetchProjects();
      } catch (error) {
        console.error('Ошибка создания проекта:', error);
      } finally {
        creatingProject.value = false;
      }
    };

    const confirmDeleteProject = (projectName: string) => {
    const project = projects.value.find((p) => p.name === projectName);
    if (project) {
        projectToDeleteName.value = project.name;
        projectToDelete.value = project.id;
        deleteProjectDialogVisible.value = true;
    } else {
        console.error('Проект для удаления не найден');
    }
};

    const deleteProject = async () => {
    if (!projectToDelete.value) return;
    try {
        await axios.delete(`http://188.120.229.36:8001/api/v1/services/${projectToDelete.value}`);
        deleteProjectDialogVisible.value = false;
        projectToDelete.value = null; 
        projectToDeleteName.value = null; 
        fetchProjects(); 
    } catch (error) {
        console.error('Ошибка удаления проекта:', error);
    }
};
    const submitChanges = async () => {
      if (!selectedProject.value) return;

      try {
        for (const user of users.value) {
          // Пример: отправка обновления ролей
          await axios.post(`http://188.120.229.36:8001/api/v1/service-roles/${user.id}`, {
            roles: user.role,
          });
        }
        alert('Изменения успешно сохранены!');
      } catch (error) {
        console.error('Ошибка при внесении изменений:', error);
      }
    };
    const updateRoles = async (userId: string, newRoles: string[]) => {
      try {
        const currentRoles = users.value.find(user => user.id === userId)?.role || [];
        const rolesToAdd = newRoles.filter(role => !currentRoles.includes(role));
        const rolesToRemove = currentRoles.filter(role => !newRoles.includes(role));

        for (const role of rolesToAdd) {
          await addRole(userId, role);
        }
        for (const role of rolesToRemove) {
          await removeRole(userId, role);
        }
        alert('Роли успешно обновлены!');
      } catch (error) {
        console.error('Ошибка обновления ролей:', error);
      }
    };

    const logout = () => {
      window.location.href = '/';
    };

    onMounted(() => {
      fetchProjects();
    });

    return {
      projects,
      users,
      roles,
      selectedProject,
      createProjectDialogVisible,
      deleteProjectDialogVisible,
      newProjectName,
      projectToDelete,
      projectToDeleteName,
      headers,
      fetchUsers,
      fetchRoles,  
      openCreateProjectDialog,
      createProject,
      confirmDeleteProject,
      deleteProject,
      logout,
      creatingProject,
      isEditMode,
      toggleEditMode,
      submitChanges,
      updateRoles,
    };
  },
});
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.project-select {
  margin: 20px;
  margin-bottom: 0px;
  min-width: 250px;
}

.header-btn {
  border: 2px solid;
  border-radius: 8px;
  transition: all 0.3s;
}

.header-btn[color="primary"] {
  border-color: #1976d2;
}

.header-btn[color="red"] {
  border-color: #d32f2f;
}

.header-btn:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
}

.header-btn-logout {
  border: 2px solid #d32f2f;
  border-radius: 8px;
  margin-left: auto;
  transition: all 0.3s;
}

.header-btn-logout:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.header-btn[color="success"] {
  border-color: #388e3c;
}

.user-management-background {
  background-color: #3a3a3a;
  min-height: 100vh;
  padding: 20px;
}

.header-content .header-btn {
  margin-left: 0;
}
</style>
