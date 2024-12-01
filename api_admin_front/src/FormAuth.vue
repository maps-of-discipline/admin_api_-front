<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Логин</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="Введите логин"
          required
        >
      </div>
  
      <div class="form-group">
        <label for="password">Пароль</label>
        <div class="password-wrapper">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Введите пароль"
            required
          >
          <button
            type="button"
            class="toggle-password"
            @click="togglePasswordVisibility"
          >
            {{ showPassword ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
      </div>
  
      <button
        type="submit"
        class="btn-submit"
      >
        Войти
      </button>
    </form>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  
  export default defineComponent({
    name: 'LoginForm',
    setup() {
      const form = reactive({
        username: '',
        password: '',
      });
  
      const showPassword = ref(false);
  
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
      };
  
      const handleSubmit = () => {
        // Здесь можно добавить обработку формы
        console.log('Логин:', form.username);
        console.log('Пароль:', form.password);
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
  .login-form {
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .password-wrapper {
    display: flex;
    align-items: center;
  }
  
  .toggle-password {
    margin-left: 10px;
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
  }
  
  .toggle-password:hover {
    text-decoration: underline;
  }
  
  .btn-submit {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-submit:hover {
    background-color: #0056b3;
  }
  </style>