<template>
  <v-app>
    <header class="header">
      <v-app-bar dark class="header-bar">
        <div class="header-content">
          <v-select
            v-model="selectedProject"
            :items="projects"
            item-title="verbose_name"
            item-value="name"
            label="Выберите проект"
            class="project-select"
            outlined
            @input="fetchRoles"
          ></v-select>
          <v-btn color="success" class="header-btn" @click="fetchUsers">
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
          <v-btn
            color="red"
            class="header-btn"
            @click="confirmDeleteProject(selectedProject)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <div class="logo-container">
          <img
            src="..\styles\img\mospolytech-logo-white.png"
            alt="Logo"
            class="logo"
          />
        </div>

        <div
          class="d-flex align-center"
          style="margin-left: auto; gap: 10px; padding-right: 16px"
        >
          <v-btn color="yellow" class="header-btn-access" @click="handleAccess">
            ДОСТУП
          </v-btn>
          <v-btn color="red" class="header-btn-logout" @click="logout">
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
            <v-btn icon @click="toggleEditMode">
              <v-icon>{{ isEditMode ? "mdi-eye" : "mdi-pencil" }}</v-icon>
            </v-btn>
            <v-btn
              v-if="isEditMode"
              color="blue"
              class="header-btn"
              @click="updateRoles"
            >
              <v-icon>mdi-database</v-icon> Внести изменения
            </v-btn>
          </v-card-title>

          <v-table class="centered-table">
            <thead>
              <tr>
                <th class="text-left">Имя</th>
                <th class="text-left">Фамилия</th>
                <th class="text-left">Отчество</th>
                <th class="text-left">Логин</th>
                <th class="text-left">Почта</th>
                <th class="text-left">Роль</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in users" :key="item.id">
                <td>{{ item.first_name }}</td>
                <td>{{ item.last_name }}</td>
                <td>{{ item.middle_name }}</td>
                <td>{{ item.login }}</td>
                <td>{{ item.email }}</td>
                <td>
                  <div v-if="isEditMode">
                    <v-select
                      v-model="item.role"
                      :items="roles.length > 0 ? roles : ['Загрузка...']"
                      multiple
                      outlined
                      dense
                      @change="(newRoles: any) => updateRoles(item.id, newRoles)"
                    ></v-select>
                  </div>
                  <div v-else>{{ item.role }}</div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-container>

      <v-dialog v-model="createProjectDialogVisible" max-width="400px">
        <v-card>
          <v-card-title>Создать проект</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newProjectName"
              label="Название проекта"
              required
            ></v-text-field>
            <v-text-field
              v-model="newProjectLogin"
              label="Логин проекта"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              @click="createProjectDialogVisible = false"
            >
              Отмена
            </v-btn>
            <v-btn color="primary" @click="createProject">Создать</v-btn>
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
            <v-btn
              color="secondary"
              @click="deleteProjectDialogVisible = false"
            >
              Отмена
            </v-btn>
            <v-btn color="red" @click="deleteProject"> Удалить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "UserManagementPage",
  setup() {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const projects = ref<any[]>([]);
    const users = ref<any[]>([]);
    const roles = ref<string[]>([]);
    const selectedProject = ref<string>("");

    const isEditMode = ref(false);
    const createProjectDialogVisible = ref(false);
    const deleteProjectDialogVisible = ref(false);
    const newProjectName = ref("");
    const newProjectLogin = ref("");
    const projectToDeleteName = ref<string | null>(null);
    const creatingProject = ref(false);

    const headers = ref([
      { text: "Имя", value: "first_name" },
      { text: "Фамилия", value: "last_name" },
      { text: "Отчество", value: "middle_name" },
      { text: "Логин", value: "login" },
      { text: "Почта", value: "email" },
      { text: "Роль", value: "role" },
    ]);

    const fetchProjects = async () => {
      try {
        const response = await axios.post(`${baseURL}/services/filters`, {});
        projects.value = response.data.data.map((project: any) => ({
          id: project.id,
          name: project.name,
          verbose_name: project.verbose_name, 
        }));
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
      }
    };

    const fetchRoles = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.post(`${baseURL}/service-roles/filters`, {
          service_name: selectedProject.value,
        });
        roles.value = response.data.data.map((role: any) => role.role);
      } catch (error) {
        console.error("Ошибка при загрузке ролей:", error);
      }
    };

    const fetchUsers = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.post(`${baseURL}/users/filters`, {
          service_name: selectedProject.value,
        });

        const usersList = [];

        for (const user of response.data.data) {
          const rolesResponse = await axios.post(
            `${baseURL}/users/${user.id}/get_roles_from_service?service_name=${selectedProject.value}`
          );

          const userRoles = [];

          for (const role of rolesResponse.data.roles || []) {
            try {
              const roleResponse = await axios.get(
                `${baseURL}/service-roles/${role.service_roles_id}`
              );
              userRoles.push(roleResponse.data.role);
            } catch (roleError) {
              console.error(
                `Ошибка при получении роли с id ${role.service_roles_id}:`,
                roleError
              );
            }
          }

          const userData = {
            id: user.id,
            first_name: user.name,
            last_name: user.surname,
            middle_name: user.patronymic || "",
            login: user.login,
            email: user.email,
            role: user.role,
            roles: userRoles,
            userRoles: rolesResponse.data.roles || [],
          };

          usersList.push(userData);
        }

        users.value = usersList;
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      }
    };

    const addRole = async (userId: string, serviceRoleId: string) => {
      try {
        await axios.post(`${baseURL}/user_service_roles`, {
          service_roles_id: serviceRoleId,
          user_id: userId,
        });
      } catch (error) {
        console.error(`Ошибка добавления роли ${serviceRoleId}:`, error);
      }
    };

    const removeRole = async (userServiceRoleId: string) => {
      try {
        await axios.delete(
          `${baseURL}/user_service_roles/${userServiceRoleId}`
        );
      } catch (error) {
        console.error(`Ошибка удаления роли ${userServiceRoleId}:`, error);
      }
    };

    const updateRoles = async (userId: string, newRoles: string[]) => {
      try {
        const currentUser = users.value.find((user) => user.id === userId);
        if (!currentUser) throw new Error("Пользователь не найден");

        const currentRoles = currentUser.roles || [];

        const roleMappings = await axios.post(
          `${baseURL}/service-roles/filters`,
          {
            service_name: selectedProject.value,
          }
        );

        const roleMap = roleMappings.data.data.reduce((map: any, role: any) => {
          map[role.role] = role.id;
          return map;
        }, {});

        const rolesToAdd = newRoles.filter(
          (role) => !currentRoles.includes(role)
        );
        const rolesToRemove = currentRoles.filter(
          (role: string) => !newRoles.includes(role)
        );

        for (const roleName of rolesToAdd) {
          const serviceRoleId = roleMap[roleName];
          if (serviceRoleId) {
            await addRole(userId, serviceRoleId);
          }
        }

        for (const roleName of rolesToRemove) {
          const userRole = currentUser.userRoles.find(
            (r: any) => r.role === roleName
          );
          if (userRole && userRole.user_service_role_id) {
            await removeRole(userRole.user_service_role_id);
          }
        }

        currentUser.roles = newRoles;
      } catch (error) {
        console.error("Ошибка обновления ролей:", error);
      }
    };

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
      if (isEditMode.value && selectedProject.value) {
        fetchRoles();
      }
    };

    const logout = () => {
      window.location.href = "/";
    };
    const handleAccess = () => {
      window.location.href = "/admin/user/permissions";
    };

    const openCreateProjectDialog = () => {
      createProjectDialogVisible.value = true;
    };

    const createProject = async () => {
      if (!newProjectName.value.trim() || !newProjectLogin.value.trim()) return;

      creatingProject.value = true;
      try {
        await axios.post(`${baseURL}/services`, {
          name: newProjectLogin.value,
          verbose_name: newProjectName.value,
        });
        createProjectDialogVisible.value = false;
        newProjectName.value = "";
        newProjectLogin.value = "";
        await fetchProjects();
      } catch (error) {
        console.error("Ошибка создания проекта:", error);
      } finally {
        creatingProject.value = false;
      }
    };

    const confirmDeleteProject = (projectName: string) => {
      projectToDeleteName.value = projectName;
      deleteProjectDialogVisible.value = true;
    };

    const deleteProject = async () => {
      if (!projectToDeleteName.value) return;

      try {
        await axios.delete(`${baseURL}/services/${projectToDeleteName.value}`);
        deleteProjectDialogVisible.value = false;
        selectedProject.value = "";
        await fetchProjects();
      } catch (error) {
        console.error("Ошибка удаления проекта:", error);
      }
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
      newProjectLogin,
      projectToDeleteName,
      headers,
      fetchUsers,
      fetchRoles,
      toggleEditMode,
      updateRoles,
      logout,
      handleAccess,
      isEditMode,
      openCreateProjectDialog,
      createProject,
      confirmDeleteProject,
      deleteProject,
      creatingProject,
    };
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
  border: 2px solid  #fbc02d;
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
