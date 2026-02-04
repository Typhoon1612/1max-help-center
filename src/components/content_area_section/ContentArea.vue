<template>
  <main class="content-area">
    <BreadcrumpNav :selected-category="selectedCategory" />
  </main>
</template>

<script setup>
  import { defineProps } from "vue";
  import BreadcrumpNav from "./BreadcrumpNav.vue";

  defineProps({
    selectedCategory: {
      type: Object,
      default: null,
    },
  });
</script>

<style scoped>
  .content-area {
    /* Content area specific styles can go here */
  }
</style>
