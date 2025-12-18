<script setup lang="ts">
import TopMenu from '@/modules/shop/components/TopMenu.vue';
import CustomFooter from '@/modules/shop/components/CustomFooter.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <!-- component -->
  <!-- Create By Joker Banny -->
  <!-- Header Navbar -->
  <top-menu />

  <!-- HomeView -->
  <router-view />

  <!-- Footer -->
  <custom-footer />
</template>
