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
              />
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
            />

            <v-btn type="submit" color="primary" block class="mt-4">
              Войти
            </v-btn>
          </v-card>
        </v-form>
      </v-col>
    </v-container>

    <v-dialog v-model="isModalVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6"> Введите код подтверждения </v-card-title>
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
          <v-spacer />
          <v-btn color="primary" @click="submitVerificationCode">
            Подтвердить
          </v-btn>
          <v-btn @click="isModalVisible = false"> Отмена </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "AuthService",
  setup() {
    const form = reactive({
      login: "",
      password: "",
      rememberMe: false,
      service_name: "",
    });

    const showPassword = ref(false);
    const isModalVisible = ref(false);
    const verificationCode = ref("");
    const router = useRouter();
    const route = useRoute();

    form.service_name = (route.query.service_name as string) || "";
    const redirectUrl = (route.query.return_url as string) || "/";

    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      try {
        const response = await axios.post(`${baseURL}/users/login`, {
          login: form.login,
          password: form.password,
          service_name: form.service_name,
        });

        console.log("Аутентификация успешна:", response.data);
        isModalVisible.value = true;
      } catch (error) {
        console.error("Ошибка при аутентификации:", error);
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
          },
        );

        console.log("Код подтверждения принят:", response.data);

        const token = response.data.access_token;

        if (form.rememberMe) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }

        isModalVisible.value = false;

        const redirectWithToken = `${redirectUrl}?token=${encodeURIComponent(token)}`;
        window.location.href = redirectWithToken;
      } catch (error) {
        console.error("Ошибка при подтверждении кода:", error);
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
