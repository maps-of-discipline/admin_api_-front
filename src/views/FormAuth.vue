<template>
  <div class="form-background">
    <v-container class="login-form" max-width="400">
      <v-col cols="12" sm="500" md="300" class="mx-auto">
        <v-form @submit.prevent="handleSubmit">
          <v-card class="pa-5" outlined>
            <div class="logo-placeholder">
              <v-img
                src="..\styles\img\logo-white.png"
                alt="Логотип"
                max-height="100"
                contain
              ></v-img>
            </div>
            <v-card-title class="text-h5 justify-center">
              Добро пожаловать!
            </v-card-title>
            <div class="hint-text">
              Вход в систему администрации происходит через единую учетную
              запись (ЕУЗ)
            </div>
            <v-text-field
              v-model="form.login"
              label="Логин"
              placeholder="Введите логин"
              required
              outlined
              dense
              class="mb-4"
            />
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
            <v-checkbox
              v-model="form.rememberMe"
              label="Запомнить меня"
              class="mb-4"
            ></v-checkbox>
            <v-btn
              :loading="isLoading"
              type="submit"
              color="primary"
              block
              class="mt-4"
            >
              Войти
            </v-btn>
            <v-btn
              :loading="isLoading"
              color="primary"
              block
              class="mt-4"
              variant="outlined"
              @click="loginWithoutEUZ"
            >
              Войти без ЕУЗ
            </v-btn>
          </v-card>
        </v-form>
      </v-col>
    </v-container>

    <!-- Диалог подтверждения -->
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
            :error="verificationError"
            :error-messages="
              verificationError ? 'Неверный код подтверждения' : ''
            "
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitVerificationCode"
            >Подтвердить</v-btn
          >
          <v-btn @click="isModalVisible = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="left"
      multi-line
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-progress-linear color="black" height="2" absolute bottom />
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const form = reactive({
      login: "",
      password: "",
      rememberMe: false,
      service_name: "kd_maps",
    });

    const showPassword = ref(false);
    const isModalVisible = ref(false);
    const verificationCode = ref("");
    const verificationError = ref(false);
    const isLoading = ref(false);
    const snackbar = ref(false);
    const snackbarMessage = ref("");
    const snackbarColor = ref("error");
    const router = useRouter();

    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        const response = await axios.post(`${baseURL}/users/login`, {
          login: form.login,
          password: form.password,
          service_name: form.service_name,
        });

        console.log("Аутентификация успешна:", response.data);
        isModalVisible.value = true;
      } catch (error: any) {
        console.error("Ошибка при аутентификации:", error);
        snackbarMessage.value = "Ошибка при входе. Проверьте логин и пароль.";
        snackbarColor.value = "error";
        snackbar.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    const submitVerificationCode = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/users/verification_auth_code`,
          {
            login: form.login,
            code: verificationCode.value,
            service_name: form.service_name,
          }
        );

        console.log("Код подтверждения принят:", response.data);
        verificationError.value = false;

        const token = response.data.token;
        if (form.rememberMe) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }

        isModalVisible.value = false;
        router.push({ name: "UserWork" as "/" });
      } catch (error) {
        console.error("Ошибка при подтверждении кода:", error);
        verificationError.value = true;
      }
    };

    // Добавленная функция для перенаправления
    const loginWithoutEUZ = () => {
      router.push('/loginServise/email');
    };

    return {
      form,
      showPassword,
      togglePasswordVisibility,
      handleSubmit,
      isModalVisible,
      verificationCode,
      verificationError,
      submitVerificationCode,
      isLoading,
      snackbar,
      snackbarMessage,
      snackbarColor,
      loginWithoutEUZ, // Добавлен метод в возвращаемый объект
    };
  },
});
</script>

<style scoped>
.form-background {
  background-color: #3a3a3a;
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
  background-color: #2e2e2e;
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
  background-color: #2e2e2e;
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
