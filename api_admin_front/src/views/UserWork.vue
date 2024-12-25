<template>
  <v-app>
    <header class="header">
      <v-app-bar dark>
        <v-select
          v-model="selectedProject"
          :items="projects"
          item-text="name"
          item-value="id"
          label="Выберите проект"
          class="project-select"
          outlined
          @change="fetchUsers"
        ></v-select>

        <v-btn color="primary" @click="openCreateProjectDialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn color="red" @click="logout">
          Выйти
        </v-btn>
      </v-app-bar>
    </header>

    <div class="user-management-background">
      <v-container max-width="1000">
        <v-card class="pa-5" outlined>
          <v-card-title class="text-h5 justify-center">
            Управление пользователями
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="users"
            item-value="id"
            class="elevation-1"
            dense
          >
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
            Вы уверены, что хотите удалить проект "{{ projectToDelete }}"?
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
    const selectedProject = ref<string | null>(null);

    const createProjectDialogVisible = ref(false);
    const deleteProjectDialogVisible = ref(false);
    const newProjectName = ref('');
    const projectToDelete = ref<string | null>(null);

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Имя', value: 'name' },
      { text: 'Логин', value: 'login' },
      { text: 'Почта', value: 'email' },
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


    const fetchUsers = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.get(`http://188.120.229.36:8001/api/v1/services/${selectedProject.value}`);
        users.value = response.data;
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    };

    const openCreateProjectDialog = () => {
      createProjectDialogVisible.value = true;
    };

    const createProject = async () => {
      try {
        await axios.post('http://188.120.229.36:8001/api/v1/services', { name: newProjectName.value });
        createProjectDialogVisible.value = false;
        newProjectName.value = '';
        fetchProjects();
      } catch (error) {
        console.error('Ошибка создания проекта:', error);
      }
    };

    const confirmDeleteProject = (project: string) => {
      projectToDelete.value = project;
      deleteProjectDialogVisible.value = true;
    };

    const deleteProject = async () => {
      if (!projectToDelete.value) return;
      try {
        await axios.delete(`http://188.120.229.36:8001/api/v1/services/${projectToDelete.value}`);
        deleteProjectDialogVisible.value = false;
        fetchProjects();
      } catch (error) {
        console.error('Ошибка удаления проекта:', error);
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
      selectedProject,
      createProjectDialogVisible,
      deleteProjectDialogVisible,
      newProjectName,
      projectToDelete,
      headers,
      fetchUsers,
      openCreateProjectDialog,
      createProject,
      confirmDeleteProject,
      deleteProject,
      logout,
    };
  },
});
</script>

<style scoped>
.user-management-background {
  background-color: #3a3a3a;
  min-height: 100vh;
  padding: 20px;
}

.v-app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-select {
  max-width: 300px;
}
</style>
