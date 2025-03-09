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

          <!-- Новый шаблон таблицы -->
          <v-table>
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
            <v-btn
              color="secondary"
              @click="createProjectDialogVisible = false"
            >
              Отмена
            </v-btn>
            <v-btn color="primary" @click="createProject"> Создать </v-btn>
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
    const projects = ref<any[]>([]);
    const users = ref<any[]>([]);
    const roles = ref<string[]>([]);
    const selectedProject = ref<string>("");
    const isEditMode = ref(false);

    const createProjectDialogVisible = ref(false);
    const deleteProjectDialogVisible = ref(false);
    const newProjectName = ref("");
    const projectToDelete = ref<string | null>(null);
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
        const response = await axios.post(
          "http://188.120.229.36:8001/api/v1/services/filters",
          {}
        );
        projects.value = response.data.data.map((project: any) => ({
          id: project.id,
          name: project.name,
        }));
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
      }
    };

    const fetchRoles = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.post(
          "http://188.120.229.36:8001/api/v1/service-roles/filters",
          {
            service_name: selectedProject.value,
          }
        );
        if (response.data && response.data.data) {
          roles.value = response.data.data.map((role: any) => role.role);
        } else {
          console.error("Роли не найдены");
        }
      } catch (error) {
        console.error("Ошибка при загрузке ролей:", error);
      }
    };

    const fetchUsers = async () => {
      if (!selectedProject.value) return;
      try {
        const response = await axios.post(
          "http://188.120.229.36:8001/api/v1/users/filters",
          { service_name: selectedProject.value }
        );
        const usersList = [];

        for (const user of response.data.data) {
          const rolesResponse = await axios.post(
            `http://188.120.229.36:8001/api/v1/users/${user.id}/get_roles_from_service?service_name=${selectedProject.value}`
          );
          const userRoles = [];

          for (const role of rolesResponse.data.roles || []) {
            try {
              const roleResponse = await axios.get(
                `http://188.120.229.36:8001/api/v1/service-roles/${role.service_roles_id}`
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
          };
          console.log(11,user.id)
          usersList.push(userData);
        }

        users.value = usersList;
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      }
    };

    const addRole = async (userId: string, serviceRoleId: string) => {
      try {
        await axios.post(
          "http://188.120.229.36:8001/api/v1/user_service_roles",
          {
            service_roles_id: serviceRoleId,
            user_id: userId,
          }
        );
        console.log(
          `Роль ${serviceRoleId} успешно добавлена пользователю ${userId}`
        );
      } catch (error) {
        console.error(`Ошибка добавления роли ${serviceRoleId}:`, error);
      }
    };

    const removeRole = async (userServiceRoleId: string) => {
      try {
        await axios.delete(
          `http://188.120.229.36:8001/api/v1/user_service_roles/${userServiceRoleId}`
        );
        console.log(`Роль ${userServiceRoleId} успешно удалена`);
      } catch (error) {
        console.error(`Ошибка удаления роли ${userServiceRoleId}:`, error);
      }
    };

    const updateRoles = async (userId: string, newRoles: string[]) => {
      try {
        const currentUser = users.value.find((user) => user.id === userId);
        console.log(1, userId);
        console.log(2, users.value);
        if (!currentUser) throw new Error("Пользователь не найден");

        const currentRoles = currentUser.roles || [];

       
        const roleMappings = await axios.post(
          "http://188.120.229.36:8001/api/v1/service-roles/filters",
          {
            service_name: selectedProject.value,
          }
        );

        const roleMap = roleMappings.data.data.reduce((map: any, role: any) => {
          map[role.role] = role.id; 
          return map;
        }, {});
        console.log(3, roleMap);

      
        const rolesToAdd = newRoles.filter(
          (role) => !currentRoles.includes(role)
        );
        
        const rolesToRemove = currentRoles.filter(
          (role) => !newRoles.includes(role)
        );
        console.log(4, rolesToAdd);
        console.log(5, rolesToRemove);

        
        for (const roleName of rolesToAdd) {
          const serviceRoleId = roleMap[roleName];
          if (serviceRoleId) {
            await addRole(userId, serviceRoleId);
          } else {
            console.error(
              `Роль ${roleName} не найдена в списке доступных ролей`
            );
          }
        }

        
        for (const roleName of rolesToRemove) {
          const userRole = currentUser.userRoles.find(
            (r: any) => r.role === roleName
          );
          if (userRole && userRole.user_service_role_id) {
            await removeRole(userRole.user_service_role_id);
          } else {
            console.error(
              `Роль ${roleName} не найдена для пользователя ${userId}`
            );
          }
        }

        
        currentUser.roles = newRoles;

        console.log("Роли обновлены успешно!");
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
      toggleEditMode,
      updateRoles,
      logout,
      isEditMode,
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
.v-data-table {
  table-layout: auto;
}
</style>
