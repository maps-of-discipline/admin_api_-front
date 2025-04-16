<template>
    <v-app>
      <!-- Контент: Права доступа + выбор проекта -->
      <v-main class="bg-grey-darken-4">
        <v-container class="py-6">
          <v-row class="align-center mb-4">
            <v-col cols="12" md="6" class="d-flex align-center">
              <h2 class="text-white mr-4">Права доступа для</h2>
              <v-select
                v-model="selectedProject"
                :items="projects"
                item-title="name"
                item-value="name"
                label="Выберите проект"
                class="project-select"
                hide-details
                dense
                outlined
                style="max-width: 250px"
                @input="fetchRoles"
              />
            </v-col>
  
            <v-col
              cols="12"
              md="6"
              class="d-flex justify-end align-center"
              style="gap: 12px"
            >
              <v-btn icon color="success" @click="fetchUsers"
                ><v-icon>mdi-refresh</v-icon></v-btn
              >
              <v-btn icon color="primary" @click="openCreateProjectDialog"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
  
              <v-btn color="red" variant="outlined" class="text-red" @click="back"
                >На главную</v-btn
              >
            </v-col>
          </v-row>
  
          <v-row>
            <!-- Роли -->
            <v-col cols="12" md="4">
              <v-card class="pa-4" color="#1e1e1e" elevation="3">
                <h3 class="text-white mb-3">Выбранная роль</h3>
                <v-btn
                  v-for="role in roles"
                  :key="role.name"
                  class="mb-2"
                  :color="
                    selectedRole.name === role.name ? 'primary' : 'blue-lighten-2'
                  "
                  block
                  @click="selectRole(role)"
                >
                  {{ role.name }}
                </v-btn>
              </v-card>
            </v-col>
  
            <!-- Разрешения -->
            <v-col cols="12" md="8">
              <v-card class="pa-4" color="#1e1e1e" elevation="3">
                <h3 class="text-white mb-3">Разрешение</h3>
                <v-list dense>
                  <v-list-item
                    v-for="(perm, index) in allPermissions"
                    :key="index"
                    class="text-white"
                    @click="togglePermission(perm)"
                    style="cursor: pointer"
                  >
                    <template v-slot:prepend>
                      <v-checkbox
                        :model-value="selectedRole.permissions.includes(perm)"
                        color="primary"
                        @change.stop="togglePermission(perm)"
                      />
                    </template>
                    <v-list-item-title class="ml-2">{{ perm }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    name: "AccessRights",
    data() {
      return {
        selectedProject: null,
        projects: [
          { name: "Проект А" },
          { name: "Проект Б" },
          { name: "Проект В" },
        ],
        roles: [
          {
            name: "студент",
            permissions: ["Просмотр данных"],
          },
          {
            name: "сотрудник",
            permissions: ["Просмотр данных", "Редактирование данных"],
          },
          {
            name: "админ",
            permissions: [
              "Просмотр данных",
              "Редактирование данных",
              "Удаление данных",
              "Управление пользователями",
            ],
          },
        ],
        selectedRole: {
          name: "студент",
          permissions: ["Просмотр данных"],
        },
        allPermissions: [
          "Просмотр данных",
          "Редактирование данных",
          "Удаление данных",
          "Управление пользователями",
        ],
      };
    },
    methods: {
      back() {
        window.location.href = "/admin/user";
      },
      selectRole(role) {
        this.selectedRole = { ...role };
      },
      togglePermission(perm) {
        const index = this.selectedRole.permissions.indexOf(perm);
        if (index > -1) {
          this.selectedRole.permissions.splice(index, 1);
        } else {
          this.selectedRole.permissions.push(perm);
        }
      },
      fetchRoles() {
        console.log("Загрузка ролей...");
      },
      fetchUsers() {
        console.log("Обновление пользователей...");
      },
      openCreateProjectDialog() {
        console.log("Создание проекта...");
      },
      confirmDeleteProject(project) {
        console.log("Удаление проекта:", project);
      },
    },
  };
  </script>
  
  <style scoped>
  .text-white {
    color: white;
  }
  .project-select .v-field {
    background-color: #2a2a2a;
    border-radius: 8px;
  }
  </style>