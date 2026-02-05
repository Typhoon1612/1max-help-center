<template>
  <nav class="breadcrumb-nav">
    <div class="breadcrumb-container">
      <span class="breadcrumb-text">Help Center</span>
      <svg
        class="breadcrumb-separator"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      <span
        v-if="selectedCategory"
        class="breadcrumb-current"
        >{{ selectedCategory.title }}</span
      >
      <span
        v-else
        class="breadcrumb-current"
        >All Topics</span
      >
    </div>
  </nav>
</template>

<script setup>
  import { defineProps } from "vue";

  defineProps({
    selectedCategory: {
      type: Object,
      default: null,
    },
  });
</script>

<style scoped>
  .breadcrumb-nav {
    background-color: transparent;
    padding: 1rem 0;
    font-family: "HarmonyOS_Sans", sans-serif;
  }

  @media (max-width: 767px) {
    .breadcrumb-nav {
      padding: 2rem 0 1rem 0;
    }
  }

  .breadcrumb-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .breadcrumb-text {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .breadcrumb-separator {
    color: #9ca3af;
    width: 16px;
    height: 16px;
  }

  .breadcrumb-current {
    color: #000000;
    font-size: 0.875rem;
  }
</style>
