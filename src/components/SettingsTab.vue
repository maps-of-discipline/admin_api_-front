<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        {{ service.verbose_name }}
        <div class="px-2">
          <v-btn icon v-if="!editing" @click="enableEditing" class="mr-2">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn :disabled="editing" icon color="error" @click="dialog = true">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-if="editing" v-model="editedService.name" label="Название (name)" outlined
                :rules="[nameRule]" />
              <div v-else>
                <strong>Название:</strong>
                <span v-html="highlightMatch(service.name)"></span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-if="editing" v-model="editedService.verbose_name" label="Отображаемое имя (verbose_name)"
                outlined :rules="[verboseNameRule]" />
              <div v-else>
                <strong>Отображаемое имя:</strong>
                <span v-html="highlightMatch(service.verbose_name)"></span>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <!-- Кнопки -->
      <v-card-actions v-if="editing">
        <v-spacer />
        <v-btn :disabled="!formValid" color="primary" @click="updateServiceData">Сохранить</v-btn>
        <v-btn @click="cancelEditing">Отмена</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Диалог удаления -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          Подтвердите удаление сервиса
        </v-card-title>
        <v-card-text>
          <p class="mb-1">Чтобы удалить сервис, введите его название: <strong>{{ service.name }}</strong></p>
          <v-text-field v-model="deleteConfirmation" label="Введите название" />
        </v-card-text>
        <!-- Кнопки -->
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" :disabled="deleteConfirmation !== service.name" @click="deleteServiceData">
            Удалить
          </v-btn>
          <v-btn @click="dialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Toast -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="left" multi-line>
    {{ snackbarMessage }}
    <template #actions>
      <v-progress-linear color="black" height="2" absolute bottom />
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Service } from '../interfaces/service'
import { useToast } from '../composable/useToast'
import { updateService, deleteService, getService } from '../services/service';

export default defineComponent({
  name: 'SettingsTab',
  props: {
    service: {
      type: Object as () => Service,
      required: true,
    },
    search: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editing: false,
      dialog: false,
      deleteConfirmation: '',
      editedService: { ...this.service },
      formValid: false, // Для отслеживания валидности формы
      ...useToast(),
    }
  },
  computed: {
    // Валидация для поля name (только английский)
    nameRule() {
      return (v: string) => /^[A-Za-z0-9_]+$/.test(v) || 'Только латинские символы и цифры';
    },
    // Валидация для поля verbose_name (только кириллица)
    verboseNameRule() {
      return (v: string) => /^[А-Яа-яЁё\s]+$/.test(v) || 'Только кириллица';
    },
  },
  methods: {
    highlightMatch(text: string): string {
      if (!this.search) return text;
      const escaped = this.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Экранирование спецсимволов
      const regex = new RegExp(`(${escaped})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>'); // Оборачиваем совпадения в <mark>
    },
    enableEditing() {
      this.editedService = { ...this.service }
      this.editing = true
    },
    cancelEditing() {
      this.editing = false
    },
    async updateServiceData() {
      try {
        const response = await updateService({ ...this.editedService });
        if (response.success) {
          this.showToast('Изменения сохранены', 'success')
          try {
            const response = await getService({ id: this.service.id, name: "", verbose_name: "" })
            if (response.success && response.data) {
              this.editedService = { ...response.data }; // если хотите редактировать дальше
              this.$emit('update:service', response.data);
              this.showToast('Данные обновлены', 'success')
            } else {
              this.showToast('Не удалось обновить данные', 'error')
            }
          } catch (error) {
            this.showToast("Ошибка при запросе.", "error");
          }
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
      this.editing = false
    },
    async deleteServiceData() {
      try {
        const response = await deleteService({ id: this.service.id, name: this.service.name, verbose_name: this.service.verbose_name });
        if (response.success) {
          this.dialog = false
          this.showToast('Сервис удалён', 'success')
          this.deleteConfirmation = ''
          this.$router.push('/')
        } else {
          this.showToast(response.error || "Ошибка получения данных.", "error");
        }
      } catch (error) {
        this.showToast("Ошибка при запросе.", "error");
      }
    },
  },
})
</script>
