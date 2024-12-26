<!-- Код из этого компонента не используеться, но я решил его оставить. Вдруг пригодиться Савиди Г.А.-->


<template>
    <div class="main-background">
      <v-container
        class="requests-container"
        max-width="800"
      >
        <v-card
          class="pa-5"
          outlined
        >
          <v-card-title class="text-h5 justify-center">
            Заявки пользователей
          </v-card-title>
    
          <v-list>
            <!-- Цикл для отображения списка заявок -->
            <v-list-item
              v-for="(request, index) in requests"
              :key="index"
              class="request-item"
              @click="openDetails(request)"
            >
              <v-list-item-content class="request-details">
                <v-list-item-title class="request-title">
                  {{ request.projectName }}
                </v-list-item-title>
                <v-list-item-subtitle class="request-subtitle">
                  {{ request.name }} - {{ request.role }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="request-subtitle">
                  {{ request.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
    
              <v-list-item-action class="request-actions">
                <v-btn
                  color="success"
                  @click.stop="acceptRequest(request)"
                >
                  Принять
                </v-btn>
                <v-btn
                  color="error"
                  @click.stop="rejectRequest(request)"
                >
                  Отклонить
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    
      <!-- Окно с подробной информацией о заявке -->
      <v-dialog
        v-model="dialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title class="text-h5 justify-center">
            Подробности заявки
          </v-card-title>
          <v-card-text>
            <p><strong>Название проекта:</strong> {{ selectedRequest?.projectName }}</p>
            <p><strong>ФИО:</strong> {{ selectedRequest?.name }}</p>
            <p><strong>Почта:</strong> {{ selectedRequest?.email }}</p>
            <p><strong>Роль:</strong> {{ selectedRequest?.role }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              @click="dialog = false"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
    
    <script lang="ts">
    import { defineComponent, ref } from 'vue';
    
    export default defineComponent({
      name: 'MainPage',
      setup() {
        const dialog = ref(false);
        const selectedRequest = ref<any>(null);
    
        // Тестовые данные заявок
        const requests = ref([
          { projectName: 'Проект A', name: 'Иванов Иван', email: 'ivanov@example.com', role: 'Разработчик' },
          { projectName: 'Проект B', name: 'Петров Петр', email: 'petrov@example.com', role: 'Дизайнер' },
          { projectName: 'Проект C', name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
          { projectName: 'Проект C', name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
          { projectName: 'Проект C', name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
          { projectName: 'Проект C', name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
          { projectName: 'Проект C', name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' },
          { projectName: 'Проект C', name: 'Сидоров Сидор', email: 'sidorov@example.com', role: 'Менеджер' }, 
        ]);
    
        const openDetails = (request: any) => {
          selectedRequest.value = request;
          dialog.value = true;
        };
    
        const acceptRequest = (request: any) => {
          console.log('Заявка принята:', request);
          // Добавьте логику для принятия заявки, например, вызов API или обновление данных
        };
    
        const rejectRequest = (request: any) => {
          console.log('Заявка отклонена:', request);
          // Добавьте логику для отклонения заявки, например, вызов API или обновление данных
        };
    
        return {
          requests,
          dialog,
          selectedRequest,
          openDetails,
          acceptRequest,
          rejectRequest,
        };
      },
    });
    </script>
    
    <style scoped>
    .main-background {
      background-color: #3A3A3A;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .requests-container {
      width: 100%;
      max-width: 800px;
    }
    
    .v-card {
      background-color: #2e2e2e;
      border-radius: 12px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      padding: 20px;
    }
    
    .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px 0;
      border-bottom: 1px solid #444;
    }
    
    .request-details {
      flex: 1;
      margin-right: 10px;
    }
    
    .request-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .request-subtitle {
      margin-bottom: 5px;
    }
    
    .request-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .v-btn {
      margin-left: 5px;
    }
    </style>
    