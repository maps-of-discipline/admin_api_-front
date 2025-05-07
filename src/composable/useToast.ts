import { ref } from "vue";

export function useToast() {
  const snackbar = ref(false);
  const snackbarMessage = ref("");
  const snackbarColor = ref("success");

  function showToast(message: string, color = "success") {
    snackbarMessage.value = message;
    snackbarColor.value = color;
    snackbar.value = true;
  }

  return {
    snackbar,
    snackbarMessage,
    snackbarColor,
    showToast,
  };
}
