<template>
  <div class="container">
    <v-container max-width="400">
      <v-col cols="12" sm="500" md="300" class="mx-auto">
        <v-form ref="form" @submit.prevent="handleLogIn">
          <v-card class="pa-5" outlined>
            <v-card-title class="text-h5 text-center font-weight-bold">
              Добро пожаловать!
            </v-card-title>
            <v-card-text class="font-weight-light text-center">
              Вход в систему администрации происходит через сохранненую учетную запись.
            </v-card-text>
            <v-text-field v-model="logInForm.email" label="Почта" placeholder="Введите Email" required outlined dense />
            <v-text-field v-model="logInForm.service_name" label="Сервис" placeholder="Введите название сервиса"
              required outlined dense />
            <v-btn :loading="isLoading" type="submit" color="primary" block>
              Войти
            </v-btn>
            <v-btn :disabled="isLoading" color="primary" block class="mt-4" variant="outlined" @click="loginEUZ">
              Войти по ЕУЗ
            </v-btn>
          </v-card>
        </v-form>
      </v-col>
    </v-container>

    <!-- Диалог подтверждения -->
    <v-dialog v-model="isModalVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Введите код подтверждения
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="verificationCode" label="Код подтверждения" placeholder="Введите код" required outlined
            dense :error="verificationError" :error-messages="verificationError ? 'Неверный код подтверждения' : ''" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="handleSubmitLogIn">
            Войти
          </v-btn>
          <v-btn @click="isModalVisible = false">
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toast -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="left" multi-line>
      {{ snackbarMessage }}
      <template #actions>
        <v-progress-linear color="black" height="2" absolute bottom />
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getLogInByEmailForm } from "../forms/authForms";
import { useToast } from "../composable/useToast";
import { loginByEmail, submit } from "../services/auth";

export default defineComponent({
  name: "AuthByEmail",
  data() {
    return {
      logInForm: getLogInByEmailForm(),
      userLogin: "",
      isModalVisible: false,
      verificationCode: "",
      verificationError: false,
      isLoading: false,
      ...useToast(),
    };
  },
  methods: {
    async handleLogIn() {
      const form = this.$refs.form as any;
      if (!form.validate()) {
        return; // Не отправляем, если форма невалидна
      }
      this.isLoading = true;
      try {
        const response = await loginByEmail(this.logInForm);
        if (response.success && response.data) {
          this.userLogin = response.data; // Сохраняем логин пользователя
          this.isModalVisible = true;
        } else {
          this.showToast(response.error || "Ошибка при входе", "error");
        }
      } catch (error) {
        this.showToast("Не удалось отправить код.", "error");
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmitLogIn() {
      try {
        const response = await submit({
          login: this.userLogin, // Используем сохраненный логин
          code: this.verificationCode,
          service_name: this.logInForm.service_name, // Используем введенное название сервиса
        });
        if (response.success) {
          this.verificationError = false;
          this.isModalVisible = false;
          this.showToast("Успешный вход", "success");
          this.$router.push("/");
        } else {
          this.verificationError = true;
          this.showToast(response.error || "Ошибка подтверждения", "error");
        }
      } catch (error) {
        this.verificationError = true;
        this.showToast("Ошибка при подтверждении кода", "error");
      }
    },
    loginEUZ() {
      this.$router.push("/auth");
    },
  },
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
