<template>
  <div class="form-background">
    <v-container
      class="login-form"
      max-width="400"
    >
      <v-col
        cols="12"
        sm="500"
        md="300"
        class="mx-auto"
      >
        <v-form @submit.prevent="handleSubmit">
          <v-card
            class="pa-5"
            outlined
          >
            <!-- Заголовок -->
            <v-card-title class="text-h5 justify-center">
              Добро пожаловать!
            </v-card-title>
  
            <!-- Поле логина -->
            <v-text-field
              v-model="form.username"
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
              append-inner-icon="mdi-eye"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="mb-4"
              @click:append-inner="togglePasswordVisibility"
            />
  
            <!-- Кнопка "Войти" -->
            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-4"
            >
              Войти
            </v-btn>
          </v-card>
        </v-form>
      </v-col>
    </v-container>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const form = reactive({
      username: '',
      password: '',
    });

    const showPassword = ref(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      try {
        const response = await fetch('http://188.120.229.36:8001/api/v1/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Аутентификация успешна:', data);

        // После успешной аутентификации редиректим на MainPage
        router.push({ name: 'MainPage' });

      } catch (error) {
        console.error('Ошибка при аутентификации:', error.message);
      }
    };

    return {
      form,
      showPassword,
      togglePasswordVisibility,
      handleSubmit,
    };
  },
});
  </script>
  
  <style scoped>
  .form-background {
    background-color: #3A3A3A;  /* Фон страницы */
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
    background-color: #2E2E2E;  /* Фон формы */
    border-radius: 12px;  /* Закругленные углы */
    padding: 20px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .v-card-title {
    color: #ffffff;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .v-btn {
    margin-top: 20px;
  }
  
  .v-text-field {
    background-color: #2E2E2E;  /* Фон полей */
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
  