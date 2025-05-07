<template>
  <v-app>
    <header class="header">
      <v-app-bar dark class="header-bar">
        <div class="header-content">
          <v-select v-model="selectedProject" :items="projects" item-title="verbose_name" item-value="name"
            label="Выберите проект" class="project-select" outlined @input="passFunc" />
          <v-btn color="success" class="header-btn" @click="passFunc">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn color="primary" class="header-btn" :disabled="creatingProject" @click="passFunc">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn color="red" class="header-btn" @click="passFunc">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <div class="logo-container">
          <img src="..\styles\img\mospolytech-logo-white.png" alt="Logo" class="logo">
        </div>

        <div class="d-flex align-center" style="margin-left: auto; gap: 10px; padding-right: 16px">
          <v-btn color="yellow" class="header-btn-access" @click="passFunc">
            ДОСТУП
          </v-btn>
          <v-btn color="red" class="header-btn-logout" @click="passFunc">
            ВЫЙТИ
          </v-btn>
        </div>
      </v-app-bar>
    </header>

    <div class="user-management-background">
      <v-container class="table-wrapper">
        <v-card class="centered-table-card" outlined>
          <v-card-title class="text-h5 justify-center">
            Управление пользователями
            <v-btn icon @click="passFunc">
              <v-icon>{{ isEditMode ? "mdi-eye" : "mdi-pencil" }}</v-icon>
            </v-btn>
            <v-btn v-if="isEditMode" color="blue" class="header-btn" @click="passFunc">
              <v-icon>mdi-database</v-icon> Внести изменения
            </v-btn>
          </v-card-title>

          <v-table class="centered-table">
            <thead>
              <tr>
                <th class="text-left">
                  Имя
                </th>
                <th class="text-left">
                  Фамилия
                </th>
                <th class="text-left">
                  Отчество
                </th>
                <th class="text-left">
                  Логин
                </th>
                <th class="text-left">
                  Почта
                </th>
                <th class="text-left">
                  Роль
                </th>
              </tr>
            </thead>
            <!-- <tbody>
              <tr v-for="item in users" :key="item.id">
                <td>{{ item.first_name }}</td>
                <td>{{ item.last_name }}</td>
                <td>{{ item.middle_name }}</td>
                <td>{{ item.login }}</td>
                <td>{{ item.email }}</td>
                <td>
                  <div v-if="isEditMode">
                    <v-select v-model="item.role" :items="roles.length > 0 ? roles : ['Загрузка...']" multiple outlined
                      dense @change="(newRoles) => updateRoles(item.id, newRoles)" />
                  </div>
                  <div v-else>
                    {{ item.role }}
                  </div>
                </td>
              </tr>
            </tbody> -->
          </v-table>
        </v-card>
      </v-container>

      <v-dialog v-model="createProjectDialogVisible" max-width="400px">
        <v-card>
          <v-card-title>Создать проект</v-card-title>
          <v-card-text>
            <v-text-field v-model="newProjectName" label="Название проекта" required />
            <v-text-field v-model="newProjectLogin" label="Логин проекта" required />
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="createProjectDialogVisible = false">
              Отмена
            </v-btn>
            <v-btn color="primary" @click="passFunc">
              Создать
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            <v-btn color="red" @click="passFunc">
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserManagementPage",
  data() {
    return {
      projects: [],
      users: [],
      roles: [],
      selectedProject: null as null | undefined,
      isEditMode: false,
      createProjectDialogVisible: false,
      deleteProjectDialogVisible: false,
      newProjectName: "",
      newProjectLogin: "",
      projectToDeleteName: null,
      creatingProject: false,
      headers: [
        { text: "Имя", value: "first_name" },
        { text: "Фамилия", value: "last_name" },
        { text: "Отчество", value: "middle_name" },
        { text: "Логин", value: "login" },
        { text: "Почта", value: "email" },
        { text: "Роль", value: "role" },
      ],
    };
  },
  methods: {
    passFunc() {
      return
    }
    // async fetchProjects() {
    //   try {
    //     const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/services/filters`, {});
    //     this.projects = response.data.data.map(project => ({
    //       id: project.id,
    //       name: project.name,
    //       verbose_name: project.verbose_name,
    //     }));
    //   } catch (error) {
    //     console.error("Ошибка загрузки проектов:", error);
    //   }
    // },
    // async fetchRoles() {
    //   if (!this.selectedProject) return;
    //   try {
    //     const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/service-roles/filters`, {
    //       service_name: this.selectedProject,
    //     });
    //     this.roles = response.data.data.map(role => role.role);
    //   } catch (error) {
    //     console.error("Ошибка при загрузке ролей:", error);
    //   }
    // },
    // async fetchUsers() {
    //   if (!this.selectedProject) return;
    //   try {
    //     const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/filters`, {
    //       service_name: this.selectedProject,
    //     });

    //     const usersList = [];
    //     for (const user of response.data.data) {
    //       const rolesResponse = await axios.post(
    //         `${import.meta.env.VITE_API_BASE_URL}/users/${user.id}/get_roles_from_service?service_name=${this.selectedProject}`
    //       );

    //       const userRoles = [];
    //       for (const role of rolesResponse.data.roles || []) {
    //         try {
    //           const roleResponse = await axios.get(
    //             `${import.meta.env.VITE_API_BASE_URL}/service-roles/${role.service_roles_id}`
    //           );
    //           userRoles.push(roleResponse.data.role);
    //         } catch (roleError) {
    //           console.error(
    //             `Ошибка при получении роли с id ${role.service_roles_id}:`,
    //             roleError
    //           );
    //         }
    //       }

    //       const userData = {
    //         id: user.id,
    //         first_name: user.name,
    //         last_name: user.surname,
    //         middle_name: user.patronymic || "",
    //         login: user.login,
    //         email: user.email,
    //         role: user.role,
    //         roles: userRoles,
    //         userRoles: rolesResponse.data.roles || [],
    //       };

    //       usersList.push(userData);
    //     }

    //     this.users = usersList;
    //   } catch (error) {
    //     console.error("Ошибка загрузки пользователей:", error);
    //   }
    // },
    // async updateRoles(userId, newRoles) {
    //   try {
    //     const currentUser = this.users.find(user => user.id === userId);
    //     if (!currentUser) throw new Error("Пользователь не найден");

    //     const currentRoles = currentUser.roles || [];
    //     const roleMappings = await axios.post(
    //       `${import.meta.env.VITE_API_BASE_URL}/service-roles/filters`,
    //       {
    //         service_name: this.selectedProject,
    //       }
    //     );

    //     const roleMap = roleMappings.data.data.reduce((map, role) => {
    //       map[role.role] = role.id;
    //       return map;
    //     }, {});

    //     const rolesToAdd = newRoles.filter(role => !currentRoles.includes(role));
    //     const rolesToRemove = currentRoles.filter(role => !newRoles.includes(role));

    //     for (const roleName of rolesToAdd) {
    //       const serviceRoleId = roleMap[roleName];
    //       if (serviceRoleId) {
    //         await this.addRole(userId, serviceRoleId);
    //       }
    //     }

    //     for (const roleName of rolesToRemove) {
    //       const userRole = currentUser.userRoles.find(r => r.role === roleName);
    //       if (userRole && userRole.user_service_role_id) {
    //         await this.removeRole(userRole.user_service_role_id);
    //       }
    //     }

    //     currentUser.roles = newRoles;
    //   } catch (error) {
    //     console.error("Ошибка обновления ролей:", error);
    //   }
    // },
    // async addRole(userId, serviceRoleId) {
    //   try {
    //     await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user_service_roles`, {
    //       service_roles_id: serviceRoleId,
    //       user_id: userId,
    //     });
    //   } catch (error) {
    //     console.error(`Ошибка добавления роли ${serviceRoleId}:`, error);
    //   }
    // },
    // async removeRole(userServiceRoleId) {
    //   try {
    //     await axios.delete(
    //       `${import.meta.env.VITE_API_BASE_URL}/user_service_roles/${userServiceRoleId}`
    //     );
    //   } catch (error) {
    //     console.error(`Ошибка удаления роли ${userServiceRoleId}:`, error);
    //   }
    // },
    // toggleEditMode() {
    //   this.isEditMode = !this.isEditMode;
    //   if (this.isEditMode && this.selectedProject) {
    //     this.fetchRoles();
    //   }
    // },
    // logout() {
    //   window.location.href = "/";
    // },
    // handleAccess() {
    //   window.location.href = "/admin/user/permissions";
    // },
    // openCreateProjectDialog() {
    //   this.createProjectDialogVisible = true;
    // },
    // async createProject() {
    //   if (!this.newProjectName.trim() || !this.newProjectLogin.trim()) return;

    //   this.creatingProject = true;
    //   try {
    //     await axios.post(`${import.meta.env.VITE_API_BASE_URL}/services`, {
    //       name: this.newProjectLogin,
    //       verbose_name: this.newProjectName,
    //     });
    //     this.createProjectDialogVisible = false;
    //     this.newProjectName = "";
    //     this.newProjectLogin = "";
    //     await this.fetchProjects();
    //   } catch (error) {
    //     console.error("Ошибка создания проекта:", error);
    //   } finally {
    //     this.creatingProject = false;
    //   }
    // },
    // confirmDeleteProject(projectName) {
    //   this.projectToDeleteName = projectName;
    //   this.deleteProjectDialogVisible = true;
    // },
    // async deleteProject() {
    //   if (!this.projectToDeleteName) return;

    //   try {
    //     await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/services/${this.projectToDeleteName}`);
    //     this.deleteProjectDialogVisible = false;
    //     this.selectedProject = "";
    //     await this.fetchProjects();
    //   } catch (error) {
    //     console.error("Ошибка удаления проекта:", error);
    //   }
    // },
  },
  mounted() {
    // this.fetchProjects();
  },
});
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo {
  height: 55px;
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

.header-btn-access {
  border: 2px solid #fbc02d;
  border-radius: 8px;
  transition: all 0.3s;
  margin-left: auto;
}

.header-btn-access:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
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

.table-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-top: 110px;
}

.centered-table-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 10px;
}

.centered-table {
  width: 100%;
}

.v-data-table {
  table-layout: auto;
}
</style>
