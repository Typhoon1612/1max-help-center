<template>
  <aside class="sidebar">
    <BackButton />
    <CategoryTitle @category-selected="handleCategorySelected" />
  </aside>
</template>

<script setup>
  import BackButton from "./BackButton.vue";
  import CategoryTitle from "./CategoryTitle.vue";

  const emit = defineEmits(["category-selected"]);

  const handleCategorySelected = (category) => {
    emit("category-selected", category);
  };
</script>

<style scoped>
  .sidebar {
    width: 250px;
    height: calc(100vh - 73px);
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
    padding: 1.5rem 0;
    position: fixed;
    left: 0;
    top: 73px;
    overflow-y: auto;
  }

  /* Scrollbar styling */
  .sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      position: relative;
      min-height: auto;
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
    }
  }
</style>
