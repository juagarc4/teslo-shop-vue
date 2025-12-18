<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

const authStore = useAuthStore();
const fullNameInputRef = ref<HTMLInputElement | null>(null);
const emaiInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);
const toast = useToast();
// Reactive can be used to save objects. The use of ref is recommenden unless there is
// necessary the use of reactive.
const myForm = reactive({
  fullName: '',
  email: '',
  password: '',
});

const onRegister = async () => {
  if (myForm.fullName.length < 2) {
    return fullNameInputRef.value?.focus();
  }
  if (myForm.email === '' || !myForm.email.includes('@')) {
    return emaiInputRef.value?.focus();
  }
  if (myForm.password.length < 6) {
    return passwordInputRef.value?.focus();
  }

  const ok = await authStore.register(myForm.fullName, myForm.email, myForm.password);
  if (ok) {
    toast.success('User successfully registered. Login now using your new credentials.');
    myForm.fullName = '';
    myForm.email = '';
    myForm.password = '';
    return;
  }

  toast.error('User was not registered');
};
</script>
<template>
  <h1 class="text-2xl font-semibold mb-4">Register</h1>
  <form @submit.prevent="onRegister">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="fullName" class="block text-gray-600">Full Name</label>
      <input
        ref="fullNameInputRef"
        v-model="myForm.fullName"
        type="text"
        id="fullName"
        name="fullName"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>

    <!-- E-Mail Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">E-Mail</label>
      <input
        ref="emailInputRef"
        v-model="myForm.email"
        type="email"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-6">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        ref="passwordInputRef"
        v-model="myForm.password"
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>

    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Register
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'login' }" class="hover:underline">Login Here</RouterLink>
  </div>
</template>
