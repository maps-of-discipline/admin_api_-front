<template>
  <div class="form-background">
    <v-container class="login-form" max-width="400">
      <v-col cols="12" sm="500" md="300" class="mx-auto">
        <v-form @submit.prevent="handleSubmit">
          <v-card class="pa-5" outlined>
            <!-- Логотип -->
            <div class="logo-placeholder">
              <v-img src="../styles/img/изображение_2024-12-15_174821888.png" alt="Логотип" max-height="100" contain></v-img>
            </div>

            <!-- Заголовок -->
            <v-card-title class="text-h5 justify-center">
              Добро пожаловать!
            </v-card-title>

            <!-- Текстовая подсказка -->
            <div class="hint-text">
              Вход в систему администрации происходит через единую учетную запись (ЕУЗ)
            </div>

            <!-- Поле логина -->
            <v-text-field
              v-model="form.login"
              label="Логин"
              placeholder="Введите логин"
              required
              outlined
              dense
              class="mb-4"
            />

            <!-- Поле пароля -->
            <v-text-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Пароль"
              placeholder="Введите пароль"
              required
              outlined
              dense
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="mb-4"
              @click:append-inner="togglePasswordVisibility"
            />

            <!-- Чекбокс "Запомнить меня" -->
            <v-checkbox
              v-model="form.rememberMe"
              label="Запомнить меня"
              class="mb-4"
            ></v-checkbox>

            <!-- Кнопка "Войти" -->
            <v-btn type="submit" color="primary" block class="mt-4">
              Войти
            </v-btn>
          </v-card>
        </v-form>
      </v-col>
    </v-container>

    <!-- Модальное окно для ввода кода -->
    <v-dialog v-model="isModalVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Введите код подтверждения</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="verificationCode"
            label="Код подтверждения"
            placeholder="Введите код"
            required
            outlined
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitVerificationCode">Подтвердить</v-btn>
          <v-btn text @click="isModalVisible = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const form = reactive({
      login: '',
      password: '',
      rememberMe: false,
      service_name: 'admin_api',
    });

    const showPassword = ref(false);
    const isModalVisible = ref(false);
    const verificationCode = ref('');
    const router = useRouter();

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      try {
        const response = await axios.post('http://188.120.229.36:8001/api/v1/users/login', {
          login: form.login,
          password: form.password,
          service_name: form.service_name,
        });

        console.log('Аутентификация успешна:', response.data);

        // Показываем модальное окно для ввода кода подтверждения
        isModalVisible.value = true;
      } catch (error) {
        console.error('Ошибка при аутентификации:', error);
      }
    };

    const submitVerificationCode = async () => {
      try {
        const response = await axios.post('http://188.120.229.36:8001/api/v1/users/verification_auth_code', {
          login: form.login,
          code: verificationCode.value,
        });

        console.log('Код подтверждения принят:', response.data);

        // Сохраняем токен и данные пользователя
        if (form.rememberMe) {
          localStorage.setItem('authToken', response.data.token);
        } else {
          sessionStorage.setItem('authToken', response.data.token);
        }

        // Закрываем модальное окно и перенаправляем на страницу работы с пользователями
        isModalVisible.value = false;
        router.push({ name: 'UserWork' }); // Переход на маршрут UserWork
      } catch (error) {
        console.error('Ошибка при подтверждении кода:', error);
      }
    };

    return {
      form,
      showPassword,
      togglePasswordVisibility,
      handleSubmit,
      isModalVisible,
      verificationCode,
      submitVerificationCode,
    };
  },
});
</script>

<style scoped>
.form-background {
  background-color: #3A3A3A; 
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.v-card {
  background-color: #2E2E2E; 
  border-radius: 12px; 
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-placeholder {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.hint-text {
  text-align: center;
  color: #c7c7c7;
  font-size: 14px;
  margin-bottom: 20px;
}

.v-card-title {
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
}

.v-btn {
  margin-top: 20px;
}

.v-text-field {
  background-color: #2E2E2E; 
  border-radius: 8px;
}

.v-btn.primary {
  background-color: #1e88e5;
  color: white;
}

.v-btn.primary:hover {
  background-color: #1565c0;
}
</style>
