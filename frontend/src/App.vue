<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { AuthStatus } from '@/modules/auth/interfaces';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';

// Subscrition to the store

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

authStore.$subscribe(
  (_, state) => {
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus();
      return;
    }
    // Redirects to home after successfull login, but it does not avoid the navigation to login.
    // To avoid the navigation we use a guard.
    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'home' });
      return;
    }
  },
  { immediate: true },
);
</script>
<template>
  <FullScreenLoader v-if="authStore.isChecking" />
  <RouterView v-else />
</template>
