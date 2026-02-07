<template>
  <main class="content-area">
    <BreadcrumpNav :selected-category="selectedCategory" />

    <!-- Show category content -->
    <div class="content-container">
      <CategoryContent :category="selectedCategory" />
    </div>
  </main>
</template>

<script setup>
  import { defineProps } from "vue";
  import BreadcrumpNav from "./sub-components/BreadcrumpNav.vue";
  import CategoryContent from "./CategoryContent.vue";

  defineProps({
    selectedCategory: {
      type: Object,
      required: true,
    },
  });
</script>

<style scoped>
  .content-container,
  .accordion-container {
    margin-top: 1.5rem;
  }
</style>
